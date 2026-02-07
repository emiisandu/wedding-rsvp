import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

function isBlank(v) {
  return !v || !String(v).trim();
}

function validateForm(data, t) {
  const errors = [];

  // attendance required (main guest)
  if (isBlank(data.guests?.[0]?.attendance)) {
    errors.push(t("err_attendance_required"));
  }

  // lodging required
  if (isBlank(data.lodgingSuggestions)) {
    errors.push(t("err_lodging_required"));
  }

  // guests required fields
  (data.guests || []).forEach((g, i) => {
    const idx = i + 1;

    if (isBlank(g.firstName)) errors.push(t("err_firstname_required", { idx }));
    if (isBlank(g.lastName)) errors.push(t("err_lastname_required", { idx }));

    if (isBlank(g.email)) {
      errors.push(t("err_email_required", { idx }));
    } else if (!EMAIL_RE.test(String(g.email).trim())) {
      errors.push(t("err_email_invalid", { idx }));
    }

    if (isBlank(g.menu)) errors.push(t("err_menu_required", { idx }));

    // ageType required only for added guests (index !== 0)
    if (i !== 0 && isBlank(g.ageType)) {
      errors.push(t("err_agetype_required", { idx }));
    }
  });

  // message required (you said all fields)
  if (isBlank(data.message)) {
    errors.push(t("err_message_required"));
  }

  return errors;
}

export default function RSVPForm() {
  const { t } = useTranslation();
  const [status, setStatus] = useState(null);

  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileElRef = useRef(null);
  const widgetIdRef = useRef(null);



  /*******************************
 * RSVP Web App (Apps Script)
 * Sheets:
 *   - GuestList: [firstName, lastName]
 *   - RSVP: columns as requested
 *******************************/

  const SHEET_RSVP = "RSVP_CONFIRMATIONS";
  const SHEET_GUESTLIST = "GUEST_LIST";
  const SPREADSHEET_ID = "1FVzj-msJxegi9yNz8UZZoIsmPmvB05IMij_4hw5_I5U";

  // Romanian-ish nickname helpers (extend as you want)
  const NICKNAMES = {
    "alex": ["alexandru", "alexandra"],
    "sandu": ["alexandru"],
    "ion": ["ioan", "ionut", "ionut"],
    "ionut": ["ioan", "ion"],
    "gigi": ["george", "gheorghe"],
    "geo": ["george"],
    "vali": ["valentin", "valeria"],
  };

  // --- Web app entrypoints ---
  function doOptions(e) {
    // Helps if you ever call Apps Script directly from browser (CORS preflight).
    return withCors_(ContentService.createTextOutput(""));
  }

  function doGet(e) {
    // Quick health check
    return withCors_(
      ContentService
        .createTextOutput(JSON.stringify({ ok: true, message: "RSVP endpoint alive" }))
        .setMimeType(ContentService.MimeType.JSON)
    );
  }

  function doPost(e) {
    try {
      const raw = (e && e.postData && e.postData.contents) ? e.postData.contents : "";
      if (!raw) return jsonError_("Empty body");

      const payload = JSON.parse(raw);
      if (!payload || !Array.isArray(payload.guests) || payload.guests.length === 0) {
        return jsonError_("Invalid payload: guests missing");
      }

      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      const guestSheet = ss.getSheetByName(SHEET_GUESTLIST);
      const rsvpSheet = ss.getSheetByName(SHEET_RSVP);

      if (!guestSheet) return jsonError_(`Missing sheet: ${SHEET_GUESTLIST}`);
      if (!rsvpSheet) return jsonError_(`Missing sheet: ${SHEET_RSVP}`);

      // Load guest list
      const guestList = loadGuestList_(guestSheet); // array of {first,last, normPairs:Set}
      if (guestList.length === 0) return jsonError_("Guest list is empty");

      // Load already registered names from RSVP
      const alreadySet = loadAlreadyRegistered_(rsvpSheet); // Set of normalized full names (both orders)

      // Main attendance is only collected for guest[0] in your form
      const mainAttendance = (payload.guests[0].attendance || "").toString().trim().toLowerCase(); // "da" | "nu"
      const lodging = (payload.lodgingSuggestions || "no").toString().trim().toLowerCase(); // "yes" | "no"
      const lodgingLabel = lodging === "yes" ? "vreau ajutor" : "caut singur";
      const message = (payload.message || "").toString().trim();

      const addedBy = fullName_(payload.guests[0].firstName, payload.guests[0].lastName);

      // 1) Validate: at least one submitted guest matches the guest list (fuzzy, swapped ok)
      const matchResults = payload.guests.map(g => matchGuest_(g, guestList));
      const anyMatch = matchResults.some(r => r.matched);

      if (!anyMatch) {
        return jsonError_(
          "Sorry, none of the names submitted were on the guest list. Please contact us if problem persists."
        );
      }

      // 2) Append only those who match guest list and are NOT already registered
      const confirmedSubmitted = [];
      const alreadyRegistered = [];

      const rowsToAppend = [];

      for (let i = 0; i < payload.guests.length; i++) {
        const g = payload.guests[i];
        const res = matchResults[i];

        // Only write guests that match guest list
        if (!res.matched) continue;

        const displayName = fullName_(g.firstName, g.lastName);

        // Dedup check against RSVP sheet (also fuzzy-ish by normalized exact key)
        const normA = normalizeFull_(g.firstName, g.lastName);
        const normB = normalizeFull_(g.lastName, g.firstName);

        if (alreadySet.has(normA) || alreadySet.has(normB)) {
          alreadyRegistered.push(displayName);
          continue;
        }

        // Build your columns
        const row = [
          (g.firstName || "").toString().trim(),                         // prenume invitat
          (g.lastName || "").toString().trim(),                          // nume invitat
          (g.ageType || "adult").toString().trim(),                      // tip invitat
          (g.email || "").toString().trim(),                             // email
          (mainAttendance || "").toString().trim(),                      // participa (da/nu)
          addedBy,                                                       // adaugat de
          (g.menu || "traditional").toString().trim(),                   // optiune meniu
          lodgingLabel,                                                  // cazare label
          message,                                                       // mesaj
        ];

        rowsToAppend.push(row);

        // Update dedupe set so duplicates in same submission don’t double-add
        alreadySet.add(normA);
        alreadySet.add(normB);

        confirmedSubmitted.push(displayName);
      }

      // If they matched guest list but all matched ones were already registered
      if (rowsToAppend.length === 0) {
        return jsonOk_({
          confirmedSubmitted: [],
          alreadyRegistered,
          message:
            alreadyRegistered.length
              ? `Guests already registered: ${alreadyRegistered.join(", ")}`
              : "Nothing to add.",
        });
      }

      // Append in one batch
      rsvpSheet.getRange(rsvpSheet.getLastRow() + 1, 1, rowsToAppend.length, rowsToAppend[0].length)
        .setValues(rowsToAppend);

      // 3) Return UI-friendly response
      const outMsgParts = [];
      if (confirmedSubmitted.length) outMsgParts.push(`Confirmation submitted for: ${confirmedSubmitted.join(", ")}`);
      if (alreadyRegistered.length) outMsgParts.push(`Guests already registered: ${alreadyRegistered.join(", ")}`);

      return jsonOk_({
        confirmedSubmitted,
        alreadyRegistered,
        message: outMsgParts.join("\n"),
      });

    } catch (err) {
      return jsonError_(String(err && err.message ? err.message : err));
    }
  }

  // --- Matching helpers ---

  function loadGuestList_(sheet) {
    const values = sheet.getDataRange().getValues();
    if (values.length <= 1) return [];

    const list = [];
    for (let i = 1; i < values.length; i++) {
      const first = (values[i][0] || "").toString().trim();
      const last = (values[i][1] || "").toString().trim();
      if (!first && !last) continue;

      const variants = expandNameVariants_(first, last); // array of {a,b} variants including nicknames
      const set = new Set();
      variants.forEach(v => {
        set.add(normalizeFull_(v.first, v.last));
        set.add(normalizeFull_(v.last, v.first)); // allow swapped in guest list too
      });

      list.push({ first, last, normPairs: set });
    }
    return list;
  }

  function loadAlreadyRegistered_(sheet) {
    const values = sheet.getDataRange().getValues();
    const set = new Set();
    if (values.length <= 1) return set;

    // Columns 1 and 2 are first/last as per your structure
    for (let i = 1; i < values.length; i++) {
      const first = (values[i][0] || "").toString().trim();
      const last = (values[i][1] || "").toString().trim();
      if (!first && !last) continue;
      set.add(normalizeFull_(first, last));
      set.add(normalizeFull_(last, first));
    }
    return set;
  }

  function matchGuest_(guest, guestList) {
    const fn = (guest.firstName || "").toString();
    const ln = (guest.lastName || "").toString();

    const candidates = expandNameVariants_(fn, ln); // includes nickname expansions & swapped later

    // Create normalized candidate strings (both orders)
    const candNorms = [];
    candidates.forEach(v => {
      candNorms.push(normalizeFull_(v.first, v.last));
      candNorms.push(normalizeFull_(v.last, v.first));
    });

    // Fast exact containment against precomputed sets
    for (const gl of guestList) {
      for (const cn of candNorms) {
        if (gl.normPairs.has(cn)) return { matched: true, matchedTo: fullName_(gl.first, gl.last), method: "exact/variant" };
      }
    }

    // Fuzzy pass: compare candidate norms to each guest list norm
    let best = { score: -1, who: null };

    for (const gl of guestList) {
      for (const cn of candNorms) {
        // Compare cn against each norm in gl.normPairs
        for (const gln of gl.normPairs) {
          const score = similarity_(cn, gln); // 0..1
          if (score > best.score) best = { score, who: fullName_(gl.first, gl.last) };
        }
      }
    }

    // Threshold: allow “1–2 mistakes”
    // For short names keep it stricter; for longer names allow more.
    const threshold = 0.84; // good default for diacritics + 1-2 typos
    if (best.score >= threshold) return { matched: true, matchedTo: best.who, method: "fuzzy", score: best.score };

    return { matched: false };
  }

  function expandNameVariants_(first, last) {
    const f = normalizeToken_(first);
    const l = normalizeToken_(last);

    const out = [];
    // base
    out.push({ first, last });

    // nickname expansions: if first is a nickname, expand
    const fNick = (NICKNAMES[f] || []);
    fNick.forEach(nn => out.push({ first: nn, last }));

    // nickname expansions: if last is a nickname (rare but just in case)
    const lNick = (NICKNAMES[l] || []);
    lNick.forEach(nn => out.push({ first, last: nn }));

    // If user typed single field in first name (e.g. "Ion Popescu") you could split,
    // but your UI has two inputs, so keeping it simple.

    return out;
  }

  // --- Normalization ---
  function normalizeFull_(a, b) {
    return `${normalizeToken_(a)} ${normalizeToken_(b)}`.trim();
  }

  function normalizeToken_(s) {
    return stripDiacritics_(
      (s || "")
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[\u2019']/g, "")      // apostrophes
        .replace(/[^a-zăâîșşțţ\- ]/g, " ") // keep letters + RO diacritics + dash + space
        .replace(/\s+/g, " ")
    );
  }

  function stripDiacritics_(s) {
    // normalize + remove combining marks; also handle RO diacritics that might appear precomposed
    return (s || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ș/g, "s").replace(/ş/g, "s")
      .replace(/ț/g, "t").replace(/ţ/g, "t")
      .replace(/ă/g, "a")
      .replace(/â/g, "a")
      .replace(/î/g, "i");
  }

  function fullName_(first, last) {
    const f = (first || "").toString().trim();
    const l = (last || "").toString().trim();
    return `${f} ${l}`.trim();
  }

  // --- Similarity (Levenshtein ratio) ---
  function similarity_(a, b) {
    if (!a && !b) return 1;
    if (!a || !b) return 0;
    const dist = levenshtein_(a, b);
    const maxLen = Math.max(a.length, b.length);
    return maxLen ? (1 - dist / maxLen) : 1;
  }

  function levenshtein_(a, b) {
    const m = a.length, n = b.length;
    const dp = [];
    for (let i = 0; i <= m; i++) {
      dp[i] = [i];
    }
    for (let j = 1; j <= n; j++) {
      dp[0][j] = j;
    }
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,      // deletion
          dp[i][j - 1] + 1,      // insertion
          dp[i - 1][j - 1] + cost // substitution
        );
      }
    }
    return dp[m][n];
  }

  // --- JSON response helpers ---
  function jsonOk_(data) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, ...data }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  function jsonError_(message) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, message: message || "Error" }))
      .setMimeType(ContentService.MimeType.JSON);
  }


  function withCors_(output) {
    return output;
  }


  const INITIAL_FORM = {
    guests: [
      {
        firstName: "",
        lastName: "",
        ageType: "adult",
        attendance: "",
        email: "",
        menu: "traditional",
      },
    ],
    lodgingSuggestions: "no",
    message: "",
  };

  function resetForm() {
    setFormData(INITIAL_FORM);
    setStatus(null);
    setTurnstileToken("");

    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }


  useEffect(() => {
    // Wait until the turnstile script is available
    const interval = setInterval(() => {
      if (!window.turnstile || !turnstileElRef.current) return;

      clearInterval(interval);

      // Avoid double-rendering
      if (widgetIdRef.current) return;

      widgetIdRef.current = window.turnstile.render(turnstileElRef.current, {
        sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
        theme: "light",
        appearance: "interaction-only",
        callback: (token) => setTurnstileToken(token),
        "expired-callback": () => setTurnstileToken(""),
        "error-callback": () => setTurnstileToken(""),
      });

    }, 100);

    return () => clearInterval(interval);
  }, []);
  const [formData, setFormData] = useState(INITIAL_FORM);


  // Global fields (lodgingSuggestions, message)
  function handleChange(e) {
    const { name, value } = e.target;
    setStatus(null);
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleGuestChange(index, field, value) {
    setStatus(null);
    setFormData((prev) => {
      const guests = [...prev.guests];
      guests[index] = { ...guests[index], [field]: value };
      return { ...prev, guests };
    });
  }

  function addGuest() {
    setStatus(null);
    setFormData((prev) => ({
      ...prev,
      guests: [
        ...prev.guests,
        {
          firstName: "",
          lastName: "",
          ageType: "adult",
          attendance: "",
          email: "",
          menu: "traditional",
        },
      ],
    }));
  }

  function removeGuest(index) {
    setStatus(null);
    setFormData((prev) => {
      if (prev.guests.length === 1) return prev;
      const guests = prev.guests.filter((_, i) => i !== index);
      return { ...prev, guests };
    });
  }


  async function handleSubmit(e) {
    e.preventDefault();

    const errors = validateForm(formData, t);
    if (errors.length) {
      setStatus({ type: "error", message: errors.join("\n") });
      return;
    }


    try {
      if (!turnstileToken) {
        setStatus({ type: "error", message: "Human check not ready yet — please try again in a second." });
        return;
      }

      const payload = { ...formData, turnstileToken };

      const res = await fetch("/.netlify/functions/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      console.log("RSVP status:", res.status, res.headers.get("content-type"));
      console.log("RSVP raw response (first 300):", text.slice(0, 300));

      let json;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error("Server returned non-JSON. Check console for HTML response.");
      }

      if (!json.ok) {
        setStatus({
          type: "error",
          message: json.message || t("unexpected_error"),
        });
        return;
      }

      const confirmed = (json.confirmedSubmitted || []).join(", ");
      const already = (json.alreadyRegistered || []).join(", ");

      let msg = `${t("confirmation_submitted_for")}: ${confirmed || "—"}`;

      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
      setTurnstileToken("");


      if (already) {
        msg += `\n${t("already_registered")}: ${already}`;
      }

      setStatus({
        type: "success",
        message: msg,
      });

      setTimeout(() => resetForm(), 1500);


    } catch (err) {
      console.error("RSVP submission failed:", err);
      // OPTIONAL: show error message in UI
    }
  }


  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto flex flex-col gap-6 px-4 pb-10 font-prata-light z-40 bg-pink"
    >
      {/* === GUESTS SECTION === */}
      <div className="flex flex-col gap-3 ">
        <h3 className="text-s tracking-widest uppercase font-semibold font-monoton">
          {t("guests")}
        </h3>

        {formData.guests.map((guest, index) => (
          <div
            key={index}
            className="
               bg-[#f5ead5] rounded-sm
              
              px-3 py-3 flex flex-col gap-3  guests-form
            "
          >
            {/* Prenume + Nume */}
            <div className="flex flex-col sm:flex-row gap-3 min-w-0">
              <label className="flex-1 flex flex-col gap-1">
                <span className="text-[0.65rem] tracking-widest uppercase font-semibold font-prata">
                  {t("Prenume")}
                </span>
                <input required
                  type="text"
                  value={guest.firstName}
                  onChange={(e) =>
                    handleGuestChange(index, "firstName", e.target.value)
                  }
                  className="
                    w-full
                    px-2 py-2 
                    border border-black/30 
                    rounded-sm
                    bg-[#f5ead5]
                    focus:outline-none focus:border-black
                    shadow-[2px_2px_0px_rgba(0,0,0,0.35)]
                  "
                  placeholder={t('Prenume')}
                />
              </label>

              <label className="flex-1 flex flex-col gap-1">
                <span className="text-[0.65rem] tracking-widest uppercase font-semibold font-prata">
                  {t("Nume")}
                </span>
                <input required
                  type="text"
                  value={guest.lastName}
                  onChange={(e) =>
                    handleGuestChange(index, "lastName", e.target.value)
                  }
                  className="
                    w-full
                    px-3 py-2 
                    border border-black/30 
                    rounded-sm
                    bg-[#f5ead5]
                    focus:outline-none focus:border-black
                    shadow-[2px_2px_0px_rgba(0,0,0,0.35)]
                  "
                  placeholder={t("Nume")}
                />
              </label>
            </div>

            {/* ADULT / CHILD */}
            {index !== 0 && (

              <div className="flex flex-col gap-2 mt-1">
                <span className="text-[0.65rem] tracking-widest uppercase font-semibold font-prata">
                  {t("Tip invitat")}
                </span>

                <div className="flex flex-col sm:flex-row gap-2">
                  <label
                    className="
                    flex items-center gap-3 
                    px-3 py-2 
                    bg-[#f5ead5] 
                    border border-black/30 
                    rounded-sm
                    shadow-[2px_2px_0px_rgba(0,0,0,0.35)]
                    active:translate-x-[1px] active:translate-y-[1px] active:shadow-none
                  "
                  >
                    <input required
                      type="radio"
                      name={`ageType-${index}`}
                      value="adult"
                      checked={guest.ageType === "adult"}
                      onChange={(e) =>
                        handleGuestChange(index, "ageType", e.target.value)
                      }
                      className="
                          appearance-none
                          h-4 w-4
                          border border-black/70
                          rounded-full
                          relative
                          before:content-['']
                          before:absolute before:inset-[3px] before:rounded-full
                          before:bg-transparent
                          checked:before:bg-[#d62423]
                        "
                    />
                    <span className="text-sm tracking-wide">Adult</span>
                  </label>

                  <label
                    className="
                    flex items-center gap-3 
                    px-3 py-2 
                    bg-[#f5ead5] 
                    border border-black/30 
                    rounded-sm
                    shadow-[2px_2px_0px_rgba(0,0,0,0.35)]
                    active:translate-x-[1px] active:translate-y-[1px] active:shadow-none
                  "
                  >
                    <input required
                      type="radio"
                      name={`ageType-${index}`}
                      value="child"
                      checked={guest.ageType === "child"}
                      onChange={(e) =>
                        handleGuestChange(index, "ageType", e.target.value)
                      }
                      className="
                            appearance-none
                            h-4 w-4
                            border border-black/70
                            rounded-full
                            relative
                            before:content-['']
                            before:absolute before:inset-[3px] before:rounded-full
                            before:bg-transparent
                            checked:before:bg-[#d62423]
                          "
                    />
                    <span className="text-sm tracking-wide">{t("Copil")}</span>
                  </label>
                </div>
              </div>
            )}
            {/* EMAIL – only if COPIL */}
            {guest.ageType === "adult" && (
              <label className="flex flex-col gap-1">
                <span className="text-[0.65rem] tracking-widest uppercase font-semibold font-prata">
                  {t("email")}
                </span>
                <input required
                  type="email"
                  value={guest.email}
                  onChange={(e) =>
                    handleGuestChange(index, "email", e.target.value)
                  }
                  className="
                    px-3 py-2 
                    border border-black/30 
                    rounded-sm
                    bg-[#f5ead5]
                    shadow-[2px_2px_0px_rgba(0,0,0,0.35)]
                    focus:outline-none focus:border-black
                  "
                  placeholder="abc@def.com"
                />
              </label>
            )}

            {/* PARTICIPARE — only for FIRST guest */}
            {index === 0 && (
              <div className="flex flex-col gap-2 mt-1">
                <span className="text-[0.65rem] tracking-widest uppercase font-semibold font-prata">
                  {t("Participare")}
                </span>

                <div className="flex flex-col gap-2">

                  {/* DA */}
                  <label className="flex items-center gap-3 px-3 py-2 bg-[#f5ead5] border border-black/30 rounded-sm shadow-[2px_2px_0px_rgba(0,0,0,0.35)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none">
                    <input required
                      type="radio"
                      name="attendance-main"
                      value="da"
                      checked={guest.attendance === "da"}
                      onChange={(e) =>
                        handleGuestChange(index, "attendance", e.target.value)
                      }
                      className="
                        appearance-none
                        h-4 w-4
                        border border-black/70
                        rounded-full
                        relative
                        before:content-['']
                        before:absolute before:inset-[3px] before:rounded-full
                        before:bg-transparent
                        checked:before:bg-[#d62423]
                      "
                    />
                    <span className="text-sm tracking-wide">{t("Da")}</span>
                  </label>

                  {/* NU */}
                  <label className="flex items-center gap-3 px-3 py-2 bg-[#f5ead5] border border-black/30 rounded-sm shadow-[2px_2px_0px_rgba(0,0,0,0.35)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none">
                    <input required
                      type="radio"
                      name="attendance-main"
                      value="nu"
                      checked={guest.attendance === "nu"}
                      onChange={(e) =>
                        handleGuestChange(index, "attendance", e.target.value)
                      }
                      className="
                      appearance-none
                      h-4 w-4
                      border border-black/70
                      rounded-full
                      relative
                      before:content-['']
                      before:absolute before:inset-[3px] before:rounded-full
                      before:bg-transparent
                      checked:before:bg-[#d62423]
                    "
                    />
                    <span className="text-sm tracking-wide">{t("Nu")}</span>
                  </label>
                </div>
              </div>
            )}


            {/* MENU – only if attendance === "da" */}
            {(guest.attendance === "da" || index !== 0) && (
              <div className="flex flex-col gap-2 mt-1">
                <span className="text-[0.65rem] tracking-widest uppercase font-semibold font-prata">
                  {t("menu")}
                </span>

                <div className="flex flex-col gap-2">
                  <label
                    className="
                      flex items-center gap-3 
                      px-3 py-2 
                      bg-[#f5ead5] 
                      border border-black/30 
                      rounded-sm
                      shadow-[2px_2px_0px_rgba(0,0,0,0.35)]
                      active:translate-x-[1px] active:translate-y-[1px] active:shadow-none
                    "
                  >
                    <input required
                      type="radio"
                      name={`menu-${index}`}
                      value="traditional"
                      checked={guest.menu === "traditional"}
                      onChange={(e) =>
                        handleGuestChange(index, "menu", e.target.value)
                      }
                      className="
                            appearance-none
                            h-4 w-4
                            border border-black/70
                            rounded-full
                            relative
                            before:content-['']
                            before:absolute before:inset-[3px] before:rounded-full
                            before:bg-transparent
                            checked:before:bg-[#d62423]
                          "
                    />
                    <span className="text-sm tracking-wide">{t("Tradițional")}</span>
                  </label>

                  <label
                    className="
                      flex items-center gap-3 
                      px-3 py-2 
                      bg-[#f5ead5] 
                      border border-black/30 
                      rounded-sm
                      shadow-[2px_2px_0px_rgba(0,0,0,0.35)]
                      active:translate-x-[1px] active:translate-y-[1px] active:shadow-none
                    "
                  >
                    <input required
                      type="radio"
                      name={`menu-${index}`}
                      value="vegetarian"
                      checked={guest.menu === "vegetarian"}
                      onChange={(e) =>
                        handleGuestChange(index, "menu", e.target.value)
                      }
                      className="
                       appearance-none
                        h-4 w-4
                        border border-black/70
                        rounded-full
                        relative
                        before:content-['']
                        before:absolute before:inset-[3px] before:rounded-full
                        before:bg-transparent
                        checked:before:bg-[#d62423]
                      "
                    />
                    <span className="text-sm tracking-wide">Vegetarian</span>
                  </label>
                </div>
              </div>
            )}

            {/* DELETE GUEST BUTTON */}
            <div className="flex justify-end mt-1">
              {formData.guests.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeGuest(index)}
                  className="
                    font-monoton
                    text-[0.65rem] uppercase tracking-widest font-semibold
                    px-3 py-1
                    border border-black/40
                    rounded-sm
                    bg-[#f5ead5]
                    text-black
                    shadow-[2px_2px_0px_rgba(0,0,0,0.35)]
                    active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                  "
                >
                  {t("Șterge invitat")}
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Add guest button */}
        <button
          type="button"
          onClick={addGuest}
          className="
            font-monoton
            self-start mt-1
            bg-[#f5ead5]
            text-black
            px-3 py-1.5
            rounded-sm
            text-xs uppercase tracking-widest font-semibold
            border border-black/40
            shadow-[2px_2px_0px_rgba(0,0,0,0.35)]
            active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
          "
        >
          + {t("Adaugă invitat")}
        </button>
      </div>

      {/* LODGING SUGGESTIONS */}
      <div className="flex flex-col gap-2">
        <span className="text-xs tracking-widest uppercase font-semibold font-monoton">
          {t("accommodation_sug")}
        </span>

        <div className="flex flex-col gap-2">
          <label
            className="
              flex items-center gap-3 
              px-3 py-2 
              bg-[#f5ead5] 
              border border-black/30 
              rounded-sm
              shadow-[2px_2px_0px_rgba(0,0,0,0.35)]
              active:translate-x-[1px] active:translate-y-[1px] active:shadow-none
            "
          >
            <input required
              type="radio"
              name="lodgingSuggestions"
              value="yes"
              checked={formData.lodgingSuggestions === "yes"}
              onChange={handleChange}
              className="
                        appearance-none
                        h-4 w-4
                        border border-black/70
                        rounded-full
                        relative
                        before:content-['']
                        before:absolute before:inset-[3px] before:rounded-full
                        before:bg-transparent
                        checked:before:bg-[#d62423]
                      "
            />
            <span className="text-sm tracking-wide">
              {t("accommodation_yes")}
            </span>
          </label>

          <label
            className="
              flex items-center gap-3 
              px-3 py-2 
              bg-[#f5ead5] 
              border border-black/30 
              rounded-sm
              shadow-[2px_2px_0px_rgba(0,0,0,0.35)]
              active:translate-x-[1px] active:translate-y-[1px] active:shadow-none
            "
          >
            <input required
              type="radio"
              name="lodgingSuggestions"
              value="no"
              checked={formData.lodgingSuggestions === "no"}
              onChange={handleChange}
              className="
                        appearance-none
                        h-4 w-4
                        border border-black/70
                        rounded-full
                        relative
                        before:content-['']
                        before:absolute before:inset-[3px] before:rounded-full
                        before:bg-transparent
                        checked:before:bg-[#d62423]
                      "
            />
            <span className="text-sm tracking-wide">{t("accommodation_no")}</span>
          </label>
        </div>
      </div>

      {/* MESSAGE */}
      <label className="flex flex-col gap-1">
        <span className="text-xs tracking-widest uppercase font-semibold font-monoton">
          {t("Mesaj")}
        </span>

        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="
            px-3 py-2 
            border border-black/30 
            rounded-sm
            bg-[#f5ead5]
            text-black
            placeholder-black/40
            shadow-[2px_2px_0px_rgba(0,0,0,0.35)]
            focus:outline-none focus:border-black
            h-24
          "
          placeholder={t("write us")}
        />
      </label>

      {status?.message && (
        <div
          className={[
            "rounded-sm border px-3 py-3 shadow-[2px_2px_0px_rgba(0,0,0,0.35)]",
            "whitespace-pre-line text-[0.75rem] tracking-widest uppercase",
            status.type === "error"
              ? "bg-[#f5ead5] border-red-600 text-red-700"
              : "bg-[#f5ead5] border-green-700 text-green-800",
          ].join(" ")}
        >
          {status.message}
        </div>
      )}

      <div className="flex justify-center min-h-[2px]">
        <div ref={turnstileElRef} />
      </div>





      {/* SUBMIT */}
      <button
        type="submit"
        className="
          mt-2
          bg-red
          text-pink
          px-4 py-2
          rounded-sm
          uppercase tracking-widest text-sm font-bold
          border border-black/40
          shadow-[2px_2px_0px_rgba(0,0,0,0.5)]
          [text-shadow:0.5px_0.5px_1px_white]
          active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
          font-monoton
          "
        title="send"
      >
        {t("send")}
      </button>
    </form>


  );
}

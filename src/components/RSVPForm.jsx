import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Loader from "./Loader";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;


function isBlank(v) {
  return !v || !String(v).trim();
}


function titleCaseName(value) {
  return value
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trimStart()
    .replace(/(^|[\s\-’'])\p{L}/gu, (char) => char.toUpperCase());
}


function autoGrow(e) {
  e.target.style.height = "auto";
  e.target.style.height = `${e.target.scrollHeight}px`;
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

    if (isBlank(g.email) && g.ageType === 'adult') {
      errors.push(t("err_email_required", { idx }));
    } else if (g.ageType === 'adult' && !EMAIL_RE.test(String(g.email).trim())) {
      errors.push(t("err_email_invalid", { idx }));
    }

    if (isBlank(g.menu)) errors.push(t("err_menu_required", { idx }));

    // ageType required only for added guests (index !== 0)
    if (i !== 0 && isBlank(g.ageType)) {
      errors.push(t("err_agetype_required", { idx }));
    }
  });

  return errors;
}

export default function RSVPForm() {
  const { t } = useTranslation();
  const [status, setStatus] = useState(null);

  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileElRef = useRef(null);
  const widgetIdRef = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

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


  function resetTurnstile() {
    setTurnstileToken("");
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }


  async function handleSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return; // prevent double-click submits

    try {
      // validate first
      const errors = validateForm(formData, t);
      if (errors.length) {
        setStatus({ type: "error", message: errors.join("\n") });
        return;
      }

      // require fresh token
      if (!turnstileToken) {
        setStatus({
          type: "error",
          message: t("err_humancheck") || "Human check not ready yet — please try again.",
        });
        return;
      }

      setIsSubmitting(true);


      const payload = { ...formData, turnstileToken };

      const res = await fetch("/.netlify/functions/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        // if server returned html
        resetTurnstile();
        throw new Error("Server returned non-JSON.");
      }

      if (!json.ok) {
        // ✅ IMPORTANT: reset Turnstile on ANY backend error,
        // because the token is now likely consumed
        resetTurnstile();

        // If it was specifically Turnstile failing, show a nicer message
        const codes = json.verification?.["error-codes"]?.join(", ");
        const isTurnstileFail = json.message?.toLowerCase().includes("turnstile");

        setStatus({
          type: "error",
          message: isTurnstileFail
            ? (t("err_turnstile_retry") || "Human check failed — please try again.") + (codes ? `\n(${codes})` : "")
            : (json.message || t("unexpected_error")),
        });
        return;
      }

      const confirmed = json.confirmedSubmitted || [];
      const already = json.alreadyRegistered || [];

      let msgParts = [];

      if (confirmed.length) {
        msgParts.push(
          t("rsvp_confirmed_for", { names: confirmed.join(", ") })
        );
      }

      if (already.length) {
        msgParts.push(
          t("rsvp_already_registered", { names: already.join(", ") })
        );
      }

      setStatus({
        type: "success",
        message: msgParts.join("\n"),
      });

      requestAnimationFrame(() => statusRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));

      resetForm();

    } catch (err) {
      console.error("RSVP submission failed:", err);
      resetTurnstile?.();
      setStatus({ type: "error", message: t("unexpected_error") || "Something went wrong. Please try again." });
    }
    finally {
      setIsSubmitting(false);
    }
  }


  const statusRef = useRef(null);



  return (
    <div className="relative">
      {isSubmitting && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-pink/80">
          <Loader />
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className=" w-full max-w-lg mx-auto flex flex-col gap-6 px-4 pb-10 font-prata-light z-40 bg-pink"
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
                      handleGuestChange(
                        index,
                        "firstName",
                        titleCaseName(e.target.value)
                      )
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
                      handleGuestChange(
                        index,
                        "lastName",
                        titleCaseName(e.target.value)
                      )
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
            onChange={(e) => {
              handleChange(e);
              autoGrow(e);
            }}
            onInput={autoGrow}
            rows={3}
            className="
          px-3 py-2
          border border-black/30
          rounded-sm
          bg-[#f5ead5]
          text-black
          placeholder-black/40
          shadow-[2px_2px_0px_rgba(0,0,0,0.35)]
          focus:outline-none focus:border-black
          resize-none
          overflow-hidden
          min-h-[3.5rem]
        "
            placeholder={t('write us')}
          />

        </label>


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

        {status?.message && (
          <div ref={statusRef}
            className={[
              "mt-3 relative z-20", // ✅ ensures it sits above weird overlays
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


      </form>
    </div>
    // <Loader/>
  );
}

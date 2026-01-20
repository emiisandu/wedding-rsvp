import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function RSVPForm() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    guests: [
      {
        firstName: "",
        lastName: "",
        ageType: "adult",     // "adult" | "child"
        attendance: "",       // "da" | "nu"
        email: "",
        menu: "traditional",  // "traditional" | "vegetarian"
      },
    ],
    lodgingSuggestions: "no",
    message: "",
  });

  // Global fields (lodgingSuggestions, message)
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Guest-specific fields
  function handleGuestChange(index, field, value) {
    setFormData((prev) => {
      const guests = [...prev.guests];
      guests[index] = { ...guests[index], [field]: value };
      return { ...prev, guests };
    });
  }

  function addGuest() {
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
    setFormData((prev) => {
      if (prev.guests.length === 1) return prev; // keep at least one guest
      const guests = prev.guests.filter((_, i) => i !== index);
      return { ...prev, guests };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch("/.netlify/functions/rsvp", {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(formData),
      });

      const text = await res.text();
      console.log("RSVP raw response:", text);

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

      if (already) {
        msg += `\n${t("already_registered")}: ${already}`;
      }

      setStatus({
        type: "success",
        message: msg,
      });



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
                <input
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
                <input
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
                  <input
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
                  <input
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

            {/* EMAIL – only if COPIL */}
            {guest.ageType === "adult" && (
              <label className="flex flex-col gap-1">
                <span className="text-[0.65rem] tracking-widest uppercase font-semibold font-prata">
                  {t("email")}
                </span>
                <input
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
                    <input
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
                    <input
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
                    <input
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
                    <input
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
            <input
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
            <input
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
          className={`
            text-xs tracking-widest uppercase
            whitespace-pre-line
            ${status.type === "error"
              ? "text-red-700"
              : "text-green-700"
            }
          `}
        >
          {status.message}
        </div>
      )}

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

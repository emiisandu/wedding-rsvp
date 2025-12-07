import { useState } from "react";

export default function RSVPForm() {
  const [formData, setFormData] = useState({
    guests: [
      {
        firstName: "",
        lastName: "",
        attendance: "",
        email: "",
        menu: "traditional",
      },
    ],
    lodgingSuggestions: "no",
    message: "",
  });

  // Top-level (global) fields: lodgingSuggestions, message
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Guest fields
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
          attendance: "",
          email: "",
          menu: "traditional",
        },
      ],
    }));
  }

  function removeGuest(index) {
    setFormData((prev) => {
      if (prev.guests.length === 1) return prev; // keep at least one
      const guests = prev.guests.filter((_, i) => i !== index);
      return { ...prev, guests };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Submitted:", formData);
    // TODO: send formData somewhere
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto flex flex-col gap-6 px-4 pb-10"
    >
      {/* === GUESTS SECTION === */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs tracking-widest uppercase font-semibold font-fascinate">
          Invitați
        </h3>

        {formData.guests.map((guest, index) => (
          <div
            key={index}
            className="
              border border-black/30 bg-[#faf7f1] rounded-sm
              shadow-[2px_2px_0px_rgba(0,0,0,0.35)]
              px-3 py-3 flex flex-col gap-3
            "
          >
            {/* Prenume + Nume */}
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex-1 flex flex-col gap-1">
                <span className="text-[0.65rem] tracking-widest uppercase font-semibold font-fascinate">
                  Prenume
                </span>
                <input
                  type="text"
                  value={guest.firstName}
                  onChange={(e) =>
                    handleGuestChange(index, "firstName", e.target.value)
                  }
                  className="
                    px-3 py-2 
                    border border-black/30 
                    rounded-sm
                    bg-[#faf7f1]
                    focus:outline-none focus:border-black
                  "
                  placeholder="Prenume"
                />
              </label>

              <label className="flex-1 flex flex-col gap-1">
                <span className="text-[0.65rem] tracking-widest uppercase font-semibold font-fascinate">
                  Nume
                </span>
                <input
                  type="text"
                  value={guest.lastName}
                  onChange={(e) =>
                    handleGuestChange(index, "lastName", e.target.value)
                  }
                  className="
                    px-3 py-2 
                    border border-black/30 
                    rounded-sm
                    bg-[#faf7f1]
                    focus:outline-none focus:border-black
                  "
                  placeholder="Nume"
                />
              </label>
            </div>

            {/* EMAIL (per guest) */}
            <label className="flex flex-col gap-1">
              <span className="text-[0.65rem] tracking-widest uppercase font-semibold font-fascinate">
                Adresa de e-mail
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
                  bg-[#faf7f1]
                  shadow-[2px_2px_0px_rgba(0,0,0,0.35)]
                  focus:outline-none focus:border-black
                "
                placeholder="abc@def.com"
              />
            </label>

            {/* PARTICIPARE */}
            <div className="flex flex-col gap-2 mt-1">
              <span className="text-[0.65rem] tracking-widest uppercase font-semibold font-fascinate">
                Participare
              </span>

              <div className="flex flex-col gap-2">
                <label
                  className="
                    flex items-center gap-3 
                    px-3 py-2 
                    bg-[#faf7f1] 
                    border border-black/30 
                    rounded-sm
                    shadow-[2px_2px_0px_rgba(0,0,0,0.35)]
                    active:translate-x-[1px] active:translate-y-[1px] active:shadow-none
                  "
                >
                  <input
                    type="radio"
                    name={`attendance-${index}`}
                    value="yes"
                    checked={guest.attendance === "yes"}
                    onChange={(e) =>
                      handleGuestChange(index, "attendance", e.target.value)
                    }
                    className="
                      appearance-none
                      h-4 w-4
                      border border-black/70 
                      rounded-full 
                      checked:bg-black 
                      checked:border-black
                    "
                  />
                  <span className="text-sm tracking-wide">Vin</span>
                </label>

                <label
                  className="
                    flex items-center gap-3 
                    px-3 py-2 
                    bg-[#faf7f1] 
                    border border-black/30 
                    rounded-sm
                    shadow-[2px_2px_0px_rgba(0,0,0,0.35)]
                    active:translate-x-[1px] active:translate-y-[1px] active:shadow-none
                  "
                >
                  <input
                    type="radio"
                    name={`attendance-${index}`}
                    value="no"
                    checked={guest.attendance === "no"}
                    onChange={(e) =>
                      handleGuestChange(index, "attendance", e.target.value)
                    }
                    className="
                      appearance-none
                      h-4 w-4
                      border border-black/70 
                      rounded-full 
                      checked:bg-black 
                      checked:border-black
                    "
                  />
                  <span className="text-sm tracking-wide">Nu vin</span>
                </label>
              </div>
            </div>

            {/* MENU (per guest) */}
            <div className="flex flex-col gap-2 mt-1">
              <span className="text-[0.65rem] tracking-widest uppercase font-semibold font-fascinate">
                Meniu
              </span>

              <div className="flex flex-col gap-2">
                <label
                  className="
                    flex items-center gap-3 
                    px-3 py-2 
                    bg-[#faf7f1] 
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
                      checked:bg-black 
                      checked:border-black
                    "
                  />
                  <span className="text-sm tracking-wide">Tradițional</span>
                </label>

                <label
                  className="
                    flex items-center gap-3 
                    px-3 py-2 
                    bg-[#faf7f1] 
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
                      checked:bg-black 
                      checked:border-black
                    "
                  />
                  <span className="text-sm tracking-wide">Vegetarian</span>
                </label>
              </div>
            </div>

            {/* DELETE GUEST BUTTON */}
            <div className="flex justify-end mt-1">
              {formData.guests.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeGuest(index)}
                  className="
                    text-[0.65rem] uppercase tracking-widest font-semibold
                    px-3 py-1
                    border border-black/40
                    rounded-sm
                    bg-[#faf7f1]
                    text-black
                    shadow-[2px_2px_0px_rgba(0,0,0,0.35)]
                    active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                  "
                >
                  Șterge invitat
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
            self-start mt-1
            bg-[#faf7f1]
            text-black
            px-3 py-1.5
            rounded-sm
            text-xs uppercase tracking-widest font-semibold
            border border-black/40
            shadow-[2px_2px_0px_rgba(0,0,0,0.35)]
            active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
          "
        >
          + Adaugă invitat
        </button>
      </div>

      {/* === LODGING SUGGESTIONS (APPLIES TO ALL) === */}
      <div className="flex flex-col gap-2">
        <span className="text-xs tracking-widest uppercase font-semibold font-fascinate">
          Vrei sugestii de cazare?
        </span>

        <div className="flex flex-col gap-2">
          <label
            className="
              flex items-center gap-3 
              px-3 py-2 
              bg-[#faf7f1] 
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
                checked:bg-black 
                checked:border-black
              "
            />
            <span className="text-sm tracking-wide">
              Da, trimite-mi sugestii
            </span>
          </label>

          <label
            className="
              flex items-center gap-3 
              px-3 py-2 
              bg-[#faf7f1] 
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
                checked:bg-black 
                checked:border-black
              "
            />
            <span className="text-sm tracking-wide">Nu, mulțumesc</span>
          </label>
        </div>
      </div>

      {/* === MESSAGE FIELD === */}
      <label className="flex flex-col gap-1">
        <span className="text-xs tracking-widest uppercase font-semibold font-fascinate">
          Mesaj
        </span>

        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="
            px-3 py-2 
            border border-black/30 
            rounded-sm
            bg-[#faf7f1]
            text-black
            placeholder-black/40
            shadow-[2px_2px_0px_rgba(0,0,0,0.35)]
            focus:outline-none focus:border-black
            h-24
          "
          placeholder="Scrie-ne ceva drăguț…"
        />
      </label>

      {/* === SUBMIT BUTTON === */}
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
          shadow-[2px_2px_0px_rgba(0,0,0,0.35)]
          [text-shadow:0.5px_0.5px_1px_white]
          active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
        "
      >
        TRIMITE
      </button>
    </form>
  );
}

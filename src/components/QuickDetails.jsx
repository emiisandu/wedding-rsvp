const TZ = "Europe/Bucharest";

function pad(n) {
    return String(n).padStart(2, "0");
}

// YYYY-MM-DD + HH:MM → YYYYMMDDTHHMM00
function toLocal(dateISO, time) {
    const [y, m, d] = dateISO.split("-").map(Number);
    const [hh, mm] = time.split(":").map(Number);
    return `${y}${pad(m)}${pad(d)}T${pad(hh)}${pad(mm)}00`;
}

function makeIcs({ title, dateISO, start, end, location, description }) {
    const dtStamp =
        new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    return [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Wedding Invite//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `UID:${dateISO}-${Math.random().toString(16).slice(2)}@invite`,
        `DTSTAMP:${dtStamp}`,
        `DTSTART;TZID=${TZ}:${toLocal(dateISO, start)}`,
        `DTEND;TZID=${TZ}:${toLocal(dateISO, end)}`,
        `SUMMARY:${title}`,
        `LOCATION:${location}`,
        `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
        "END:VEVENT",
        "END:VCALENDAR",
    ].join("\r\n");
}

function downloadIcs(filename, content) {
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
}


import { useTranslation } from "react-i18next";
import React, { useRef } from "react";

export default function QuickDetails() {
    const { t } = useTranslation();

    const dateISO = "2026-07-25";
    const dateLabel = t("25 iulie 2026")
    const town = "Fundu Moldovei, Suceava";

    const schedule = [
        {
            timeLabel: "2:00 PM",
            title: t("Iertăciune"),
            place: t("Pensiunea La Moara"),
            link: "https://maps.app.goo.gl/PN59jzskmuTTfvYR7",
        },
        {
            timeLabel: "4:00 PM",
            title: t("Cununie religioasă"),
            place: t("Biserica Sf. Dumitru"),
            link: "https://maps.app.goo.gl/GnNc6iYsGZYJq1BZ9",
        },
        {
            timeLabel: "6:00 PM",
            title: t("Petrecere"),
            place: t("Sala de Evenimente La Baciu"),
            link: "https://maps.app.goo.gl/SYgho5d2TUPX75JNA",
        },
    ];

    const description = schedule
        .map((s) => `${s.timeLabel} — ${s.title} — ${s.place}\n${s.link}`)
        .join("\n\n");



    const ics = makeIcs({
        title: t("event-title"),
        dateISO,
        start: "14:00",
        end:"23:59",
        location: town,
        description,
    });

    return (
        <section className="px-6 pt-12 pb-20 mt-20">
            <div className="max-w-4xl mx-auto">
                <div
                    className="
            bg-[#f5ead5]
            border border-black/30
            rounded-sm
            shadow-[2px_2px_0px_rgba(0,0,0,0.35)]
            px-5 py-5
            
          "
                >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-monoton uppercase tracking-widest text-sm">
                                {t("Detalii eveniment")}
                            </h3>
                            <h3 className="font-monoton uppercase tracking-widest text-sm mt-8">
                                {t("event-title")}</h3>
                            <p className="font-prata text-xs tracking-widest uppercase mt-2">
                                {dateLabel}
                            </p>
                            <p className="font-prata text-[0.7rem] tracking-widest uppercase text-black/60">
                                {town}
                            </p>
                        </div>
                        <div className="text-right font-prata text-[0.6rem] tracking-widest uppercase text-black/50">
                            {t("screenshot-friendly")}
                        </div>
                    </div>

                    <div className="h-px bg-black/20 my-4" />

                    {/* Timeline */}
                    <div className="flex flex-col gap-2 font-prata text-xs tracking-widest uppercase">
                        <div className="flex justify-between">
                            <span>{t("ORA 14")}</span>
                            <span>{t("Iertăciune")}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{t("ORA 16")}</span>
                            <span>{t("Cununie religioasă")}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{t("ORA 18")}</span>
                            <span>{t("Petrecere")}</span>
                        </div>
                    </div>

                    {/* Add to calendar */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() =>
                                downloadIcs("Theodora-Cozmin-Wedding.ics", ics)
                            }
                            className="
                font-prata
                text-[0.6rem]
                tracking-[0.35em]
                uppercase
                px-4 py-2
                border border-black/40
                rounded-sm
                shadow-[2px_2px_0px_rgba(0,0,0,0.35)]
                active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
              "
                        >
                            {t("add_to_calendar")}
                        </button>
                    </div>

                    {/* <p className="mt-4 text-center font-prata text-[0.55rem] tracking-[0.25em] uppercase text-black/50">
                        
                    </p> */}
                </div>
            </div>
        </section>
    );
}

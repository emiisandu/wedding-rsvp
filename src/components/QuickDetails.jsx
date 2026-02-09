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
import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";

export default function QuickDetails() {
    const { t } = useTranslation();

    const dateISO = "2026-07-25";
    const dateLabel = t("25 iulie 2026")
    const town = "Fundu Moldovei, Suceava";

    const schedule = [
        {
            timeLabel: t("ORA 14"),
            title: t("iertaciune_short"),
            place: t("Pensiunea La Moara"),
            link: "https://maps.app.goo.gl/PN59jzskmuTTfvYR7",
        },
        {
            timeLabel: t("ORA 16"),
            title: t("Cununie religioasă"),
            place: t("Biserica Sf. Dumitru"),
            link: "https://maps.app.goo.gl/GnNc6iYsGZYJq1BZ9",
        },
        {
            timeLabel: t("ORA 18"),
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
        end: "23:59",
        location: town,
        description,
    });


    const exportRef = useRef(null);
    const [exporting, setExporting] = useState(false);

    async function downloadCardImage() {
        setExporting(true);

        // wait one frame so styles/layout are applied
        await new Promise((r) => requestAnimationFrame(r));

        if (!exportRef.current) return;

        const canvas = await html2canvas(exportRef.current, {
            backgroundColor: "#f5ead5",
            scale: Math.min(2, window.devicePixelRatio || 2),
            useCORS: true,
            logging: false,
        });

        setExporting(false);

        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = "Detalii-eveniment.png";
        a.click();
    }


    const year = new Date().getFullYear();


    return (
        <section className="relative px-6 pt-32 pb-0 mt-30 z-40 bg-pink border-0">
            <div className="max-w-4xl mx-auto">
                <div
                    className="
                    mt-10
                    bg-[#f5ead5]
                    border border-black/30
                    rounded-sm
                    shadow-[2px_2px_0px_rgba(0,0,0,0.35)]
                    px-5 py-10 
                    min-h-[60vh]
                    flex flex-col
                "
                >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-monoton uppercase tracking-widest text-sm [word-spacing:0.4em]">
                                {t("Detalii eveniment")}
                            </h3>
                            <h3 className="flex items-center gap-2 font-monoton uppercase tracking-widest text-sm mt-8 [word-spacing:0.4em]">
                                {t("event-title")}
                                <img
                                    className="w-8 sm:w-12 inline-block translate-y-[1px]"
                                    src="/images/wedding-ring.svg"
                                    alt="Wedding rings"
                                />
                            </h3>

                            <p className="font-prata text-xs  uppercase mt-8">
                                {dateLabel}
                            </p>
                            <p className="font-prata text-[0.7rem]  uppercase text-black/80">
                                {town}
                            </p>
                        </div>
                        <div className="text-right font-prata text-[0.6rem]  uppercase text-black/50"
                            data-html2canvas-ignore="true">
                            {/* {t("screenshot-friendly")} */}

                            <div className="flex justify-center">
                                <button
                                    onClick={downloadCardImage}
                                    className="
                        font-prata-light
                        text-[.60rem]
                        uppercase
                        active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                        "
                                >                            {t("screenshot-friendly")}

                                    <span className="text-[.9rem]"> ⤓</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-black/20 my-4" />

                    {/* Timeline */}
                    <div className="flex flex-col gap-2 font-prata text-xs uppercase mt-6">
                        <div className="flex justify-between">
                            <span>{t("ORA 14")}</span>
                            <span>{t("iertaciune_short")}</span>
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
                    <div className="mt-auto text-center " data-html2canvas-ignore="true">
                        <button
                            onClick={() =>
                                downloadIcs("Theodora-Cozmin-Wedding.ics", ics)
                            }
                            className="
                        font-prata-light
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
                    <div
                        className="
                            fixed left-[-10000px] top-0
                            mt-14
                            max-w-4xl mx-auto
                            flex flex-col sm:flex-row
                            items-center sm:items-end
                            justify-between
                            gap-2
                            px-4
                            "
                    >
                        {/* Left text */}
                        <p
                            className="
                            text-[0.65rem]
                            tracking-[0.35em]
                            uppercase
                            font-prata-light
                            text-black/100
                            text-center sm:text-left
                        "
                        >
                            Crafted with love
                            <br></br>© {year} zwaistein
                        </p>

                        {/* Right text (email) */}
                        <p
                            className="
                                text-[0.55rem]
                                tracking-[0.25em]
                                font-prata-light
                                text-black/100
                                text-center sm:text-right
                            "
                        >
                            zwaisteinsrl@gmail.com
                        </p>
                    </div>
                    {/* <p className="mt-4 text-center font-prata text-[0.55rem] tracking-[0.25em] uppercase text-black/50">
                        
                    </p> */}
                </div>


                {/* EXPORT-ONLY CARD (off-screen but renderable) */}
                <div className={exporting ? "export-visible" : "export-only"}>
                    <div
                        ref={exportRef}
                        className="
                    w-[420px]
                    bg-[#f5ead5]
                    border border-black/30
                    rounded-sm
                    shadow-[2px_2px_0px_rgba(0,0,0,0.35)]
                    px-5 py-10
                    flex flex-col
                    "
                    >
                        {/* Header (NO screenshot-friendly label) */}
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-monoton uppercase tracking-widest text-sm [word-spacing:0.4em]">
                                    {t("Detalii eveniment")}
                                </h3>

                                <h3 className="flex items-center gap-2 font-monoton uppercase tracking-widest text-sm mt-8 [word-spacing:0.4em]">
                                    {t("event-title")}

                                </h3>

                                <p className="font-prata text-xs uppercase mt-8">{dateLabel}</p>
                                <p className="font-prata text-[0.7rem] uppercase text-black/80">{town}</p>
                            </div>
                        </div>

                        <div className="h-px bg-black/20 my-4" />

                        {/* Timeline */}
                        <div className="flex flex-col gap-2 font-prata text-xs uppercase mt-6">
                            <div className="flex justify-between">
                                <span>{t("ORA 14")}</span>
                                <span>{t("iertaciune_short")}</span>
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

                        {/* FOOTER SIGNATURE (included in export image) */}
                        <div className="mt-10 pt-6 border-t border-black/20 flex items-end justify-between gap-4">
                            <p className="text-[0.65rem] tracking-[0.20em] uppercase font-prata-light text-black">
                                Crafted with love <br />© {year} zwaistein
                            </p>

                            <p className="text-[0.55rem] tracking-[0.18em] font-prata-light text-black text-right">
                                zwaisteinsrl@gmail.com
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

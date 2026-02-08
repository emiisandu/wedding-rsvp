import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function HoraReveal() {
    const ref = useRef(null);
    const { t } = useTranslation();

    // progress 0..1 while scrolling through this section
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    // Foreground appears first
    // Foreground: reveal quickly
    const fgOpacity = useTransform(scrollYProgress, [0.0, 0.05, 0.12], [0, 1, 1]);
    const fgScale = useTransform(scrollYProgress, [0.0, 0.10], [1.03, 1]);

    // Background: start soon after
    const bgOpacity = useTransform(scrollYProgress, [0.10, 0.18], [0, 1]);
    const bgScale = useTransform(scrollYProgress, [0.10, 0.22], [1.06, 1]);

    // Note: also earlier
    const noteOpacity = useTransform(scrollYProgress, [0.18, 0.26], [0, 1]);
    const noteY = useTransform(scrollYProgress, [0.18, 0.26], [16, 0]);

    const sceneLift = useTransform(scrollYProgress, [0.92, 1.0], [0, -240]);
    const sceneFade = useTransform(scrollYProgress, [0.96, 1.0], [1, 0]);


    return (
        <section ref={ref} className="bg-pink px-6">
            {/* scroll fuel */}
            <div className="relative mx-auto max-w-4xl h-[150vh] sm:h-[165vh] mt-[-28rem]">
                {/* pinned viewport */}
                <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
                    <motion.div style={{ y: sceneLift, opacity: sceneFade }} className="relative w-[92vw] max-w-[520px]">
                        {/* background (reveals second) */}
                        <motion.img
                            src="/images/hora-background.png"
                            alt=""
                            className="block w-full h-auto select-none pointer-events-none"
                            style={{ opacity: bgOpacity, scale: bgScale }}
                        />

                        {/* foreground left */}
                        <motion.img
                            src="/images/hora-foreground-left.png"
                            alt=""
                            className="absolute inset-0 block w-full h-auto select-none pointer-events-none"
                            style={{ opacity: fgOpacity, scale: fgScale }}
                        />

                        {/* foreground right */}
                        <motion.img
                            src="/images/hora-foreground-right.png"
                            alt=""
                            className="absolute inset-0 block w-full h-auto select-none pointer-events-none"
                            style={{ opacity: fgOpacity, scale: fgScale }}
                        />
                    </motion.div>
                </div>

            {/* <img
                src="/images/dress-code-2.png"
                alt="no pic"
                className="w-32 sm:w-24 h-auto mb-2 pointer-events-none select-none rotate-[-5deg]
                mt-[8rem]
                "
            /> */}

                {/* Bucovina cocktail note */}
                <motion.div
                    style={{ opacity: noteOpacity, y: noteY }}
                    className="
                            absolute 
                            bottom-4 sm:bottom-[-10rem] 
                            right-[-3.5rem] sm:right-[-1.5rem] 
                            z-30
                            max-w-[240px]
                            sm:max-w-[25rem]
                            rounded-[18px]
                            bg-pink/90
                            p-3
                            sm:pb-[8rem]
                            
                        "
                >
                    <img
                        src="/images/bucovina-cocktail.png"
                        alt=""
                        className="w-32 sm:w-40  mb-2 pointer-events-none select-none rotate-[-1deg] relative top-4 right-[-5rem]"
                    />

                    <p className="font-prata text-sm text-red leading-snug">
                        <span className="block font-meow text-[1.4rem]">Dress code:</span>
                        <span className="tracking-wide">{t("bucovina_cocktail")}</span>
                    </p>

                    <p className="flex mt-1 font-prata text-xs sm:text-sm ">
                        {t("dress_code_text")}
                        <img
                            src="/images/bucovina-sun.png"
                            alt=""
                            className="w-16 sm:w-24 h-auto mb-2 pointer-events-none select-none rotate-[-5deg]"
                        />
                    </p>
                    <p className="mt-1 font-prata-light text-xs sm:text-sm text-red/80 tracking-widest">
                        See you @FM
                    </p>
                </motion.div>

            </div>

            {/* <img
                src="/images/dress-code-1.png"
                alt="no pic"
                className="w-32 sm:w-24 h-auto mb-2 pointer-events-none select-none rotate-[-5deg]
                mt-[-3rem]
                "
            /> */}

        </section>
    );
}

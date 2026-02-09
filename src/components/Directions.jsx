import { useTranslation } from "react-i18next";
import { Parallax } from "react-scroll-parallax";
import CopyRow from "./CopyRow";
import HoraReveal from "./HoraReveal";
import Gift from "./Gift";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Directions() {
    const { t } = useTranslation();

    return (
        <section className="relative z-50 px-6 bg-pink border-0 mt-20">
            <div className="relative max-w-4xl mx-auto
                min-h-[150vh]
                sm:min-h-[200vh]
                [@media(min-height:900px)]:min-h-[140vh]
                [@media(min-height:1200px)]:min-h-[120vh]">



                {/* CONTENT UNDER TITLE */}
                <div className="sticky top-0 z-50 bg-pink pt-[1.5rem] sm:pt-[0rem] pb-[.7rem] sm:pb-0 ">
                    {/* title block (your existing) */}
                    <div className="flex items-center justify-center date-div text-align text-right">
                        <svg
                            viewBox="0 0 600 100"
                            className="swirly-text [font-size:2.8rem] sm:[font-size:2.2rem]"
                            aria-hidden="true"
                        >
                            <path
                                id="wavePath"
                                d="M0,60 Q75,20 150,60 T300,60 T450,60 T600,60"
                                fill="transparent"
                            />
                            <text>
                                <textPath href="#wavePath" startOffset="50%" textAnchor="middle">
                                    {t("direction_title")}

                                </textPath>

                            </text>
                        </svg>
                        {/* <img
                            src="/images/pin.png"
                            alt=""
                            className="ml-[-2rem] mr-[2.5rem] w-12 sm:w-24 object-cover"
                        /> */}
                    </div>
                </div>
                {/* grid */}
                <div className="mx-auto max-w-4xl mt-4 sm:mt-10">
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* 1) LEFT BIG IMAGE (belongs to title) */}
                        <div className="relative overflow-hidden  bg-pink p-3">
                            {/* wavy “frame” overlay */}
                            <div className="pointer-events-none absolute inset-0 opacity-60 sm:top-[-30rem]">
                                <svg viewBox="0 0 400 300" className="h-full w-full">
                                    <path
                                        d="M20,40 Q60,10 100,35 T180,35 T260,35 T340,35 
                                            Q380,40 370,80 
                                            T370,180 
                                            Q370,240 330,250 
                                            T90,250 
                                            Q30,245 30,210 
                                            T30,90 
                                            Q30,55 20,40 Z"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                    />
                                </svg>
                            </div>
                            {/* replace this with your image */}
                            <div className="relative overflow-hidden rounded-[22px]">
                                <img
                                    src="/images/fm-hora.png"
                                    alt=""
                                    className="h-[210px] w-full object-cover md:h-[290px] sm:h-[240px] lg:h-[290px]"
                                />
                            </div>

                            {/* tiny caption (optional) */}
                            {/* <p className="mt-3 text-right font-prata text-xs tracking-widest text-red/80 text-[.8rem]  sm:text-[1rem]">
                                    {t("direction_subtitle")}
                                </p> */}


                            {/* desktop-only filler so left side isn't empty */}
                            <div className="hidden lg:block">
                                {/* <div className="flex justify-center pointer-events-none mt-4">
                                    <Parallax speed={5}>

                                        <img className="w-[8rem]" src="/images/wedding-ring.svg" alt="" />
                                    </Parallax>
                                </div> */}

                                {/* <div className="relative overflow-hidden mt-0">
                                    <div className="relative z-10 flex justify-center pointer-events-none">
                                        <Parallax speed={-45}>
                                            <img className="w-[26rem]" src="/images/fm-deer.svg" alt="" />
                                        </Parallax>
                                    </div>

                                    <div className="relative z-40 flex justify-center pointer-events-none">
                                        <img className="w-[28rem]" src="/images/fm-mount.png" alt="" />
                                    </div>
                                </div>

                                <div className="left-0 right-0 mx-auto gifts-end bg-pink h-[20vh] z-30 w-80 overflow-hidden bottom-0 mb-0 top-[-3em]  mt-0 relative">

                                </div> */}

                                <MobileDeerMountSwap />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <TravelCard
                                align="right"
                                title={t("by_car")}
                                subtitle="A3/A7"
                                img="/images/fm-car.png"
                            />
                            <div className="flex justify-center pointer-events-none mt-[-4rem] ">
                                <Parallax speed={15}>
                                    <img
                                        className="w-80 lg:w-96"
                                        src="/images/fm-house.svg"
                                        alt="FM House"
                                    />
                                </Parallax>
                            </div>
                            <TravelCard
                                align="left"
                                title={t("by_train")}
                                subtitle={t("train_text")}
                                img="/images/fm-train.png"
                                locationLink={t("train_link")}
                                locationLabel={t("info_train")}
                            />

                            {/* <div className="relative overflow-hidden">
                                <div className="block lg:hidden relative z-10 flex justify-center pointer-events-none">
                                    <Parallax speed={-26}>
                                        <img className="w-80 lg:w-96" src="/images/fm-deer.svg" alt="" />
                                    </Parallax>
                                </div>

                                <div className="block lg:hidden relative z-40 flex justify-center pointer-events-none">
                                    <img className="w-96 lg:w-96" src="/images/fm-mount.png" alt="" />
                                </div>
                            </div> 
                            
                            */}

                            <div className="block lg:hidden">
                                <MobileDeerMountSwap />
                            </div>

                            <div className="mt-4"></div>
                            <TravelCard
                                align="right"
                                title={t("by_plane")}
                                subtitle={t("plane_text")}
                                img="/images/fm-plane.png"
                                locationLink={t("plane_link")}
                                locationLabel={t("info_plane")}
                            />
                        </div>
                    </div>
                </div>
            </div>


            <HoraReveal />

            <Gift />

        </section >)


}


function TravelCard({ title, subtitle, img, align = "left", locationLink = null, locationLabel = null }) {
    const isRight = align === "right";

    return (
        <div
            className={[
                "relative w-[90%] sm:w-[85%] overflow-hidden bg-pink/40 p-4 z-40",
                isRight ? "self-end text-right" : "self-start text-left",
            ].join(" ")}
        >
            <div className={["flex items-start gap-3", isRight ? "flex-row-reverse" : ""].join(" ")}>
                {/* descriptive image */}
                <div className="shrink-0">
                    <div className="w-40 sm:w-40 overflow-hidden bg-pink/60">
                        <img src={img} alt="" className="h-full w-full object-cover" />
                    </div>
                </div>

                {/* text */}
                <div className="min-w-0">
                    <div className={["flex items-center ", isRight ? " justify-end" : "ml-[-.5rem]"].join(" ")}>
                        {!isRight && <span className="mt-[2px] inline-block h-2 w-2 rounded-full bg-red/70" />}
                        <p className="font-meow [font-size:2.2rem] text-base text-red">{title}</p>
                        {isRight && <span className="mt-[2px] inline-block h-2 w-2 rounded-full bg-red/70" />}
                    </div>

                    <p className="mt-1 text-[.8rem]  sm:text-[1rem] leading-snug font-prata whitespace-normal ">
                        {subtitle}
                    </p>
                    {locationLink && (<a
                        href={locationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 underline text-blue-600 hover:text-blue-700 font-prata"
                    >
                        <span>
                            {locationLabel ?? ""}
                        </span>
                    </a>)}

                </div>
            </div>

            {/* subtle “paper cut” corner (mirror it too) */}
            {/* <div
        className={[
          "pointer-events-none absolute h-20 w-20 rotate-12 rounded-[26px] border border-red/20 bg-pink/30",
          isRight ? "-left-6 -top-6" : "-right-6 -top-6",
        ].join(" ")}
      /> */}
        </div>
    );
}

function MobileDeerMountSwap() {
    const ref = useRef(null);

    // local scroll progress for just this block
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"], // starts when it enters viewport, ends when it leaves
    });

    // pick the exact “moment” (tweak these numbers)
    const t0 = 0.48; // start of swap
    const t1 = 0.52; // end of swap

    // deer disappears during the swap window
    const deerOpacity = useTransform(scrollYProgress, [t0, t1], [1, 0]);

    // crossfade mounts in the same window
    const mountOpacity = useTransform(scrollYProgress, [t0, t1], [1, 0]);
    const mountDeerOpacity = useTransform(scrollYProgress, [t0, t1], [0, 1]);

    return (

        <div ref={ref} className="block lg:mt-32 relative overflow-hidden">
            {/* deer (over everything, centered-ish) */}
            <motion.div
                style={{ opacity: deerOpacity }}
                className="absolute inset-0 z-20 flex justify-center pointer-events-none "
            >
                <Parallax speed={-26}>
                    <img className="w-80 lg:w-96" src="/images/fm-deer.svg" alt="" />
                </Parallax>
            </motion.div>

            {/* base mount */}
            <motion.div
                style={{ opacity: mountOpacity }}
                className="relative z-10 flex justify-center pointer-events-none"
            >
                <img className="w-96 lg:w-96" src="/images/fm-mount.png" alt="" />
            </motion.div>

            {/* swapped mount (with deer baked into image) */}
            <motion.div
                style={{ opacity: mountDeerOpacity }}
                className="absolute inset-0 z-10 flex justify-center pointer-events-none"
            >
                <img className="w-96 lg:w-96" src="/images/fm-mount-deer.png" alt="" />
            </motion.div>
        </div>

    );
}

import { useTranslation } from "react-i18next";
import { Parallax } from "react-scroll-parallax";
import CopyRow from "./CopyRow";
import { Trans } from "react-i18next";

export default function Gift() {
    const { t } = useTranslation();

    return (
        <section className=" px-6 bg-pink border-0">
            {/* Make this section tall so scrolling can happen */}
            <div className="relative mx-auto max-w-4xl h-[150vh] ">

                <div className="sticky top-0 z-30 flex justify-center pt-6 pointer-events-none">
                    <img
                        className=""
                        src="/images/fm-forest-top.svg"
                        alt="FM forest top"
                    />
                </div>

                {/* 2) HEART + TEXT: becomes sticky below top forest */}
                {/* Pick a top offset that matches the height of the top image */}
                <div className="sticky top-[220px] sm:top-[14rem] z-20 flex justify-center w-80  left-0 right-0 mx-auto">
                    <div className="flex items-center gap-4 bg-pink/0">
                        <img className="w-24" src="/images/heart-box.svg" alt="Heart box" />
                        <div className="font-prata leading-snug text-[.9rem] sm:text-[1.2rem]">
                            <p>
                                <Trans i18nKey="gift_msg" components={[<span className="diacritic-nudge-big" />]} />
                            </p>

                            <p>
                                <Trans i18nKey="gift_text" components={[<span className="diacritic-nudge-big" />]} />
                            </p>

                            <div className="mt-3 space-y-1 text-[0.7rem] sm:text-[0.9rem] tracking-widest">
                                <CopyRow label="BCR" value="RO002RNCB29387298" />
                                <CopyRow label="BT" value="RO002RNCB29387298" />
                                <div>Beneficiar: Țibu Cozmin</div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* caprioara sa aterizeze pe colina (sa nu dispara in ea) si sa se faca asa freeze */}
                {/* 3) BOTTOM FOREST: becomes sticky below heart/text */}
                {/* Pick a top offset that matches: top image + heart/text block */}
                <div className="sticky fixed top-[15rem] sm:top-[10rem] z-10 flex justify-center pointer-events-none">
                    <img

                        src="/images/fm-forest-bottom.svg"
                        alt="FM forest bottom"
                    />
                </div>

            </div>

            <div className="flex justify-center pointer-events-none">
                <Parallax speed={-6}>
                    <img
                        className="w-80 lg:w-96"
                        src="/images/fm-house.svg"
                        alt="FM forest top"
                    />
                </Parallax>
            </div>

            {/* <div className="flex justify-center pointer-events-none">
                <Parallax speed={16}>

                    <img
                        className="w-80 lg:w-96"
                        src="/images/fm-houses.svg"
                        alt="FM forest top"
                    />
                </Parallax>
            </div> */}


            <div className="relative overflow-hidden">
                {/* deer */}
                <div className="relative z-10 flex justify-center pointer-events-none">
                    <Parallax speed={-26}>
                        <img className="w-80 lg:w-96" src="/images/fm-deer.svg" alt="" />
                    </Parallax>
                </div>

                {/* mount */}
                <div className="relative z-40 flex justify-center pointer-events-none">
                    <img className="w-96 lg:w-96" src="/images/fm-mount.svg" alt="" />
                </div>
            </div>


            <div className="left-0 right-0 mx-auto gifts-end bg-pink h-[20vh] z-30 w-80 overflow-hidden bottom-0 mb-0 top-[-3em]  mt-0 relative">

            </div>
        </section>
    );
}

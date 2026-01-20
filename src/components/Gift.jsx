import { useTranslation } from "react-i18next";
import { Parallax } from "react-scroll-parallax";
import CopyRow from "./CopyRow";
export default function Gift() {
    const { t } = useTranslation();

    return (
        <section className="bg-pink px-6 bg-pink border-0">
            {/* Make this section tall so scrolling can happen */}
            <div className="relative mx-auto max-w-4xl h-[150vh] ">

                <div className="sticky top-0 z-30 flex justify-center pt-6 pointer-events-none">
                    <img
                        className="w-80 lg:w-96"
                        src="/images/fm-forest-top.svg"
                        alt="FM forest top"
                    />
                </div>

                {/* 2) HEART + TEXT: becomes sticky below top forest */}
                {/* Pick a top offset that matches the height of the top image */}
                <div className="sticky top-[220px] sm:top-[14rem] z-20 flex justify-center w-80  left-0 right-0 mx-auto">
                    <div className="flex items-center gap-4 bg-pink/0">
                        <img className="w-24" src="/images/heart-box.svg" alt="Heart box" />
                        <div className="font-prata text-sm leading-snug">
                            <p>{t("gift_msg")}</p>

                            <div className="mt-3 space-y-1 text-[0.6rem] sm:text-[0.8rem] tracking-widest">
                                <CopyRow label="BCR" value="RO002RNCB29387298" />
                                <CopyRow label="BT" value="RO002RNCB29387298" />
                                <div>Beneficiar: Țibu Cozmin</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3) BOTTOM FOREST: becomes sticky below heart/text */}
                {/* Pick a top offset that matches: top image + heart/text block */}
                <div className="sticky top-[12rem] sm:top-[10rem] z-10 flex justify-center pointer-events-none">
                    <img
                        className="w-80 lg:w-96"
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

            <div className="flex justify-center pointer-events-none">
                <Parallax speed={16}>

                    <img
                        className="w-80 lg:w-96"
                        src="/images/fm-houses.svg"
                        alt="FM forest top"
                    />
                </Parallax>
            </div>


            <div className="relative z-10 flex justify-center pointer-events-none">
                <Parallax speed={-26}>

                    <img
                        className="w-80 lg:w-96 "
                        src="/images/fm-deer.svg"
                        alt="FM forest top"
                    />
                </Parallax>
            </div>


            <div className="relative flex justify-center pointer-events-none z-40 overflow-hidden">
                {/* <Parallax speed={-26}> */}

                <img
                    className="w-96 lg:w-96"
                    src="/images/fm-mount.svg"
                    alt="FM forest top"
                />
                {/* </Parallax> */}
            </div>


            <div className="bg-pink h-[20vh] z-40 w-80 overflow-hidden bottom-0 mb-0 relative">

            </div>
        </section>
    );
}

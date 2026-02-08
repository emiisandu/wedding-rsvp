import { useTranslation } from "react-i18next";
import { Parallax } from "react-scroll-parallax";
import CopyRow from "./CopyRow";

export default function Gift() {
    const { t } = useTranslation();

    return (
        <section className="mt-16 px-6 bg-pink border-0">
            {/* Make this section tall so scrolling can happen */}
            <div className="relative mx-auto max-w-4xl h-[90vh] ">

                <div className="sticky top-0 z-30 ">
                    <div className="flex justify-center pt-6 pointer-events-none">
                        <img
                            className=""
                            src="/images/fm-forest-top.svg"
                            alt="FM forest top"
                        />
                    </div>

                    <img className="w-20 sm:w-32 sm:ml-40 relative top-[-8rem] sm:top-[-15rem]" src="/images/heart-box.svg" alt="Heart box" />

                    <div className="flex items-center justify-center gap-4 bg-pink/0 mt-[-7rem] sm:mt-[-14rem] text-align">
                        <div className="font-prata leading-snug text-[.9rem] sm:text-[1.2rem] w-56 sm:w-96">
                            <p>
                                {/* {t("gift_msg")} */}
                            </p>

                            <p className="mt-2">
                                {/* {t("gift_text")} */}
                                {t("accept_gifts")}
                            </p>

                            <div className="mt-3 space-y-1 text-[0.7rem] sm:text-[0.9rem] tracking-widest">
                                <CopyRow label="IBAN RON & EURO" value="RO19REVO0000280750661251" />
                                {/* <CopyRow label="BCR" value="RO002RNCB29387298" />
                                <CopyRow label="BT" value="RO002RNCB29387298" /> */}
                                <div className="h-1"></div>
                                <CopyRow label={t("beneficiaries")} value="Theodora-Paula Gitana Sandu & Teodosie Cozmin Țibu" />

                                {/* <div>Beneficiar: Țibu Cozmin</div> */}
                            </div>
                        </div>
                    </div>


                    <div className=" z-10 mt-[-5.5rem] sm:mt-[-13rem] flex justify-center pointer-events-none">
                        <img

                            src="/images/fm-forest-bottom.svg"
                            alt="FM forest bottom"
                        />
                    </div>

                </div>



            </div>

            {/* <div className="flex justify-center pointer-events-none">
                <Parallax speed={-6}>
                    <img
                        className="w-80 lg:w-96"
                        src="/images/fm-house.svg"
                        alt="FM forest top"
                    />
                </Parallax>
            </div> */}

            {/* <div className="flex justify-center pointer-events-none">
                <Parallax speed={16}>

                    <img
                        className="w-80 lg:w-96"
                        src="/images/fm-houses.svg"
                        alt="FM forest top"
                    />
                </Parallax>
            </div> */}


            {/* 
            <div className="relative overflow-hidden">
                <div className="relative z-10 flex justify-center pointer-events-none">
                    <Parallax speed={-26}>
                        <img className="w-80 lg:w-96" src="/images/fm-deer.svg" alt="" />
                    </Parallax>
                </div>

                <div className="relative z-40 flex justify-center pointer-events-none">
                    <img className="w-96 lg:w-96" src="/images/fm-mount.svg" alt="" />
                </div>
            </div> */}


            {/* <div className="left-0 right-0 mx-auto gifts-end bg-pink h-[20vh] z-30 w-80 overflow-hidden bottom-0 mb-0 top-[-3em]  mt-0 relative">

            </div> */}
        </section>
    );
}

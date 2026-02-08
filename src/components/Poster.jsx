import { Parallax } from "react-scroll-parallax";
import { motion } from "framer-motion";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";

export default function Poster() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="mt-14 sm:mt-10 text-4xl sm:text-5xl font-semibold font-prata-light scale-y-[1.1] uppercase leading-none mb-[-1.8rem] sm:mb-[0rem]">
        {t("us")},
      </h1>
      <div className="grid grid-cols-3 items-center pt-5 mt-12 text-beige w-full px-0 sm:px-12">

        {/* LEFT */}
        <p className="uppercase font-monoton pl-4 text-left sm:text-xl">
          theodora sandu
        </p>

        {/* CENTER */}
        <p className="uppercase font-monoton text-center text-sm">
          &amp;
        </p>

        {/* RIGHT */}
        <p className="uppercase font-monoton pr-4 text-right sm:text-xl">
          cozmin țibu
          <span className="block sm:hidden"></span>
        </p>
      </div>

      {/* <div className="flex flex-col mt-4 items-center text-sm-center font-prata">prezintă</div> */}
      <div className="flex flex-col items-center">
        {/* <h1 className="text-4xl sm:text-5xl font-semibold font-monoton uppercase leading-none mb-[-1.8rem] sm:mb-[0rem]">
          NUNTA NOASTRĂ
        </h1> */}

        <Parallax speed={-12}>
          <motion.div
            initial={{ opacity: 0.5, y: 40, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className=""
          >
            <img
              className="
                w-96
                sm:w-64
                md:w-96
                lg:w-96
                xl:w-96
                mx-auto
              "
              src="/images/theo-didi.png"
              alt="Theo & Didi"
            />
          </motion.div>
        </Parallax>

        {/* <p className="mt-16 sm:mt-0 md:mt-28 min-h-[20vh] max-w-xl font-prata z-40">
          {t("invitation text")}  ❤️
           &#x3c;3 
        </p> */}



        <p className="mt-32 sm:mt-40 md:mt-64 min-h-[10vh] sm:min-h-[1vh] max-w-xl font-prata z-40">
          {t("invitation text")}  ❤️
          {/* &#x3c;3 */}
        </p>

      </div>



    </div>
  );
}

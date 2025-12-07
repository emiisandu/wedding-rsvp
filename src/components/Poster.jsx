import { Parallax } from "react-scroll-parallax";
import { motion } from "framer-motion";
import React, { useRef } from "react";

export default function Poster() {
  
    return (
<div>
<div title="AFIS" className="grid grid-cols-3 items-center pt-5 mt-4 text-beige w-full px-0 sm:px-12">
        {/* LEFT */}
        <p className="uppercase font-fascinate pl-4 text-left">
          theodora sandu
        </p>

        {/* CENTER */}
        <p className="uppercase font-fascinate text-center text-sm">
          &amp;
        </p>

        {/* RIGHT */}
        <p className="uppercase font-fascinate pr-4 text-right">
          cozmin 
          <span className="block sm:hidden"></span> 
          <span className="font-bold"> ț</span>ibu
        </p>
      </div>

      <div className="flex flex-col mt-4 items-center text-sm-center font-fascinate">prezintă</div>
      <div className="flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl font-semibold font-fascinate uppercase leading-none mb-[-1.8rem] sm:mb-[0rem]">
          NUNTA 
        </h1>

        <Parallax speed={-20}>
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
                md:w-72
                lg:w-80
                xl:w-88
                mx-auto
              "
              src="/images/theo-didi.svg"
              alt="Theo & Didi"
            />
          </motion.div>
        </Parallax>
      </div>


      <p className="mt-12 sm:mt-0 sm:mt-4 min-h-[30vh] max-w-xl font-fascinate z-40">
        va invitam sa ne fiti alaturi la un spectacol de neuitat intr-o distributie de exceptie 
      </p>
    </div>
    );
 }

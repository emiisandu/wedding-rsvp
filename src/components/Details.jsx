// Details.jsx
import { Parallax } from "react-scroll-parallax";
import { motion } from "framer-motion";
import NotebookSection from "./NotebookSection";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";

export default function Details() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="relative max-w-4xl mx-auto
                      min-h-[150vh]
                      sm:min-h-[200vh]
                      [@media(min-height:900px)]:min-h-[140vh]
                      [@media(min-height:1200px)]:min-h-[120vh]">
        <div className="sticky top-0  overflow-hidden z-40 bg-pink pt-3 w-[102%] ">
          {/* <div className="flex flex-row items-center justify-center gap-4"> */}
            {/* <h2 className="text-2xl font-semibold mb-8 text-center font-monoton z-40 text-beige">
              Sinopsis
            </h2> */}



          <div className="flex flex-row items-center justify-center date-div text-align text-right ">
            <p className="font-bold uppercase font-monoton
                          [font-size:clamp(1.8rem,7vw,3rem)]
                          [letter-spacing:clamp(0.12em,1.8vw,0.4em)]
                          leading-none
                          text-center
                          whitespace-nowrap
                          max-w-full">

              25.07.26
            </p>
            <img
              className="mt-1 w-24 sm:w-28 md:w-32"
              src="/images/hydrangea.png"
              alt="hydrangea"
            />
          </div>
          <div className="flex flex-row items-center justify-center ">
            <p className="text-1xl sm:text-2xl font-bold tracking-[0.1em] uppercase font-prata mt-2 flex justify-center pb-2 ">
              <img
                src="/images/pin.png"
                alt=""
                className=" w-4 sm:w-8 mr-2 object-cover"
              />
              FUNDU MOLDOVEI, SUCEAVA
            </p>
          </div>
                    {/* </div> */}

        </div>

        <Parallax speed={-7}>
          <div className="flex items-center justify-center z-30 mt-12 sm:mt-10">
            <img
              className="w-80 sm:w-76 md:w-96 lg:w-96 cartoon-couple"
              src="/images/theo-didi-cartoon.svg"
              alt="Theo & Didi"
            />
          </div>
        </Parallax>

        <div className="location-div relative max-w-3xl bg-cover bg-center bg-no-repeat z-30 mt-10 mx-auto">
          <NotebookSection
            title="ORA 14"
            children={`Iertăciune,
la_moara`}
            locationLink="https://maps.app.goo.gl/PN59jzskmuTTfvYR7"
            customClass="transform-1"
            bgImage="/images/ripped-1.png"
          />

          <Parallax speed={-5}>
            <NotebookSection
              title="ORA 16"
              children={`Cununia religioasă,
sf_dumitru`}
              customClass="transform-2"
              locationLink="https://maps.app.goo.gl/GnNc6iYsGZYJq1BZ9"
              bgImage="/images/ripped-2.png"
            />
          </Parallax>

          <div className="z-20">
            <NotebookSection
              title="ORA 18"
              children={`Petrecerea,
la_baciu`}
              customClass="transform-3"
              locationLink="https://maps.app.goo.gl/SYgho5d2TUPX75JNA"
              bgImage="/images/ripped-3.png"
            />
          </div>

          <Parallax
            speed={25}
            className="absolute left-0 right-0 bottom-20 z-50 flex justify-center pointer-events-none"
          >
            <img
              className="w-80 sm:w-76 md:w-84 lg:w-80"
              src="/images/champagne.svg"
              alt="Theo & Didi"
            />
          </Parallax>

        </div>
      </div>
    </div>
  );
}

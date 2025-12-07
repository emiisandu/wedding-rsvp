import { Parallax } from "react-scroll-parallax";
import { motion } from "framer-motion";
import NotebookSection from "./NotebookSection";
import React, { useRef } from "react";


export default function Details(){

return (
<div>
      {/* Scrollable area */}
      <div title="SINOPSIS" className="relative max-w-4xl mx-auto min-h-[150vh] sm:min-h-[250vh]">
        {/* Sticky "stage" */}
          {/* Title */}
        <div className="sticky top-0 pt-2 overflow-hidden z-40 bg-pink">
          <div className="flex flex-row items-center justify-center gap-4">
              <h2 className="text-2xl font-semibold mb-8 text-center font-fascinate z-40 text-beige">
                Sinopsis
              </h2>
              <img
                className="w-24 sm:w-28 md:w-32"
                src="/images/hydrangea.svg"
                alt="Theo & Didi"
              />
            </div>

          {/* DATE*/}
          {/* <Parallax speed={4}> */}
            <div className="  flex items-center justify-center pointer-events-none date-div text-align text-right top-0">
              <p className="text-5xl font-bold tracking-[0.4em] uppercase font-fascinate ">
                25.07.26
              </p>
            </div>
          {/* </Parallax> */}

            <p className="text-2xl font-bold tracking-[0.1em] uppercase font-fascinate mt-2 flex justify-center ">
              FUNDU MOLDOVEI, SUCEAVA
            </p>

        </div>

              {/* COUPLE*/}
              <Parallax speed={-10}>
                <div className="  flex items-center justify-center z-30 mt-3 sm:mt-10">
                  <img
                    className="w-80 sm:w-76 md:w-84 lg:w-80 cartoon-couple"
                    src="/images/theo-didi-cartoon.svg"
                    alt="Theo & Didi"
                  />
                </div>
              </Parallax>


            <div
              className=" pointer-events-none location-div bg-cover bg-center bg-no-repeat z-40 mt-10"
              style={{ backgroundImage: "url('/images/la-baciu.svg')", opacity:1 }}>
       
                {/* <p className="text-2xl font-bold tracking-[0.1em] z-40"> */}
                      <NotebookSection title="ORA 14" children="Iertăciune, Pensiunea La Moara" customClass="transform-1">
                          </NotebookSection>
                {/* </p> */}
                <Parallax speed={-5}>
                  {/* <p className="text-2xl font-bold tracking-[0.1em] z-40"> */}
                    <NotebookSection title="ORA 16" children="Cununia religioasă, Biserica Sf. Dumitru" customClass="transform-2" hasTape="notebook-tape">
                            </NotebookSection>
                  {/* </p> */}

                </Parallax>
                {/* <p className="text-2xl font-bold tracking-[0.1em] z-40"> */}
                    <NotebookSection title="ORA 18" children='Petrecerea, Sala de Evenimente “La Baciu" ' customClass="transform-3" >
                            </NotebookSection>
                {/* </p> */}
                <Parallax speed={25}>
                    <img
                            className="w-80 sm:w-76 md:w-84 lg:w-80 cartoon-couple z-10 absolute bottom-20"
                            src="/images/champagne.svg"
                            alt="Theo & Didi"
                          />
                  </Parallax>
            </div>



      </div>
  </div>
);

}
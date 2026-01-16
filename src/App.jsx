import { Parallax } from "react-scroll-parallax";
import { motion } from "framer-motion";
import Poster from "./components/Poster";
import Details from "./components/Details";
import RSVPForm from "./components/RSVPForm";
import NotebookSection from "./components/NotebookSection";
import React, { useRef, useState, useEffect } from "react";
import LangSwitch from "./components/LangSwitch";
import { useTranslation } from "react-i18next";


function App() {

  const { t } = useTranslation();

  const posterRef = useRef(null);
  const detailsRef = useRef(null);
  const formRef = useRef(null);
  const menuRef = useRef(null);


    // Scroll function
  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [menuOpen, setMenuOpen] = useState(false);


  const [showMenuButton, setShowMenuButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // show button only after leaving the very top
      setShowMenuButton(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    
    // initialize once
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
  const handleClickOutside = (event) => {
    if (menuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [menuOpen]);



  return (
    <div className="min-h-screen bg-pink px-0 sm:px-20">
       <LangSwitch/>
      {/* HAMBURGER MENU */}
      {showMenuButton && (

      <nav className="hamburger-wrapper right-4 sm:right-8" ref={menuRef}>
        {/* round button */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className={`hamburger-toggle ${menuOpen ? "is-open" : ""}`}
          aria-label="Toggle navigation"
        >
          <img   className="w-32 sm:w-36 md:w-40 max-w-none"
                    src="/images/cake.svg"
                    alt="Theo & Didi"
              />
          {/* <span className="hamburger-line line-1" />
          <span className="hamburger-line line-2" />
          <span className="hamburger-line line-3" /> */}
        </button>

        {menuOpen && (
          <div className="hamburger-panel font-prata">
            <div className="panel-header">
              <span className="panel-label">{t("menu")}</span>
            </div>

            <div className="panel-buttons">
              <button
                onClick={() => {
                  scrollToSection(posterRef);
                  setMenuOpen(false);
                }}
              >
                {t("home")}
              </button>
              <button
                onClick={() => {
                  scrollToSection(detailsRef);
                  setMenuOpen(false);
                }}
              >
                {t("schedule")}
              </button>
              <button
                onClick={() => {
                  scrollToSection(formRef);
                  setMenuOpen(false);
                }}
              >
                {t("confirmation")}
              </button>
            </div>

          </div>
        )}
      </nav>
      )}

      {/* POSTER SECTION */}
      <section ref={posterRef} className="min-h-[55vh] flex flex-col items-center justify-center px-6 text-center">
        <Poster />
      </section>

      {/* PARALLAX SECTION */}
      <section ref={detailsRef} className="min-h-[150vh] px-6 pt-0 sm:pt-40">
        <Details/>
      </section>
      

            {/* PARALLAX SECTION */}
    <section ref={formRef} className=" px-6 pt-10">


      {/* Scrollable area */}
      <div title="CONFIRMARE" className="relative max-w-4xl mx-auto ">
 

        <div className="sticky top-0 pt-2 overflow-hidden z-40 bg-pink mb-10">
          <div className="flex flex-row items-center justify-center gap-4">
              <img
                    className="w-24 sm:w-28 md:w-32"
                    src="/images/carnation.svg"
                    alt="Theo & Didi"
              />
              <h2 className="text-2xl sml:3xl mb-8 text-center font-monoton z-40  uppercase [word-spacing:0.4em]">
                {t("confirm attendance")}
              </h2>

          </div>

        </div>
          <RSVPForm/>

      </div>
        

    </section>
      
    </div>
  );
}

export default App;

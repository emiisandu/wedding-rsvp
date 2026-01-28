import { Parallax } from "react-scroll-parallax";
import { motion } from "framer-motion";
import Poster from "./components/Poster";
import Details from "./components/Details";
import RSVPForm from "./components/RSVPForm";
import NotebookSection from "./components/NotebookSection";
import React, { useRef, useState, useEffect } from "react";
import LangSwitch from "./components/LangSwitch";
import { useTranslation } from "react-i18next";
import Footer from "./components/Footer";
import QuickDetails from "./components/QuickDetails";
import Loader from "./components/Loader";
import { useParallaxController } from "react-scroll-parallax";
import ScrollToSectionButton from "./components/ScrollToSectionButton";
import Gift from "./components/Gift";
import { preloadImages, preloadFonts } from "./preloadAssets";

function App() {

  const { t } = useTranslation();

  const posterRef = useRef(null);
  const detailsRef = useRef(null);
  const formRef = useRef(null);
  const menuRef = useRef(null);
  const quickDetailsRef = useRef(null);
  const footerRef = useRef(null);
  const giftRef = useRef(null);

  const parallaxController = useParallaxController();

  // Scroll function
  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });

    let frames = 0;
    const raf = () => {
      parallaxController?.update();
      frames += 1;
      if (frames < 40) requestAnimationFrame(raf); // ~40 frames ≈ 0.6s
    };
    requestAnimationFrame(raf);
  };



  const [menuOpen, setMenuOpen] = useState(false);


  const [showMenuButton, setShowMenuButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // show button only after leaving the very top
      setShowMenuButton(window.scrollY > 110);
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




  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      await Promise.all([
        preloadImages(),
        preloadFonts(),
        new Promise((r) => setTimeout(r, 600)), // aesthetic minimum
      ]);

      if (!cancelled) setReady(true);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return <Loader />;
  }



  return (
    <div className="min-h-screen bg-pink px-0 sm:px-20 ">
      <LangSwitch />
      {/* HAMBURGER MENU */}
      {showMenuButton && (

        <nav className="hamburger-wrapper right-4 sm:right-8 bg-pink " ref={menuRef}>
          {/* round button */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className={`hamburger-toggle 
              bg-transparent border-0 appearance-none outline-none shadow-none p-0 
              ${menuOpen ? "is-open" : ""}`}
            aria-label="Toggle navigation"
          >
            <div className="flex flex-col items-center">
              <img
                className="block w-32 sm:w-36 md:w-40 max-w-none"
                src="/images/cake.svg"
                alt="Theo & Didi"
              />

              <span
                className="
                    mt-[-2px]
                    ml-1
                    w-full
                    text-center
                    font-prata
                    text-[0.55rem]
                    tracking-[0.35em]
                    uppercase
                    text-black/80
                    leading-none
                    
                  "
              >
                {t("menu")}
              </span>
            </div>

          </button>

          {menuOpen && (
            <div className="hamburger-panel font-prata bg-pink">
              {/* <div className="panel-header">
                <span className="panel-label">{t("menu")}</span>
              </div> */}

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

                <button
                  onClick={() => {
                    scrollToSection(giftRef);
                    setMenuOpen(false);
                  }}
                >
                  <img
                    className="left-0 right-0 mx-auto block w-8 sm:w-12 md:w-12 max-w-12"
                    src="/images/heart-box.svg"
                    alt="Theo & Didi"
                  />

                  {/* {t("location")} */}
                </button>

                <button
                  onClick={() => {
                    scrollToSection(quickDetailsRef);
                    setMenuOpen(false);
                  }}
                >
                  {t("quick_details")}
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
      <section ref={detailsRef} className="min-h-[150vh] px-6 pt-0 ">
        <Details />
      </section>

      <ScrollToSectionButton
        targetRef={formRef}
        stopRef={footerRef}
        label="RSVP"
      />

      {/* PARALLAX SECTION */}
      <section ref={formRef} className=" px-6 pt-10 ">


        {/* Scrollable area */}
        <div className="relative max-w-4xl mx-auto z-40  ">


          <div className="sticky top-0 pt-4 overflow-hidden z-40 bg-pink mb-10">
            <div className="flex flex-row items-center justify-center gap-4">
              <img
                className="w-24 sm:w-28 md:w-32"
                src="/images/carnation.svg"
                alt="Theo & Didi"
              />
              <h2 className="text-2xl sm:3xl mb-8 font-monoton z-40  uppercase [word-spacing:0.4em]">
                {t("confirm attendance")}
              </h2>

            </div>

          </div>
          <RSVPForm />

        </div>
      </section>



      <section ref={giftRef} >
        <Gift />
      </section>



      <section ref={quickDetailsRef}>
        <QuickDetails
        />
      </section>

      <section ref={footerRef}>
        <Footer />
      </section>

    </div>
  );
}

export default App;

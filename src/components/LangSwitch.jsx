import { useTranslation } from "react-i18next";

export default function LangSwitch() {
  const { i18n } = useTranslation();
  const active = i18n.language;

  const setLang = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lng", lng);
  };

  const linkClass = (lng) =>
    `bg-transparent p-0 m-0 border-0 cursor-pointer font-prata tracking-widest text-xs
     ${active === lng ? "opacity-100 underline" : "opacity-60 hover:opacity-100"}`;

  return (
    <div className="fixed top-4 left-4 z-50 flex items-center gap-2 select-none text-beige font-prata">
      <button className={linkClass("ro")} onClick={() => setLang("ro")}>RO</button>
      <span className="opacity-60">|</span>
      <button className={linkClass("en")} onClick={() => setLang("en")}>EN</button>
    </div>
  );
}

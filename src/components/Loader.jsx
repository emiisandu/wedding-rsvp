import { useTranslation } from "react-i18next";

export default function Loader() {
const { t } = useTranslation();
    
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-pink">
      <div className="flex flex-col items-center gap-4">
        {/* Decorative element (reuse your style) */}
        <img
          src="/images/wedding-ring.svg"
          alt=""
          className="w-16 animate-pulse"
        />

        <p
          className="
            font-prata
            text-[0.6rem]
            tracking-[0.35em]
            uppercase
            text-black/70
          "
        >
          {t("loading")}...
        </p>
      </div>
    </div>
  );
}

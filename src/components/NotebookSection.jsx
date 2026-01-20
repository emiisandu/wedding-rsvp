import { useTranslation } from "react-i18next";

// NotebookSection.jsx
export default function NotebookSection({
  title,
  children,
  customClass = "",
  bgImage = "",
  locationLink = "",
}) {
  const rows = typeof children === "string" ? children.split("\n") : children;
  const { t } = useTranslation();

  return (
    <section className="notebook-wrapper">
      <div className={`notebook-shadow ${customClass}`}>
        <div
          className="notebook-page notebook-page--image"
          style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
        >
          {title && <h2 className="notebook-title font-prata text-black mb-4 text-xl sm:text-2xl z-0 pl-2 sm:pl-14 md:pl-10">{t(title)}</h2>}

          <div className="notebook-content font-meow text-black text-2xl sm:text-3xl pl-2 sm:pl-14 md:pl-12">
            {Array.isArray(rows)
              ? rows.map((line, i) => {
                  const isLocationLine = Boolean(locationLink) && i === 1;

                  if (!isLocationLine) {
                    return (
                      <p className="block" key={i}>
                        {t(line)}
                      </p>
                    );
                  }

                  return (
                    <p className="block" key={i}>
                      <a
                        href={locationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 underline text-blue-600 hover:text-blue-700" 
                    //     underline-offset-2
                    //     border border-black/40
                    // rounded-sm cursor-pointer
                    
                    // text-black
                    // shadow-[2px_2px_0px_rgba(0,0,0,0.35)]
                    // active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                      >
                        <span>
                        <img
                          src="/images/maps-2.png"
                          alt=""
                          className="inline-block w-7 h-7 sm:w-8 sm:h-8 align-middle "
                          aria-hidden="true"
                        />
                        {t(line)}
                        </span>
                      </a>
                    </p>
                  );
                })
              : rows}
          </div>
        </div>
      </div>
    </section>
  );
}

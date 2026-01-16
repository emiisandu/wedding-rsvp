// NotebookSection.jsx
export default function NotebookSection({
  title,
  children,
  customClass = "",
  bgImage = "",
  locationLink = "",
}) {
  const rows = typeof children === "string" ? children.split("\n") : children;

  return (
    <section className="notebook-wrapper">
      <div className={`notebook-shadow ${customClass}`}>
        <div
          className="notebook-page notebook-page--image"
          style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
        >
          {title && <h2 className="notebook-title font-prata text-black mb-4 text-xl sm:text-2xl z-0 pl-2 sm:pl-14 md:pl-10">{title}</h2>}

          <div className="notebook-content font-meow text-black text-2xl sm:text-3xl pl-2 sm:pl-14 md:pl-10">
            {Array.isArray(rows)
              ? rows.map((line, i) => {
                  const isLocationLine = Boolean(locationLink) && i === 1;

                  if (!isLocationLine) {
                    return (
                      <p className="block" key={i}>
                        {line}
                      </p>
                    );
                  }

                  return (
                    <p className="block" key={i}>
                      <a
                        href={locationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 underline underline-offset-2"
                      >
                        <span>
                        <img
                          src="/images/pin.png"
                          alt=""
                          className="inline-block w-5 h-5 align-middle"
                          aria-hidden="true"
                        />
                        {line}
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

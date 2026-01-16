export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 pb-10">
      <div
        className="
          max-w-4xl mx-auto
          flex flex-col sm:flex-row
          items-center sm:items-end
          justify-between
          gap-2
          px-4
        "
      >
        {/* Left text */}
        <p
          className="
            text-[0.65rem]
            tracking-[0.35em]
            uppercase
            font-prata
            text-black/70
            text-center sm:text-left
          "
        >
          Crafted with love • © {year} zwaistein 
        </p>

        {/* Right text (email) */}
        <p
          className="
            text-[0.55rem]
            tracking-[0.25em]
            font-prata
            text-black/50
            text-center sm:text-right
          "
        >
          zwaisteinsrl@gmail.com
        </p>
      </div>
    </footer>
  );
}

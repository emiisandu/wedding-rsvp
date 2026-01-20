import { useState } from "react";

export default function CopyRow({ label, value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center justify-between gap-3 ">
      <span className="whitespace-nowrap">
        {label}: {value}
      </span>

      <button
        onClick={handleCopy}
        className="
          text-[0.8rem]
          uppercase
          px-2 py-[2px]
          rounded-sm
          hover:bg-black/5
          active:translate-y-[1px]
        "
        aria-label={`Copy ${label}`}
      >
        {copied ? "✓" : "⧉"}
      </button>
    </div>
  );
}

import { useEffect, useState } from "react";

export default function ScrollToSectionButton({
  targetRef,
  stopRef,              // footer ref (optional)
  label,
  showAfter = 100,       // px before showing
  targetThreshold = 0.3, // how much of target must be visible to hide
  stopThreshold = 0.05,  // footer barely visible to hide
}) {
  const [scrolled, setScrolled] = useState(false);
  const [targetInView, setTargetInView] = useState(false);
  const [stopInView, setStopInView] = useState(false);
  const [direction, setDirection] = useState("down"); // "up" | "down"

  // Show after scrolling + compute arrow direction
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > showAfter);

      if (!targetRef?.current) return;

      const scrollY = window.scrollY;
      const targetTop = targetRef.current.getBoundingClientRect().top + scrollY;

      setDirection(scrollY < targetTop ? "down" : "up");
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [targetRef, showAfter]);

  // Hide when target section is in view
  useEffect(() => {
    if (!targetRef?.current) return;

    const obs = new IntersectionObserver(
      ([entry]) => setTargetInView(entry.isIntersecting),
      { threshold: targetThreshold }
    );

    obs.observe(targetRef.current);
    return () => obs.disconnect();
  }, [targetRef, targetThreshold]);

  // Hide when footer is in view (optional)
  useEffect(() => {
    if (!stopRef?.current) return;

    const obs = new IntersectionObserver(
      ([entry]) => setStopInView(entry.isIntersecting),
      { threshold: stopThreshold }
    );

    obs.observe(stopRef.current);
    return () => obs.disconnect();
  }, [stopRef, stopThreshold]);

  // FINAL visibility rule
  if (!scrolled || targetInView || stopInView) return null;

  return (
    <button
      onClick={() => targetRef.current?.scrollIntoView({ behavior: "smooth" })}
      className="
        fixed 
        bottom-6 
        right-0 left-0 ml-0 mr-0 mx-auto 
        z-50
        flex items-center justify-center gap-2
        font-prata text-[0.65rem] tracking-[0.35em] uppercase
        px-4 py-3 bg-[#f5ead5]
        border border-black/40 rounded-sm
        shadow-[2px_2px_0px_rgba(0,0,0,0.35)]
        active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
      "
      aria-label="Scroll"
    >
      <span>{label}</span>
      <span className="text-xs leading-none">
        {direction === "down" ? "↓" : "↑"}
      </span>
    </button>
  );
}

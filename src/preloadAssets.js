export function preloadImages() {
  // 1. <img> tags
  const imgPromises = Array.from(document.images).map((img) => {
    if (img.complete && img.naturalWidth !== 0) return Promise.resolve();

    return new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve; // don't block forever
    });
  });

  // 2. CSS background images
  const bgPromises = Array.from(document.querySelectorAll("*"))
    .map((el) => {
      const bg = getComputedStyle(el).backgroundImage;
      if (!bg || bg === "none") return null;

      const match = bg.match(/url\(["']?(.*?)["']?\)/);
      if (!match) return null;

      const img = new Image();
      img.src = match[1];

      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    })
    .filter(Boolean);

  return Promise.all([...imgPromises, ...bgPromises]);
}


export function preloadFonts() {
  if (!document.fonts) return Promise.resolve();
  return document.fonts.ready;
}

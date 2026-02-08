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


export async function waitForAllImagesInDocument() {
  const imgs = Array.from(document.images || []);

  // include images that might be added quickly after mount
  await new Promise((r) => requestAnimationFrame(r));

  const tasks = imgs.map(async (img) => {
    try {
      // If not loaded yet, wait
      if (!img.complete) {
        await new Promise((resolve, reject) => {
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true }); // don't block forever
        });
      }

      // Decode if supported (prevents "loaded but not rendered" pop-in)
      if (img.decode) {
        await img.decode().catch(() => {});
      }
    } catch {
      // ignore per-image failures so loader doesn't hang
    }
  });

  await Promise.all(tasks);
}



export function preloadFonts() {
  if (!document.fonts) return Promise.resolve();
  return document.fonts.ready;
}

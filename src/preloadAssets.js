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


function extractUrlsFromCssBg(bg) {
  // supports: url(a), url("a"), url('a'), multiple backgrounds
  const urls = [];
  const re = /url\(["']?(.*?)["']?\)/g;
  let m;
  while ((m = re.exec(bg))) {
    if (m[1]) urls.push(m[1]);
  }
  return urls;
}

async function loadAndDecodeUrl(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = async () => {
      // decode helps with PNG/JPG; harmless for SVG
      if (img.decode) await img.decode().catch(() => {});
      resolve(true);
    };
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

export async function preloadAllImagesAndBackgrounds({ timeoutMs = 8000 } = {}) {
  // Let React commit DOM first (important!)
  await new Promise((r) => requestAnimationFrame(r));
  await new Promise((r) => requestAnimationFrame(r));

  const imgEls = Array.from(document.images || []);

  // 1) <img> sources (includes SVG via <img src="*.svg">)
  const imgSrcs = imgEls
    .map((img) => img.currentSrc || img.src)
    .filter(Boolean);

  // Wait for existing <img> tags to finish + decode
  const imgTasks = imgEls.map(async (img) => {
    try {
      if (!img.complete) {
        await new Promise((resolve) => {
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true });
        });
      }
      if (img.decode) await img.decode().catch(() => {});
    } catch {}
  });

  // 2) CSS background images (includes SVG backgrounds)
  const allEls = Array.from(document.querySelectorAll("*"));
  const bgUrls = new Set();

  for (const el of allEls) {
    const bg = getComputedStyle(el).backgroundImage;
    if (!bg || bg === "none") continue;
    extractUrlsFromCssBg(bg).forEach((u) => bgUrls.add(u));
  }

  const bgTasks = Array.from(bgUrls).map(loadAndDecodeUrl);

  // Combine and add timeout so loader never hangs forever
  const all = Promise.all([...imgTasks, ...bgTasks]);

  const timeout = new Promise((resolve) =>
    setTimeout(() => resolve("timeout"), timeoutMs)
  );

  await Promise.race([all, timeout]);
}

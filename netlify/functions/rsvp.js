export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const scriptUrl = process.env.GAS_RSVP_URL; // set in Netlify env vars
    if (!scriptUrl) {
      return { statusCode: 500, body: "Missing GAS_RSVP_URL env var" };
    }

    const resp = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: event.body || "{}",
    });

    const text = await resp.text(); // Apps Script returns JSON text
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: String(err) }),
    };
  }
}

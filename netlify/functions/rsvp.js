async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET;
  if (!secret) throw new Error("Missing TURNSTILE_SECRET env var");

  const formData = new URLSearchParams();
  formData.append("secret", secret);
  formData.append("response", token);
  if (ip) formData.append("remoteip", ip);

  const resp = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: formData,
    },
  );

  return resp.json();
}

export async function handler(event) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: "Method Not Allowed",
    };
  }

  try {
    const payload = JSON.parse(event.body || "{}");

    const token = payload.turnstileToken;
    if (!token) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ ok: false, message: "Missing Turnstile token" }),
      };
    }

    // Verify with Cloudflare
    const ip = event.headers["x-forwarded-for"]?.split(",")[0]?.trim();
    const verification = await verifyTurnstile(token, ip);

    if (!verification.success) {
      return {
        statusCode: 403,
        headers: corsHeaders,
        body: JSON.stringify({
          ok: false,
          message: "Turnstile verification failed",
          verification,
          errorCodes: verification["error-codes"] || [],
        }),
      };
    }

    // Remove token before forwarding
    delete payload.turnstileToken;

    const scriptUrl = process.env.GAS_RSVP_URL;
    if (!scriptUrl) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({
          ok: false,
          message: "Missing GAS_RSVP_URL env var",
        }),
      };
    }

    // Forward to Apps Script
    const resp = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await resp.text();

    return {
      statusCode: resp.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ ok: false, message: String(err) }),
    };
  }
}

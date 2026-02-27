export default async function handler(req: any, res: any) {

  const WEBAPP_URL = process.env.SHEETS_WEBAPP_URL || "";
  const TOKEN = process.env.SHEETS_WEBAPP_TOKEN || "";

  if (!WEBAPP_URL) return res.status(500).json({ ok: false, error: "missing_env_webapp_url" });
  if (!TOKEN) return res.status(500).json({ ok: false, error: "missing_env_token" });

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  try {
    const { email, source } = req.body || {};
    const cleanEmail = String(email || "").trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ ok: false, error: "invalid_email" });
    }

    const payload = new URLSearchParams({
      token: process.env.SHEETS_WEBAPP_TOKEN || "",
      email: cleanEmail,
      source: source || "hero-checklist",
      page: req.headers?.referer || "",
      ua: req.headers?.["user-agent"] || "",
    }).toString();

    const r = await fetch(process.env.SHEETS_WEBAPP_URL || "", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: payload,
    });

    const data = await r.json().catch(() => ({}));
    if (!data?.ok) {
      return res.status(500).json({ ok: false, error: data?.error || "sheet_error" });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: "server_error" });
  }
}
const { Resend } = require("resend");

module.exports = async function handler(req, res) {
  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    // Make sure env var exists
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ ok: false, error: "RESEND_API_KEY is missing in Vercel env vars" });
    }

    const resend = new Resend(apiKey);

    const { name, company, email, subject, message } = req.body || {};
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ ok: false, error: "Missing required fields" });
    }

    const data = await resend.emails.send({
      from: "Studio17 <no-reply@studio17.world>",  // must be verified in Resend
      to: ["info@studio17.world"],
      replyTo: email,
      subject: `[Contact] ${subject}`,
      text: `Name: ${name}\nCompany: ${company || "-"}\nEmail: ${email}\n\n${message}`,
    });

    return res.status(200).json({ ok: true, id: data.id });
  } catch (err) {
    console.error("Resend error:", err);
    return res.status(500).json({ ok: false, error: err?.message || "Server error" });
  }
};

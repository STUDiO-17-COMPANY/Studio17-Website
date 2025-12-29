import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { name, company, email, subject, message } = req.body || {};
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ ok: false, error: "Missing required fields" });
    }

    const { data, error } = await resend.emails.send({
      from: "Studio17 <no-reply@studio17.world>", // must be VERIFIED in Resend Domains
      to: ["contact@studio17.world"],                // for testing, use your personal inbox too
      reply_to: email,                            // <-- use reply_to (snake_case)
      subject: `[Contact] ${subject}`,
      text: `Name: ${name}\nCompany: ${company || "-"}\nEmail: ${email}\n\n${message}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({ ok: false, error: error.message || "Resend failed" });
    }

    return res.status(200).json({ ok: true, id: data?.id });
  } catch (err) {
    console.error("Handler error:", err);
    return res.status(500).json({ ok: false, error: err?.message || "Failed to send" });
  }
}

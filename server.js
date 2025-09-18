const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/send-inquiry", async (req, res) => {
  const { name, phone, city,message,email} = req.body;

  if (!phone) {
    return res.status(400).json({ error: "Phone and City are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
  from: `"Solar Website" <${process.env.EMAIL_USER}>`,
  to: process.env.EMAIL_TO,
  subject: `Solar Inquiry from Website: - ${name || "New Lead"}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
      <div style="text-align: center; border-bottom: 2px solid #ff9900; padding-bottom: 10px; margin-bottom: 20px;">
        <h2 style="color: #ff9900; margin: 0; font-size: 24px;">✨ New Solar Consultation Request ✨</h2>
      </div>
      
      <p style="font-size: 16px; color: #333;">Hello,</p>
      <p style="font-size: 16px; color: #333;">A new potential customer has requested a consultation through your website. Here are the details:</p>

      <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #e0e0e0;">
        <h3 style="color: #000; font-size: 20px; margin: 0 0 10px 0;">Customer Information:</h3>
        <ul style="list-style-type: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 8px;"><strong><span style="color: #555;">👤 Name:</span></strong> ${name || "N/A"}</li>
          <li style="margin-bottom: 8px;"><strong><span style="color: #555;">📞 Phone:</span></strong> <a href="tel:${phone}" style="color: #ff9900; text-decoration: none;">${phone}</a></li>
          <li style="margin-bottom: 8px;"><strong><span style="color: #555;">📍 City:</span></strong> ${city} </li>
          <li style="margin-bottom: 8px;"><strong><span style="color: #555;">👤 Email:</span></strong> ${email} </li>
          <li style="margin-bottom: 8px;"><strong><span style="color: #555;">📍 City:</span></strong> ${message}</li>
        </ul>
      </div>

      <p style="font-size: 14px; color: #888; text-align: center; margin-top: 20px;">Please contact the customer as soon as possible to schedule their consultation.</p>
      
      <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
        <p style="font-size: 12px; color: #aaa;">This email was sent from your website's inquiry form.</p>
      </div>
    </div>
  `,
});

    res.status(200).json({ message: "Inquiry sent successfully" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ error: "Failed to send inquiry" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));

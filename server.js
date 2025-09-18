const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Server is running!");
});

app.post("/api/send-inquiry", async (req, res) => {
  const { name, phone, city, message, email } = req.body;

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
      html: `<div>... your HTML template ...</div>`,
    });

    res.status(200).json({ message: "Inquiry sent successfully" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ error: "Failed to send inquiry" });
  }
});

// ⛔ REMOVE app.listen()
// ✅ Instead, export as Vercel handler
module.exports = app;

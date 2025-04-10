import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Hardcoded email configuration for Gmail
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "endi35733@gmail.com",
    pass: "kwlg jfij hepv opjj",
  },
});

export async function POST(request: Request) {
  try {
    const { to, subject, html } = await request.json();

    // Send email using nodemailer
    const info = await transporter.sendMail({
      from: `"CIRT" <endi35733@gmail.com>`,
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.messageId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email notification" },
      { status: 500 }
    );
  }
}

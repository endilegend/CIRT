import nodemailer from "nodemailer";

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  throw new Error(
    "Email credentials not configured. Please set EMAIL_USER and EMAIL_PASSWORD environment variables."
  );
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendReviewStatusEmail(
  authorEmail: string,
  articleTitle: string,
  status: string,
  comments?: string
) {
  const subject = `Article Review Update: ${articleTitle}`;
  let body = `Your article "${articleTitle}" has been ${status.toLowerCase()}.\n\n`;

  if (comments) {
    body += `Reviewer Comments:\n${comments}\n\n`;
  }

  body += `You can view the full details in your dashboard.\n\n`;
  body += `Best regards,\nCIRT Team`;

  try {
    await transporter.sendMail({
      from: `CIRT <${process.env.EMAIL_USER}>`,
      to: authorEmail,
      subject,
      text: body,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

import nodemailer from "nodemailer";
import { Resend } from "resend";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};
const resend = new Resend(process.env.RESEND_API_KEY);

// Replace with your SMTP credentials
const smtpOptions = {
  host: process.env.SMTP_HOST || "",
  port: parseInt(process.env.SMTP_PORT || "2525"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
};

export const sendEmail = (data: EmailPayload) => {
  console.log(process.env.MODE)
  if (process.env.MODE === "production") {
    return sendEmailProd(data);
  } else {
    return sendEmailDev(data);
  }
}
export const sendEmailDev = async (data: EmailPayload) => {
  const transporter = nodemailer.createTransport({
    ...smtpOptions,
  });

  return await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL,
    ...data,
  });
};

export const sendEmailProd = async (data: EmailPayload) => {
  return await resend.emails.send({
    from: process.env.SMTP_FROM_EMAIL || "noreply@freelanzo.com",
    ...data,
  });
};

import nodemailer from 'nodemailer';

let transporter;
let testAccount;

const getTransporter = async () => {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user, pass },
    });
    return transporter;
  }

  if (!testAccount) {
    testAccount = await nodemailer.createTestAccount();
    console.warn('[email] SMTP is not configured; using Ethereal test account for development.');
  }

  transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });

  return transporter;
};

export const sendEmail = async ({ to, subject, html }) => {
  const client = await getTransporter();

  const info = await client.sendMail({
    from: process.env.MAIL_FROM || 'United Mart Sukkur <no-reply@unitedmart.local>',
    to,
    subject,
    html,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`[email] Preview URL: ${previewUrl}`);
  }

  return { delivered: true, previewUrl };
};

export default sendEmail;

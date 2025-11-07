import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for others
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
    const info = await transporter.sendMail({
        from: `"Your App Name" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html,
    });
    console.log("Email sent: %s", info.messageId);
};

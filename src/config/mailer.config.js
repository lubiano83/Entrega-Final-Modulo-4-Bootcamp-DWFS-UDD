import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Carga variables de entorno desde .env

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST, // SMTP Host (Ej: smtp.gmail.com)
    port: process.env.MAIL_PORT, // Puerto SMTP (465 o 587)
    secure: process.env.MAIL_SECURE === "true", // true para 465, false para otros
    auth: {
        user: process.env.MAIL_USER, // Tu email
        pass: process.env.MAIL_PASS, // Contraseña o App Password
    },
});

export default transporter;
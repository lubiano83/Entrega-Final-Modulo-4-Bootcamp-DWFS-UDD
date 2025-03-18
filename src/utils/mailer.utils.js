import transporter from "../config/mailer.config.js";

export const sendReservationEmail = async (reservation) => {
    try {
        const imageUrl = `https://backend-sistema-de-reservas.onrender.com/logo.webp`;
        const mailOptions = {
            from: `"Reservas Cabañas" <${process.env.MAIL_USER}>`,
            to: reservation.email,
            subject: "Confirmación de Reserva",
            html: `
                <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                    <div style="width: 100%; display: flex; justify-content: center; align-items: center;">
                        <img src="${imageUrl}" alt="Logo Cabañas" style="width: 150px; height: auto;">
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: start;">
                        <h2>Hola ${reservation.name}, tu reserva ha sido confirmada.</h2>
                        <p><strong>Fecha de llegada:</strong> ${new Date(reservation.arrive).toLocaleDateString()}</p>
                        <p><strong>Fecha de salida:</strong> ${new Date(reservation.leave).toLocaleDateString()}</p>
                        <p><strong>Cabaña:</strong> ${reservation.lodgeId}</p>
                        <p><strong>Personas:</strong> ${reservation.people}</p>
                        <p><strong>Total a pagar:</strong> $${reservation.price}</p>
                    </div>
                    <p>Gracias por elegirnos. ¡Esperamos verte pronto!</p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Correo enviado:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error enviando email:", error);
        return { success: false, error: error.message };
    }
};
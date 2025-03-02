import ReservationsDao from "../dao/reservations.dao.js";

const reservationsDao = new ReservationsDao();

export default class ReservationsController {

    getReservations = async(req, res) => {
        try {
            const reservations = await reservationsDao.readFile();
            return res.status(200).send({ message: "Todas las reservas..", reservations });
        } catch (error) {
            return res.status(500).send({ message: "Error interno del servidor..", error: error.message });
        }
    };

    getReservationById = async(req, res) => {
        try {
            const { id } = req.params;
            const reservation = await reservationsDao.readFileById( Number(id) );
            if(!reservation) return res.status(404).send({ message: "Reserva no encontrada.." });
            return res.status(200).send({ message: "Reserva obtenida por el id..", reservation });
        } catch (error) {
            return res.status(500).send({ message: "Error interno del servidor..", error: error.message });
        }
    };

    createReservation = async(req, res) => {
        try {
            const data = req.body;
            const { name, email, phone, address, lodge, arrive, leave } = data;
            if( !name, !email, !phone, !address, !lodge, !arrive, !leave ) return res.status(400).send({ message: "Todos los campos son requeridos.." });
            const modifiedData = { name: name.toLowerCase(), email: email.toLowerCase(), address: address.toLowerCase(), lodge: Number(lodge), arrive: new Date(arrive), leave: new Date(leave) };
            await reservationsDao.createFile(modifiedData);
            return res.status(201).send([{ message: "Reserva creado con exito..", modifiedData }]);
        } catch (error) {
            return res.status(500).send({ message: "Error interno del servidor..", error: error.message });
        }
    };

    deleteReservation = async(req, res) => {
        try {
            const { id } = req.params;
            const deleted = await reservationsDao.readFileById( Number(id) );
            if (!deleted) return res.status(404).send({ message: "Reserva no encontrada.." });
            await reservationsDao.deleteFile( Number(id) );
            return res.status(200).send({ message: "Reserva eliminado con exito.." });
        } catch (error) {
            return res.status(500).send({ message: "Error interno del servidor..", error: error.message });
        }
    };

    updateReservation = async(req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const updated = await reservationsDao.readFileById( Number(id) );
            if (!updated) return res.status(404).send({ message: "Reserva no encontrada.." });
            const reservation = await reservationsDao.updateFile( Number(id), data );
            return res.status(200).send({ message: "Reserva modificada con exito..", reservation });
        } catch (error) {
            return res.status(500).send({ message: "Error interno del servidor..", error: error.message });
        }
    };

    deleteAllReservations = async(req, res) => {
        try {
            await reservationsDao.deleteAllFile();
            const reservations = await reservationsDao.readFile();
            return res.status(200).send({ message: "Reservas eliminadas con exito..", reservations });
        } catch (error) {
            return res.status(500).send({ message: "Error interno del servidor..", error: error.message });
        }
    };
};
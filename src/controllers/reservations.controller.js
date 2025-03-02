import ReservationsDao from "../dao/reservations.dao.js";
import LodgesDao from "../dao/lodges.dao.js";

const reservationsDao = new ReservationsDao();
const lodgesDao = new LodgesDao();

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
            const { name, email, phone, address, lodgeId, arrive, leave } = data;
            if( !name, !email, !phone, !address, !lodgeId, !arrive, !leave ) return res.status(400).send({ message: "Todos los campos son requeridos.." });
            const findLodge = await lodgesDao.readFileById( Number(lodgeId) );
            if(findLodge.available === true) {
                const modifiedData = { name: name.toLowerCase(), email: email.toLowerCase(), address: address.toLowerCase(), phone: String(phone), lodgeId: Number(lodgeId), arrive: new Date(arrive), leave: new Date(leave) };
                const reservationsList = await reservationsDao.readFile();
                const existingReservations = reservationsList.filter(item => item.lodgeId === Number(lodgeId));
                const conflict = existingReservations.some(reservation => {
                    const reservationStart = new Date(reservation.arrive);
                    const reservationEnd = new Date(reservation.leave);
                    return (
                        (modifiedData.arrive >= reservationStart && modifiedData.arrive < reservationEnd) || // Llega dentro de una reserva existente
                        (modifiedData.leave > reservationStart && modifiedData.leave <= reservationEnd) || // Se va dentro de una reserva existente
                        (modifiedData.arrive <= reservationStart && modifiedData.leave >= reservationEnd) // La reserva cubre totalmente otra reserva
                    );
                });
                if (conflict) return res.status(400).send({ message: "Esta cabaña ya está reservada en las fechas seleccionadas.." });
                await reservationsDao.createFile(modifiedData);
                return res.status(201).send([{ message: "Reserva creada con éxito..", modifiedData }]);
            } else {
                return res.status(400).send({ message: "Esa cabaña no esta disponible.." });
            }
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
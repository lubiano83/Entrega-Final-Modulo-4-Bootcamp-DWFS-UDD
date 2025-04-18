import ReservationsDao from "../dao/reservations.dao.js";
import LodgesDao from "../dao/lodges.dao.js";
import RecordsDao from "../dao/records.dao.js";
import SeasonsDao from "../dao/seasons.dao.js";
import { sendReservationEmail } from "../utils/mailer.utils.js";

const reservationsDao = new ReservationsDao();
const lodgesDao = new LodgesDao();
const recordsDao = new RecordsDao();
const seasonsDao = new SeasonsDao();

export default class ReservationsController {

    #getPricePerDay = async(date, lodgeId) => {
        try {
            const lodge = await lodgesDao.readFileById( Number(lodgeId) );
            const year = date.getFullYear();
            const seasons = await seasonsDao.readFile();
            if(seasons.length === 0) throw new Error("Primero debes establecer las temporadas..");
            const highSeasonStart = new Date(year, seasons[0].highSeasonStart.month - 1, seasons[0].highSeasonStart.day);
            const highSeasonEnd = new Date(year, seasons[0].highSeasonEnd.month - 1, seasons[0].highSeasonEnd.day);
            const midSeasonStart = new Date(year, seasons[0].midSeasonStart.month - 1, seasons[0].midSeasonStart.day);
            const midSeasonEnd = new Date(year + 1, seasons[0].midSeasonEnd.month - 1, seasons[0].midSeasonEnd.day);
            if (date >= highSeasonStart && date < highSeasonEnd) return lodge.season.high;
            if (date >= midSeasonStart && date < midSeasonEnd) return lodge.season.medium;
            return lodge.season.low;
        } catch (error) {
            throw new Error(error.message);
        }
    };
    
    #calculateTotalPrice = async(arrive, leave, lodgeId) => {
        try {
            let totalPrice = 0;
            let currentDate = new Date(arrive);
            const endDate = new Date(leave);
            while (currentDate < endDate) {
                totalPrice += await this.#getPricePerDay(currentDate, lodgeId);
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return totalPrice;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    #confirmReservationDate = async (modifiedData, lodgeId, id) => {
        try {
            const reservationsList = await reservationsDao.readFile();
            let currentReservation = null;
            if (id) currentReservation = await reservationsDao.readFileById(Number(id));
            const existingReservations = reservationsList.filter(item => item.lodgeId === Number(lodgeId) && (!currentReservation || item.id !== currentReservation.id));
            const conflict = existingReservations.some(reservation => {
                const reservationStart = new Date(reservation.arrive);
                const reservationEnd = new Date(reservation.leave);
                return (
                    (modifiedData.arrive >= reservationStart && modifiedData.arrive < reservationEnd) ||
                    (modifiedData.leave > reservationStart && modifiedData.leave <= reservationEnd) ||
                    (modifiedData.arrive <= reservationStart && modifiedData.leave >= reservationEnd)
                );
            });
            return conflict;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    getReservations = async (req, res) => {
        try {
            const { lodgeId, people, paid, ...sortParams } = req.query;
            let reservations = await reservationsDao.readFile();
            if (lodgeId) reservations = reservations.filter(item => Number(item.lodgeId) === Number(lodgeId));
            if (people) reservations = reservations.filter(item => Number(item.people) === Number(people));
            if (paid) reservations = reservations.filter(item => String(item.paid) === String(paid));
            const [sortKey, sortOrder] = Object.entries(sortParams)[0] || [];
            if (sortKey && ["arrive", "leave"].includes(sortKey)) {
                const orderFactor = sortOrder === "desc" ? -1 : 1;
                reservations.sort((a, b) => {
                    return (new Date(a[sortKey]) - new Date(b[sortKey])) * orderFactor;
                });
            }
            return res.status(200).send({ message: "Todas las reservas ordenadas..", reservations });
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
            const { name, email, phone, address, lodgeId, people, arrive, leave } = data;
            const { region, city, street, number } = address;
            const findLodge = await lodgesDao.readFileById( Number(lodgeId) );
            if(!findLodge) return res.status(404).send({ message: "Cabaña no econtrada.." });    
            if( !name || !email || !phone || !region || !city || !street || !number || !lodgeId || !people || !arrive || !leave ) return res.status(400).send({ message: "Todos los campos son requeridos.." });
            let price = await this.#calculateTotalPrice(arrive, leave, lodgeId);
            const modifiedData = { name: name.toLowerCase().trim(), email: email.toLowerCase().trim(), phone: String(phone), address: { region: region.toLowerCase().trim(), city: city.toLowerCase().trim(), street: street.toLowerCase().trim(), number: String(number) }, lodgeId: Number(lodgeId), people: Number(people), arrive: new Date(arrive), leave: new Date(leave), price: Number(price), paid: Boolean(false) };
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) return res.status(400).send({ message: "Debes ingresar un email válido.." });
            const phoneRegex = /^\+569\d{8}$/;
            if (!phoneRegex.test(phone)) return res.status(400).send({ message: "Debes ingresar un telefono válido.." });
            if(isNaN(Number(lodgeId)) || isNaN(Number(people))) return res.status(400).send({ message: "El campo: lodgeId y people, deben ser tipo number.." });
            if(findLodge.available === false) return res.status(400).send({ message: "Esa cabaña no esta disponible.." });
            if(modifiedData.people > findLodge.capacity) return res.status(400).send({ message: `La capacidad maxima es de ${findLodge.capacity} personas..` });
            const conflict = await this.#confirmReservationDate(modifiedData, lodgeId);
            if (conflict) return res.status(400).send({ message: "Esta cabaña ya está reservada en las fechas seleccionadas.." });
            await reservationsDao.createFile(modifiedData);
            const emailResponse = await sendReservationEmail(modifiedData);
            if (!emailResponse.success) return res.status(500).send({ message: "Reserva creada, pero hubo un error al enviar el email.", error: emailResponse.error });
            return res.status(201).send([{ message: "Reserva creada con éxito..", modifiedData }]);
        } catch (error) {
            return res.status(500).send({ message: "Error interno del servidor..", error: error.message });
        }
    };

    deleteReservationById = async(req, res) => {
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

    updateReservationUserById = async(req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const { name, email, phone, address } = data;
            const { region, city, street, number } = address;
            if(!name || !email || !phone || !region || !city || !street || !number) return res.status(400).send({ message: "Todos los campos son requeridos.." });
            const modifyData = { name: name.toLowerCase().trim(), email: email.toLowerCase().trim(), phone: String(phone), address: { region: region.toLowerCase().trim(), city: city.toLowerCase().trim(), street: street.toLowerCase().trim(), number: String(number) }};
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) return res.status(400).send({ message: "Debes ingresar un email válido.." });
            const phoneRegex = /^\+569\d{8}$/;
            if (!phoneRegex.test(phone)) return res.status(400).send({ message: "Debes ingresar un telefono válido.." });
            const updated = await reservationsDao.readFileById( Number(id) );
            if (!updated) return res.status(404).send({ message: "Reserva no encontrada.." });
            const reservation = await reservationsDao.updateFile( Number(id), modifyData );
            return res.status(200).send({ message: "Reserva modificada con exito..", reservation });
        } catch (error) {
            return res.status(500).send({ message: "Error interno del servidor..", error: error.message });
        }
    };

    updateReservationLodgeById = async(req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const { lodgeId, people, arrive, leave } = data;
            let price = await this.#calculateTotalPrice(arrive, leave, lodgeId);
            if(!lodgeId || !people || !arrive || !leave) return res.status(400).send({ message: "Todos los campos son requeridos.." });
            const modifiedData = { lodgeId: Number(lodgeId), people: Number(people), price: Number(price), arrive: new Date(arrive), leave: new Date(leave) };
            if(isNaN(Number(lodgeId)) || isNaN(Number(people))) return res.status(400).send({ message: "El campo: lodgeId y people, deben ser tipo number.." });
            const findLodge = await lodgesDao.readFileById( Number(lodgeId) );
            if(!findLodge) return res.status(404).send({ message: "Cabaña no econtrada.." });
            if(findLodge.available === false) return res.status(400).send({ message: "Esa cabaña no esta disponible.." });
            if(modifiedData.people > findLodge.capacity) return res.status(400).send({ message: `La capacidad maxima es de ${findLodge.capacity} personas..` });
            const conflict = await this.#confirmReservationDate(modifiedData, lodgeId, id);
            if (conflict) return res.status(400).send({ message: "Esta cabaña ya está reservada en las fechas seleccionadas.." });
            const reservation = await reservationsDao.updateFile( Number(id), modifiedData );
            return res.status(201).send([{ message: "Reserva creada con éxito..", reservation }]);
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

    isAlreadyPaid = async(req, res) => {
        try {
            const { id } = req.params;
            const updated = await reservationsDao.readFileById( Number(id) );
            if (!updated) return res.status(404).send({ message: "Reserva no encontrada.." });
            const reservation = await reservationsDao.updateFile( Number(id), { paid: !updated.paid });
            const lodge = await lodgesDao.readFileById( Number(reservation.lodgeId) );
            const payload = { ...reservation, lodgeId: lodge }
            await recordsDao.createFile({ payload });
            await reservationsDao.deleteFile( Number(id) );
            return res.status(200).send({ message: "Registro creado con exito..", payload });
        } catch (error) {
            return res.status(500).send({ message: "Error interno del servidor..", error: error.message });
        }
    };
};
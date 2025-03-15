import ReservationsDao from "../dao/reservations.dao.js";
import LodgesDao from "../dao/lodges.dao.js";
import RecordsDao from "../dao/records.dao.js";

const reservationsDao = new ReservationsDao();
const lodgesDao = new LodgesDao();
const recordsDao = new RecordsDao();

export default class ReservationsController {

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
            return res.status(200).send({ message: "Todas las reservas ordenadas.", reservations });
        } catch (error) {
            return res.status(500).send({ message: "Error interno del servidor.", error: error.message });
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
            if( !name || !email || !phone || !region || !city || !street || !number || !lodgeId || !people || !arrive || !leave ) return res.status(400).send({ message: "Todos los campos son requeridos.." });
            const modifiedData = { name: name.toLowerCase().trim(), email: email.toLowerCase().trim(), phone: String(phone), address: { region: region.toLowerCase().trim(), city: city.toLowerCase().trim(), street: street.toLowerCase().trim(), number: String(number) }, lodgeId: Number(lodgeId), people: Number(people), arrive: new Date(arrive), leave: new Date(leave), paid: Boolean(false) };
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) return res.status(400).send({ message: "Debes ingresar un email válido.." });
            const phoneRegex = /^\+569\d{8}$/;
            if (!phoneRegex.test(phone)) return res.status(400).send({ message: "Debes ingresar un telefono válido.." });
            if(isNaN(Number(lodgeId)) || isNaN(Number(people))) return res.status(400).send({ message: "El campo: lodgeId y people, deben ser tipo number.." });
            const findLodge = await lodgesDao.readFileById( Number(lodgeId) );
            if(!findLodge) return res.status(404).send({ message: "Cabaña no econtrada.." });
            if(findLodge.available === true) {
                if(modifiedData.people > findLodge.capacity) return res.status(400).send({ message: `La capacidad maxima es de ${findLodge.capacity} personas..` });
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
            if(!lodgeId || !people || !arrive || !leave) return res.status(400).send({ message: "Todos los campos son requeridos.." });
            const modifiedData = { lodgeId: Number(lodgeId), people: Number(people), arrive: new Date(arrive), leave: new Date(leave) };
            if(isNaN(Number(lodgeId)) || isNaN(Number(people))) return res.status(400).send({ message: "El campo: lodgeId y people, deben ser tipo number.." });
            const findLodge = await lodgesDao.readFileById( Number(lodgeId) );
            if(!findLodge) return res.status(404).send({ message: "Cabaña no econtrada.." });
            if(findLodge.available === true) {
                if(modifiedData.people > findLodge.capacity) return res.status(400).send({ message: `La capacidad maxima es de ${findLodge.capacity} personas..` });
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
                const reservation = await reservationsDao.updateFile( Number(id), modifiedData );
                return res.status(201).send([{ message: "Reserva creada con éxito..", reservation }]);
            } else {
                return res.status(400).send({ message: "Esa cabaña no esta disponible.." });
            }
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
            await recordsDao.createFile(reservation);
            await reservationsDao.deleteFile( Number(id) );
            return res.status(200).send({ message: "Reserva modificada con exito..", reservation });
        } catch (error) {
            return res.status(500).send({ message: "Error interno del servidor..", error: error.message });
        }
    };
};
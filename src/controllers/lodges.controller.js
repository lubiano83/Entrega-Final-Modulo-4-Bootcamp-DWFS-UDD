import LodgesDao from "../dao/lodges.dao.js";

const lodgesDao = new LodgesDao();

export default class LodgesController {

    getLodges = async (req, res) => {
        try {
            const { hotel, size, bedroom, bathroom, capacity, wifi, available, ...sortParams } = req.query;
            let lodges = await lodgesDao.readFile();
            if (hotel) lodges = lodges.filter(lodge => lodge.hotel === hotel);
            if (size) lodges = lodges.filter(lodge => Number(lodge.size) === Number(size));
            if (bedroom) lodges = lodges.filter(lodge => Number(lodge.bedroom) === Number(bedroom));
            if (bathroom) lodges = lodges.filter(lodge => Number(lodge.bathroom) === Number(bathroom));
            if (capacity) lodges = lodges.filter(lodge => Number(lodge.capacity) === Number(capacity));
            if (wifi) lodges = lodges.filter(lodge => lodge.wifi === (wifi === "true"));
            if (available) lodges = lodges.filter(lodge => lodge.available === (available === "true"));
            const [seasonKey, sortOrder] = Object.entries(sortParams)[0] || [];
            if (seasonKey && ["high", "medium", "low"].includes(seasonKey)) {
                const orderFactor = sortOrder === "desc" ? -1 : 1;
                lodges.sort((a, b) => (a.season[seasonKey] - b.season[seasonKey]) * orderFactor);
            }
            return res.status(200).send({ message: "Cabañas filtradas y ordenadas.", lodges });
        } catch (error) {
            return res.status(500).send({ message: "Error interno del servidor.", error: error.message });
        }
    };          

    getLodgeById = async(req, res) => {
        try {
            const { id } = req.params;
            const lodge = await lodgesDao.readFileById( Number(id) );
            if(!lodge) return res.status(404).send({ message: "Cabaña no encontrada.." });
            return res.status(200).send({ message: "Cabaña obtenida por el id..", lodge });
        } catch (error) {
            return res.status(500).send({ message: "Error interno del servidor..", error: error.message });
        }
    };

    createLodge = async(req, res) => {
        try {
            const data = req.body;
            const { hotel, size, bedroom, bathroom, capacity, season } = data;
            const { high, medium, low } = season;
            if( !hotel, !size, !bedroom, !bathroom, !capacity, !high, !medium, !low ) return res.status(400).send({ message: "Todos los campos son requeridos.." });
            const modifiedData = { hotel: String(hotel.toLowerCase()), img: [], size: Number(size), bedroom: Number(bedroom), bathroom: Number(bathroom), capacity: Number(capacity), wifi: Boolean(false), season: { high: Number(high), medium: Number(medium), low: Number(low) }, available: Boolean(false)};
            await lodgesDao.createFile(modifiedData);
            return res.status(201).send([{ message: "Cabaña creado con exito..", modifiedData }]);
        } catch (error) {
            return res.status(500).send({ message: "Error interno del servidor..", error: error.message });
        }
    };

    deleteLodgeById = async(req, res) => {
        try {
            const { id } = req.params;
            const deleted = await lodgesDao.readFileById( Number(id) );
            if (!deleted) return res.status(404).send({ message: "Cabaña no encontrada.." });
            await lodgesDao.deleteFile( Number(id) );
            return res.status(200).send({ message: "Cabaña eliminada con exito.." });
        } catch (error) {
            return res.status(500).send({ message: "Error interno del servidor..", error: error.message });
        }
    };

    updateLodgeById = async(req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const { hotel, size, bedroom, bathroom, capacity, wifi, season } = data;
            const modifyData = {
                hotel: hotel ? String(hotel) : undefined,
                size: size ? Number(size) : undefined,
                bedroom: bedroom ? Number(bedroom) : undefined,
                bathroom: bathroom ? Number(bathroom) : undefined,
                capacity: capacity ? Number(capacity) : undefined,
                wifi: wifi !== undefined ? Boolean(wifi) : undefined,
                season: season
                    ? { 
                        high: season.high !== undefined ? Number(season.high) : undefined, 
                        medium: season.medium !== undefined ? Number(season.medium) : undefined, 
                        low: season.low !== undefined ? Number(season.low) : undefined 
                      }
                    : undefined
            };
            const updated = await lodgesDao.readFileById( Number(id) );
            if (!updated) return res.status(404).send({ message: "Cabaña no encontrada.." });
            const lodge = await lodgesDao.updateFile( Number(id), modifyData );
            if (!lodge) return res.status(404).send({ message: "Cabaña no encontrada.." });
            return res.status(200).send({ message: "Cabaña modificada con exito..", lodge });
        } catch (error) {
            return res.status(500).send({ message: "Error interno del servidor..", error: error.message });
        }
    };

    deleteAllLodge = async(req, res) => {
        try {
            await lodgesDao.deleteAllFile();
            const lodges = await lodgesDao.readFile();
            return res.status(200).send({ message: "Cabañas eliminadas con exito..", lodges })
        } catch (error) {
            return res.status(500).send({ message: "Error interno del servidor..", error: error.message });
        }
    };

    changeAvailable = async(req, res) => {
        try {
            const { id } = req.params;
            const updated = await lodgesDao.readFileById( Number(id) );
            if (!updated) return res.status(404).send({ message: "Cabaña no encontrada.." });
            const lodge = await lodgesDao.updateFile( Number(id), { available: !updated.available });
            if (!lodge) return res.status(404).send({ message: "Cabaña no encontrada.." });
            return res.status(200).send({ message: "Disponibilidad de cabaña modificada con exito..", lodge });
        } catch (error) {
            return res.status(500).send({ message: "Error interno del servidor..", error: error.message });
        }
    };
};
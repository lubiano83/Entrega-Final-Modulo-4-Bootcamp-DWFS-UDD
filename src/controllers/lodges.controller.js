import LodgesDao from "../dao/lodges.dao.js";

const lodgesDao = new LodgesDao();

export default class LodgesController {

    getLodges = async(req, res) => {
        try {
            const lodges = await lodgesDao.readFile();
            return res.status(200).send({ message: "Todas las cabañas..", lodges })
        } catch (error) {
            return res.status(500).send({ message: "Error interno del servidor..", error: error.message })
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
            const { img, size, bedroom, bathroom, wifi, capacity, price } = data;
            const { high, medium, low } = price;
            if( !img, !size, !bedroom, !bathroom, !wifi, !capacity, !high, !medium, !low ) return res.status(400).send({ message: "Todos los campos son requeridos.." });
            const modifiedData = { img: String(img), size: String(size), bedroom: Number(bedroom), bathroom: Number(bathroom), capacity: Number(capacity), wifi: Boolean(wifi), price: { high: Number(high), medium: Number(medium), low: Number(low) }};
            const lodges = await lodgesDao.createFile(modifiedData);
            return res.status(201).send([{ message: "Cabaña creado con exito..", lodges }]);
        } catch (error) {
            return res.status(500).send({ message: "Error interno del servidor..", error: error.message });
        }
    };

    deleteLodge = async(req, res) => {
        try {
            const { id } = req.params;
            const deleted = await lodgesDao.readFileById( Number(id) );
            if (!deleted) return res.status(404).send({ message: "Cabaña no encontrada.." });
            await lodgesDao.deleteFile( Number(id) );
            return res.status(200).send({ message: "Reserva eliminado con exito.." });
        } catch (error) {
            return res.status(500).send({ message: "Error interno del servidor..", error: error.message });
        }
    };

    updateLodge = async(req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const updated = await lodgesDao.readFileById( Number(id) );
            if (!updated) return res.status(404).send({ message: "Cabaña no encontrada.." });
            const lodge = await lodgesDao.updateFile( Number(id), data );
            if (!lodge) return res.status(404).send({ message: "Cabaña no encontrada.." });
            return res.status(200).send({ message: "Reserva modificada con exito..", lodge });
        } catch (error) {
            return res.status(500).send({ message: "Error interno del servidor..", error: error.message });
        }
    };

};
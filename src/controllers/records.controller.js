import RecordsDao from "../dao/records.dao.js";

const recordsDao = new RecordsDao();

export default class RecordsController {
    getRecords = async(req, res) => {
        try {
            const records = await recordsDao.readFile();
            res.status(200).send({ message: "Todos los registros", records });
        } catch (error) {
            return res.status(500).send({ message: "Error interno del servidor..", error: error.message });
        }
    };

    deleteRecordById = async(req, res) => {
        try {
            const { id } = req.params;
            const record = await recordsDao.deleteFile( Number(id) );
            return res.status(200).send({ message: "Registro eliminado con exito.." });
        } catch (error) {
            return res.status(500).send({ message: "Error interno del servidor..", error: error.message });
        }
    };

    deleteAllRecords = async(req, res) => {
        try {
            await recordsDao.deleteAllFile();
            const records = await recordsDao.readFile();
            return res.status(200).send({ message: "Registros eliminados con exito..", records });
        } catch (error) {
            return res.status(500).send({ message: "Error interno del servidor..", error: error.message });
        }
    };
};
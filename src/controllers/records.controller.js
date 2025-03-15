import RecordsDao from "../dao/records.dao.js";

const recordsDao = new RecordsDao();

export default class RecordsController {
    getRecords = async(req, res) => {
        try {
            const records = await recordsDao.readFile();
            res.status(200).send(records);
        } catch (error) {
            return res.status(500).send({ message: "Error interno del servidor..", error: error.message });
        }
    };
};
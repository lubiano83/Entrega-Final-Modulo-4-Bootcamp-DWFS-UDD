import SeasonsDao from "../dao/seasons.dao.js";

const seasonsDao = new SeasonsDao();

export class SeasonsController {

    async #validateDate(month, day) {
        try {
            const modifiedData = { month: Number(month), day: Number(day) };
            if (isNaN(modifiedData.month) || isNaN(modifiedData.day)) throw new Error("Los campos: month y day, deben ser tipo number..");
            return modifiedData;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    setSeasons = async (req, res) => {
        try {
            await seasonsDao.deleteAllFile();
            const { highSeasonStart, highSeasonEnd, midSeasonStart, midSeasonEnd } = req.body;
            if (!highSeasonStart || !highSeasonEnd || !midSeasonStart || !midSeasonEnd) return res.status(400).json({ message: "Todos los campos de temporada son obligatorios.." });
            const seasonsData = {
                highSeasonStart: await this.#validateDate(highSeasonStart.month, highSeasonStart.day),
                highSeasonEnd: await this.#validateDate(highSeasonEnd.month, highSeasonEnd.day),
                midSeasonStart: await this.#validateDate(midSeasonStart.month, midSeasonStart.day),
                midSeasonEnd: await this.#validateDate(midSeasonEnd.month, midSeasonEnd.day),
            };
            await seasonsDao.createFile(seasonsData);
            return res.status(200).json({ message: "Temporadas actualizadas correctamente", seasons: seasonsData });
        } catch (error) {
            return res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }
    };
}
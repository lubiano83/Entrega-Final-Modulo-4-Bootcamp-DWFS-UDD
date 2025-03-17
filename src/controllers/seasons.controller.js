import SeasonsDao from "../dao/seasons.dao.js";

const seasonsDao = new SeasonsDao();

export class SeasonsController {
    setSeasons = async(req, res) => {
        try {
            await seasonsDao.deleteAllFile();
            const data = req.body;
            const { highSeasonStart, highSeasonEnd, midSeasonStart, midSeasonEnd } = data;
            const modifiedData = { highSeasonStart: { year: year, month: month,  day: day }, highSeasonEnd: { year: year, month: month,  day: day }, midSeasonStart: { year: year, month: month,  day: day }, midSeasonEnd: { year: year, month: month,  day: day }};


        } catch (error) {
            return res.status(500).send({ message: "Error interno del servidor.", error: error.message });
        }
    };
};
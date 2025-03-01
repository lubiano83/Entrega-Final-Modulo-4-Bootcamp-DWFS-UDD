import FileSystemDao from "../dao/fs.dao.js";

const fileSystemDao = new FileSystemDao();

export default class ReservasController {

    readFile = async(req, res) => {
        try {
            const reservas = await fileSystemDao.readFile();
            res.status(200).send({ message: "Todas las reservas..", reservas });
        } catch (error) {
            console.log(error.message);
        }
    };

    createFile = async(req, res) => {
        try {
            const data = req.body;
            const { firstName, lastName, email, phone, address, house, arrive, leave } = data;
            if( !firstName, !lastName, !email, !phone, !address, !house, !arrive, !leave ) return res.send({ message: "Todos los campos son requeridos.." });
            const response = await fileSystemDao.createFile(data);
            res.status(200).send([{ message: "Archivo creado con exito..", response }]);
        } catch (error) {
            console.log(error.message);
        }
    };

    deleteFile = async(req, res) => {
        try {
            const { id } = req.params;
            await fileSystemDao.deleteFile( Number(id) );
            return res.send({ message: "Archivo eliminado con exito.." });
        } catch (error) {
            console.log(error.message);
        }
    };

    updateFile = async(req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const response = await fileSystemDao.updateFile( Number(id), data );
            return res.send({ response });
        } catch (error) {
            
        }
    };

    deleteAllFile = async(req, res) => {
        try {
            await fileSystemDao.deleteAllFile();
            const reservas = await fileSystemDao.readFile();
            res.status(200).send({ message: "Archivos eliminados con exito..", reservas });
        } catch (error) {
            console.log(error.message);
        }
    };
};
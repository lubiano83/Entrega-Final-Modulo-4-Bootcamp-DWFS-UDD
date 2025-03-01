import fs from 'fs/promises';
import path from 'path';

export default class FileSystemDao {
    
    constructor() {
        this.path = path.join(process.cwd(), "src/database/reservas.database.json");
    }

    #generarId = (reservas) => {
        let idMayor = 0;
        reservas.forEach((reserva) => {
            if (reserva.id > idMayor) {
                idMayor = reserva.id;
            }
        });
        return idMayor + 1;
    };

    #writeFile = async(data) => {
        try {
            await fs.writeFile(this.path, JSON.stringify(data, null, "\t"));
        } catch (error) {
            console.log(error.message);
        }
    };

    #accessFile = async() => {
        try {
            await fs.access(this.path);
        } catch (error) {
            await this.#writeFile([]);
        }
    };

    readFile = async() => {
        try {
            await this.#accessFile();
            const data = await fs.readFile(this.path, "utf8");
            return JSON.parse(data);
        } catch (error) {
            console.log(error.message);
        }
    };

    createFile = async(data) => {
        try {
            const reservas = await this.readFile();
            reservas.push({ id: this.#generarId(reservas), ...data });
            return await this.#writeFile(reservas);
        } catch (error) {
            console.log(error.message);
        }
    };

    deleteFile = async(id) => {
        try {
            const reservas = await this.readFile();
            const reservaEliminada = reservas.filter(item => item.id !== id);
            return  await this.#writeFile(reservaEliminada);
        } catch (error) {
            console.log(error.message);
        }
    };

    updateFile = async(id, data) => {
        try {
            const reservas = await this.readFile();
            const index = reservas.findIndex(reserva => reserva.id === id);
            if (index !== -1) {
                reservas[index] = { ...reservas[index], ...data };
                await this.#writeFile(reservas);
                return reservas[index];
            } 
            return null;
        } catch (error) {
            console.log(error.message);
        }
    };

    deleteAllFile = async() => {
        try {
            await this.#writeFile([]);
        } catch (error) {
            console.log(error.message);
        }
    };
}
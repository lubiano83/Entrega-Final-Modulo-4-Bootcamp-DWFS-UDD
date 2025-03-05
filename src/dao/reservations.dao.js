import fs from 'fs/promises';
import path from 'path';

export default class ReservationsDao {
    
    constructor() {
        this.path = path.join(process.cwd(), "src/database/reservations.database.json");
    }

    #generarId = (reservations) => {
        let idMayor = 0;
        reservations.forEach(item => {
            if (item.id > idMayor) {
                idMayor = item.id;
            }
        });
        return idMayor + 1;
    };

    #writeFile = async(data) => {
        try {
            return await fs.writeFile(this.path, JSON.stringify(data, null, "\t"));
        } catch (error) {
            console.log(error.message);
        }
    };

    #accessFile = async() => {
        try {
            return await fs.access(this.path);
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

    readFileById = async(id) => {
        try {
            const reservations = await this.readFile();
            const reservationDetected = reservations.find(item => item.id === id);
            return reservationDetected;
        } catch (error) {
            console.log(error.message);
        }
    };

    createFile = async(data) => {
        try {
            const reservations = await this.readFile();
            reservations.push({ id: this.#generarId(reservations), ...data });
            return await this.#writeFile(reservations);
        } catch (error) {
            console.log(error.message);
        }
    };

    deleteFile = async(id) => {
        try {
            const reservations = await this.readFile();
            const reservationDeleted = reservations.filter(item => item.id !== id);
            return  await this.#writeFile(reservationDeleted);
        } catch (error) {
            console.log(error.message);
        }
    };

    updateFile = async(id, data) => {
        try {
            const reservations = await this.readFile();
            const index = reservations.findIndex(item => item.id === id);
            if (index !== -1) {
                reservations[index] = { ...reservations[index], ...data };
                await this.#writeFile(reservations);
                return reservations[index];
            } 
            return null;
        } catch (error) {
            console.log(error.message);
        }
    };

    deleteAllFile = async() => {
        try {
            return await this.#writeFile([]);
        } catch (error) {
            console.log(error.message);
        }
    };
}
import fs from 'fs/promises';
import path from 'path';

export default class LodgesDao {
    
    constructor() {
        this.path = path.join(process.cwd(), "src/database/seasons.database.json");
    }

    #generarId = (seasons) => {
        let idMayor = 0;
        seasons.forEach(item => {
            if (item.id > idMayor) {
                idMayor = item.id;
            }
        });
        return idMayor + 1;
    };

    #writeFile = async(data) => {
        try {
            await fs.writeFile(this.path, JSON.stringify(data, null, "\t"));
        } catch (error) {
            throw new Error(error.message);
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
            throw new Error(error.message);
        }
    };

    readFileById = async(id) => {
        try {
            const seasons = await this.readFile();
            const seasonDetected = seasons.find(item => item.id === id);
            return seasonDetected;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    createFile = async(data) => {
        try {
            const seasons = await this.readFile();
            seasons.push({ id: this.#generarId(seasons), ...data });
            return await this.#writeFile(seasons);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    deleteFile = async(id) => {
        try {
            const seasons = await this.readFile();
            const seasonDeleted = seasons.filter(item => item.id !== id);
            return  await this.#writeFile(seasonDeleted);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    updateFile = async(id, data) => {
        try {
            const seasons = await this.readFile();
            const index = seasons.findIndex(item => item.id === id);
            if (index !== -1) {
                seasons[index] = { ...seasons[index], ...data };
                await this.#writeFile(seasons);
                return seasons[index];
            } 
            return null;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    deleteAllFile = async() => {
        try {
            await this.#writeFile([]);
        } catch (error) {
            throw new Error(error.message);
        }
    };
}
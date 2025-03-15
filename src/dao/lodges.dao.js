import fs from 'fs/promises';
import path from 'path';

export default class LodgesDao {
    
    constructor() {
        this.path = path.join(process.cwd(), "src/database/lodges.database.json");
    }

    #generarId = (lodges) => {
        let idMayor = 0;
        lodges.forEach(item => {
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
            const lodges = await this.readFile();
            const lodgeDetected = lodges.find(item => item.id === id);
            return lodgeDetected;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    createFile = async(data) => {
        try {
            const lodges = await this.readFile();
            lodges.push({ id: this.#generarId(lodges), ...data });
            return await this.#writeFile(lodges);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    deleteFile = async(id) => {
        try {
            const lodges = await this.readFile();
            const lodgesDeleted = lodges.filter(item => item.id !== id);
            return  await this.#writeFile(lodgesDeleted);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    updateFile = async(id, data) => {
        try {
            const lodges = await this.readFile();
            const index = lodges.findIndex(item => item.id === id);
            if (index !== -1) {
                lodges[index] = { ...lodges[index], ...data };
                await this.#writeFile(lodges);
                return lodges[index];
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
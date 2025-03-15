import fs from 'fs/promises';
import path from 'path';

export default class RecordsDao {
    
    constructor() {
        this.path = path.join(process.cwd(), "src/database/records.database.json");
    }

    #generarId = (records) => {
        let idMayor = 0;
        records.forEach(item => {
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
            const records = await this.readFile();
            const recordDetected = records.find(item => item.id === id);
            return recordDetected;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    createFile = async(data) => {
        try {
            const records = await this.readFile();
            records.push({ id: this.#generarId(records), ...data });
            return await this.#writeFile(records);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    deleteFile = async(id) => {
        try {
            const records = await this.readFile();
            const recordDeleted = records.filter(item => item.id !== id);
            return  await this.#writeFile(recordDeleted);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    updateFile = async(id, data) => {
        try {
            const records = await this.readFile();
            const index = records.findIndex(item => item.id === id);
            if (index !== -1) {
                records[index] = { ...records[index], ...data };
                await this.#writeFile(records);
                return records[index];
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
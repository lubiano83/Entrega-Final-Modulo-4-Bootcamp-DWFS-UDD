import express from "express";
import seasonsRouter from "./routes/seasons.router.js";
import lodgesRouter from "./routes/lodges.router.js";
import reservationsRouter from "./routes/reservations.router.js";
import recordsRouter from "./routes/records.router.js";
import { swaggerServe, swaggerSetup } from "./config/swagger.config.js";

// Variables
const APP = express();
const PORT = 8080;
const HOST = "localhost";

// Middlewares
APP.use(express.json());
APP.use(express.urlencoded({ extended: true }));
APP.use(express.static("./src/public"));

// Routes
APP.get("/", (req, res) => res.send(`<h1>Este es nuestro backend de un sistema de reservas!!</h1><br/><a href="/api/seasons" target="_blank"><button>seasons</button></a> <a href="/api/lodges" target="_blank"><button>lodges</button></a> <a href="/api/reservations" target="_blank"><button>reservations</button></a> <a href="/api/records" target="_blank"><button>records</button></a> <a href="/api/docs" target="_blank"><button>docs</button></a>`));
APP.use("/api/seasons", seasonsRouter);
APP.use("/api/lodges", lodgesRouter);
APP.use("/api/reservations", reservationsRouter);
APP.use("/api/records", recordsRouter);
APP.use("/api/docs", swaggerServe, swaggerSetup);

// Método que gestiona las rutas inexistentes.
APP.use((req, res) => {
    return res.status(404).send("<h1>Error 404: Not Found</h1>");
});

// Control de errores internos
APP.use((error, req, res) => {
    console.error("Error:", error.message);
    res.status(500).send("<h1>Error 500: Error en el Servidor</h1>");
});

// Listening
APP.listen(PORT, () => console.log(`Escuchando en http://${HOST}:${PORT}`));
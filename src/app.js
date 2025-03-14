import exprress from "express";
import lodgesRouter from "./routes/lodges.router.js";
import reservationsRouter from "./routes/reservations.router.js";
import { swaggerServe, swaggerSetup } from "./config/swagger.config.js";

// Variables
const APP = exprress();
const PORT = process.env.PORT || 8080;
const HOST = "0.0.0.0";

// Middlewares
APP.use(exprress.json());
APP.use(exprress.urlencoded({ extended: true }));

// Routes
APP.get("/", (req, res) => res.send(`<h1>Este es nuestro backend de un sistema de reservas!!</h1><br/><a href="/api/lodges" target="_blank"><button>lodges</button></a> <a href="/api/reservations" target="_blank"><button>reservations</button></a> <a href="/api/docs" target="_blank"><button>docs</button></a>`));
APP.use("/api/lodges", lodgesRouter);
APP.use("/api/reservations", reservationsRouter);
APP.use("/api/docs", swaggerServe, swaggerSetup);

// Método que gestiona las rutas inexistentes.
APP.use("*", (req, res) => {
    return res.status(404).send("<h1>Error 404: Not Found</h1>");
});

// Control de errores internos
APP.use((error, req, res) => {
    console.error("Error:", error.message);
    res.status(500).send("<h1>Error 500: Error en el Servidor</h1>");
});

// Listening
APP.listen(PORT, HOST, () => console.log(`Escuchando en http://${HOST}:${PORT}`));
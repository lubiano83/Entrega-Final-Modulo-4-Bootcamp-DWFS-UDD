import exprress from "express";
import lodgesRouter from "./routes/lodges.router.js";
import reservationsRouter from "./routes/reservations.router.js";

// Variables
const APP = exprress();
const PORT = 8080;
const HOST = "localhost";

// Middlewares
APP.use(exprress.json());
APP.use(exprress.urlencoded({ extended: true }));

// Routes
APP.use("/api/lodges", lodgesRouter);
APP.use("/api/reservations", reservationsRouter);

// Método que gestiona las rutas inexistentes.
APP.use("*", (req, res) => {
    return res.status(404).send("<h1>Error 404: Not Found</h1>");
});

// Control de errores internos
APP.use((error, req, res) => {
    console.error("Error:", error.message);
    res.status(500).send("<h1>Error 500: Error en el Servidor</h1>");
});

// Listen
APP.listen(PORT, () => console.log(`Escuchando en http://${HOST}:${PORT}`));
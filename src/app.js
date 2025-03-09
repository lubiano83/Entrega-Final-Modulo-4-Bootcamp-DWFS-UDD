import exprress from "express";
import lodgesRouter from "./routes/lodges.router.js";
import reservationsRouter from "./routes/reservations.router.js";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from "swagger-ui-express";

// Variables
const APP = exprress();
const PORT = 8080;
const HOST = "localhost";

// Swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentación de la App de Reservas de Cabañas",
            description: "App dedicada a la administración y reserva de cabañas para hospedaje."
        }
    },
    apis: ["./src/docs/*.yaml"] // Esto lee todos las carpetas y sus archivos .yaml dentro de docs.
}

const specs = swaggerJSDoc(swaggerOptions);

// Middlewares
APP.use(exprress.json());
APP.use(exprress.urlencoded({ extended: true }));

// Routes
APP.use("/api/lodges", lodgesRouter);
APP.use("/api/reservations", reservationsRouter);
APP.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

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
APP.listen(PORT, () => console.log(`Escuchando en http://${HOST}:${PORT}`));
import swaggerJSDoc from 'swagger-jsdoc';

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

export default specs;
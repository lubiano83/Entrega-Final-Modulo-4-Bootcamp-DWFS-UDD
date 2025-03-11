# Sistema de Reservas de Cabañas

Este es un sistema de reservas de cabañas desarrollado con **Node.js** y **Express.js**. Permite gestionar cabañas y reservas mediante una API REST. Utiliza archivos JSON como base de datos local y cuenta con documentación de API mediante **Swagger**.

## Características Principales
- CRUD de cabañas y reservas.
- Filtros y ordenamiento de datos.
- Validaciones de disponibilidad y capacidad.
- Documentación de API con **Swagger**.

## Tecnologías Utilizadas
- **Node.js**
- **Express.js**
- **Swagger** (para documentación de API)
- **JSON** (como base de datos local)

## Instalación
1. Clonar el repositorio:
   ```sh
   git clone https://github.com/lubiano83/Entrega-Final-Modulo-4-Bootcamp-DWFS-UDD
   ```

2. Acceder al directorio del proyecto:
   ```sh
   cd sistema-reservas
   ```

3. Instalar dependencias:
   ```sh
   npm install
   ```

## Configuración
- Definir el puerto en un archivo `.env` (opcional, por defecto es `8080`):
  ```sh
  PORT=8080
  ```

## Uso
Para iniciar el servidor:
```sh
npm start
```

El servidor se ejecutará en `http://localhost:8080`.

## Rutas de la API

### Cabañas (`/api/lodges`)
- **GET `/api/lodges`** → Obtiene todas las cabañas.
- **POST `/api/lodges`** → Crea una nueva cabaña.
- **GET `/api/lodges/:id`** → Obtiene una cabaña por ID.
- **PUT `/api/lodges/:id`** → Actualiza una cabaña por ID.
- **DELETE `/api/lodges/:id`** → Elimina una cabaña por ID.
- **PATCH `/api/lodges/:id`** → Cambia la disponibilidad de una cabaña.

### Reservas (`/api/reservations`)
- **GET `/api/reservations`** → Obtiene todas las reservas.
- **POST `/api/reservations`** → Crea una nueva reserva.
- **GET `/api/reservations/:id`** → Obtiene una reserva por ID.
- **PUT `/api/reservations/:id`** → Actualiza una reserva por ID.
- **DELETE `/api/reservations/:id`** → Elimina una reserva por ID.
- **PATCH `/api/reservations/:id`** → Cambia el estado de pago de una reserva.

## Documentación con Swagger
El proyecto incluye documentación de la API con **Swagger**. Para acceder:
- **URL:** `http://localhost:8080/api/docs`

## Manejo de Errores
- **404 Not Found** → Cuando una ruta no existe.
- **500 Internal Server Error** → Cuando ocurre un error interno en el servidor.

## Contribuciones
Si deseas contribuir, por favor sigue estos pasos:
1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b nueva-funcionalidad`).
3. Realiza los cambios y haz commit (`git commit -m "Agrega nueva funcionalidad"`).
4. Sube los cambios (`git push origin nueva-funcionalidad`).
5. Abre un pull request.

## Licencia
Este proyecto está bajo la licencia **MIT**.

## Servidor en la Nube
https://backend-sistema-de-reservas.onrender.com/
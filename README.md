# Sistema de Reservas de Cabañas

Este es un sistema de reservas de cabañas desarrollado con **Node.js** y **Express.js**. Permite gestionar cabañas y reservas mediante una API REST. Utiliza archivos JSON como base de datos local y cuenta con documentación de API mediante **Swagger**.

## Características Principales
- CRUD de cabañas, reservas y registros de pago.
- Filtros y ordenamiento de datos.
- Validaciones de disponibilidad y capacidad.
- Cálculo automático del precio según la temporada.
- Envió de confirmación de reserva por email con **Nodemailer**.
- Manejo de temporadas.
- Documentación de API con **Swagger**.

## Tecnologías Utilizadas
- **Node.js**
- **Express.js**
- **Swagger** (para documentación de API)
- **Nodemailer** (para envió de correos electrónicos)
- **JSON** (como base de datos local)

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

### Temporadas (`/api/seasons`)
- **GET `/api/seasons`** → Obtiene todas las temporadas.
- **POST `/api/seasons`** → Configura las temporadas.

### Cabañas (`/api/lodges`)
- **GET `/api/lodges`** → Obtiene todas las cabañas con filtros y ordenamiento.
- **POST `/api/lodges`** → Crea una nueva cabaña.
- **DELETE `/api/lodges`** → Elimina todas las cabañas.
- **GET `/api/lodges/:id`** → Obtiene una cabaña por ID.
- **PUT `/api/lodges/:id`** → Actualiza una cabaña por ID.
- **DELETE `/api/lodges/:id`** → Elimina una cabaña por ID.
- **PATCH `/api/lodges/:id`** → Cambia la disponibilidad de una cabaña.

### Reservas (`/api/reservations`)
- **GET `/api/reservations`** → Obtiene todas las reservas con filtros y ordenamiento.
- **POST `/api/reservations`** → Crea una nueva reserva (se envía un email de confirmación con **Nodemailer**).
- **DELETE `/api/reservations`** → Elimina todas las reservas.
- **GET `/api/reservations/:id`** → Obtiene una reserva por ID.
- **DELETE `/api/reservations/:id`** → Elimina una reserva por ID.
- **PATCH `/api/reservations/:id`** → Cambia el estado de pago de una reserva.
- **PUT `/api/reservations/user/:id`** → Actualiza la información de usuario de una reserva.
- **PUT `/api/reservations/lodge/:id`** → Modifica la reserva cambiando la cabaña y fechas.

### Registros (`/api/records`)
- **GET `/api/records`** → Obtiene todos los registros de pagos confirmados.
- **DELETE `/api/records`** → Elimina todos los registros.
- **DELETE `/api/records/:id`** → Elimina un registro por ID.

## Documentación con Swagger
El proyecto incluye documentación de la API con **Swagger**. Para acceder:
- **URL:** `http://localhost:8080/api/docs`

## Manejo de Errores
- **400 Bad Request** → Cuando faltan parámetros obligatorios o hay datos incorrectos.
- **404 Not Found** → Cuando una cabaña, reserva o registro no existe.
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

## Servidor en Render
https://backend-sistema-de-reservas.onrender.com/
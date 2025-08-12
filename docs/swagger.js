const express = require ("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
app.use("/", swaggerUi.serve, swaggerUi.setup(require("./swagger.json")));

module.exports = app;
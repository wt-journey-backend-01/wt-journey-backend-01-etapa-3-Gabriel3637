const express = require ("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerJsDocs = require("swagger-jsdoc");
const path = require("path")

const options = {
    definition: {
        openapi: "3.1.1",
        info: {
            title: "API para o Departamento de Polícia",
            summary: "API para gerenciar casos e agentes policiais",
            description: "Essa API permite o gerenciamento de casos policiais e agentes, incluindo operações CRUD para ambos.",
            termsOfService: "http://localhost:3000/terms/",
            contact: {
                name: "Gabriel",
                email: "gabriellvbs14@gmail.com"
            },
            license: {
                name: "MIT"
            },
            version: "1.0.0"
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Ambiente de desenvolvimento"
            }
        ]
    },
    apis: [path.join(__dirname, "../routes/*.js")]

}

const spec = swaggerJsDocs(options);

app.use("/", swaggerUi.serve, swaggerUi.setup(spec));



module.exports = app;
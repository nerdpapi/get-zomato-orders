// src/swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Zomato Orders API",
      version: "1.0.0",
      description: "API docs for the Zomato Orders pagination project",
    },
    servers: [
      { url: "http://localhost:8080", description: "Local" },
      { url: "https://get-zomato-orders.onrender.com", description: "Render" },
    ],
  },
  apis: ["src/index.js"],
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // optional: expose raw JSON at /api-docs.json
  app.get("/api-docs.json", (req, res) => res.json(swaggerSpec));
}

module.exports = setupSwagger;

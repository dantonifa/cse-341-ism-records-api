require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const initDb = require("./config/db");
const recordsRoutes = require("./routes/records");

// --- SWAGGER DOCUMENTATION CONFIGURATION ---
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Instituto Privado Salvador Moncada API",
      version: "1.0.0",
      description:
        "API for managing student records and academic grades (CRUD operations)",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development Server",
      },
    ],
  },
  // Scans your routes folder and specific records file for documentation specs
  apis: ["./routes/*.js", "./routes/records.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// --------------------------------------------

// Standard Express Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Serves HTML/CSS/JS frontend files

// Mount core application routers
app.use("/records", recordsRoutes);

// Define operational Port environment
const PORT = process.env.PORT || 3000;

// Initialize Database connection and launch local runtime listener
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`MongoDB connected successfully`);
      console.log(
        `Swagger documentation live at http://localhost:3000/api-docs`,
      );
    });
  })
  .catch((err) => {
    console.error(
      "Failed to start server due to database connection error:",
      err.message,
    );
  });

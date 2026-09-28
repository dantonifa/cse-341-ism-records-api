require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const config = require("./config");

const app = express();

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Connect to DB
connectDB();

// Routes
const homeRoutes = require("./routes/index");
const recordsRoutes = require("./routes/records");

app.use("/", homeRoutes);
app.use("/records", recordsRoutes);

app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
});

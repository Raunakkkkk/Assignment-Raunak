const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.path} - Endpoint hit`
  );
  next();
});

// Routes
app.use(routes);
app.use(express.json());


// Health
app.get("/health", (req, res) => {
  console.log("GET /health endpoint called");
  res
    .status(200)
    .json({
      success: true,
      message: "Server is running",
      timestamp: new Date().toISOString(),
    });
});

// 404 handler
app.use("*", (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res
    .status(404)
    .json({
      success: false,
      error: "Not found",
      message: `Route ${req.method} ${req.originalUrl} not found`,
    });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error handler:", error);
  res
    .status(500)
    .json({
      success: false,
      error: "Internal server error",
      message: "Something went wrong on the server",
    });
});

module.exports = app;

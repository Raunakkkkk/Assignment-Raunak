const express = require("express");
const app = require("./app");
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  console.log(`Server started at: ${new Date().toISOString()}`);
  console.log("Available endpoints:");
  console.log("  POST /precall - Get dummy patient data");
  console.log("  POST /getPatient - Get detailed patient info by medicalID");
  console.log("  POST /postcall - Save call summary");
  console.log("  GET /logs - Get all call logs");
  console.log("  GET /health - Health check");
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});

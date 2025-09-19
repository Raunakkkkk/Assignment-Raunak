const express = require("express");
const { precall, getPatient } = require("../controllers/patientController");
const { postcall, logs } = require("../controllers/callController");

const router = express.Router();

router.post("/precall", precall);
router.post("/getPatient", getPatient);
router.post("/postcall", postcall);
router.get("/logs", logs);

module.exports = router;

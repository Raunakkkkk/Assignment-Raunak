const {
  getRandomPatient,
  findPatientByMedicalID,
} = require("../data/patients");

// POST /precall
function precall(req, res) {
  try {
    console.log("POST /precall endpoint called");

    // Get random patient data
    const randomPatient = getRandomPatient();

    const responseData = {
      call: {
        dynamic_variables: {
          // Only name, id, and age

          // medicalID: randomPatient.medicalID,
          name: randomPatient.name,
          age: randomPatient.age,
          lastVisit:randomPatient.lastVisit,
        },
      },
    };

    console.log(`Returning precall data for patient: ${randomPatient.name}`);
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error in /precall endpoint:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: "Failed to retrieve precall data",
    });
  }
}

// post /getPatient
function getPatient(req, res) {
  try {
    console.log("POST /function-call endpoint called");
     console.log(req.body);



    const { medicalID } = req.body;
    if (!medicalID) {
      console.log("Missing medicalID in arguments");
      return res.status(400).json({
        error: "medicalID is required in arguments",
      });
    }

    const patient = findPatientByMedicalID(medicalID);
    if (!patient) {
      console.log(`Patient not found for medicalID: ${medicalID}`);
      return res.status(404).json({ error: "Patient not found" });
    }

    const detailedPatientInfo = {
      medicalID: patient.medicalID,
      name: patient.name,
      age: patient.age,
      condition: patient.condition,
      medications: patient.medications,
      lastVisit: patient.lastVisit,
      allergies: patient.allergies,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
    };

    console.log(`Returning detailed info for patient: ${patient.name}`);
    return res.json(detailedPatientInfo);
  } catch (error) {
    console.error("Error in /function-call endpoint:", error);
    res.status(500).json({
      error: "Failed to retrieve patient data",
    });
  }
}

module.exports = { precall, getPatient };

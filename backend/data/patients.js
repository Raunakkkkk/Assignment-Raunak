// Fake patient database with sample data
const patientDatabase = [
  {
    medicalID: "PAT001",
    name: "John Smith",
    age: 45,
    lastVisit: "2024-01-15",
    allergies: ["Penicillin", "Shellfish"],
    condition: "Hypertension",
    medications: ["Lisinopril 10mg", "Metformin 500mg"],
    phone: "(555) 123-4567",
    email: "john.smith@email.com",
    address: "123 Main St, Anytown, USA",
  },
  {
    medicalID: "PAT002",
    name: "Sarah Johnson",
    age: 32,
    lastVisit: "2024-02-20",
    allergies: ["Latex"],
    condition: "Diabetes Type 2",
    medications: ["Insulin", "Metformin 1000mg"],
    phone: "(555) 987-6543",
    email: "sarah.johnson@email.com",
    address: "456 Oak Ave, Springfield, USA",
  },
  {
    medicalID: "PAT003",
    name: "Michael Davis",
    age: 67,
    lastVisit: "2024-01-30",
    allergies: ["None known"],
    condition: "Arthritis",
    medications: ["Ibuprofen 400mg", "Glucosamine"],
    phone: "(555) 456-7890",
    email: "michael.davis@email.com",
    address: "789 Pine St, Riverside, USA",
  },
];

function getRandomPatient() {
  const randomIndex = Math.floor(Math.random() * patientDatabase.length);
  return patientDatabase[randomIndex];
}

function findPatientByMedicalID(medicalID) {
  return patientDatabase.find((patient) => patient.medicalID === medicalID);
}

module.exports = { patientDatabase, getRandomPatient, findPatientByMedicalID };

import React, { useState } from "react";
import mqtt from "mqtt";
import './index.css';

const rooms = [
  { id: 1, number: "101", patients: [
      { name: "Max", medications: [{name: "Paracetamol", quantity: 3, dosage: "50mg", frequency: "2x daily"},
        {name: "Cocaine", quantity: 2, dosage: "50mg", frequency: "2x daily"}
      ] }
    ]
  },
  { id: 2, number: "102", patients: [
      { name: "Juan", medications: [{name: "Cocaine", quantity: 0, dosage: "50mg", frequency: "2x daily"}] }
    ]
  },
  { id: 3, number: "103", patients: [
      { name: "Bernhard", medications: [{name: "Ibuprofen", quantity: 0, dosage: "50mg", frequency: "2x daily"}] }
    ]
  },
  { id: 4, number: "104", patients: [
      { name: "Adam", medications: [{name: "Paracetamol", quantity: 0, dosage: "50mg", frequency: "2x daily"}] }
    ]
  }
];

const RetirementHome = () => {
  const [expandedRoom, setExpandedRoom] = useState(null);
  const [expandedPatient, setExpandedPatient] = useState(null);
  const [medications, setMedications] = useState(rooms);

  const handleEditClick = (roomId) => {
    setExpandedRoom(expandedRoom === roomId ? null : roomId);
  };

  const handlePatientClick = (patientIndex) => {
    setExpandedPatient(expandedPatient === patientIndex ? null : patientIndex);
  };

  const handleMedicationChange = (roomIndex, patientIndex, medIndex, value) => {
    const updatedMedications = [...medications];
    updatedMedications[roomIndex].patients[patientIndex].medications[medIndex] = value;
    setMedications(updatedMedications);
  };

  const handleAddMedication = (roomIndex, patientIndex) => {
    const updatedMedications = [...medications];
    updatedMedications[roomIndex].patients[patientIndex].medications.push({
      name: "",
      quantity: "",
      dosage: "",
    });
    setMedications(updatedMedications);
  };
  

  const handleSaveMedications = () => {
    // Save medications logic here
    console.log("Medications saved:", medications);

    const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt', {
      connectTimeout: 60 * 1000, // 60 seconds
      reconnectPeriod: 1000, // Reconnect every 1 second
    });
    client.publish('retirementHome/medications', JSON.stringify(medications), () => {
      console.log('Medications data sent via MQTT');
      client.end();
    });
  };

  //ws://test.mosquitto.org:8081/mqtt'

  const handleSendRooms = () => {
    console.log("Sent information to robot:", rooms);
    const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt', {
      connectTimeout: 60 * 1000, // 60 seconds
      reconnectPeriod: 1000, // Reconnect every 1 second
    });
    client.publish('retirementHome/rooms', JSON.stringify(rooms), () => {
      console.log('Rooms data sent via MQTT');
      client.end();
    });
  };

  const handlePatientNameChange = (roomIndex, patientIndex, value) => {
    const updatedMedications = [...medications];
    updatedMedications[roomIndex].patients[patientIndex].name = value;
    setMedications(updatedMedications);
  };

  const handleAddPatient = (roomIndex) => {
    const updatedMedications = [...medications];
    updatedMedications[roomIndex].patients.push({ name: "", medications: [""] });
    setMedications(updatedMedications);
  };

  const handleDeletePatient = (roomIndex, patientIndex) => {
    const updatedMedications = [...medications];
    updatedMedications[roomIndex].patients.splice(patientIndex, 1);
    setMedications(updatedMedications);
  };

  const handleDeleteMedication = (roomIndex, patientIndex, medIndex) => {
    const updatedMedications = [...medications];
    updatedMedications[roomIndex].patients[patientIndex].medications.splice(medIndex, 1);
    setMedications(updatedMedications);
  };

  /*const handleDeleteMedication = (roomIndex, patientIndex, medicationIndex) => {
    const updatedMedications = [...medications];
    updatedMedications[roomIndex].patients[patientIndex].medications.splice(medicationIndex, 1);
    setMedications(updatedMedications);
  };*/

  const [isBlackBackground, setIsBlackBackground] = useState(false);

  const toggleBackgroundColor = () => {
    setIsBlackBackground(!isBlackBackground);
  };

  

  return (
    <div
      className={`flex justify-center items-center min-h-screen ${
        isBlackBackground ? "bg-black text-white" : "bg-gray-700 text-black"
      }`}
    >
      <div
      className={`w-[1000px] ${
        isBlackBackground ? "bg-black text-white" : "bg-blue-200 text-black"
      } p-20 rounded-lg shadow-lg`}
    >
        <h1 className="text-center text-xl font-bold mb-4">Retirement home</h1>
        <div className="space-y-4">
          {medications.map((room, roomIndex) => (
            <div
              key={room.id}
              className={`flex flex-col items-start justify-between bg-gray-600 p-4 rounded-lg text-white expandable ${expandedRoom === room.id ? 'expanded' : 'collapsed'}`}
            >
              <div className="flex justify-between w-full">
                <span className="font-semibold">Room {room.number}</span>
                <button
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    isBlackBackground
                      ? "bg-yellow-400 text-black hover:bg-yellow-500"
                      : "bg-blue-400 text-white hover:bg-blue-500"
                  }`}
                  onClick={() => handleEditClick(room.id)}
                >
                  {expandedRoom === room.id ? 'Close' : 'Edit'}
                </button>
              </div>
              {expandedRoom === room.id && (
                <div className="mt-4 w-full">
                  <label className="block text-sm font-medium text-gray-300">Patients:</label>
                  <div className="space-y-2">
                    {room.patients.map((patient, patientIndex) => (
                      <div key={patientIndex} className="flex justify-between items-center">
                        <input
                          type="text"
                          value={patient.name}
                          onChange={(e) => handlePatientNameChange(roomIndex, patientIndex, e.target.value)}
                          className="bg-gray-700 border border-gray-500 rounded-md text-white px-2 py-1"
                        />
                        <button
                          className={`px-4 py-2 rounded-lg font-semibold ${
                            isBlackBackground
                              ? "bg-yellow-400 text-black hover:bg-yellow-500"
                              : "bg-blue-400 text-white hover:bg-blue-500"
                          }`}
                          onClick={() => handlePatientClick(`${roomIndex}-${patientIndex}`)}
                        >
                          {expandedPatient === `${roomIndex}-${patientIndex}` ? 'Hide Medications' : 'Show Medications'}
                        </button>
                        <button
                          className={`px-4 py-2 rounded-lg font-semibold ${
                            isBlackBackground
                              ? "bg-yellow-400 text-black hover:bg-yellow-500"
                              : "bg-red-400 px-4 py-2 rounded-lg text-white font-semibold hover:bg-red-500"
                          }`}
                          onClick={() => handleDeletePatient(roomIndex, patientIndex)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                  {expandedPatient && expandedPatient.startsWith(`${roomIndex}-`) && (
                    <div className="mt-4 w-full">
                      <h2 className="text-lg font-semibold text-gray-300">Medications:</h2>
                      <ul className="list-disc list-inside">
                        {room.patients[expandedPatient.split('-')[1]].medications.map((med, medIndex) => (
                          <li key={medIndex} className="text-gray-300">
                            <div className="flex space-x-2 mb-2">
                              <input
                                type="text"
                                placeholder="Name"
                                value={med.name || ""}
                                onChange={(e) =>
                                  handleMedicationChange(roomIndex, expandedPatient.split('-')[1], medIndex, { ...med, name: e.target.value })
                                }
                                className="bg-gray-700 border border-gray-500 rounded-md text-white px-2 py-1 w-1/3"
                              />
                              <input
                                type="number"
                                placeholder="Quantity"
                                value={med.quantity || ""}
                                onChange={(e) =>
                                  handleMedicationChange(roomIndex, expandedPatient.split('-')[1], medIndex, { ...med, quantity: e.target.value })
                                }
                                className="bg-gray-700 border border-gray-500 rounded-md text-white px-2 py-1 w-1/3"
                              />
                              <input
                                type="text"
                                placeholder="Dosage"
                                value={med.dosage || ""}
                                onChange={(e) =>
                                  handleMedicationChange(roomIndex, expandedPatient.split('-')[1], medIndex, { ...med, dosage: e.target.value })
                                }
                                className="bg-gray-700 border border-gray-500 rounded-md text-white px-2 py-1 w-1/3"
                              />
                              <input
                                type="text"
                                placeholder="Frequency"
                                value={med.frequency || ""}
                                onChange={(e) =>
                                  handleMedicationChange(roomIndex, expandedPatient.split('-')[1], medIndex, { ...med, frequency: e.target.value })
                                }
                                className="bg-gray-700 border border-gray-500 rounded-md text-white px-2 py-1 w-1/3"
                              />

                              <button
                                        className={`px-4 py-2 rounded-lg font-semibold ${
                                          isBlackBackground
                                            ? "bg-yellow-400 text-black hover:bg-yellow-500"
                                            : "bg-red-400 px-4 py-2 rounded-lg text-white font-semibold hover:bg-red-500"
                                        }`}
                                        onClick={() => handleDeleteMedication(roomIndex, expandedPatient.split('-')[1], medIndex)}
                                      >
                                        Delete
                                      </button>
                            </div>

                          </li>
                        ))}
                      </ul>
                      <button
                        className={`px-4 py-2 rounded-lg font-semibold ${
                          isBlackBackground
                            ? "bg-yellow-400 text-black hover:bg-yellow-500 mt-2"
                            : "bg-blue-400 px-4 py-2 rounded-lg text-white font-semibold hover:bg-blue-500 mt-2"
                        }`}
                        onClick={() => handleAddMedication(roomIndex, expandedPatient.split('-')[1])}
                      >
                        Add Medication
                      </button>
                      <button
                        className={`px-4 py-2 rounded-lg font-semibold ${
                          isBlackBackground
                            ? "bg-yellow-400 text-black hover:bg-yellow-500 mt-2 ml-2"
                            : "bg-green-400 px-4 py-2 rounded-lg text-white font-semibold hover:bg-green-500 mt-2 ml-2"
                        }`}
                        onClick={handleSaveMedications}
                      >
                        Save Medications
                      </button>
                    </div>
                  )}
                  <button
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      isBlackBackground
                        ? "bg-yellow-400 text-black hover:bg-yellow-500 mt-2"
                        : "bg-blue-400 px-4 py-2 rounded-lg text-white font-semibold hover:bg-blue-500 mt-2"
                    }`}
                    onClick={() => handleAddPatient(roomIndex)}
                  >
                    Add Patient
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          className={`px-4 py-2 rounded-lg font-semibold ${
            isBlackBackground
              ? "bg-yellow-400 text-black hover:bg-yellow-500 mt-4"
              : "bg-green-400 px-4 py-2 rounded-lg text-white font-semibold hover:bg-green-500 mt-4"
          }`}
          onClick={handleSendRooms}
        >
          Send Robot
        </button>
      </div>
      <div className="fixed bottom-4 w-full flex justify-center">
      <button
        className={`px-4 py-2 rounded-lg font-semibold ${
          isBlackBackground
            ? "bg-yellow-400 text-black hover:bg-yellow-500"
            : "bg-yellow-500 px-6 py-3 rounded-lg text-black font-semibold hover:bg-yellow-600"
        }`}
        onClick={toggleBackgroundColor}
      >
        Color impaired version
      </button>
    </div>
    </div>
  );
};

export default RetirementHome;

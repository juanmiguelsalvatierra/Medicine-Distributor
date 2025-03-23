import React, { useState } from "react";
import mqtt from "mqtt";
import './index.css';

const rooms = [
  { id: 1, number: "101", patients: [
      { name: "Lorem", medications: ["Med1", "Med2", "Med3"] },
      { name: "Ipsum", medications: ["Med4", "Med5"] },
      { name: "Dolor", medications: ["Med6", "Med7", "Med8"] }
    ]
  },
  { id: 2, number: "102", patients: [
      { name: "Amet", medications: ["Med9", "Med10"] },
      { name: "Kasd", medications: ["Med11", "Med12"] },
      { name: "Sanctus", medications: ["Med13"] }
    ]
  },
  { id: 3, number: "103", patients: [
      { name: "Lorem", medications: ["Med14", "Med15", "Med16"] },
      { name: "Ipsum", medications: ["Med17", "Med18"] },
      { name: "Dolor", medications: ["Med19", "Med20", "Med21"] }
    ]
  },
  { id: 4, number: "104", patients: [
      { name: "Lorem", medications: ["Med22"] },
      { name: "Ipsum", medications: ["Med23", "Med24"] },
      { name: "Dolor", medications: ["Med25", "Med26", "Med27"] }
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
    updatedMedications[roomIndex].patients[patientIndex].medications.push("");
    setMedications(updatedMedications);
  };

  const handleSaveMedications = () => {
    // Save medications logic here
    console.log("Medications saved:", medications);

    const client = mqtt.connect('ws://test.mosquitto.org:8081/mqtt', {
      connectTimeout: 60 * 1000, // 60 seconds
      reconnectPeriod: 1000, // Reconnect every 1 second
    });
    client.publish('retirementHome/medications', JSON.stringify(medications), () => {
      console.log('Medications data sent via MQTT');
      client.end();
    });
  };

  const handleSendRooms = () => {
    const client = mqtt.connect('ws://test.mosquitto.org:8081/mqtt', {
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-700">
      <div className="w-[1000px] bg-blue-200 p-20 rounded-lg shadow-lg">
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
                  className="bg-blue-400 px-4 py-2 rounded-lg text-white font-semibold hover:bg-blue-500"
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
                          className="bg-blue-400 px-4 py-2 rounded-lg text-white font-semibold hover:bg-blue-500"
                          onClick={() => handlePatientClick(`${roomIndex}-${patientIndex}`)}
                        >
                          {expandedPatient === `${roomIndex}-${patientIndex}` ? 'Hide Medications' : 'Show Medications'}
                        </button>
                        <button
                          className="bg-red-400 px-4 py-2 rounded-lg text-white font-semibold hover:bg-red-500"
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
                            <input
                              type="text"
                              value={med}
                              onChange={(e) => handleMedicationChange(roomIndex, expandedPatient.split('-')[1], medIndex, e.target.value)}
                              className="bg-gray-700 border border-gray-500 rounded-md text-white px-2 py-1"
                            />
                          </li>
                        ))}
                      </ul>
                      <button
                        className="bg-blue-400 px-4 py-2 rounded-lg text-white font-semibold hover:bg-blue-500 mt-2"
                        onClick={() => handleAddMedication(roomIndex, expandedPatient.split('-')[1])}
                      >
                        Add Medication
                      </button>
                      <button
                        className="bg-green-400 px-4 py-2 rounded-lg text-white font-semibold hover:bg-green-500 mt-2 ml-2"
                        onClick={handleSaveMedications}
                      >
                        Save Medications
                      </button>
                    </div>
                  )}
                  <button
                    className="bg-green-400 px-4 py-2 rounded-lg text-white font-semibold hover:bg-green-500 mt-2"
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
          className="bg-red-400 px-4 py-2 rounded-lg text-white font-semibold hover:bg-red-500 mt-4"
          onClick={handleSendRooms}
        >
          Send Rooms Data
        </button>
      </div>
    </div>
  );
};

export default RetirementHome;

import React from "react";
import './index.css';

const rooms = [
  { id: 1, number: "101", patients: "Lorem, Ipsum, Dolor" },
  { id: 2, number: "102", patients: "Amet, Kasd, Sanctus" },
  { id: 3, number: "101", patients: "Lorem, Ipsum, Dolor" },
  { id: 4, number: "101", patients: "Lorem, Ipsum, Dolor" },
];

const RetirementHome = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-700">
      <div className="w-[800px] bg-blue-200 p-6 rounded-lg shadow-lg">
        <h1 className="text-center text-xl font-bold mb-4">Retirement home</h1>
        <div className="space-y-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="flex items-center justify-between bg-gray-600 p-4 rounded-lg text-white"
            >
              <span className="font-semibold">Room {room.number}</span>
              <span className="bg-gray-500 px-3 py-1 rounded-lg text-sm">Patients:</span>
              <span className="text-gray-300">{room.patients}</span>
              <button className="bg-blue-400 px-4 py-2 rounded-lg text-white font-semibold hover:bg-blue-500">
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default RetirementHome;

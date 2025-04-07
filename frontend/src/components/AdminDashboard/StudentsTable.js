import React from "react";

const StudentsTable = ({ students }) => {
  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr>
          <th className="border border-gray-300 px-4 py-2">Name</th>
          <th className="border border-gray-300 px-4 py-2">Email</th>
          <th className="border border-gray-300 px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student.id}>
            <td className="border border-gray-300 px-4 py-2">{student.name}</td>
            <td className="border border-gray-300 px-4 py-2">{student.email}</td>
            <td className="border border-gray-300 px-4 py-2">
              <button className="text-blue-500">Edit</button>
              <button className="text-red-500 ml-2">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudentsTable;

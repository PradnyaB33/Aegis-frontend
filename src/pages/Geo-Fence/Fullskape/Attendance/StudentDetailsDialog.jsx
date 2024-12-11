// import React from "react";

// const StudentDetailsDialog = ({ student, onClose }) => {
//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white p-6 rounded shadow-md w-96">
//         <h2 className="text-lg font-bold mb-4">Student Details</h2>
//         <p><strong>ID:</strong> {student.id}</p>
//         <p><strong>Name:</strong> {student.name}</p>
//         <p><strong>Class:</strong> {student.class}</p>
//         <h3 className="mt-4 font-semibold">Attendance Records:</h3>
//         {student.attendance.length > 0 ? (
//           <ul className="list-disc ml-6">
//             {student.attendance.map((record) => (
//               <li key={record._id}>
//                 <strong>{record.type}:</strong> {new Date(record.timestamp).toLocaleString()}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No attendance records available.</p>
//         )}
//         <button
//           className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
//           onClick={onClose}
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// export default StudentDetailsDialog;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AttendanceTable from "./Attendance/AttendanceTable";
import StudentDetailsDialog from "./Attendance/StudentDetailsDialog";

const FullskapeAttendance = () => {
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null); // Dialog control
  const { organisationId } = useParams();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/fullskape-attendance/${organisationId}`
        );
        const students = response.data.data.map((student) => ({
          id: student.PRN,
          division: student.division,
          name: student.name,
          class: student.class,
          attendance: student.attendance,
        }));
        setStudentData(students);
      } catch (error) {
        console.error("Error fetching student data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [organisationId]);

  const handleRowClick = (student) => {
    setSelectedStudent(student);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-6 py-6"> {/* Add padding */}
      <h1 className="text-2xl font-bold text-center  text-blue-600">
        Student Attendance {/* Highlight the headline */}
      </h1>
      <AttendanceTable studentList={studentData} onRowClick={handleRowClick} />
      {selectedStudent && (
        <StudentDetailsDialog
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
};

export default FullskapeAttendance;

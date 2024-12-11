import React, { useState, useEffect } from "react";
import axios from "axios";
import useGetStudents from "./hooks/useGetStudents";
import useAuthToken from "../../../hooks/Token/useAuth";
import { FaEdit, FaTrash } from "react-icons/fa";


const ConfirmationDialog = ({ open, onClose, onConfirm, message }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded shadow-lg p-4 w-80">
        <h2 className="text-lg font-semibold mb-4">Confirm Action</h2>
        <p className="text-sm mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const FullskapeTableComponent = ({ setValue, watch, addedEmployee = [], zoneId }) => {
  const { students } = useGetStudents(zoneId);
  const [filters, setFilters] = useState({ name: "", class: "", division: "" });
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const authToken = useAuthToken();

  useEffect(() => {
    if (!students) return;

    const filtered = students.filter((student) => {
      return (
        (filters.name === "" || student.name?.toLowerCase().includes(filters.name.toLowerCase())) &&
        (filters.class === "" || student.class?.toLowerCase().includes(filters.class.toLowerCase())) &&
        (filters.division === "" || student.division?.toLowerCase().includes(filters.division.toLowerCase()))
      );
    });

    setFilteredStudents(filtered);
  }, [students, filters]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (student) => {
    setEditingStudent(student); // Open edit mode for the student
    setPreviewImage(student.imageUrl || null); // Show existing image
  };

  const uploadStudentImage = async (file) => {
    if (!file) {
      throw new Error("No file provided for upload.");
    }

    try {
      const { data: { url } } = await axios.get(
        `${process.env.REACT_APP_API}/route/s3createFile/StudentImage`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
        }
      );

      await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      return url.split("?")[0];
    } catch (error) {
      console.error("Image upload failed:", error.message);
      throw new Error("Failed to upload the image.");
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    setPreviewImage(URL.createObjectURL(file));
    try {
      const uploadedImageUrl = await uploadStudentImage(file);
      setEditingStudent((prev) => ({ ...prev, imageUrl: uploadedImageUrl }));
    } catch (error) {
      console.error("Image upload failed:", error.message);
    }
  };

  const handleUpdate = async () => {
    if (!editingStudent) return;

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/route/fullskape/students/${zoneId}/${editingStudent._id}`,
        editingStudent
      );
      console.error(response);

      // Update state directly
      setFilteredStudents((prev) =>
        prev.map((student) =>
          student._id === editingStudent._id ? { ...student, ...editingStudent } : student
        )
      );

      setEditingStudent(null); // Exit edit mode
      setPreviewImage(null);
    } catch (error) {
      console.error(error);
    }
  };

  const confirmDelete = (studentId) => {
    setStudentToDelete(studentId);
    setDialogOpen(true);
  };

  const handleDelete = async (studentId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API}/route/fullskape/students/${zoneId}/${studentId}`
      );
      setFilteredStudents((prev) =>
        prev.filter((student) => student._id !== studentId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={() => handleDelete(studentToDelete)}
        message="Are you sure you want to delete this student?"
      />
      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          name="name"
          placeholder="Filter by name"
          value={filters.name}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="class"
          placeholder="Filter by class"
          value={filters.class}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="division"
          placeholder="Filter by division"
          value={filters.division}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />
      </div>

      {/* Table */}
      <table className="min-w-full bg-white text-left text-sm font-light">
        <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
          <tr className="font-semibold">
          <th>Image</th>
            <th>Name</th>
            <th>Class</th>
            <th>Parent Email</th>
            <th>Parent Phone</th>
            <th>Student Phone</th>
            <th>Division</th>
            <th>PRN</th>
            
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) =>
            editingStudent?._id === student._id ? (
              <tr key={student._id}>
                <td>
                    {previewImage && (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <input type="file" onChange={handleImageChange} />
                </td>
                <td><input type="text" value={editingStudent.name} onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })} /></td>
                <td><input type="text" value={editingStudent.class} onChange={(e) => setEditingStudent({ ...editingStudent, class: e.target.value })} /></td>
                <td><input type="text" value={editingStudent.parentEmail} onChange={(e) => setEditingStudent({ ...editingStudent, parentEmail: e.target.value })} /></td>
                <td><input type="text" value={editingStudent.parentPhoneNumber} onChange={(e) => setEditingStudent({ ...editingStudent, parentPhoneNumber: e.target.value })} /></td>
                <td><input type="text" value={editingStudent.studentPhoneNumber} onChange={(e) => setEditingStudent({ ...editingStudent, studentPhoneNumber: e.target.value })} /></td>
                <td><input type="text" value={editingStudent.division} onChange={(e) => setEditingStudent({ ...editingStudent, division: e.target.value })} /></td>
                <td><input type="text" value={editingStudent.PRN} onChange={(e) => setEditingStudent({ ...editingStudent, PRN: e.target.value })} /></td>
                

                <td>
                  <button onClick={handleUpdate}>Save</button>
                  <button onClick={() => setEditingStudent(null)}>Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={student._id}>
                 <td>
                    {student.imageUrl ? (
                      <img
                        src={student.imageUrl}
                        alt="Student"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      "No Image"
                    )}
                </td>
                <td>{student.name}</td>
                <td>{student.class}</td>
                <td>{student.parentEmail}</td>
                <td>{student.parentPhoneNumber}</td>
                <td>{student.studentPhoneNumber}</td>
                <td>{student.division}</td>
                <td>{student.PRN}</td>
               

                <td>
                <button onClick={() => handleEdit(student)}>
                  <FaEdit className="text-blue-500 hover:text-blue-600" />
                </button>
                <button onClick={() => confirmDelete(student._id)}>
                  <FaTrash className="text-red-500 hover:text-red-600" />
                </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FullskapeTableComponent;

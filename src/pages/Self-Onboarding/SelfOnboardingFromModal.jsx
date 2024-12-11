import {
  Modal,
  Button,
  TextField,
  IconButton,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { AddCircle, Close } from "@mui/icons-material";
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
// eslint-disable-next-line no-unused-vars
import { Edit, Delete } from "@mui/icons-material";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { useParams } from "react-router-dom";

const SelfOnboardingFromModal = ({ open, handleClose }) => {
  const { organisationId } = useParams();
  console.log("orgID", organisationId);

  const queryClient = useQueryClient();
  const [employees, setEmployees] = useState([]);
  const [submittedForms, setSubmittedForms] = useState([]);
  const [selectedForms, setSelectedForms] = useState([]);
  const [showButtons, setShowButtons] = useState(false);
  // const [employeeCount, setEmployeeCount] = useState(1);
  const [employeeCount, setEmployeeCount] = useState("");
  const [currentEmployeeIndex, setCurrentEmployeeIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState("");

  const [formErrors, setFormErrors] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    companyemail: "",
  });

  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

  const [showSubmittedForms, setShowSubmittedForms] = useState(false); // New state for toggling submitted forms view

  // Function to toggle the submitted forms view
  const toggleShowSubmittedForms = () => {
    setShowSubmittedForms((prev) => !prev);
    if (showSubmittedForms) {
      // If we're hiding submitted forms, reset selected forms
      setSelectedForms([]);
    }
  };

  // Fetch submitted employees using react-query
  // eslint-disable-next-line no-unused-vars
  const { data: fetchedEmployees, isLoading: isFetching } = useQuery(
    "employees",
    async () => {
      const response = await axios.get(
        // `${process.env.REACT_APP_API}/route/selfOnboarding`
        `${process.env.REACT_APP_API}/route/employee`
      );
      return response.data;
    },
    {
      enabled: open, // Only fetch when modal is open
      onSuccess: (data) => {
        setSubmittedForms(data); // Set the fetched data to submittedForms
      },
      onError: (error) => {
        console.error("Error fetching submitted employees:", error);
        toast.error(
          "Could not fetch submitted employees. Please try again later."
        );
        // alert("Could not fetch submitted employees. Please try again later.");
      },
    }
  );

  // Mutation for submitting employees
  const mutationSubmit = useMutation(
    async (employeeData) => {
      const response = await axios.post(
        // `${process.env.REACT_APP_API}/route/selfOnboarding/submit`,
        `${process.env.REACT_APP_API}/route/employee/submit`,
        employeeData
      );
      return response.data;
    },
    {
      onSuccess: (data) => {
        console.log("Employees submitted successfully:", data);
        toast.success(
          `Onboarding emails have been sent to: ${data?.employees
            ?.map((emp) => emp.email)
            .join(", ")}`
        );
        queryClient.invalidateQueries("employees"); // Invalidate employee query to refresh
        handleClose();
        setEmployees([]); // Reset fields
        setShowButtons(false);
      },
      onError: (error) => {
        console.error("Error submitting employee:", error);
        toast.error(
          "An error occurred while submitting the employees. Please try again."
        );
      },
    }
  );

  // const handleAlert = useContext(TestContext)
  // Mutation for updating employee
  const mutationUpdate = useMutation(
    async ({ id, data }) => {
      const response = await axios.put(
        // `${process.env.REACT_APP_API}/route/selfOnboarding/${id}`,
        `${process.env.REACT_APP_API}/route/employee/${id}`,
        data
      );
      return response.data;
    },
    {
      onSuccess: (data) => {
        console.log("Employee updated successfully:", data);
        toast.success("Employee updated successfully.");
        queryClient.invalidateQueries("employees");
        setEditMode(false);
        setEmployees([]);
        setEditIndex(null);
        setCurrentEmployeeIndex(0);
      },
      onError: (error) => {
        console.error("Error updating employee:", error);
        toast.error("Could not update employee data. Please try again.");
      },
    }
  );

  // Mutation for deleting an employee
  const mutationDelete = useMutation(
    async (id) => {
      const response = await axios.delete(
        // `${process.env.REACT_APP_API}/route/selfOnboarding/${id}`
        `${process.env.REACT_APP_API}/route/employee/${id}`
      );
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success("Employee deleted successfully.");
        queryClient.invalidateQueries("employees"); // Invalidate employee query to refresh
      },
      onError: (error) => {
        console.error("Error deleting employee:", error);
        toast.error("Could not delete employee. Please try again.");
      },
    }
  );

  const addEmployeeForm = () => {
    // Check if adding employees would exceed the limit
    if (employees.length >= 100) {
      setError("Cannot add more than 100 employees.");
      return;
    }

    // Calculate how many employees can be added without exceeding the limit
    const countToAdd = Math.min(employeeCount, 100 - employees.length);

    if (countToAdd > 0) {
      const newEmployees = Array.from({ length: countToAdd }, () => ({
        first_name: "",
        middle_name: "",
        last_name: "",
        phone_number: "",
        email: "",
        companyemail: "",
        organisationId,
      }));

      // Clear error since we are within limits
      setError("");
      // Update the employees state
      setEmployees((prev) => [...prev, ...newEmployees]);
      setShowButtons(true);

      // Update the current employee index to reflect the new count
      setCurrentEmployeeIndex(employees.length); // Set to the index of the newly added employee
    }
  };
  const handleEmployeeCountChange = (e) => {
    const value = Number(e.target.value);
    if (value < 0) {
      setEmployeeCount(1);
    } else if (value > 100) {
      setEmployeeCount(100);
      setError("Cannot add more than 100 employees.");
    } else {
      setEmployeeCount(value);
      setError(""); // Clear error if input is valid
    }
  };
  const validateFields = (index) => {
    const newErrors = { ...formErrors };
    const currentEmployee = employees[index];

    if (!currentEmployee.first_name) {
      newErrors.first_name = " Required";
    } else {
      newErrors.first_name = "";
    }

    if (!currentEmployee.last_name) {
      newErrors.last_name = "Required";
    } else {
      newErrors.last_name = "";
    }

    if (!currentEmployee.phone_number) {
      newErrors.phone_number = "Required";
    } else {
      newErrors.phone_number = "";
    }

    if (!currentEmployee.email) {
      newErrors.email = "Required";
    } else {
      newErrors.email = "";
    }

    if (!currentEmployee.companyemail) {
      newErrors.companyemail = "Required";
    } else {
      newErrors.companyemail = "";
    }

    setFormErrors(newErrors);
  };

  const handleChange = (index, field, value) => {
    const newEmployees = [...employees];
    newEmployees[index][field] = value; // Update the specific employee form
    setEmployees(newEmployees);
    console.log(`Updated ${field} for employee ${index + 1}: ${value}`);
    // validateFields(index); // Call validation after change

    // Validate based on the field
    let errorMessage = "";
    if (["first_name", "middle_name", "last_name"].includes(field)) {
      errorMessage = validateName(field, value);
    } else if (field === "phone_number") {
      errorMessage = validatePhoneNumber(value);
    } else if (["email", "companyemail"].includes(field)) {
      errorMessage = validateEmail(value);
    }

    // Update error state
    setFormErrors((prev) => ({
      ...prev,
      [field]: errorMessage,
    }));

    // Update the employees state
    setEmployees(newEmployees);
  };
  const validateName = (field, value) => {
    const namePattern = /^[A-Za-z\s]+$/;
    if (!value) {
      return "This field is required.";
    }
    if (!namePattern.test(value)) {
      return "Only characters allowed";
    }
    return "";
  };

  const validatePhoneNumber = (value) => {
    const phonePattern = /^[0-9]{10}$/;
    if (!value) {
      return "Phone number is required.";
    }
    if (!phonePattern.test(value)) {
      return "Phone Number must be exactly 10 digits..";
    }
    return "";
  };

  const validateEmail = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      return "Email is required.";
    }
    if (!emailPattern.test(value)) {
      return "Invalid email format.";
    }
    return "";
  };

  const handleSubmit = async () => {
    employees.forEach((_, index) => validateFields(index));

    // Check if there are any errors
    if (Object.values(formErrors).some((error) => error)) {
      toast.error("Please fix the errors in the form.");
      return;
    }
    const validEmployees = employees.filter(
      (emp) =>
        emp.first_name &&
        emp.last_name &&
        emp.phone_number &&
        emp.email &&
        emp.companyemail &&
        emp.organisationId
    );

    const employeesWithOrgId = validEmployees.map((emp) => ({
      ...emp,
      organizationId: organisationId, // Add the organisationId
    }));

    console.log("Submitting Employees:", employeesWithOrgId);
    if (validEmployees.length > 0) {
      // setLoading(true);
      mutationSubmit.mutate(employeesWithOrgId);
    } else {
      toast.error("Please fill in all required fields.");
      // setLoading(false);
    }
  };

  const handleEdit = (index) => {
    const employeeToEdit = submittedForms[index]; // Get the employee data
    setEmployees([employeeToEdit]); // Populate the form with submitted data
    setEditIndex(index);
    setEditMode(true);
  };

  const handleDelete = (index) => {
    const employeeId = submittedForms[index]._id; // Get the ID of the employee to delete
    mutationDelete.mutate(employeeId); // Call the delete mutation
  };

  const handleDone = () => {
    const currentEmployee = employees[0];
    const employeeId = submittedForms[editIndex]._id; // Get the ID of the employee being edited
    mutationUpdate.mutate({ id: employeeId, data: currentEmployee });
  };

  const handleSelect = (index) => {
    setSelectedForms((prev) => {
      const newSelection = [...prev];
      if (newSelection.includes(index)) {
        newSelection.splice(newSelection.indexOf(index), 1); // Deselect
      } else {
        newSelection.push(index); // Select
      }
      return newSelection;
    });
  };

  const handleSendLinks = async () => {
    // Create an array of employee objects to send
    const employeeData = selectedForms.map((index) => {
      const submittedForm = submittedForms[index];
      return {
        organizationId: submittedForm.organizationId,
        first_name: submittedForm.first_name,
        last_name: submittedForm.last_name,
        email: submittedForm.email,
        // profile: submittedForm.profile || [], // Include profile if necessary
      };
    });

    toast.success(
      `Sending onboarding links to: ${employeeData
        .map((emp) => emp.email)
        .join(", ")}`
    );

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/employee/resendEmails`,
        employeeData // Send the array of employee objects
      );
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error sending emails:", error);
      toast.error("Failed to send emails. Please try again.");
    }

    setSelectedForms([]);
  };

  const handleNext = () => {
    if (currentEmployeeIndex < employees.length - 1) {
      setCurrentEmployeeIndex(currentEmployeeIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentEmployeeIndex > 0) {
      setCurrentEmployeeIndex(currentEmployeeIndex - 1);
    }
  };
  // const employeeCountNumber = Math.max(1, Math.min(100, Number(employeeCount)));
  const removeEmployee = (index) => {
    setEmployees((prev) => {
      const updatedEmployees = prev.filter((_, i) => i !== index);
      // If the current index is greater than the removed index, decrement it
      if (currentEmployeeIndex > index) {
        setCurrentEmployeeIndex((prevIndex) => prevIndex - 1);
      } else if (currentEmployeeIndex === index) {
        // If the current employee is removed, reset to the first employee
        setCurrentEmployeeIndex(0);
      }
      return updatedEmployees;
    });
  };

  return (
    <Modal open={open} onClose={handleClose} className="mt-4 ">
      <div className="border-none gap-2 shadow-md outline-none h-auto max-h-[600px] overflow-auto rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:w-[550px] md:w-[400px] sm:w-fit w-[95%] z-10  bg-white flex flex-col ">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold"> Employee Self-Onboarding</h2>
            <IconButton
              onClick={handleClose}
              className="text-gray-950 hover:text-red-600"
            >
              <Close />
            </IconButton>
          </div>

          <TextField
            className="w-full mb-4"
            label="Number of Employees"
            type="number"
            // value={employeeCount}
            // onChange={(e) =>
            //   setEmployeeCount(
            //     Math.max(1, Math.min(100, Number(e.target.value)))
            //   )
            // }
            value={employeeCount}
            // onChange={(e) => setEmployeeCount(e.target.value)}
            onChange={handleEmployeeCountChange}
            inputProps={{ min: 1, max: 100 }}
          />
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex items-center mb-4">
            <IconButton onClick={addEmployeeForm} className="text-blue-500">
              <AddCircle className="text-blue-500" />
            </IconButton>
            {/* <span className="ml-2">Add Employee</span> */}
            <button
              onClick={addEmployeeForm}
              className="ml-2 text-black-500 bg-transparent border-none font-medium focus:outline-none hover:text-black-700 "
            >
              Add Employee
            </button>
          </div>  
          {employees.length > 0 && (
            <div className="mb-2 border space-y-3 p-2 rounded relative">
              <h3 className="flex justify-between text-lg font-semibold mb-2">
                {editMode
                  ? "Edit Employee"
                  : `Employee ${currentEmployeeIndex + 1} / ${
                      employees.length
                    }`}

                <IconButton
                  onClick={() => removeEmployee(currentEmployeeIndex)}
                  color="error"
                  aria-label="Remove Employee"
                  // disabled={editMode}
                >
                  <Close />
                </IconButton>
              </h3>

              <div className="flex space-x-2">
                {["first_name", "middle_name", "last_name"].map((field, i) => (
                  <TextField
                    key={field}
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    className="flex-1"
                    value={employees[currentEmployeeIndex][field]}
                    onChange={(e) =>
                      handleChange(currentEmployeeIndex, field, e.target.value)
                    }
                    required={field !== "middle_name"}
                    error={Boolean(formErrors[field])}
                    helperText={formErrors[field]}
                  />
                ))}
              </div>
              <div className="flex space-x-2 mt-5">
                {["phone_number", "email", "companyemail"].map((field) => (
                  <TextField
                    key={field}
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    className="flex-1"
                    value={employees[currentEmployeeIndex][field]}
                    onChange={(e) =>
                      handleChange(currentEmployeeIndex, field, e.target.value)
                    }
                    required
                    error={Boolean(formErrors[field])}
                    helperText={formErrors[field]}
                  />
                ))}
              </div>
            </div>
          )}
          {employees.length > 0 && (
            <div className="flex justify-between mb-4">
              <Button
                onClick={handleBack}
                variant="outlined"
                disabled={currentEmployeeIndex === 0}
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                variant="outlined"
                disabled={currentEmployeeIndex === employees.length - 1}
              >
                Next
              </Button>
            </div>
          )}
          {editMode ? (
            <div className="flex justify-between mb-4">
              <Button onClick={handleDone} variant="contained" color="primary">
                Save
              </Button>
              <Button
                onClick={() => setEditMode(false)}
                variant="outlined"
                color="secondary"
              >
                Cancel
              </Button>
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center h-32">
              <CircularProgress />
            </div>
          ) : (
            showButtons && (
              <div className="flex justify-between mb-4">
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  color="primary"
                  disabled={editMode}
                >
                  Submit
                </Button>
                <Button
                  onClick={handleClose}
                  variant="outlined"
                  color="secondary"
                >
                  Cancel
                </Button>
              </div>
            )
          )}

          <div className="mb-4">
            <Button
              onClick={toggleShowSubmittedForms}
              className="text-blue-500"
            >
              {showSubmittedForms
                ? "Back to Employee Form"
                : "Show Submitted Forms"}
            </Button>
          </div>
          {showSubmittedForms && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Submitted Forms:</h3>
              <div className="overflow-y-auto max-h-64">
                {submittedForms.map((form, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <Checkbox
                      checked={selectedForms.includes(index)}
                      onChange={() => handleSelect(index)}
                    />
                    <p className="flex-1">{`${form.first_name} ${form.last_name} - ${form.email}`}</p>
                    <Button onClick={() => handleEdit(index)} variant="text">
                      Edit
                    </Button>

                    <IconButton
                      onClick={() => handleDelete(index)}
                      color="error"
                      aria-label="Delete"
                    >
                      <Delete />
                    </IconButton>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleSendLinks}
                variant="contained"
                className="w-full"
                disabled={selectedForms.length === 0}
              >
                Send Selected Links
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SelfOnboardingFromModal;

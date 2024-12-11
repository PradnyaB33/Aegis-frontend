import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import { useNavigate } from "react-router-dom";

const AttendanceModel = ({
  handleClose,
  open,
  organisationId,
  selectedEmployees,
}) => {
  // to import the state, hook and import other function if needed
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { handleAlert } = useContext(TestContext);
  const [emailSearch, setEmailSearch] = useState("");
  const [availableEmployee, setAvailableEmployee] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [checkedEmployees, setCheckedEmployees] = useState([]);
  const navigate = useNavigate("");

  // call get api for retrive the employee in organization
  const fetchAvailableEmployee = async (page) => {
    try {
      const apiUrl = `${process.env.REACT_APP_API}/route/employee/get-paginated-emloyee/${organisationId}?page=${page}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: authToken,
        },
      });
      setAvailableEmployee(response.data.employees);
      setCurrentPage(page);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  useEffect(() => {
    fetchAvailableEmployee(currentPage);
    // eslint-disable-next-line
  }, [currentPage]);

  // Function to handle checking/unchecking employee
  const handleCheckEmp = (employee) => {
    const isChecked = checkedEmployees.some((emp) => emp._id === employee._id);
    if (isChecked) {
      const updatedCheckedEmployees = checkedEmployees.filter(
        (emp) => emp._id !== employee._id
      );
      setCheckedEmployees(updatedCheckedEmployees);
      if (updatedCheckedEmployees.length === 0) {
        setEmailSearch("");
      }
    } else {
      setCheckedEmployees([...checkedEmployees, employee]);
      setEmailSearch(employee.email);
    }
  };
  console.log(checkedEmployees);

  // Validate email format
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  console.log("selectedEmployees", selectedEmployees);

  // to define the function for sync the data
  const handleSync = async () => {
    try {
      if (!validateEmail(emailSearch)) {
        handleAlert(true, "error", "Please enter a valid email address.");
        return;
      }

      if (checkedEmployees.length === 0) {
        handleAlert(
          true,
          "error",
          "Please select at least one employee to sync."
        );
        return;
      }
      const syncedData = selectedEmployees.map((employee) => ({
        date: new Date(employee.Date),
        punchingTime: employee["Punch Time"],
        punchingStatus: employee["Punch State"],
      }));

      console.log("syncedData", syncedData);

      const EmployeeIds = checkedEmployees.map((employee) => employee._id);

      console.log("EmployeeIds", EmployeeIds);

      await Promise.all(
        EmployeeIds.map((EmployeeId) =>
          axios.post(
            `${process.env.REACT_APP_API}/route/organization/${organisationId}/add-attendance-data`,
            {
              EmployeeId: EmployeeId,
              punchingRecords: syncedData,
            },
            {
              headers: {
                Authorization: authToken,
              },
            }
          )
        )
      );

      handleAlert(true, "success", "Synced data successfully.");
      handleClose();
      setCheckedEmployees([]);
      navigate(`/organisation/${organisationId}/view-attendance-biomatric`);
    } catch (error) {
      console.error("Failed to sync attendance data:", error);
      handleAlert(true, "error", "Failed to sync attendance data.");
    }
  };

  // navigation
  const totalPagesArray = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const prePage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Dialog
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "1000px!important",
          height: "100%",
          maxHeight: "90vh!important",
        },
      }}
      open={open}
      onClose={handleClose}
      className="w-full"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <DialogContent className="border-none !pt-0 !px-0 shadow-md outline-none rounded-md">
        <Container maxWidth="xl" className="bg-gray-50">
          <Typography variant="h4" className="text-center pl-10 mb-6 mt-2">
            Employee’s List
          </Typography>
          <p className="text-xs text-gray-600 pl-10 text-center">
            List of employees from the organisation.
          </p>

          <div className="p-4 border-b-[.5px] flex flex-col md:flex-row items-center justify-between gap-3 w-full border-gray-300">
            <div className="flex items-center gap-3 mb-3 md:mb-0">
              <Tooltip title={"Search employee by employee email"} arrow>
                <TextField
                  value={emailSearch}
                  onChange={(e) => setEmailSearch(e.target.value)}
                  placeholder="Search Email...."
                  variant="outlined"
                  size="small"
                  sx={{ width: 300 }}
                />
              </Tooltip>
            </div>
          </div>

          <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
            <table className="min-w-full bg-white text-left !text-sm font-light">
              <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                <tr className="!font-semibold">
                  <th scope="col" className="!text-left pl-8 py-3">
                    Select
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Sr. No
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Employee Id
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    First Name
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Last Name
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Email
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Location
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Department
                  </th>
                </tr>
              </thead>
              <tbody>
                {availableEmployee &&
                  availableEmployee.length > 0 &&
                  availableEmployee
                    .filter(
                      (item) =>
                        !emailSearch.toLowerCase() ||
                        (item.email &&
                          item.email
                            .toLowerCase()
                            .includes(emailSearch.toLowerCase()))
                    )
                    .map((item, id) => (
                      <tr className="!font-medium border-b" key={id}>
                        <td className="!text-left pl-8 py-3">
                          <Tooltip title={"Select the employee"} arrow>
                            <input
                              type="checkbox"
                              checked={checkedEmployees.some(
                                (emp) => emp._id === item?._id
                              )}
                              onChange={() => handleCheckEmp(item)}
                            />
                          </Tooltip>
                        </td>
                        <td className="!text-left pl-8 py-3">
                          {id + 1 + (currentPage - 1) * 10}
                        </td>
                        <td className="py-3 pl-8">{item?.empId}</td>
                        <td className="py-3 pl-8">{item?.first_name}</td>
                        <td className="py-3 pl-8">{item?.last_name}</td>
                        <td className="py-3 pl-8">{item?.email}</td>
                        <td className="py-3 pl-8">
                          {item?.worklocation?.map((location, index) => (
                            <span key={index}>{location?.city}</span>
                          ))}
                        </td>
                        <td className="py-3 pl-8 ">
                          {item?.deptname?.map((dept, index) => (
                            <span key={index}>{dept?.departmentName}</span>
                          ))}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>

            <div className="flex justify-between p-4">
              <Button
                variant="contained"
                color="primary"
                onClick={prePage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div>
                {totalPagesArray &&
                  totalPagesArray?.map((number, index) => (
                    <Button
                      key={index}
                      variant={
                        number === currentPage ? "contained" : "outlined"
                      }
                      color="primary"
                      onClick={() => number !== "..." && changePage(number)}
                      disabled={number === "..."}
                    >
                      {number}
                    </Button>
                  ))}
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
            <DialogActions className="px-4 !py-3 shadow-md outline-none rounded-md bg-gray-50">
              <Button variant="contained" color="primary" onClick={handleSync}>
                Sync
              </Button>
              <Button color="error" variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
            </DialogActions>
          </div>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceModel;

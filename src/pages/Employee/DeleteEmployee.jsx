import SwapVertIcon from "@mui/icons-material/SwapVert";
import { Delete, GetApp, Publish } from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
  Pagination,
  Stack,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BasicButton from "../../components/BasicButton";
import useDebounce from "../../hooks/QueryHook/Training/hook/useDebounce";

const DeleteEmployee = () => {
  const { handleAlert } = useContext(TestContext);
  const { setAppAlert, cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();
  const [nameSearch, setNameSearch] = useState("");
  const [deptSearch, setDeptSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [availableEmployee, setAvailableEmployee] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [deleteMultiEmpConfirmation, setDeleteMultiEmpConfirmation] =
    useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmationExcel, setShowConfirmationExcel] = useState(false);
  const { organisationId } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);
  const [availableEmployee1, setAvailableEmployee1] = useState([]);
  const debouncedNameSearch = useDebounce(nameSearch, 500); // Debounce with a 500ms delay
  const debouncedDeptSearch = useDebounce(deptSearch, 500);
  const debouncedLocationSearch = useDebounce(locationSearch, 500);

  const [sortBy, setSortBy] = useState(""); // 'name' or 'location'
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'

  // Fetch function to get paginated employees

  const fetchAvailableEmployee = useCallback(
    async (organisationId, authToken, page) => {
      try {
        setIsLoading(true);
        const apiUrl = `${process.env.REACT_APP_API}/route/employee/get-paginated-emloyee/${organisationId}?page=${page}&nameSearch=${debouncedNameSearch}&deptSearch=${debouncedDeptSearch}&locationSearch=${debouncedLocationSearch}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: authToken,
          },
        });
        setAvailableEmployee1(response.data.employees);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [
      debouncedNameSearch,
      debouncedDeptSearch,
      debouncedLocationSearch,
      sortBy,
      sortOrder,
    ]
  );

  useEffect(() => {
    fetchAvailableEmployee(organisationId, authToken, currentPage);
  }, [currentPage, organisationId, authToken, fetchAvailableEmployee]);

  useQuery(
    [
      "employees",
      organisationId,
      currentPage,
      debouncedNameSearch,
      debouncedDeptSearch,
      debouncedLocationSearch,
    ],
    () => fetchAvailableEmployee(organisationId, authToken, currentPage),
    {
      keepPreviousData: true,
      staleTime: 5000,
    }
  );

  useEffect(() => {
    fetchAvailableEmployee(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  //   // Handle search input changes
  const handleSearchChange = (field, value) => {
    setCurrentPage(1); // Reset to the first page when search changes
    if (field === "name") {
      setNameSearch(value);
    } else if (field === "department") {
      setDeptSearch(value);
    } else if (field === "location") {
      setLocationSearch(value);
    }
  };

  // Delete Query for deleting single Employee
  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
  };

  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };
  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    setAvailableEmployee((prevEmployees) =>
      prevEmployees.filter((employee) => employee._id !== id)
    );
    setDeleteConfirmation(null);
  };
  const deleteMutation = useMutation(
    (id) =>
      axios.delete(`${process.env.REACT_APP_API}/route/employee/delete/${id}`, {
        headers: {
          Authorization: authToken,
        },
      }),
    {
      onSuccess: () => {
        // Invalidate and refetch the data after successful deletion
        queryClient.invalidateQueries("employees");
        handleAlert(true, "success", "Employee deleted succesfully");
      },
    }
  );

  const handleSort = (field) => {
    if (sortBy === field) {
      // Toggle sort order if the same field is clicked
      setSortOrder((prevSortOrder) =>
        prevSortOrder === "asc" ? "desc" : "asc"
      );
    } else {
      // Set new sort field and default to ascending order
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Delete Query for deleting Multiple Employee
  const handleEmployeeSelection = (id) => {
    const selectedIndex = selectedEmployees.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = [...selectedEmployees, id];
    } else {
      newSelected = selectedEmployees.filter((employeeId) => employeeId !== id);
    }
    setSelectedEmployees(newSelected);
  };

  const handleDeleteMultiple = () => {
    // Check if any employees are selected
    if (selectedEmployees.length === 0) {
      handleAlert(true, "error", "Please select employees to delete");
      return;
    }
    // Display confirmation dialog for deleting multiple employees
    setDeleteMultiEmpConfirmation(true);
  };

  // Handle confirmation of deleting multiple employees
  const confirmDeleteMultiple = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API}/route/employee/delete-multiple`,
        {
          headers: {
            Authorization: authToken,
          },
          data: { ids: selectedEmployees },
        }
      );
      console.log(response);
      queryClient.invalidateQueries("employees");
      handleAlert(true, "success", "Employees deleted successfully");
      // Filter the available employees, removing the deleted ones
      setAvailableEmployee((prevEmployees) =>
        prevEmployees.filter(
          (employee) => !selectedEmployees.includes(employee._id)
        )
      );
      // Reset selectedEmployees after successful deletion
      setSelectedEmployees([]);
    } catch (error) {
      handleAlert(true, "error", "Failed to delete employees");
    } finally {
      setDeleteMultiEmpConfirmation(false);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // deleting the employee from excel sheet
  // generate excel sheet
  const generateExcel = () => {
    try {
      const wb = XLSX.utils.book_new();
      const wsData = [
        [
          "Employee Id",
          "First Name",
          "Last Name",
          "Email",
          "Phone Number",
          "Profile",
        ],
      ];
      // Add Employee information to the worksheet data
      availableEmployee.forEach((employee) => {
        wsData.push([
          employee._id, // Assuming _id is the Employee Id
          employee.first_name,
          employee.last_name,
          employee.email,
          employee.phone_number,
          employee.profile.join(", "), // Join profile array into a string
        ]);
      });
      // Create a worksheet and add data to workbook
      const ws = XLSX.utils.aoa_to_sheet(wsData);

      const columnWidths = [
        { wch: 30 }, // Employee Id
        { wch: 20 }, // First Name
        { wch: 20 }, // Last Name
        { wch: 35 }, // Email
        { wch: 15 }, // Phone Number
        { wch: 35 }, // Profile
      ];
      ws["!cols"] = columnWidths;
      XLSX.utils.book_append_sheet(wb, ws, "EmployeeSheet");
      // Save workbook to a file
      XLSX.writeFile(wb, "EmployeeDataTemplate.xlsx");
    } catch (error) {
      console.error("Error generating Excel:", error);
    }
  };

  const handleFileInputChange = (e) => {
    // Update the state with the selected file
    setSelectedFile(e.target.files[0]);
  };

  // delete query for deleting multiple employee from excel
  const handleDeleteFromExcel = async () => {
    try {
      const fileInput = document.getElementById("fileInput");
      const file = fileInput.files[0];
      if (!file) {
        console.error("Please upload an excel file.");
        setAppAlert({
          alert: true,
          type: "error",
          msg: "Please upload an Excel file.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = async function (e) {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const ws = workbook.Sheets["EmployeeSheet"];
          const deleteColumnIndex = XLSX.utils.decode_range(ws["!ref"]).e.c;

          if (deleteColumnIndex === undefined) {
            setAppAlert({
              alert: true,
              type: "error",
              msg: "Delete column not found in the excel sheet.",
            });
            return;
          }

          const employeesToDelete = [];
          for (
            let row = 1;
            row <= XLSX.utils.decode_range(ws["!ref"]).e.r;
            row++
          ) {
            const deleteCommand =
              ws[XLSX.utils.encode_cell({ r: row, c: deleteColumnIndex })];
            if (
              deleteCommand &&
              deleteCommand.v &&
              deleteCommand.v.toLowerCase() === "delete"
            ) {
              const employeeIdToDelete =
                ws[XLSX.utils.encode_cell({ r: row, c: 0 })].v;

              const employeeToDelete = availableEmployee.find(
                (emp) => emp._id === employeeIdToDelete
              );
              if (employeeToDelete) {
                employeesToDelete.push(employeeToDelete);
              }
            }
          }

          if (employeesToDelete.length === 0) {
            setAppAlert({
              alert: true,
              type: "error",
              msg: "Failed to delete employee from Excel. Please try again.",
            });
            setShowConfirmationExcel(false);
            return;
          }

          for (const employee of employeesToDelete) {
            try {
              await axios.delete(
                `${process.env.REACT_APP_API}/route/employee/delete/${employee._id}`,
                { headers: { Authorization: authToken } }
              );

              setAvailableEmployee((prevEmployees) =>
                prevEmployees.filter((emp) => emp._id !== employee._id)
              );

              setAppAlert({
                alert: true,
                type: "success",
                msg: "Employee deleted from the Excel sheet.",
              });
            } catch (error) {
              console.error("Error deleting employee:", error);
              setAppAlert({
                alert: true,
                type: "error",
                msg: "Failed to delete employee from excel. Please try again.",
              });
            }
          }
          handleClose();
          setShowConfirmationExcel(false);
        } catch (error) {
          console.error("Error processing Excel data:", error);
          setAppAlert({
            alert: true,
            type: "error",
            msg: "Error processing Excel data.",
          });
          setShowConfirmationExcel(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error handling Excel delete:", error);
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Error handling Excel delete.",
      });
      setShowConfirmationExcel(false);
    }
  };

  return (
    <>
      <BoxComponent>
        {isLoading && (
          <div className="fixed z-[100000] flex items-center justify-center bg-black/10 top-0 bottom-0 left-0 right-0">
            <CircularProgress />
          </div>
        )}

        <HeadingOneLineInfo
          heading={"Employee Offboarding"}
          info={" Delete employee data here by using delete button"}
        />
        <div className="pb-4 border-b-[.5px] flex flex-col md:flex-row items-center justify-between gap-2 w-full border-gray-300">
          <div className="flex items-center gap-2 mb-3 md:mb-0 w-full md:w-auto">
            <TextField
              onChange={(e) => handleSearchChange("name", e.target.value)}
              placeholder="Search Employee"
              variant="outlined"
              size="small"
              sx={{ bgcolor: "white" }}
            />
          </div>
          <div className="flex items-center gap-2 mb-3 md:mb-0 w-full md:w-auto">
            <TextField
              onChange={(e) => handleSearchChange("department", e.target.value)}
              placeholder="Search Department"
              variant="outlined"
              size="small"
              sx={{ bgcolor: "white" }}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <TextField
              onChange={(e) => handleSearchChange("location", e.target.value)}
              placeholder="Search Location"
              variant="outlined"
              size="small"
              sx={{ bgcolor: "white" }}
            />
          </div>

          {/* <div className="flex items-center gap-2 w-full md:w-auto"> */}
          {/* <TextField
              select
              fullWidth
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
              variant="outlined"
              size="small"
              sx={{ bgcolor: "white" }}
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="last_name">Last Name</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="empId">Employee Id</MenuItem>
              <MenuItem value="location">Location</MenuItem>
              {/* <MenuItem value="department">Department</MenuItem>   */}
          {/* </TextField> */}
          {/* </div> */}

          {/* <div className="flex items-center gap-2 w-full md:w-auto">
            <TextField
              fullWidth
              select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              label="Order"
              variant="outlined"
              size="small"
              sx={{ bgcolor: "white" }}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </TextField>
          </div> */}

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-3 md:mb-0">
            <div className="flex-grow flex-shrink-0">
              <Tooltip
                title={
                  <span>
                    To perform bulk deletion:
                    <ol>
                      <li>Generate an Excel file with employee data.</li>
                      <li>
                        Write "delete" in front of user IDs in the Excel sheet.
                      </li>
                      <li>Save the file and upload it.</li>
                      <li>
                        Click on the delete button to execute bulk deletion.
                      </li>
                    </ol>
                  </span>
                }
                arrow
              >
                <div>
                  <BasicButton
                    title={"Bulk Delete"}
                    onClick={handleMenuClick}
                  />
                </div>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={generateExcel}>
                  <GetApp style={{ color: "blue", marginRight: "10px" }} />{" "}
                  Generate Excel
                </MenuItem>
                <MenuItem>
                  <label
                    htmlFor="fileInput"
                    className="flex items-center gap-2"
                  >
                    <Publish style={{ color: "green", marginRight: "10px" }} />{" "}
                    <span>
                      {selectedFile ? selectedFile.name : "Choose File"}
                    </span>
                    <input
                      type="file"
                      accept=".xlsx, .xls"
                      id="fileInput"
                      className="w-full rounded opacity-0 absolute inset-0"
                      style={{ zIndex: -1 }}
                      onChange={handleFileInputChange}
                    />
                  </label>
                </MenuItem>
                <MenuItem onClick={() => setShowConfirmationExcel(true)}>
                  <Delete style={{ color: "red", marginRight: "10px" }} />{" "}
                  Delete
                </MenuItem>
              </Menu>
            </div>

            {/* Delete Button */}
            <div className="flex-grow-0 flex-shrink-0">
              <Tooltip title="Check at least one checkbox to delete" arrow>
                <div>
                  <BasicButton
                    title={"Delete"}
                    onClick={handleDeleteMultiple}
                    color={"danger"}
                  />
                </div>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
          <table className="min-w-full bg-white text-left !text-sm font-light">
            <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
              <tr className="!font-semibold">
                <th scope="col" className="!text-left pl-8 py-3">
                  Employee Selection
                </th>
                <th scope="col" className="!text-left pl-8 py-3 cursor-pointer">
                  Sr. No
                </th>
                <th
                  scope="col"
                  className="!text-left pl-8 py-3 cursor-pointer"
                  onClick={() => handleSort("first_name")}
                >
                  First Name
                  {sortBy === "first_name" &&
                    (sortOrder === "asc" ? <SwapVertIcon /> : <SwapVertIcon />)}
                </th>
                <th
                  scope="col"
                  className="!text-left pl-8 py-3 cursor-pointer"
                  onClick={() => handleSort("last_name")}
                >
                  Last Name
                  {sortBy === "last_name" &&
                    (sortOrder === "asc" ? <SwapVertIcon /> : <SwapVertIcon />)}
                </th>
                <th
                  scope="col"
                  className="!text-left pl-8 py-3 cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  Email
                  {sortBy === "email" &&
                    (sortOrder === "asc" ? <SwapVertIcon /> : <SwapVertIcon />)}
                </th>
                <th
                  scope="col"
                  className="!text-left pl-8 py-3 cursor-pointer"
                  onClick={() => handleSort("empId")}
                >
                  Employee Id
                  {sortBy === "empId" &&
                    (sortOrder === "asc" ? <SwapVertIcon /> : <SwapVertIcon />)}
                </th>
                <th
                  scope="col"
                  className="!text-left pl-8 py-3 cursor-pointer"
                  onClick={() => handleSort("location")}
                >
                  Location
                  {sortBy === "location" &&
                    (sortOrder === "asc" ? <SwapVertIcon /> : <SwapVertIcon />)}
                </th>
                <th
                  scope="col"
                  className="!text-left pl-8 py-3 cursor-pointer"
                  // onClick={() => handleSort('department')}
                >
                  Department
                  {/* {sortBy === 'department' && (
        sortOrder === 'asc' ? <SwapVertIcon /> : <SwapVertIcon />
      )} */}
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {availableEmployee1.map((item, id) => (
                <tr className="!font-medium border-b" key={id}>
                  <td className="!text-left  pl-8">
                    <Checkbox
                      checked={selectedEmployees.indexOf(item?._id) !== -1}
                      onChange={() => handleEmployeeSelection(item?._id)}
                    />
                  </td>
                  <td className="!text-left py-3 pl-8">{id + 1}</td>
                  <td className="py-3 pl-8">{item?.first_name}</td>
                  <td className="py-3 pl-8">{item?.last_name}</td>
                  <td className="py-3 pl-8">{item?.email}</td>
                  <td className="py-3 pl-8">{item?.empId}</td>
                  <td className="py-3 pl-8">
                    {item?.worklocation?.map((location, index) => (
                      <span key={index}>{location?.city}</span>
                    ))}
                  </td>
                  <td className="py-3 pl-8">
                    {item?.deptname?.map((dept, index) => {
                      return <span key={index}>{dept?.departmentName}</span>;
                    })}
                  </td>
                  <td className="whitespace-nowrap py-1 pl-8">
                    <IconButton
                      color="error"
                      aria-label="delete"
                      onClick={() => handleDeleteConfirmation(item?._id)}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          <Stack
            direction={"row"}
            className="border-[.5px] border-gray-200 bg-white border-t-0 px-4 py-2 h-full items-center w-full justify-between"
          >
            <div>
              <Typography variant="body2">
                Showing page {currentPage} of {totalPages} pages
              </Typography>
            </div>
            <Pagination
              count={totalPages}
              page={currentPage}
              color="primary"
              shape="rounded"
              onChange={(event, value) => setCurrentPage(value)}
            />
          </Stack>
        </div>

        {/* this dialogue for deleting single employee */}
        <Dialog
          open={deleteConfirmation !== null}
          onClose={handleCloseConfirmation}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <p>
              Please confirm your decision to delete this employee, as this
              action cannot be undone.
            </p>
          </DialogContent>
          <DialogActions>
            <BasicButton
              title={" Cancel"}
              variant="outlined"
              onClick={handleCloseConfirmation}
            />
            <BasicButton
              title={"Delete"}
              color={"danger"}
              onClick={() => handleDelete(deleteConfirmation)}
            />
          </DialogActions>
        </Dialog>

        {/* This Dialogue for delting Multiple Employe */}
        <Dialog
          open={deleteMultiEmpConfirmation}
          onClose={() => setDeleteMultiEmpConfirmation(false)}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <p>
              Please confirm your decision to delete this selected employee, as
              this action cannot be undone.
            </p>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteMultiEmpConfirmation(false)}
              variant="outlined"
              color="primary"
              size="small"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={confirmDeleteMultiple}
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* This Dialogue for delting Multiple Employe from excel sheet*/}
        <Dialog
          open={showConfirmationExcel}
          onClose={() => setShowConfirmationExcel(false)}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <p>
              Please confirm your decision to delete this employee, as this
              action cannot be undone.
            </p>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowConfirmationExcel(false)}
              variant="outlined"
              color="primary"
              size="small"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleDeleteFromExcel}
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </BoxComponent>
    </>
  );
};

export default DeleteEmployee;

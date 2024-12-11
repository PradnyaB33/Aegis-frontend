import React, { useContext, useState, useEffect } from "react";
import {
  Button,
  Container,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
// import { West } from "@mui/icons-material";
import { useQuery } from "react-query";
import axios from "axios";
import { UseContext } from "../../State/UseState/UseContext";
import { TestContext } from "../../State/Function/Main";
import Info from "@mui/icons-material/Info";
import AttendanceModel from "../../components/Modal/AttedanceBioModal/AttendanceModel";

const EmpInfoByDynimacally = ({ organisationId }) => {
  // Hooks
  // const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchDepartment, setSearchDepartment] = useState("");
  const { handleAlert } = useContext(TestContext);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const itemsPerPage = 10;

  // Get cookies
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  // Get punching data by orgId
  const { data: tempPunchData } = useQuery(
    ["tempPunchData", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-temp-punching-data`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },
    {
      enabled: !!organisationId && !!authToken,
    }
  );

  // Update filtered data based on search inputs
  useEffect(() => {
    const filtered =
      tempPunchData?.filter((data) => {
        const firstName = String(data["First Name"]).toLowerCase();
        const employeeId = String(data["Employee ID"]).toLowerCase();
        const department = String(data.Department).toLowerCase();

        return (
          firstName.includes(searchName.toLowerCase()) &&
          employeeId.includes(searchId.toLowerCase()) &&
          department.includes(searchDepartment.toLowerCase())
        );
      }) || [];
    setFilteredData(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  }, [tempPunchData, searchName, searchId, searchDepartment]);

  // Get the data to display on the current page
  const currentData = filteredData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination handlers
  const prePage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPaginationNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= halfMaxPagesToShow) {
        for (let i = 1; i <= maxPagesToShow; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage + halfMaxPagesToShow >= totalPages) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (
          let i = currentPage - halfMaxPagesToShow;
          i <= currentPage + halfMaxPagesToShow;
          i++
        ) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const paginationNumbers = getPaginationNumbers();

  // Handle checkbox change for individual employees
  const handleCheckboxChange = (event, employeeData) => {
    if (event.target.checked) {
      setSelectedEmployees((prev) => [...prev, employeeData]);
    } else {
      setSelectedEmployees((prev) =>
        prev.filter((emp) => emp._id !== employeeData._id)
      );
    }
  };

  // Handle "Select All" checkbox
  const handleSelectAllChange = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      setSelectedEmployees(filteredData);
    } else {
      setSelectedEmployees([]);
    }
  };

  //  to open the model
  const [empModalOpen, setEmpModalOpen] = useState(false);
  const handleEmpModalOpen = () => {
    if (selectedEmployees.length === 0) {
      handleAlert(false, "error", "Please check the employee before syncing.");
    } else {
      setEmpModalOpen(true);
    }
  };

  // to close the model
  const handleEmpModalClose = () => {
    setEmpModalOpen(false);
    setSelectedEmployees([]);
  };

  return (
    <>
      <Container maxWidth="xl" className="bg-gray-50 min-h-screen">
        <article className=" bg-white w-full h-max shadow-md rounded-sm border items-center">
          {/* <div className=" mt-3">
            <IconButton onClick={() => navigate(-1)}>
              <West className="text-xl" />
            </IconButton>
          </div> */}
          <Typography variant="h4" className="text-center pl-10 mb-6 mt-2">
            Employee’s Punch Sync
          </Typography>
          <p className="text-xs text-gray-600 pl-10 text-center">
            Track the attendance of employees here by using the sync button.
          </p>
          <div className="flex items-center justify-center mt-4 gap-5">
            <Tooltip title={"Please check the employee before syncing."} arrow>
              <Button
                variant="contained"
                component="span"
                onClick={handleEmpModalOpen}
              >
                Sync
              </Button>
            </Tooltip>
          </div>

          <div className="p-4 border-b-[.5px] flex flex-col md:flex-row items-center justify-between gap-3 w-full border-gray-300">
            <div className="flex items-center gap-3 mb-3 md:mb-0 w-full md:w-auto">
              <Tooltip title={"Search employee by employee name"} arrow>
                <TextField
                  placeholder="Search Employee Name...."
                  variant="outlined"
                  size="small"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 200 }}
                />
              </Tooltip>
            </div>
            <div className="flex items-center gap-3 mb-3 md:mb-0 w-full md:w-auto">
              <Tooltip title={"Search employee by employee id"} arrow>
                <TextField
                  placeholder="Search Employee ID...."
                  variant="outlined"
                  size="small"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 200 }}
                />
              </Tooltip>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Tooltip title={"Search employee by employee department"} arrow>
                <TextField
                  placeholder="Search Department...."
                  variant="outlined"
                  size="small"
                  value={searchDepartment}
                  onChange={(e) => setSearchDepartment(e.target.value)}
                  sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 200 }}
                />
              </Tooltip>
            </div>
          </div>

          <div className="px-4 py-2 bg-white w-full h-max shadow-md rounded-2m  my-8">
            <div className="overflow-auto !p-0 border-[.5px] border-gray-200 mt-4">
              <table className="min-w-full bg-white text-left !text-sm font-light">
                <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                  <tr className="!font-semibold">
                    <th className="pl-8 py-2 text-left">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAllChange}
                      />
                    </th>
                    <th className="!text-left pl-8 py-3">Sr No.</th>
                    <th className="py-3 pl-8 !text-left">Employee ID</th>
                    <th className="py-3 pl-8 !text-left">Name</th>
                    <th className="py-3 pl-8 !text-left">Department</th>
                    <th className="py-3 pl-8 !text-left">Date</th>
                    <th className="py-3 pl-8 !text-left">Punch Time</th>
                    <th className="py-3 pl-8 !text-left">Punch State</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(currentData) && currentData.length > 0 ? (
                    currentData.map((data, index) => (
                      <tr key={index} className="!font-medium border-b">
                        <td className="!text-left pl-8 py-3">
                          <input
                            type="checkbox"
                            onChange={(e) => handleCheckboxChange(e, data)}
                            checked={selectedEmployees.some(
                              (emp) => emp._id === data._id
                            )}
                          />
                        </td>

                        <td className="!text-left pl-8 py-3">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="!text-left pl-8 py-3">
                          {data["Employee ID"]}
                        </td>
                        <td className="!text-left pl-8 py-3">
                          {data["First Name"]}
                        </td>
                        <td className="!text-left pl-8 py-3">
                          {data.Department}
                        </td>
                        <td className="!text-left pl-8 py-3">{data.Date}</td>
                        <td className="!text-left pl-8 py-3">
                          {data["Punch Time"]}
                        </td>
                        <td className="!text-left pl-8 py-3">
                          {data["Punch State"]}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
                      <article className="flex items-center mb-1 text-red-500 gap-2">
                        <Info className="!text-2xl" />
                        <h1 className="text-lg font-semibold">Loading...</h1>
                      </article>
                      <p>Data is loading.</p>
                    </section>
                  )}
                </tbody>
              </table>
            </div>
          </div>
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
              {paginationNumbers &&
                paginationNumbers?.map((number, index) => (
                  <Button
                    key={index}
                    variant={number === currentPage ? "contained" : "outlined"}
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
        </article>
      </Container>

      <AttendanceModel
        handleClose={handleEmpModalClose}
        open={empModalOpen}
        organisationId={organisationId}
        selectedEmployees={selectedEmployees}
      />
    </>
  );
};

export default EmpInfoByDynimacally;

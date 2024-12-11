import Info from "@mui/icons-material/Info";
import {
  Button,
  Container,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { TestContext } from "../../State/Function/Main";
import AttendanceBioModal from "../../components/Modal/AttedanceBioModal/AttendanceBioModal";
// import { West } from "@mui/icons-material";
// import { IconButton } from "@mui/material";

const EmpInfoPunchStatus = ({ organisationId }) => {
  // define the state , hook and import function if needed
  // const navigate = useNavigate();
  const { handleAlert } = useContext(TestContext);
  const [tableData, setTableData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchDepartment, setSearchDepartment] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  //  to define the function for upload file
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setFileName("");
      setTableData([]);
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    setLoading(true);

    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setTableData(
        parsedData.slice(2).map((row) => ({ ...row, selected: false }))
      );
      setLoading(false);
    };

    reader.readAsBinaryString(file);
  };

  // to define the function for search by name
  const handleSearchName = (e) => {
    setSearchName(e.target.value);
    setCurrentPage(1);
  };

  // to define the function for search by id
  const handleSearchId = (e) => {
    setSearchId(e.target.value);
    setCurrentPage(1);
  };

  // to define the function for search by department
  const handleSearchDepartment = (e) => {
    setSearchDepartment(e.target.value);
    setCurrentPage(1);
  };

  const filteredData = tableData?.filter((row) => {
    return (
      row?.[1]
        ?.toString()
        .toLowerCase()
        ?.includes(searchName?.toLowerCase() ?? "") &&
      row?.[0]
        ?.toString()
        .toLowerCase()
        ?.includes(searchId?.toLowerCase() ?? "") &&
      row?.[2]
        ?.toString()
        .toLowerCase()
        ?.includes(searchDepartment?.toLowerCase() ?? "")
    );
  });

  useEffect(() => {
    setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
  }, [filteredData.length]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // select for individual record
  const handleEmployeeSelect = (index) => {
    const selectedEmployeeRecord = currentItems[index];
    const isSelected = selectedEmployees.some(
      (emp) =>
        emp[0] === selectedEmployeeRecord[0] &&
        emp[1] === selectedEmployeeRecord[1] &&
        emp[2] === selectedEmployeeRecord[2] &&
        emp[3] === selectedEmployeeRecord[3] &&
        emp[4] === selectedEmployeeRecord[4] &&
        emp[5] === selectedEmployeeRecord[5] &&
        emp[6] === selectedEmployeeRecord[6] &&
        emp[7] === selectedEmployeeRecord[7] &&
        emp[8] === selectedEmployeeRecord[8] &&
        emp[9] === selectedEmployeeRecord[9]
    );

    if (isSelected) {
      setSelectedEmployees((prevSelected) =>
        prevSelected.filter(
          (emp) =>
            emp[0] !== selectedEmployeeRecord[0] ||
            emp[1] !== selectedEmployeeRecord[1] ||
            emp[2] !== selectedEmployeeRecord[2] ||
            emp[3] !== selectedEmployeeRecord[3] ||
            emp[4] !== selectedEmployeeRecord[4] ||
            emp[5] !== selectedEmployeeRecord[5] ||
            emp[6] !== selectedEmployeeRecord[6] ||
            emp[7] !== selectedEmployeeRecord[7] ||
            emp[8] !== selectedEmployeeRecord[8] ||
            emp[9] !== selectedEmployeeRecord[9]
        )
      );
    } else {
      setSelectedEmployees((prevSelected) => [
        ...prevSelected,
        selectedEmployeeRecord,
      ]);
    }
  };

  // select for multiple record
  const handleSelectAll = () => {
    const allEmployeeIds = currentItems.map((row) => row[0]);
    const allEmployeeRecords = tableData.filter((row) =>
      allEmployeeIds.includes(row[0])
    );

    const allSelected = allEmployeeRecords.every((record) =>
      selectedEmployees.some((emp) => emp[0] === record[0])
    );

    if (allSelected) {
      setSelectedEmployees((prevSelected) =>
        prevSelected.filter((emp) => !allEmployeeIds.includes(emp[0]))
      );
    } else {
      setSelectedEmployees((prevSelected) => [
        ...prevSelected,
        ...allEmployeeRecords.filter(
          (record) =>
            !prevSelected.some(
              (emp) =>
                emp[0] === record[0] &&
                emp[3] === record[3] &&
                emp[4] === record[4]
            )
        ),
      ]);
    }
  };

  // pagination
  const prePage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // navigation
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
            <label htmlFor="file-upload">
              <input
                style={{ display: "none" }}
                id="file-upload"
                type="file"
                accept=".xls,.xlsx"
                onChange={handleFileUpload}
              />
              <Tooltip title={fileName} arrow>
                <Button variant="contained" component="span">
                  {fileName ? fileName.substring(0, 10) + "..." : "Upload File"}
                </Button>
              </Tooltip>
            </label>
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
                  sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 200 }}
                  value={searchName}
                  onChange={handleSearchName}
                />
              </Tooltip>
            </div>
            <div className="flex items-center gap-3 mb-3 md:mb-0 w-full md:w-auto">
              <Tooltip title={"Search employee by employee id"} arrow>
                <TextField
                  placeholder="Search Employee ID...."
                  variant="outlined"
                  size="small"
                  sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 200 }}
                  value={searchId}
                  onChange={handleSearchId}
                />
              </Tooltip>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Tooltip title={"Search employee by employee department"} arrow>
                <TextField
                  placeholder="Search Department...."
                  variant="outlined"
                  size="small"
                  sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 200 }}
                  value={searchDepartment}
                  onChange={handleSearchDepartment}
                />
              </Tooltip>
            </div>
          </div>

          {fileName === "" && (
            <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
              <article className="flex items-center mb-1 text-red-500 gap-2">
                <Info className="!text-2xl" />
                <h1 className="text-lg font-semibold">
                  Please select the file.
                </h1>
              </article>
              <p>File not found.</p>
            </section>
          )}

          {!loading && fileName !== "" && (
            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap">
                <thead>
                  <tr className="bg-gray-200 border-b-2 border-gray-300">
                    <th className="pl-8 py-2 text-left">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={
                          currentItems.length > 0 &&
                          currentItems.every((row) =>
                            selectedEmployees?.some(
                              (emp) =>
                                emp[0] === row[0] &&
                                emp[1] === row[1] &&
                                emp[2] === row[2] &&
                                emp[3] === row[3] &&
                                emp[4] === row[4] &&
                                emp[5] === row[5] &&
                                emp[6] === row[6] &&
                                emp[7] === row[7] &&
                                emp[8] === row[8] &&
                                emp[9] === row[9]
                            )
                          )
                        }
                      />
                    </th>
                    <th className="!text-left pl-8 py-3">Sr No.</th>
                    <th className="py-3 pl-8 !text-left">Employee ID</th>
                    <th className="py-3 pl-8 !text-left">Name</th>
                    <th className="py-3 pl-8 !text-left">Department</th>
                    <th className="py-3 pl-8 !text-left">Date</th>
                    <th className="py-3 pl-8 !text-left">In/Out time</th>
                    <th className="py-3 pl-8 !text-left">Punch Status</th>
                    <th className="py-3 pl-8 !text-left">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems &&
                    currentItems?.map((row, index) => (
                      <tr key={index}>
                        <td className="!text-left pl-8 py-3">
                          <input
                            type="checkbox"
                            checked={selectedEmployees?.some(
                              (emp) =>
                                emp[0] === row[0] &&
                                emp[1] === row[1] &&
                                emp[2] === row[2] &&
                                emp[3] === row[3] &&
                                emp[4] === row[4] &&
                                emp[5] === row[5] &&
                                emp[6] === row[6] &&
                                emp[7] === row[7] &&
                                emp[8] === row[8] &&
                                emp[9] === row[9]
                            )}
                            onChange={() => handleEmployeeSelect(index)}
                          />
                        </td>
                        <td className="!text-left pl-8 py-3">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="py-3 pl-8">{row[0]}</td>
                        <td className="py-3 pl-8">{row[1]}</td>
                        <td className="py-3 pl-8">{row[2]}</td>
                        <td className="py-3 pl-8">{row[3]}</td>
                        <td className="py-3 pl-8">{row[4]}</td>
                        <td className="py-3 pl-8">{row[5]}</td>
                        <td className="py-3 pl-8">{row[6]}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {loading && (
            <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
              <article className="flex items-center mb-1 text-red-500 gap-2">
                <Info className="!text-2xl" />
                <h1 className="text-lg font-semibold">Loading...</h1>
              </article>
              <p>Data is loading.</p>
            </section>
          )}
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

      <AttendanceBioModal
        handleClose={handleEmpModalClose}
        open={empModalOpen}
        organisationId={organisationId}
        selectedEmployees={selectedEmployees}
      />
    </>
  );
};

export default EmpInfoPunchStatus;

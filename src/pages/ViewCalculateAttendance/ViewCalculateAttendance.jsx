import {
  Container,
  Typography,
  TextField,
  IconButton,
  Button,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";
import { useQuery } from "react-query";
import ViewAttendanceCallModal from "../../components/Modal/ViewAttendanceCalModal/ViewAttendanceCalModal";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
//import { West } from "@mui/icons-material";
const ITEMS_PER_PAGE = 10;

const ViewCalculateAttendance = () => {
  // to define the state ,  hook and import other function if needed
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { organisationId } = useParams();
  const [emailSearch, setEmailSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  // const navigate = useNavigate();

  // For Get Query
  const {
    data: calculateAttendanceData,
    isLoading,
    error,
  } = useQuery(
    ["empAttendanceData", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-punching-info`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    },
    {
      staleTime: 0, // Data will be considered stale immediately
      cacheTime: 0, // Data will not be cached
      refetchOnWindowFocus: true, // Refetch on window focus
      refetchOnReconnect: true, // Refetch on network reconnect
    }
  );
  
  console.log("calculated attendnace data", calculateAttendanceData);

  useEffect(() => {
    if (calculateAttendanceData) {
      const filtered = calculateAttendanceData.filter((item) => {
        return (
          item?.EmployeeId !== null && // Ensure EmployeeId is not null
          (!emailSearch.toLowerCase() ||
            (item?.EmployeeId?.email !== null &&
              item?.EmployeeId?.email !== undefined &&
              item?.EmployeeId?.email.toLowerCase().includes(emailSearch)))
        );
      });
      setFilteredData(filtered);
    }
  }, [calculateAttendanceData, emailSearch]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const currentData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // for open the modal for display employee
  const [empModalOpen, setEmpModalOpen] = useState(false);
  const [employee, setEmployee] = useState();
  const handleEmpModalOpen = (employee) => {
    setEmployee(employee);
    setEmpModalOpen(true);
  };
  const handleEmpModalClose = () => {
    setEmpModalOpen(false);
    setEmployee();
  };

  // pagination
  const prePage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginationNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>An error occurred: {error.message}</p>;

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
            Employee’s Calendar View
          </Typography>
          <p className="text-xs text-gray-600 pl-10 text-center">
            Calendar view of employee attendance
          </p>

          <div className="p-4 border-b-[.5px] flex flex-col md:flex-row items-center justify-between gap-3 w-full border-gray-300">
            <div className="flex items-center gap-3 mb-3 md:mb-0">
              <TextField
                onChange={(e) => setEmailSearch(e.target.value)}
                placeholder="Search Employee by Email...."
                variant="outlined"
                size="small"
                sx={{ width: 300 }}
              />
            </div>
          </div>

          <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
            <table className="min-w-full bg-white text-left !text-sm font-light">
              <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                <tr className="!font-semibold">
                  <th scope="col" className="!text-left pl-8 py-3">
                    Sr. No
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Employee Id
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Employee Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Employee Email
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData &&
                  currentData.map((item, index) => (
                    <tr className="!font-medium border-b" key={index}>
                      <td className="!text-left pl-8 py-3">
                        {index + 1 + (currentPage - 1) * ITEMS_PER_PAGE}
                      </td>
                      <td className="py-3 pl-6">
                        {item?.EmployeeId?.empId || ""}
                      </td>
                      <td className="py-3 pl-6">
                        {item?.EmployeeId?.first_name || ""}
                      </td>
                      <td className="py-3 pl-6">
                        {item?.EmployeeId?.email || ""}
                      </td>
                      <td className="!text-left pl-6 py-3">
                        <IconButton
                          aria-label="view"
                          size="small"
                          onClick={() => {
                            handleEmpModalOpen(item);
                          }}
                        >
                          <CalendarMonthIcon sx={{ color: "green" }} />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
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
                paginationNumbers.map((number, index) => (
                  <Button
                    key={index}
                    variant={number === currentPage ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => changePage(number)}
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

      <ViewAttendanceCallModal
        handleClose={handleEmpModalClose}
        open={empModalOpen}
        employee={employee}
        organisationId={organisationId}
      />
    </>
  );
};

export default ViewCalculateAttendance;

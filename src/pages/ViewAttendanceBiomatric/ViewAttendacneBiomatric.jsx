import {
  Container,
  Typography,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";
import { useQuery } from "react-query";
import EmployeeTypeSkeleton from "../SetUpOrganization/components/EmployeeTypeSkeleton";
import { Info } from "@mui/icons-material";
import CalculateHourEmpModal from "../../components/Modal/CalculateHourEmpModal/CalculateHourEmpModal";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import { West } from "@mui/icons-material";

const ViewAttendacneBiomatric = () => {
  // to import the state, hook and import other function if needed
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { organisationId } = useParams();
  // const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [empPunchingData, setEmpPunchingData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // to get the employee attendance data
  const { data: empAttendanceData, isLoading } = useQuery(
    ["empAttendanceData", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-attendance-data`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      const filteredData = response.data.data.filter(
        (record) => record.EmployeeId !== null
      );

      return filteredData;
    }
  );

  // to define the function for open the model
  const handleModalOpen = (data) => {
    setEmpPunchingData(data);
    setModalOpen(true);
  };

  // to define the function for close the model
  const handleModalClose = () => {
    setModalOpen(false);
  };

  console.log("empAttendanceData", empAttendanceData);

  // for pagination
  const totalPages = Math.ceil((empAttendanceData?.length || 0) / itemsPerPage);

  const prePage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };
  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };
  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const paginationNumbers = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      paginationNumbers.push(i);
    }
  } else {
    if (currentPage <= 3) {
      paginationNumbers.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      paginationNumbers.push(
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      paginationNumbers.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
    }
  }

  return (
    <>
      <Container maxWidth="xl" className="bg-gray-50 min-h-screen">
        <article className=" bg-white w-full h-max shadow-md rounded-sm border items-center">
          {/* <div className=" mt-3">
            <IconButton onClick={() => navigate(-1)}>
              <West className="text-xl" />
            </IconButton>
          </div> */}

          <Typography variant="h4" className=" text-center pl-10  mb-6 mt-2">
            Employee’s Time Track
          </Typography>
          <p className="text-xs text-gray-600 pl-10   mb-6 text-center">
            Track the attendance of employees here.
          </p>

          {isLoading ? (
            <EmployeeTypeSkeleton />
          ) : empAttendanceData?.length > 0 ? (
            <>
              <div className="overflow-auto !p-0  border-[.5px] border-gray-200">
                <table className="min-w-full bg-white  text-left !text-sm font-light">
                  <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                    <tr className="!font-semibold ">
                      <th scope="col" className="!text-left pl-8 py-3 ">
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
                      <th scope="col" className="px-6 py-3">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {empAttendanceData
                      .slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      )
                      .map((empAttendanceItem, id) => (
                        <tr className="!font-medium border-b" key={id}>
                          <td className="!text-left pl-8 py-3 ">
                            {id + 1 + (currentPage - 1) * itemsPerPage}
                          </td>
                          <td className="!text-left  pl-7 py-3 ">
                            {empAttendanceItem?.EmployeeId?.empId || ""}
                          </td>
                          <td className="!text-left  pl-7 py-3 ">
                            {empAttendanceItem?.EmployeeId?.first_name || ""}
                          </td>
                          <td className="!text-left  pl-7 py-3 ">
                            {empAttendanceItem?.EmployeeId?.email || ""}
                          </td>
                          <td className="!text-left pl-4 py-3">
                            <Tooltip
                              title={"Calculate the hours of employee"}
                              arrow
                            >
                              <IconButton
                                aria-label="view"
                                size="small"
                                onClick={() =>
                                  handleModalOpen(empAttendanceItem)
                                }
                              >
                                <AccessTimeIcon sx={{ color: "green" }} />
                              </IconButton>
                            </Tooltip>
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
            </>
          ) : (
            <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
              <article className="flex items-center mb-1 text-red-500 gap-2">
                <Info className="!text-2xl" />
                <h1 className="text-lg font-semibold">No Sync Data Found</h1>
              </article>
              <p>Please sync the data of employee.</p>
            </section>
          )}
        </article>
      </Container>

      <CalculateHourEmpModal
        handleClose={handleModalClose}
        open={modalOpen}
        organisationId={organisationId}
        empPunchingData={empPunchingData}
      />
    </>
  );
};

export default ViewAttendacneBiomatric;

import { Assignment, Info } from "@mui/icons-material";
import { Container, IconButton, Typography, Button } from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import { UseContext } from "../../State/UseState/UseContext";
import MissPunchJustifyModal from "../../components/Modal/MissPunchJustifyModal/MissPunchJustifyModal";
import UserProfile from "../../hooks/UserData/useUser";
import useLeaveRequesationHook from "../../hooks/QueryHook/Leave-Requsation/hook";

const MissPunchJustify = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const organisationId = user.organizationId;
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch data with pagination
  const { data: unavailableRecord, isLoading } = useQuery(
    ["missedJustifyData", organisationId, currentPage],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/unavailable-record?page=${currentPage}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setTotalPages(response.data.totalPages || 1);
      return response.data.data;
    }
  );
  console.log("unavailable record", unavailableRecord);

  const { data } = useLeaveRequesationHook();

  // Modal state
  const [missPunchModalOpen, setMissPunchModalOpen] = useState(false);
  const [unavailableRecords, setUnavailableRecords] = useState(null);

  // Open modal handler
  const handleMissPunchModalOpen = (data) => {
    setUnavailableRecords(data);
    setMissPunchModalOpen(true);
  };

  // Close modal handler
  const handleMissPunchModalClose = () => {
    setMissPunchModalOpen(false);
    setUnavailableRecords(null);
  };

  // Pagination handlers
  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prePage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Container maxWidth="xl" className="bg-gray-50 min-h-screen py-8 px-4">
        {/* <div className="mt-3">
          <IconButton onClick={() => navigate(-1)}>
            <West className="text-xl" />
          </IconButton>
        </div> */}
        <Typography variant="h4" className="text-center pl-10 mb-6 mt-2">
          Missed Justify
        </Typography>
        <p className="text-xs text-gray-600 pl-10 text-center">
          View the unavailable record.
        </p>
        {unavailableRecord && unavailableRecord.length > 0 ? (
          unavailableRecord.map((record, index) => (
            <article
              key={index}
              className="bg-white w-full h-max shadow-md rounded-sm border items-center mb-4"
            >
              <Typography variant="h7" className="pl-2 mb-6 mt-2">
                {record.employeeId.first_name} {record.employeeId.last_name}
              </Typography>

              {record.unavailableRecords?.length > 0 ? (
                <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
                  <table className="min-w-full bg-white text-left !text-sm font-light">
                    {/* Table Header */}
                    <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                      <tr className="font-semibold">
                        <th scope="col" className="!text-left pl-8 py-3">
                          Sr. No
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Punch In Time
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Punch Out Time
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Justify
                        </th>
                      </tr>
                    </thead>
                    {/* Table Body */}
                    <tbody>
                      {record.unavailableRecords.map(
                        (unavailableRecord, id) => (
                          <tr className="!font-medium border-b" key={id}>
                            <td className="!text-left pl-8 py-3">
                              {(currentPage - 1) * 10 + id + 1}
                            </td>
                            <td className="!text-left pl-6 py-3">
                              {new Date(
                                unavailableRecord.recordDate
                              ).toLocaleDateString()}
                            </td>
                            <td className="!text-left pl-6 py-3">
                              {unavailableRecord.status}
                            </td>
                            <td className="!text-left pl-6 py-3">
                              {unavailableRecord.punchInTime
                                ? new Date(
                                    unavailableRecord.punchInTime
                                  ).toLocaleTimeString()
                                : "-"}
                            </td>
                            <td className="!text-left pl-6 py-3">
                              {unavailableRecord.punchOutTime
                                ? new Date(
                                    unavailableRecord.punchOutTime
                                  ).toLocaleTimeString()
                                : "-"}
                            </td>
                            <td className="!text-left pl-6 py-3">
                              <IconButton
                                color="primary"
                                onClick={() =>
                                  handleMissPunchModalOpen(unavailableRecord)
                                }
                                disabled={
                                  Boolean(unavailableRecord.justify) ||
                                  unavailableRecord.leave ||
                                  unavailableRecord.shift
                                }
                              >
                                <Assignment />
                              </IconButton>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
                  <article className="flex items-center mb-1 text-red-500 gap-2">
                    <Info className="!text-2xl" />
                    <h1 className="text-lg font-semibold">No Data Found.</h1>
                  </article>
                </section>
              )}
            </article>
          ))
        ) : (
          <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
            <article className="flex items-center mb-1 text-red-500 gap-2">
              <Info className="!text-2xl" />
              <h1 className="text-lg font-semibold">No Data Found</h1>
            </article>
          </section>
        )}
        {/* Pagination */}
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
            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index}
                variant={index + 1 === currentPage ? "contained" : "outlined"}
                color="primary"
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
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
      </Container>

      {/* Modal */}
      <MissPunchJustifyModal
        handleClose={handleMissPunchModalClose}
        open={missPunchModalOpen}
        organisationId={organisationId}
        unavailableRecords={unavailableRecords}
        data={data}
      />
    </>
  );
};

export default MissPunchJustify;

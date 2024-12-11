import { Info, RequestQuote } from "@mui/icons-material";
import { Avatar, Container, Typography } from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import { useQuery, useQueryClient } from "react-query";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import UserProfile from "../../hooks/UserData/useUser";

const MissedPunchNotified = ({ employeeId }) => {
  // to define the state, hook , import other function if user needed
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { getCurrentUser, useGetCurrentRole } = UserProfile();
  const user = getCurrentUser();
  const role = useGetCurrentRole();
  const organisationId = user.organizationId;
  const queryClient = useQueryClient();

  // get unavailable record based on employee id
  const { data: unavailableRecord } = useQuery(
    ["unavailableRecords", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/unavailable-record/${employeeId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      queryClient.invalidateQueries("employee-missed-punch");
      return response.data.data;
    }
  );

  // for manager
  // approved by manager
  const handleApprovalUpdateByMgr = async (recordId) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/update-approvalId/${recordId}`,
        {},
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log(response);
      await queryClient.invalidateQueries([
        "unavailableRecords",
        organisationId,
      ]);
      handleAlert(true, "success", "Approval updated successfully.");
    } catch (error) {
      console.error("Error updating approval:", error);
      handleAlert(true, "error", "Failed to update approval.");
    }
  };

  //  reject by manager
  const handleRejectUnavailableRecord = async (recordId) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/reject-unavailable-record/${recordId}`,
        {},
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log(response);
      await queryClient.refetchQueries(["unavailableRecords", organisationId]);
      handleAlert(true, "success", "Record rejected successfully.");
    } catch (error) {
      console.error("Error approving record:", error);
      handleAlert(true, "error", "Failed to approve record.");
    }
  };

  // for hr
  //  for hr approved the unavailable record
  const handleApprovalUnavailableRecord = async (recordId) => {
    try {
      console.log("record id", recordId);
      const response = await axios.put(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/approved-unavailable-record/${recordId}`,
        {},
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log(response);
      await queryClient.refetchQueries(["unavailableRecords", organisationId]);
      handleAlert(true, "success", "Record approved successfully.");
    } catch (error) {
      console.error("Error approving record:", error);
      handleAlert(true, "error", "Failed to approve record.");
    }
  };

  // to define the function for approval the unpaid leave
  const handleApprovedUnpaidLeave = async (recordId) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/approved-leave-unavailable-record/${recordId}`,
        {},
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log(response);
      await queryClient.refetchQueries(["unavailableRecords", organisationId]);
      handleAlert(true, "success", "Approved leave successfully.");
    } catch (error) {
      console.error("Error approving record:", error);
      handleAlert(true, "error", "Failed to approve record.");
    }
  };

  // to define the function for approval the extra shift
  const handleApprovedExtraShift = async (recordId) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/approved-extra-shift-record/${recordId}`,
        {},
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log(response);
      await queryClient.refetchQueries(["unavailableRecords", organisationId]);
      handleAlert(true, "success", "Approved extra shift successfully.");
    } catch (error) {
      console.error("Error approving record:", error);
      handleAlert(true, "error", "Failed to approve record.");
    }
  };

  return (
    <>
      <Container maxWidth="xl" className="bg-gray-50 min-h-screen py-8 px-4 ">
        <div className="space-y-1 flex items-center gap-3 mb-4">
          <Avatar className="text-white !bg-blue-500">
            <RequestQuote />
          </Avatar>
          <div>
            <h1 className=" md:text-xl text-lg ">Missed Punch Requests</h1>
            <p className="text-sm">
              Here you will be able to approve or reject the missed punch
              notifications
            </p>
          </div>
        </div>
        {unavailableRecord && unavailableRecord.length > 0 ? (
          unavailableRecord.map((record, index) => (
            <article
              key={index}
              className=" bg-white w-full h-max shadow-md rounded-sm border items-center mb-4"
            >
              <Typography variant="h7" className=" pl-2 mb-20 mt-20">
                {record?.employeeId?.first_name} {record?.employeeId?.last_name}
              </Typography>

              {record?.unavailableRecords?.length > 0 ? (
                <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
                  <table className="min-w-full bg-white text-left !text-sm font-light">
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
                        <th scope="col" className="px-6 py-3">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {record &&
                        record.unavailableRecords &&
                        record.unavailableRecords.length > 0 &&
                        record.unavailableRecords.map(
                          (unavailableRecord, id) => (
                            <tr className="!font-medium border-b" key={id}>
                              <td className="!text-left pl-8 py-3">{id + 1}</td>
                              <td className="!text-left pl-6 py-3">
                                {new Date(
                                  unavailableRecord?.recordDate || ""
                                ).toLocaleDateString()}
                              </td>
                              <td className="!text-left pl-6 py-3">
                                {unavailableRecord?.status || ""}
                              </td>
                              <td className="!text-left pl-8 py-3">
                                {unavailableRecord?.punchInTime
                                  ? new Date(
                                    unavailableRecord.punchInTime
                                  ).toLocaleTimeString()
                                  : "-"}
                              </td>
                              <td className="!text-left pl-8 py-3">
                                {unavailableRecord?.punchOutTime
                                  ? new Date(
                                    unavailableRecord.punchOutTime
                                  ).toLocaleTimeString()
                                  : "-"}
                              </td>
                              <td className="!text-left pl-6 py-3">
                                {unavailableRecord?.justify ||
                                  unavailableRecord?.leave ||
                                  unavailableRecord?.shift ||
                                  ""}
                              </td>
                              <td className="!text-left pl-6 py-3">
                                {role === "Manager" ? (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleApprovalUpdateByMgr(
                                          unavailableRecord._id
                                        )
                                      }
                                      className="bg-green-500 text-white px-2 py-1 rounded-md mr-2"
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleRejectUnavailableRecord(
                                          unavailableRecord._id
                                        )
                                      }
                                      className="border border-red-500 text-red-500 px-2 py-1 ml-2 rounded-md bg-transparent"
                                    >
                                      Reject
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleApprovalUpdateByMgr(
                                          unavailableRecord._id
                                        )
                                      }
                                      className="border border-green-500 text-green-500 px-2 py-1 ml-2 rounded-md bg-transparent"
                                    >
                                      Approved Extra shift
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleApprovalUpdateByMgr(
                                          unavailableRecord._id
                                        )
                                      }
                                      className="border border-red-500 text-red-500 px-2 py-1 ml-2 rounded-md bg-transparent"
                                    >
                                      Approved Unpaid leave
                                    </button>
                                  </>
                                ) : role === "HR" ? (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleApprovalUnavailableRecord(
                                          unavailableRecord._id
                                        )
                                      }
                                      className="bg-green-500 text-white px-2 py-1 rounded-md mr-2"
                                    >
                                      Accept
                                    </button>

                                    <button
                                      onClick={() =>
                                        handleRejectUnavailableRecord(
                                          unavailableRecord._id
                                        )
                                      }
                                      className="bg-red-500 text-white px-2 py-1 rounded-md"
                                    >
                                      Reject
                                    </button>

                                    <button
                                      onClick={() =>
                                        handleApprovedExtraShift(
                                          unavailableRecord._id
                                        )
                                      }
                                      className="bg-green-500 text-white px-2 py-1 ml-2 rounded-md outline"
                                    >
                                      Approved Extra shift
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleApprovedUnpaidLeave(
                                          unavailableRecord._id
                                        )
                                      }
                                      className="bg-red-500 text-white px-2 py-1 ml-2 rounded-md"
                                    >
                                      Approved unpaid leave
                                    </button>
                                  </>
                                ) : null}
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
                    <h1 className="text-lg font-semibold">
                      No Missed Data Found
                    </h1>
                  </article>
                  <p>Calculate the hours of employee.</p>
                </section>
              )}
            </article>
          ))
        ) : (
          <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
            <article className="flex items-center mb-1 text-red-500 gap-2">
              <Info className="!text-2xl" />
              <h1 className="text-lg font-semibold">No Missed Data Found</h1>
            </article>
            <p>Calculate the hours of employee.</p>
          </section>
        )}
      </Container>
    </>
  );
};
export default MissedPunchNotified;

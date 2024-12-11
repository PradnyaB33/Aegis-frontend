import { Cancel, CheckCircle, Error, Info, Pending } from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import BasicButton from "../../components/BasicButton";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import ApplyAdvanceSalaryModal from "../../components/Modal/AdvanceSalaryModal/ApplyAdvanceSalaryModal";
import EditAdvanceSalaryModal from "../../components/Modal/AdvanceSalaryModal/EditAdvanceSalaryModal";
import UserProfile from "../../hooks/UserData/useUser";
import LoanManagementSkeleton from "../LoanManagement/LoanManagementSkeleton";
const AdvanceSalary = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const userId = user._id;
  const organisationId = user.organizationId;

  //to get advance salary data
  const { data: getEmployeeAdvanceSalaryData, isLoading } = useQuery(
    ["advanceSalary", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/${userId}/get-advancesalary-data`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );

  // for apply the advance salary modal
  const [applyAdvanceSalaryModalOpen, setAdvanceSalaryModalOpen] =
    useState(false);
  const handleApplyAdvanceSalaryModalOpen = () => {
    setAdvanceSalaryModalOpen(true);
  };
  const handleApplyAdvanceSalaryModalClose = () => {
    setAdvanceSalaryModalOpen(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toDateString();
  };

  // for edit the advance salary
  const [editAdvanceSalaryModalOpen, setEditAdvanceSalaryModalOpen] =
    useState(false);
  const [advanceSalary, setAdvanceSalary] = useState(null);
  const handleEditAdvanceSalaryModalOpen = (data) => {
    setEditAdvanceSalaryModalOpen(true);
    setAdvanceSalary(data);
  };
  const handleEditAdvanceSalaryModalClose = () => {
    setEditAdvanceSalaryModalOpen(false);
    setAdvanceSalary(null);
  };

  // for delete the query to delete record
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
  };

  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    handleCloseConfirmation();
  };

  const deleteMutation = useMutation(
    (id) =>
      axios.delete(
        `${process.env.REACT_APP_API}/route/delete-advance-salary-data/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("advanceSalary");
        handleAlert(
          true,
          "success",
          "Advance salary data deleted successfully"
        );
      },
    }
  );

  return (
    <>
      <BoxComponent>
        <div className="flex items-center justify-between">
          <HeadingOneLineInfo
            heading={"Advance Salary"}
            info={"Manage the advance salary here."}
          />
          <BasicButton
            color={"primary"}
            onClick={handleApplyAdvanceSalaryModalOpen}
            title={"Apply For Advance Salary"}
          />
        </div>
        <article className="  w-full h-max shadow-md rounded-sm border items-center">
          {/* <div className="p-4  border-b-[.5px] flex  justify-between  gap-3 w-full border-gray-300">
            {getEmployeeAdvanceSalaryData?.length > 0 && (
              <div className="flex gap-2 w-full">
                <h1 className="text-lg">Your current advance salary</h1>
              </div>
            )}

            <div className="flex justify-end w-full">
              <Button
                className="!font-semibold !bg-sky-500 flex gap-2"
                variant="contained"
                onClick={handleApplyAdvanceSalaryModalOpen}
              >
                <Add />
                Apply For Advance Salary
              </Button>
            </div>
          </div> */}
          {isLoading ? (
            <LoanManagementSkeleton />
          ) : getEmployeeAdvanceSalaryData?.length > 0 ? (
            <div className="overflow-auto !p-0  border-[.5px] border-gray-200">
              <table className="min-w-full bg-white  text-left !text-sm font-light">
                <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                  <tr className="!font-semibold ">
                    <th scope="col" className="!text-left pl-8 py-3 ">
                      Sr. No
                    </th>
                    <th scope="col" className="!text-left pl-8 py-3 ">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Total Salary
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Advance Salary Amount
                    </th>
                    <th scope="col" className="px-6 py-3">
                      No Of Month
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Starting Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Ending Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getEmployeeAdvanceSalaryData &&
                    getEmployeeAdvanceSalaryData.length > 0 &&
                    getEmployeeAdvanceSalaryData.map((advanceSalary, id) => (
                      <tr className="!font-medium border-b" key={id}>
                        <td className="!text-left pl-8 py-3 ">{id + 1}</td>
                        <td className="!text-left  pl-7 py-3 ">
                          {advanceSalary.status === "Pending" ? (
                            <div className="flex items-center gap-2">
                              <Pending className="text-yellow-400" />
                              <span className="text-yellow-400">Pending</span>
                            </div>
                          ) : advanceSalary.status === "Ongoing" ? (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="text-green-400" />
                              <span className="text-green-400">Ongoing</span>
                            </div>
                          ) : advanceSalary.status === "Rejected" ? (
                            <div className="flex items-center gap-2">
                              <Cancel className="text-red-400" />
                              <span className="text-red-400">Rejected</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Error className="text-gray-400" />
                              <span className="text-gray-400">
                                {advanceSalary.status}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="!text-left  pl-7 py-3 ">
                          {advanceSalary?.totalSalary || ""}
                        </td>
                        <td className="!text-left pl-6 py-3">
                          {" "}
                          {advanceSalary?.advancedSalaryAmounts || ""}
                        </td>
                        <td className="!text-left pl-8 py-3">
                          {" "}
                          {advanceSalary?.noOfMonth || ""}
                        </td>
                        <td className="py-3 pl-6">
                          {formatDate(
                            advanceSalary?.advanceSalaryStartingDate
                          ) || ""}
                        </td>
                        <td className="py-3 pl-6">
                          {formatDate(advanceSalary?.advanceSalaryEndingDate) ||
                            ""}
                        </td>
                        <td className="py-3 pl-6">
                          {advanceSalary.status === "Pending" && (
                            <>
                              <IconButton
                                color="primary"
                                aria-label="edit"
                                onClick={() =>
                                  handleEditAdvanceSalaryModalOpen(
                                    advanceSalary
                                  )
                                }
                              >
                                <EditOutlinedIcon />
                              </IconButton>
                              <IconButton
                                color="error"
                                aria-label="delete"
                                onClick={() =>
                                  handleDeleteConfirmation(advanceSalary?._id)
                                }
                              >
                                <DeleteOutlineIcon />
                              </IconButton>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
              <article className="flex items-center mb-1 text-red-500 gap-2">
                <Info className="!text-2xl" />
                <h1 className="text-lg font-semibold">
                  No advance salary data found
                </h1>
              </article>
              <p>Please apply for advance salary.</p>
            </section>
          )}
        </article>
      </BoxComponent>

      {/* for open advance salary */}
      <ApplyAdvanceSalaryModal
        handleClose={handleApplyAdvanceSalaryModalClose}
        open={applyAdvanceSalaryModalOpen}
        organisationId={organisationId}
      />

      {/* for edit advance salary */}
      <EditAdvanceSalaryModal
        handleClose={handleEditAdvanceSalaryModalClose}
        open={editAdvanceSalaryModalOpen}
        organisationId={organisationId}
        advanceSalary={advanceSalary}
      />

      {/* for delete */}
      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this advance salary data, as
            this action cannot be undone.
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseConfirmation}
            variant="outlined"
            color="primary"
            size="small"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleDelete(deleteConfirmation)}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdvanceSalary;

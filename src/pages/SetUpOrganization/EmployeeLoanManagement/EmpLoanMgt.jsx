import { Info } from "@mui/icons-material";
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
import { useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import BasicButton from "../../../components/BasicButton";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import AddLoanTypeModal from "../../../components/Modal/LoanTypeModal/AddLoanTypeModal";
import EditLoanTypeModal from "../../../components/Modal/LoanTypeModal/EditLoanTypeModal";
import Setup from "../Setup";
import EmployeeTypeSkeleton from "../components/EmployeeTypeSkeleton";
const EmpLoanMgt = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { organisationId } = useParams();
  const queryClient = useQueryClient();
  //for  Get Query
  const { data: getEmployeeLoan, isLoading } = useQuery(
    ["loanType", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-loan-type`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );
  console.log(getEmployeeLoan);
  // for add
  const [addModalOpen, setAddModalOpen] = useState(false);

  const handleAddModalOpen = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };
  // for delete
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
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/${id}/delete-loan-type`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        // Invalidate and refetch the data after successful deletion
        queryClient.invalidateQueries("loanType");
        handleAlert(true, "success", "Loan type deleted successfully");
      },
    }
  );

  // for update
  const [editLoanModalOpen, setEditLoanModalOpen] = useState(false);
  const [loanId, setLoanId] = useState(null);

  const handleEditModalOpen = (loanId) => {
    setEditLoanModalOpen(true);
    queryClient.invalidateQueries(["loanType", loanId]);
    setLoanId(loanId);
  };
  const handleEditModalClose = () => {
    setEditLoanModalOpen(false);
  };
  return (
    <BoxComponent sx={{ p: 0 }}>
      <Setup>
        <div className="h-[90vh] overflow-y-auto scroll px-3">
          <div className="xs:block sm:block md:flex justify-between items-center ">
            <HeadingOneLineInfo
              className="!my-3"
              heading="Loan Management"
              info="Manage the loan of employee here."
            />
            <BasicButton onClick={handleAddModalOpen} title="Add Loan Type" />
          </div>
          {isLoading ? (
            <EmployeeTypeSkeleton />
          ) : getEmployeeLoan?.length > 0 ? (
            <div className=" xs:mt-3 sm:mt-3 md:mt-0">
              <table className="min-w-full bg-white  text-left !text-sm font-light">
                <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                  <tr className="!font-semibold">
                    <th
                      scope="col"
                      className="whitespace-nowrap !text-left pl-8 py-3"
                    >
                      Sr. No
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap !text-left pl-8 py-3"
                    >
                      Loan Name
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap !text-left pl-8 py-3"
                    >
                      Minimum Loan Value
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap !text-left pl-8 py-3"
                    >
                      Maximum Loan value
                    </th>

                    <th
                      scope="col"
                      className="whitespace-nowrap !text-left pl-8 py-3"
                    >
                      Rate Of Interest In %
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap !text-left pl-8 py-3"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getEmployeeLoan?.map((empLoan, id) => (
                    <tr className="!font-medium border-b" key={id}>
                      <td className="whitespace-nowrap !text-left pl-8 ">
                        {id + 1}
                      </td>
                      <td className="whitespace-nowrap pl-8">
                        {empLoan?.loanName}
                      </td>
                      <td className="whitespace-nowrap pl-8">
                        {empLoan?.loanValue}
                      </td>
                      <td className="whitespace-nowrap pl-8">
                        {empLoan?.maxLoanValue}
                      </td>

                      <td className="whitespace-nowrap pl-8">
                        {empLoan?.rateOfInterest}
                      </td>
                      <td className="whitespace-nowrap pl-8">
                        <IconButton
                          color="primary"
                          aria-label="edit"
                          onClick={() => handleEditModalOpen(empLoan?._id)}
                        >
                          <EditOutlinedIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          aria-label="delete"
                          onClick={() => handleDeleteConfirmation(empLoan?._id)}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
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
                <h1 className="text-lg font-semibold">Add Loan Type</h1>
              </article>
              <p>No loan type found. Please add the loan type.</p>
            </section>
          )}
        </div>
      </Setup>

      {/* for add */}
      <AddLoanTypeModal
        handleClose={handleAddModalClose}
        open={addModalOpen}
        organisationId={organisationId}
      />

      {/* for update */}
      <EditLoanTypeModal
        handleClose={handleEditModalClose}
        organisationId={organisationId}
        open={editLoanModalOpen}
        loanId={loanId}
      />
      {/* for delete */}
      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this loan type, as this
            action cannot be undone.
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
    </BoxComponent>
  );
};

export default EmpLoanMgt;

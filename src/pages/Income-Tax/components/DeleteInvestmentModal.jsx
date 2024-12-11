import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import useDeleteInvestment from "../hooks/mutations/useDeleteInvestment";
import useGetSalaryByFY from "../hooks/queries/useGetSalaryByFY";
import useFunctions from "../hooks/useFunctions";

const DeleteInvestmentModal = () => {
  const { organisationId } = useParams();
  const { deleteConfirm, setDeleteConfirm } = useFunctions();
  const userSalary = useGetSalaryByFY().usersalary?.TotalInvestInvestment;
  console.log(`🚀 ~ deleteConfirm:`, deleteConfirm);
  const { handleDelete } = useDeleteInvestment(organisationId, userSalary);
  return (
    <div>
      <Dialog
        open={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>Please confirm your decision to delete this declaration?</p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteConfirm(null)}
            variant="outlined"
            color="primary"
            size="small"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            size="small"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteInvestmentModal;

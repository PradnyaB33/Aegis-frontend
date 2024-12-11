import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import { useQueryClient } from "react-query";
import { TestContext } from "../../../../State/Function/Main";
import useAuthToken from "../../../../hooks/Token/useAuth";
const DeleteGoal = ({ deleteConfirmation, handleClose }) => {
  const authToken = useAuthToken();
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API}/route/performance/deleteSingleGoal/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      queryClient.invalidateQueries("orggoals");
      handleAlert(true, "success", "Goal Deleted Successfully");
      handleClose();
    } catch (error) {
      console.log(`🚀 ~ error:`, error);
      // handleAlert("Failed to delete goal", "error");
    }
  };

  return (
    <>
      <Dialog open={deleteConfirmation !== null} onClose={handleClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p className="pr-20">
            Please confirm that you want to delete the goal{" "}
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            variant="outlined"
            color="primary"
            size="small"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleDelete(deleteConfirmation._id)}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteGoal;

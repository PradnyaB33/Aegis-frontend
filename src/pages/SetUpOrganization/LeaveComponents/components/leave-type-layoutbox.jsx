import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useQueryClient } from "react-query";
import { TestContext } from "../../../../State/Function/Main";
import { UseContext } from "../../../../State/UseState/UseContext";
import LeaveTypeModal from "../../../../components/Modal/LeaveTypeModal/leave-type-modal";
const LeaveTypeEditBox = ({ leaveType, index }) => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleEditType = () => {
    setOpen(true);
  };

  const handleDeleteTypeConfirmation = () => {
    setConfirmOpen(true);
  };

  const handleDeleteType = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API}/route/leave-types-details/${leaveType._id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      handleAlert(true, "success", response.data.message);
      queryClient.invalidateQueries("leaveTypes");
      setConfirmOpen(false);
    } catch (error) {
      console.error("Failed to delete leave type:", error);
      handleAlert(
        true,
        "error",
        error?.response?.data?.message ||
        "Failed to delete leave type. Please try again."
      );
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <tr
      id={index}
      className="!font-medium border-b"
    >
      <td className="whitespace-nowrap !text-left pl-8 ">{index + 1}</td>
      <td className="whitespace-nowrap pl-8">{leaveType.leaveName}</td>
      <td className="whitespace-nowrap pl-8">
        <Chip
          variant="outlined"
          size="small"
          color={leaveType.isActive ? "info" : "warning"}
          label={leaveType.isActive ? "active" : "In-Active"}
        />
      </td>
      <td className="whitespace-nowrap pl-8">
        <div
          className={`rounded-full overflow-hidden relative`}
          style={{
            height: "20px",
            width: "20px",
            background: leaveType.color,
          }}
        ></div>
      </td>
      <td className="whitespace-nowrap pl-8">{leaveType.count}</td>
      <td className="whitespace-nowrap pl-8">
        <IconButton onClick={handleEditType} color="primary" aria-label="edit">
          <EditOutlinedIcon />
        </IconButton>
        <IconButton
          onClick={handleDeleteTypeConfirmation}
          color="error"
          aria-label="delete"
        >
          <DeleteOutlineIcon />
        </IconButton>
      </td>

      <LeaveTypeModal
        open={open}
        handleClose={handleClose}
        id={leaveType._id}
        leaveType={leaveType}
      />
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please confirm your decision to delete the leave, as this action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setConfirmOpen(false);
            }}
            variant="outlined"
            color="primary"
            size="small"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleDeleteType}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </tr>
  );
};

export default LeaveTypeEditBox;

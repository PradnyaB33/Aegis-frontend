import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import EditDesignation from "./edit-form";

const DesignationRow = ({
  data,
  id,
  updateDesignationMutation,
  deleteDesignationMutation,
}) => {
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showEditDesignationModal, setShowEditDesignationModal] =
    useState(false);

  const [editDesignation, setEditDesignation] = useState(false);

  return (
    <tr className="!font-medium border-b" key={id}>
      <td className="whitespace-nowrap !text-left pl-8 ">{id + 1}</td>
      <td className="whitespace-nowrap pl-8">{data?.designationName}</td>
      <td className="whitespace-nowrap pl-8">
        <IconButton
          color="primary"
          aria-label="edit"
          onClick={() => setShowEditDesignationModal(true)}
        >
          <EditOutlined />
        </IconButton>
        <IconButton
          color="error"
          aria-label="delete"
          onClick={() => setShowConfirmationDialog(true)}
        >
          <DeleteOutline />
        </IconButton>
        <Dialog
          open={showConfirmationDialog}
          onClose={() => setShowConfirmationDialog(false)}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <p>
              Please confirm your decision to delete this designation, as this
              action cannot be undone.
            </p>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowConfirmationDialog(false)}
              variant="outlined"
              color="primary"
              size="small"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() =>
                deleteDesignationMutation({
                  designationId: data?._id,
                  onClose: () => setShowConfirmationDialog(false),
                })
              }
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={showEditDesignationModal}
          onClose={() => setShowEditDesignationModal(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to update this designation?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              variant="outlined"
              onClick={() => setShowEditDesignationModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setEditDesignation(true);
                setShowEditDesignationModal(false);
              }}
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>
        <EditDesignation
          open={editDesignation}
          handleClose={() => setEditDesignation(false)}
          defaultValues={data}
          updateDesignation={updateDesignationMutation}
        />
      </td>
    </tr>
  );
};

export default DesignationRow;

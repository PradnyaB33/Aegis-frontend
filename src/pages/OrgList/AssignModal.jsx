import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";
import BasicButton from "../../components/BasicButton";

const AssignModal = ({ open, onClose, mutation }) => {
  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to change your employment in the
            organisation. Be aware that changing your organisation will also
            switch your leaves and other data to the new organisation.
          </p>
        </DialogContent>
        <DialogActions>
          <BasicButton onClick={onClose}
            variant="outlined"
            title={"Cancel"}
          />
          <BasicButton title={"Submit"} onClick={() => mutation.mutate()} />
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AssignModal;

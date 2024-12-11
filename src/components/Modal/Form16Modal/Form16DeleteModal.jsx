import React, { useContext, useState } from "react";
import { Box, Button, Modal } from "@mui/material";
import axios from "axios";
import { TestContext } from "../../../State/Function/Main";
import { useQuery } from "react-query";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { UseContext } from "../../../State/UseState/UseContext";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
};
const Form16DeleteModal = ({
  handleClose,
  open,
  employeeId,
  organizationId,
}) => {
  console.log(employeeId);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { handleAlert } = useContext(TestContext);
  // Get Query
  const { data: form16 } = useQuery(
    ["form16"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get/form16/${organizationId}/${employeeId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    },
    {
      enabled: open,
    }
  );

  // delete confirmation box
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
  };

  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };
  // delete query
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API}/route/delete/form16/${organizationId}/${employeeId}`
      );
      handleAlert(true, "success", "Form 16 deleted succesfully.");
      setDeleteConfirmation(null);
      handleClose();
      window.location.reload();
    } catch (error) {
      console.error("Error deleting Form 16:", error);
      handleAlert(false, "error", "Error occured while form 16 deleted.");
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          className="border-none !z-10 !pt-0 !px-0 !w-[90%] lg:!w-[50%] md:!w-[60%] shadow-md outline-none rounded-md"
        >
          <div className="flex justify-between py-4 items-center  px-4">
            <h1 className="text-xl pl-2 font-semibold font-sans">
              Delete Form 16
            </h1>
          </div>
          {/* <object
            type="application/pdf"
            width="100%"
            height="400px"
            data={form16}
            aria-label="Form 16 PDF"
            className="w-full"
          /> */}
          {form16 ? (
            <object
              type="application/pdf"
              width="100%"
              height="400px"
              data={form16}
              aria-label="Form 16 PDF"
              className="w-full"
            />
          ) : (
            <p className="text-center mt-4">Form 16 is not uploaded.</p>
          )}
          <div className="px-5 space-y-4 mt-4">
            <div className="flex gap-4  mt-4 mr-4 justify-end mb-4 ">
              <Button onClick={handleClose} color="error" variant="outlined">
                Cancel
              </Button>
              <Button
                onClick={() => handleDeleteConfirmation(employeeId)}
                variant="contained"
                color="primary"
              >
                Delete Form 16
              </Button>
            </div>
          </div>
        </Box>
      </Modal>

      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this form 16, as this action
            cannot be undone.
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

export default Form16DeleteModal;

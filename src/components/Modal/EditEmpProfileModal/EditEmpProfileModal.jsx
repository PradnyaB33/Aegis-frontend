import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  Modal,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
};

const EditEmpProfileModal = ({ handleClose, open, userId }) => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const token = cookies["aegis"];

  // function to handle get additional detail of employee
  const [userData, setUserData] = useState("");
  const fetchAvailableUserProfileData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/get/profile/${userId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch User Profile Data");
    }
  };

  useEffect(() => {
    fetchAvailableUserProfileData();
    // eslint-disable-next-line
  }, []);

  // fetch the data of emp sal cal day of employee which is already stored in database
  // useEffect(() => {
  //   if (userData) {
  //     setAdditionalPhoneNumber(userData?.additional_phone_number || "");
  //     setStatusMessage(userData?.status_message || "");
  //     setChatId(userData?.chat_id || "");
  //   }
  // }, [userData]);

  return (
    <Modal
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      open={open}
      onClose={handleClose}
    >
      <Box
        sx={style}
        className="border-none !z-10 !pt-0 !px-0 !w-[90%] lg:!w-[50%] md:!w-[60%] shadow-md outline-none rounded-md"
      >
        <div className="flex justify-between py-4 items-center  px-4">
          <h1 id="modal-modal-title" className="text-lg pl-2 font-semibold">
            Update Data
          </h1>
          <IconButton>
            <CloseIcon className="!text-[16px]" onClick={handleClose} />
          </IconButton>
        </div>

        <div className="w-full">
          <Divider variant="fullWidth" orientation="horizontal" />
        </div>

        <div className="px-5 space-y-4 mt-4">
          <div className="space-y-2 ">
            <InputLabel> Phone Number</InputLabel>
            <FormControl sx={{ width: 300 }}>
              <TextField size="small" type="Number" fullWidth margin="normal" />
            </FormControl>
          </div>
          <div className="space-y-2 ">
            <InputLabel> Chat Id</InputLabel>
            <FormControl sx={{ width: 300 }}>
              <TextField size="small" type="text" fullWidth margin="normal" />
            </FormControl>
          </div>
          <div className="space-y-2 ">
            <InputLabel> Status Message</InputLabel>
            <FormControl sx={{ width: 300 }}>
              <TextField size="small" type="text" fullWidth margin="normal" />
            </FormControl>
          </div>

          <div className="flex gap-4  mt-4 justify-end">
            <Button color="error" variant="outlined" onClick={handleClose}>
              Cancel
            </Button>

            <Button variant="contained" color="primary">
              Update
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default EditEmpProfileModal;

import { Box, Modal, TextField, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import React, { useState } from 'react';
import axios from 'axios';
import UserProfile from "../../hooks/UserData/useUser";
import useAuthToken from '../../hooks/Token/useAuth';
import ModalHeading from '../../components/HeadingOneLineInfo/ModalHeading';
import BasicButton from '../../components/BasicButton';

function AddNewUserId({ open1, handleClose1 }) {
  const [newUserid, setNewUserid] = useState('');
  const [newUseridError, setNewUseridError] = useState('');
  const user = UserProfile().getCurrentUser();
  const authToken = useAuthToken();

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    overflow: 'auto',
    maxHeight: '80vh',

  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!newUserid) {
      setNewUseridError('User ID is required');
      return;
    }

    // Validate newUserid format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(newUserid)) {
      setNewUseridError('User ID must be a valid email format');
      return;
    }

    // Validate newUserid length
    if (newUserid.length < 3 || newUserid.length > 50) {
      setNewUseridError('User ID must be between 3 and 50 characters long');
      return;
    }

    try {
      // Make the POST request to your backend API
      await axios.post(
        `${process.env.REACT_APP_API}/route/employee/add-user-id`,
        {
          email: user?.email,
          newUserId: newUserid,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      // Reset newUserid and errors after successful submission
      setNewUserid('');
      setNewUseridError('');
      handleClose1(); // Close the modal after successful submission
    } catch (error) {
      // Handle the error from the backend
      if (error.response && error.response.data && error.response.data.message) {
        setNewUseridError(error.response.data.message);
      } else {
        setNewUseridError('Failed to add User ID. Please try again.');
      }
    }
  };

  return (
    <Modal
      open={open1}
      onClose={handleClose1}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={style}

      >
        <div className="flex w-[500px] p-4 items-center flex-col gap-5 justify-center overflow-hidden bg-[white] ">
          <div className="w-full">
            <div className="flex items-center justify-between">
              <ModalHeading heading={"Create Your UserID"} info={"Create UserID for your AEGIS account"} />
              <IconButton onClick={handleClose1}>
                <Close className="!text-lg" />
              </IconButton>
            </div>

          </div>
          <form className="w-full" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Enter New User ID *"
              value={newUserid}
              onChange={(e) => setNewUserid(e.target.value)}
              error={!!newUseridError}
              helperText={newUseridError}
              InputProps={{
                sx: {
                  height: '40px',
                  padding: '0',
                  fontSize: '12px'
                },
              }}
              InputLabelProps={{
                sx: {
                  mt: "-3px"
                },
              }}
            />
            <div className="w-full mt-2"><BasicButton className="!w-[100%]" title={"Create User ID"} type="submit" /></div>
          </form>
        </div>

      </Box>
    </Modal>
  );
}

export default AddNewUserId;




























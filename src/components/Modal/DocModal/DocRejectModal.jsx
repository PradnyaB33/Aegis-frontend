import EventBusyIcon from "@mui/icons-material/EventBusy";
import {
  Box,
  Button,
  Chip,
  Grid,
  Modal,
  Stack,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { UseContext } from "../../../State/UseState/UseContext";
import UserProfile from "../../../hooks/UserData/useUser";
import Loader from "../../../pages/Notification/Loader";

const DocRejectModal = ({ items }) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const [open, setOpen] = useState(false);
  const { getCurrentUser } = UserProfile();
  const { setAppAlert } = useContext(UseContext);
  const user = getCurrentUser();
  const userId = user._id;
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  const handleClose = () => {
    setOpen(false);
  };

  const rejectRequestMutation = useMutation(
    async () => {
      await axios.post(
        `${process.env.REACT_APP_API}/route/org/rejectNotification/${items._id}`,
        { message },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
    },
    {
      onSuccess: () => {
        setAppAlert({
          alert: true,
          type: "success",
          msg: "Request rejected successfully",
        });
        queryClient.invalidateQueries("doc-requests");
        handleClose();
      },
    }
  );

  const { mutate: acceptLeaveMutation, isLoading: mutateLoading } = useMutation(
    ({ id }) =>
      axios.post(
        `${process.env.REACT_APP_API}/route/org/acceptNotification/${id}`,
        { message: "Your Request is successfully approved" },
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        setAppAlert({
          alert: true,
          type: "success",
          msg: "Request accepted successfully",
        });
        queryClient.invalidateQueries("doc-requests");
      },
    }
  );

  if (mutateLoading) {
    return <Loader />;
  }

  const handleSubmit = () => {
    rejectRequestMutation.mutate();
  };

  const filteredEmployeeIds = items.employeeId.filter(
    (employee) => employee.mId === userId
  );

  return (
    <>
      <Grid
        container
        spacing={2}
        className="bg-white w-full p-8"
        sx={{
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          borderRadius: "5px",
        }}
      >
        <Grid item className="gap-1  py-4 w-full  h-max space-y-4">
          <Box className="flex md:flex-row items-center  justify-center flex-col gap-8  md:gap-16">
            <div className="space-y-4 w-full flex flex-col items-center md:items-start justify-center">
              <h1 className="text-xl px-4 md:!px-0 font-semibold ">
                {items?.creatorId?.first_name} {items?.creatorId?.last_name} has
                raised a Doc request for sending to{" "}
                {filteredEmployeeIds[0]?.empId.first_name}{" "}
                {filteredEmployeeIds[0]?.empId.last_name}
              </h1>
              <Chip
                label={items?.description}
                size="small"
                sx={{
                  backgroundColor: items?.color,
                  color: "#ffffff",
                }}
              />

              {filteredEmployeeIds.length > 0 ? (
                <Box sx={{ mt: 3, mb: 3 }}>
                  <Stack direction="row" spacing={3}>
                    <Button
                      variant="contained"
                      onClick={() => acceptLeaveMutation({ id: items._id })}
                      color="primary"
                      sx={{
                        fontSize: "12px",
                        padding: "5px 30px",
                        textTransform: "capitalize",
                      }}
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      variant="contained"
                      sx={{
                        fontSize: "12px",
                        padding: "5px 30px",
                        textTransform: "capitalize",
                        backgroundColor: "#BB1F11",
                        "&:hover": {
                          backgroundColor: "#BB1F11",
                        },
                      }}
                    >
                      Reject
                    </Button>
                  </Stack>
                </Box>
              ) : (
                <Box>
                  <Chip label="Request already handled" color="default" />
                </Box>
              )}
            </div>
          </Box>
        </Grid>
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        keepMounted
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "rgba(255, 255, 255, 0.9)",
            p: 4,
          }}
          className="border-none md:w-[40%] w-[40%] shadow-md outline-none rounded-md"
        >
          <header className="flex items-center mb-4 gap-2">
            <EventBusyIcon className="h-4 w-4 text-gray-700 !text-[1.7rem]" />
            <h1
              id="modal-modal-title"
              className="text-xl font-semibold leading-relaxed "
            >
              Reject leave request
            </h1>
          </header>
          <form onSubmit={handleSubmit}>
            <div className="w-full space-y-2 flex flex-col">
              <TextField
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                size="small"
                id="outlined-basic"
                label="Enter Description for rejecting the leave request"
                variant="outlined"
              />
            </div>
            <div className="flex gap-4 mt-4 justify-end">
              <Button
                type="button"
                size="small"
                onClick={async (e) => {
                  await handleClose();
                }}
                color="error"
                variant="contained"
              >
                cancel
              </Button>
              <Button
                type="submit"
                size="small"
                variant="contained"
                color="primary"
              >
                submit
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default DocRejectModal;

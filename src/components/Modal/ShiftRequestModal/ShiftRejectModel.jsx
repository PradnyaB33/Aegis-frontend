import { CalendarMonth } from "@mui/icons-material";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import {
  Badge,
  Box,
  Button,
  Chip,
  Grid,
  Modal,
  Stack,
  TextField,
} from "@mui/material";
import axios from "axios";
import { differenceInDays, format, parseISO } from "date-fns";
import dayjs from "dayjs";
import React, { useContext, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { UseContext } from "../../../State/UseState/UseContext";
// import Loader from "../../../pages/Notification/Loader";
import moment from "moment";
import UserProfile from "../../../hooks/UserData/useUser";

const ShiftRejectModel = ({ items, key }) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();
  const { setAppAlert } = useContext(UseContext);
  // const [emp, setEmp] = useState([]);
  let isAcc = false;
  let isSuper = false;
  const profileArr = user.profile;

  profileArr.forEach((element) => {
    if (element === "Accountant") {
      isAcc = true;
    }
    if (element === "Super-Admin") {
      isSuper = true;
    }
  });

  const handleClose = () => {
    setOpen(false);
  };

  const acceptLeaveMutation = useMutation(
    async (id) =>
      axios.post(
        `${process.env.REACT_APP_API}/route/shiftApply/accept/${id}`,
        { message: "Your Request is successfully approved" },
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("shift-request");
        queryClient.invalidateQueries("ShiftData");
        queryClient.invalidateQueries("ShiftData2");

        setAppAlert({
          alert: true,
          type: "success",
          msg: "Request Accepted Successfully",
        });
      },
    }
  );

  const acceptAccMutation = useMutation(
    async (id) =>
      axios.post(
        `${process.env.REACT_APP_API}/route/shiftApply/acceptAcc/${id}`,
        { message: "Your Request is successfully approved" },
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("shift-request");
        queryClient.invalidateQueries("ShiftData");
        queryClient.invalidateQueries("ShiftData2");
        setAppAlert({
          alert: true,
          type: "success",
          msg: "Request Accepted Successfully",
        });
      },
    }
  );

  const rejectAccRequestMutation = useMutation(
    async () =>
      axios.post(
        `${process.env.REACT_APP_API}/route/shiftApply/rejectAcc/${items._id}`,
        { message },
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
          msg: "Request Rejected Successfully",
        });
        queryClient.invalidateQueries("shift-request");
        queryClient.invalidateQueries("ShiftData");
        queryClient.invalidateQueries("ShiftData2");
        handleClose();
      },
    }
  );

  const rejectRequestMutation = useMutation(
    async () =>
      axios.post(
        `${process.env.REACT_APP_API}/route/shiftApply/reject/${items._id}`,
        { message },
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
          msg: "Request Rejected Successfully",
        });
        queryClient.invalidateQueries("shift-request");
        queryClient.invalidateQueries("ShiftData");
        queryClient.invalidateQueries("ShiftData2");
        handleClose();
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAcc && isSuper) {
      rejectRequestMutation.mutate();
    } else if (isAcc) {
      rejectAccRequestMutation.mutate();
    } else {
      rejectRequestMutation.mutate();
    }
  };
  return (
    <>
      <Box>
        <Grid
          container
          className="bg-white w-full"
          sx={{
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            borderRadius: "5px",
          }}
        >
          <Grid item className="gap-1  py-4 w-full  h-max space-y-4">
            <Box className="flex md:flex-row items-center  justify-center flex-col gap-8  md:gap-16">
              <div className="w-max gap-4 flex flex-col items-center">
                <Badge
                  badgeContent={`${dayjs(items.end).diff(
                    dayjs(items.start),
                    "day"
                  )} days`}
                  color="info"
                  variant="standard"
                >
                  <Button
                    variant="contained"
                    size="large"
                    className="!rounded-full !bg-gray-100  !h-16 !w-16 group-hover:!text-white !text-black"
                    color="info"
                  >
                    <CalendarMonth className="!text-4xl text-gr" />
                  </Button>
                </Badge>
              </div>

              <div className="space-y-4 w-full flex flex-col items-center md:items-start justify-center">
                <h1 className="text-xl px-4 md:!px-0 font-semibold ">
                  {differenceInDays(
                    parseISO(items.end),
                    parseISO(items.start)
                  ) !== 1 ? (
                    <h1 className="text-xl px-4 md:!px-0 font-semibold ">
                      {items?.employeeId?.first_name}{" "}
                      {items?.employeeId?.last_name} has raised a {items?.title}{" "}
                      request on {format(new Date(items.start), "dd-MM-yyyy")} to{" "}
                      {moment(items.end).subtract(1, "days").format("DD-MM-YYYY")}
                    </h1>
                  ) : (
                    <h1>
                      {" "}
                      {items?.employeeId?.first_name}{" "}
                      {items?.employeeId?.last_name} has raised a {items?.title}{" "}
                      request on {format(new Date(items.start), "dd-MM-yyyy")}
                    </h1>
                  )}
                </h1>

                <Chip
                  label={items?.status}
                  size="small"
                  sx={{
                    backgroundColor: items?.color,
                    color: "#ffffff",
                  }}
                />
                {isAcc && isSuper ? (
                  <Box sx={{ mt: 3, mb: 3 }}>
                    <Stack direction="row" spacing={3}>
                      <Button
                        variant="contained"
                        onClick={() => acceptLeaveMutation.mutate(items._id)}
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
                        onClick={() => setOpen(true)}
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
                ) : isAcc ? (
                  <Box sx={{ mt: 3, mb: 3 }}>
                    <Stack direction="row" spacing={3}>
                      <Button
                        variant="contained"
                        onClick={() => acceptAccMutation.mutate(items._id)}
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
                        onClick={() => setOpen(true)}
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
                  <Box sx={{ mt: 3, mb: 3 }}>
                    <Stack direction="row" spacing={3}>
                      <Button
                        variant="contained"
                        onClick={() => acceptLeaveMutation.mutate(items._id)}
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
                        onClick={() => setOpen(true)}
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
                )}

                {/* 
              {isAcc ? (
                items.status === "Approved" ? (
                  <Box sx={{ mt: 3, mb: 3 }}>
                    <Stack direction="row" spacing={3}>
                      <Button
                        variant="contained"
                        onClick={() => acceptAccMutation({ id: items._id })}
                        color="primary"
                        sx={{
                          fontSize: "12px",
                          padding: "5px 30px",
                          textTransform: "capitalize",
                        }}
                      >
                        Accept1
                      </Button>
                      <Button
                        onClick={() => setOpen(true)}
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
                        Reject1
                      </Button>
                    </Stack>
                  </Box>
                ) : items.status === "Rejected" ? (
                  <Box>
                    <Chip label="Request rejected" color="error" />
                  </Box>
                ) : (
                  <Box>
                    <Chip label="Request Approved" color="success" />
                  </Box>
                )
              ) : items.status === "Pending" ? (
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
                      onClick={() => setOpen(true)}
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
              ) : items.status === "Rejected" ? (
                <Box>
                  <Chip label="Request rejected" color="error" />
                </Box>
              ) : (
                <Box>
                  <Chip label="Request Approved" color="success" />
                </Box>
              )} */}
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
                  onClick={handleClose}
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
      </Box >
    </>
  );
};

export default ShiftRejectModel;

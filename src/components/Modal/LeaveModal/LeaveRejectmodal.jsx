import EventBusyIcon from "@mui/icons-material/EventBusy";
import { Box, Button, Chip, Modal, Stack, TextField } from "@mui/material";
import axios from "axios";
import {
  differenceInDays,
  differenceInMinutes,
  format,
  parseISO,
} from "date-fns";
import moment from "moment";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import useAuthToken from "../../../hooks/Token/useAuth";
import Loader from "../../../pages/Notification/Loader";
import useNotificationCount from "../../app-layout/notification-zustand";
import useLeaveData from "./useLeaveData";

const LeaveRejectmodal = ({ items, isLoading, isFetching, length }) => {
  // const { cookies } = useContext(UseContext);
  // const { cookies } = useContext(UseContext);
  const authToken = useAuthToken();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();
  const { acceptDeleteLeaveMutation, rejectDeleteLeaveMutation } =
    useLeaveData();
  const { reduceNotificationCount } = useNotificationCount();

  const handleClose = () => {
    setOpen(false);
  };

  const { mutate: rejectMutate, isLoading: rejectLoading } = useMutation(
    async (length) => {
      await axios.post(
        `${process.env.REACT_APP_API}/route/leave/reject/${items._id}`,
        { message },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      reduceNotificationCount(length);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("employee-leave");
        queryClient.invalidateQueries("EmpDataLeave");
        handleClose();
      },
    }
  );
  const { mutateAsync: acceptLeaveMutation, isLoading: mutateLoading } =
    useMutation(
      ({ id, length }) => {
        axios.post(
          `${process.env.REACT_APP_API}/route/leave/accept/${id}`,
          { message: "Your Request is successfully approved" },
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        reduceNotificationCount(length);
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries("employee-leave");
          await queryClient.invalidateQueries("EmpDataLeave");
        },
      }
    );

  if (mutateLoading) {
    return <Loader />;
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    rejectMutate(length); // Trigger the mutation
  };

  return (
    <Box
      //className="py-2 space-y-5 h-max"
      sx={{
        // flexGrow: 1,
        py: 1,
      }}
    >
      <Box className="flex md:flex-row items-center  justify-center flex-col gap-1 ">
        {/* <div className="w-max gap-4 flex flex-col items-center">
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
              {items?.status === "Deleted" ? (
                <Chip label={"Delete Request"} size="small" />
              ) : (
                <Chip label={"Request"} size="small" />
              )}
            </div> */}

        <div className="space-y-1 w-full flex flex-col items-center md:items-start justify-center">
          <div className="flex md:flex-row flex-col items-center bg-white py-1 px-4 border rounded-md w-full justify-between">
            <div>
              {differenceInDays(parseISO(items.end), parseISO(items.start)) !==
              1 ? (
                items?.status === "Deleted" ? (
                  <div className="space-y-1">
                    <h1 className="text-xl  tracking-tighter text-gray-500 font-bold lowercase ">
                      {items?.creatorId?.first_name}{" "}
                      {items?.creatorId?.last_name}
                      {!items?.creatorId?._id ||
                      items?.creatorId?._id === items?.employeeId?._id
                        ? " has filed a request to deny "
                        : ` has filed request to deny of ${items?.employeeId?.first_name} ${items?.employeeId?.last_name} for `}
                      {items?.leaveTypeDetailsId?.leaveName}
                    </h1>
                    <p>
                      {moment(items.end).isSame(items.start) ? "for" : "from"}{" "}
                      {format(new Date(items.start), "dd-MM-yyyy")}
                      {moment(items.end).isSame(items?.start)
                        ? ""
                        : ` to ${moment(items.end).format("DD-MM-YYYY")}`}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <h1 className="text-xl  tracking-tighter text-gray-500 font-bold lowercase ">
                      {items?.creatorId
                        ? `${items?.creatorId?.first_name}
                    ${items?.creatorId?.last_name}`
                        : `${items?.employeeId?.first_name}
                    ${items?.employeeId?.last_name}`}{" "}
                      {items?.creatorId?._id === items?.employeeId?._id
                        ? "has requested "
                        : `has raised a request for ${items?.employeeId?.first_name} ${items?.employeeId?.last_name} for `}
                      {items?.leaveTypeDetailsId?.leaveName}{" "}
                      {items?.justification && "against biometric attendance"}
                    </h1>

                    <p>
                      {moment(items.end).isSame(items.start) ? "for" : "from"}{" "}
                      {format(new Date(items.start), "dd-MM-yyyy")}
                      {moment(items.end).isSame(items?.start)
                        ? ""
                        : ` to ${moment(items.end).format("DD-MM-YYYY")}`}
                    </p>

                    {items?.justification && (
                      <div className="flex flex-wrap items-center gap-4">
                        <p className={"bg-gray-50 border p-1 rounded-lg"}>
                          Check In Time :{" "}
                          {format(new Date(items?.punchInTime), "hh:mm a")}
                        </p>
                        <p className={"bg-gray-50 border p-1 rounded-lg"}>
                          Check Out Time :{" "}
                          {items?.punchOutTime
                            ? format(new Date(items?.punchOutTime), "hh:mm a")
                            : "Checkout not done"}
                        </p>

                        {items?.punchOutTime && (
                          <div className="flex  gap-1 w-max p-1 rounded-lg bg-gray-50 border">
                            <h1>Available Time:</h1>{" "}
                            {Math.floor(
                              differenceInMinutes(
                                new Date(items?.punchOutTime),
                                new Date(items?.punchInTime)
                              ) / 60
                            )}{" "}
                            hours{" "}
                            <p>
                              {differenceInMinutes(
                                new Date(items?.punchOutTime),
                                new Date(items?.punchInTime)
                              ) % 60}{" "}
                              minutes
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              ) : items?.status === "Deleted" ? (
                <h1 className="text-xl  tracking-tighter text-gray-500 font-bold lowercase ">
                  {items?.creatorId?.first_name +
                    " " +
                    items?.creatorId?.last_name}
                  {!items?.creatorId?._id ||
                  items?.creatorId?._id === items?.employeeId?._id
                    ? "has requested "
                    : `has filed a request to deny for ${items?.employeeId?.first_name} ${items?.employeeId?.last_name} `}
                  {items?.leaveTypeDetailsId?.leaveName} from{" "}
                  {format(new Date(items.start), "dd-MM-yyyy")}{" "}
                  {moment(items.end).isSame(items?.start)
                    ? ""
                    : `to ${moment(items.end).format("DD-MM-YYYY")}`}
                  {/* {items?.employeeId?.first_name} {items?.employeeId?.last_name}{" "}
                  has filed a request to deny{" "}
                  {items?.leaveTypeDetailsId?.leaveName} on{" "}
                  {format(new Date(items.start), "dd-MM-yyyy")} */}
                </h1>
              ) : (
                <h1 className="text-xl  tracking-tighter text-gray-500 font-bold lowercase ">
                  {items?.creatorId
                    ? `${items?.creatorId?.first_name}
                    ${items?.creatorId?.last_name}`
                    : `${items?.employeeId?.first_name}
                    ${items?.employeeId?.last_name}`}{" "}
                  {!items?.creatorId?._id ||
                  items?.creatorId?._id === items?.employeeId?._id
                    ? "has requested "
                    : `has raised a leave request for ${items?.employeeId?.first_name} ${items?.employeeId?.last_name} `}
                  {items?.leaveTypeDetailsId?.leaveName} from{" "}
                  {format(new Date(items.start), "dd-MM-yyyy")}{" "}
                  {moment(items.end).isSame(items?.start)
                    ? ""
                    : ` to ${moment(items.end).format("DD-MM-YYYY")}`}
                </h1>
                // <h1 className="text-xl px-4 md:!px-0 font-semibold ">
                //   {" "}
                //   {items?.employeeId?.first_name} {items?.employeeId?.last_name}{" "}
                //   has raised a {items?.leaveTypeDetailsId?.leaveName} request on{" "}
                //   {format(new Date(items.start), "dd-MM-yyyy")}
                // </h1>
              )}

              {(items?.message || items?.justification) && (
                <p className={"bg-gray-50 my-2 w-max border p-1 rounded-lg"}>
                  {items?.justification ? "Justification : " : "Message : "}{" "}
                  {items?.justification ?? items?.message}
                </p>
              )}
            </div>

            {/* {items?.status === "Deleted" ? (
                <Chip label={`Reason: ${items?.message}`} size="small" />
              ) : (
                <Chip
                  label={items?.description}
                  size="small"
                  sx={{
                    backgroundColor: items?.color,
                    color: "#ffffff",
                  }}
                />
              )} */}

            <div>
              {items.status === "Pending" ? (
                <Box sx={{ mt: 3, mb: 3 }}>
                  <Stack direction="row" spacing={3}>
                    <Button
                      disabled={mutateLoading || isFetching}
                      variant="contained"
                      onClick={async () =>
                        await acceptLeaveMutation({ id: items._id, length })
                      }
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
                      disabled={rejectLoading || isFetching || mutateLoading}
                    >
                      Reject
                    </Button>
                  </Stack>
                </Box>
              ) : items.status === "Rejected" ? (
                <Box>
                  <Chip label="Request rejected" color="error" />
                </Box>
              ) : items.status === "Deleted" ? (
                <Box sx={{ mt: 3, mb: 3 }}>
                  <Stack direction="row" spacing={3}>
                    <Button
                      disabled={isLoading || isFetching}
                      variant="contained"
                      onClick={() =>
                        acceptDeleteLeaveMutation({ id: items._id })
                      }
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
                      onClick={() =>
                        rejectDeleteLeaveMutation({ id: items._id })
                      }
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
                  <Chip label="Request Approved" color="success" />
                </Box>
              )}
            </div>
          </div>
        </div>
      </Box>

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
                  handleClose();
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
                disabled={rejectLoading}
              >
                submit
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default LeaveRejectmodal;

import {
  Container,
  Dialog,
  DialogContent,
  Typography,
  Grid,
  IconButton,
  Button,
} from "@mui/material";
import { Close, Delete } from "@mui/icons-material";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import MyToolbar from "../../../pages/ViewCalculateAttendance/MyToolbar";
import { useContext, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";

const ViewAttendanceCallModal = ({
  handleClose,
  open,
  employee,
  organisationId,
}) => {
  // to define the state , hook and import other function if needed
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const [selectedEvent, setSelectedEvent] = useState(null);
  const queryClient = useQueryClient();
  const localizer = momentLocalizer(moment);

  // to map the punching data from employee
  const events = employee?.punchingData.map((data) => ({
    ...data,
    title: data.status,
    start: new Date(data.recordDate),
    end: new Date(data.recordDate),
  }));

  console.log("events", events);

  // to define the functin for open the event
  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  // to define the function for close the event
  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  // to delete the query for delete single record s
  const handleDelete = () => {
    const id = selectedEvent._id;
    console.log("id", id);
    deleteMutation.mutate(id);
  };
  const deleteMutation = useMutation(
    (id) =>
      axios.delete(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/delete-record/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        // Invalidate and refetch the data after successful deletion
        queryClient.invalidateQueries("empAttendanceData");
        handleAlert(true, "success", "Record deleted succesfully");
        setSelectedEvent(null);
        handleClose();
      },
    }
  );

  return (
    <Dialog
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "1000px!important",
          height: "100%",
          maxHeight: "80vh!important",
        },
      }}
      open={open}
      onClose={handleCloseModal}
      className="w-full"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <DialogContent className="border-none  !pt-0 !px-0  shadow-md outline-none rounded-md">
        <Container maxWidth="xl" className="bg-gray-50 ">
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            className="mt-5 mb-5"
          >
            <Grid item>
              <Typography variant="h6" className="  mb-6 mt-4 ">
                Calendar View
              </Typography>
              <Typography variant="h7" className="  mb-6 mt-4 ">
                Employee Name : {employee?.EmployeeId?.first_name}{" "}
                {employee?.EmployeeId?.last_name}
              </Typography>
              <br></br>
              <Typography variant="h7" className="  mb-6 mt-4 ">
                Employee Id : {employee?.EmployeeId?.empId}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </Grid>
          </Grid>

          <div style={{ height: 500 }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500, margin: "50px auto", width: "100%" }}
              views={["month"]}
              onSelectEvent={handleEventClick}
              components={{ toolbar: (props) => <MyToolbar {...props} /> }}
            />
          </div>
        </Container>
      </DialogContent>

      {/* Modal to display event details */}
      <Dialog
        open={selectedEvent !== null}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <DialogContent>
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Details
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <Close />
            </IconButton>
          </Grid>
          {selectedEvent && (
            <div>
              <Typography>
                Punch In Time:{" "}
                {selectedEvent && selectedEvent.punchInTime
                  ? moment(selectedEvent.punchInTime).format("HH:mm:ss")
                  : "0"}
              </Typography>

              <Typography>
                Punch Out Time:{" "}
                {selectedEvent && selectedEvent.punchOutTime
                  ? moment(selectedEvent.punchOutTime).format("HH:mm:ss")
                  : "0"}
              </Typography>

              <Typography>
                Record Date:{" "}
                {moment(selectedEvent.recordDate).format("YYYY-MM-DD")}
              </Typography>
              <Typography>Status: {selectedEvent.status}</Typography>
              <Typography>
                Total Hours:{" "}
                {selectedEvent && selectedEvent.totalHours
                  ? selectedEvent.totalHours
                  : "0"}
              </Typography>

              {/* Delete button */}
              <div className=" mt-4 text-center">
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Delete />}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default ViewAttendanceCallModal;

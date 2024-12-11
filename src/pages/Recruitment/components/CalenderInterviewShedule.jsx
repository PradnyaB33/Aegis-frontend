import React, { useState, useEffect, useContext } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import { useMutation, useQuery } from "react-query"; // Import useMutation
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import useGetUser from "../../../hooks/Token/useUser";
import { useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import { Email } from "@mui/icons-material";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import UserProfile from "../../../hooks/UserData/useUser";

const CalenderInterviewShedule = () => {
    const { authToken } = useGetUser();
    const { applicantId, organisationId, jobId } = useParams();
    const { handleAlert } = useContext(TestContext);
    const { getCurrentUser } = UserProfile();
    const user = getCurrentUser();

    const selfApplicantID = user?._id;
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedCell, setSelectedCell] = useState({});
    const [dates, setDates] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // Store current month
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // Store current year

    const { control, formState, handleSubmit, reset, setValue } = useForm({
        defaultValues: {
            employeeName: "",
            notes: "",
            from: "",
            hiringManagerTo: "",
            to: "",
        },
    });
    const { errors } = formState;

    const times = ["1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM", "12AM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM", "12PM"];

    // Helper function to get dates of a particular month and year
    const getCurrentWeekDates = (month, year) => {
        const startOfMonth = new Date(year, month, 1); // First day of the month
        const firstDayOfWeek = startOfMonth.getDate() - startOfMonth.getDay(); // Find the first day of the week (Sunday)
        const startOfWeek = new Date(startOfMonth.setDate(firstDayOfWeek));

        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startOfWeek);
            currentDate.setDate(startOfWeek.getDate() + i);
            const day = currentDate.toLocaleString("en-us", { weekday: "short" });
            weekDates.push({ day, date: currentDate.getDate() });
        }
        return weekDates;
    };

    useEffect(() => {
        const weekDates = getCurrentWeekDates(currentMonth, currentYear);
        setDates(weekDates);
    }, [currentMonth, currentYear]); // Re-run whenever currentMonth or currentYear changes

    const handleDateRangeChange = (range) => {
        const [start, end] = range;
        setStartDate(start);
        setEndDate(end);
        const newDates = generateDatesInRange(start, end);
        setDates(newDates);
    };

    const generateDatesInRange = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const datesArray = [];
        let currentDate = startDate;

        while (currentDate <= endDate) {
            const day = currentDate.toLocaleString("en-us", { weekday: "short" });
            datesArray.push({ day, date: currentDate.getDate() });
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return datesArray;
    };

    const convertTo24HourFormat = (time) => {
        const regex = /(\d+)(AM|PM)/i;
        const match = time.match(regex);

        if (!match) return time; // Return original time if it's already in HH:mm format

        let hour = parseInt(match[1], 10);
        const period = match[2].toUpperCase(); // AM or PM

        if (period === "AM" && hour === 12) {
            hour = 0; // 12AM should be 00:00
        } else if (period === "PM" && hour !== 12) {
            hour += 12; // PM times should add 12 (e.g., 1PM -> 13:00)
        }

        return `${hour < 10 ? "0" : ""}${hour}:00`; // Return time in HH:mm format
    };

    // const handleCellClick = (day, date, time, month, year) => {
    //     const convertedTime = convertTo24HourFormat(time); // Convert AM/PM time to HH:mm
    //     setSelectedCell({ day, date, time: convertedTime, month, year });
    //     setDialogOpen(true);
    // };
    const handleCellClick = (day, date, time, month, year, applicant) => {
        const convertedTime = convertTo24HourFormat(time); // Convert AM/PM time to HH:mm

        // Check if the selected date and time match any existing interview
        const interviewDetails = application?.interviewDetails;
        const selectedDate = new Date(year, month - 1, date);
        const interviewDate = new Date(interviewDetails?.date);

        if (interviewDate.toLocaleDateString() === selectedDate.toLocaleDateString() && interviewDetails?.time === convertedTime) {
            setSelectedCell({
                ...selectedCell,
                day,
                date,
                time: convertedTime,
                month,
                year,
                interviewer: interviewDetails?.interviewer,
                scheduledBy: interviewDetails?.scheduledBy,
            });
        } else {
            setSelectedCell({
                day,
                date,
                time: convertedTime,
                month,
                year,
            });
        }
        if (applicant) {
            const selectedCell = { day, date, time, month, year };
            setSelectedCell(selectedCell);

            // Save applicantId and interview details to state
            setSelectedInterview({
                applicantId: applicant?._id,
                interviewDetails: applicant?.interviewDetails
            });
            setDialogOpen1(true); // Open the first dialog if applicant exists
        } else {
            setDialogOpen(true); // Open the second dialog if applicant is not present
        }

    };

    const closeDialog = () => {
        setDialogOpen(false);
        reset();
    };

    const { data: application } = useQuery(
        ["jobApplicationDetails", organisationId, jobId, applicantId],
        async () => {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/job-application/${jobId}/${applicantId}`,
                {
                    headers: { Authorization: authToken },
                }
            );
            return response.data.data;
        },
        { enabled: !!authToken }
    );
    console.log("application", application);

    useEffect(() => {
        if (application) {
            setValue("employeeName", `${application?.applicantId?.first_name} ${application?.applicantId?.last_name}`);
            setValue("from", user?.email);
            setValue("to", application?.email);
        }
    }, [application, user?.email, setValue]);

    const scheduleInterviewMutation = useMutation(
        async (payload) => {
            const response = await axios.patch(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/job-application/${applicantId}/interview`,
                payload,
                { headers: { Authorization: authToken } }
            );
            return response.data;
        },
        {
            onSuccess: () => {
                handleAlert(true, "success", "Interview scheduled successfully!");
            },
            onError: (error) => {
                handleAlert(true, "error", "Failed to schedule the interview. Try again.");
            },
        }
    );

    const formatDateToISOString = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, so add 1
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const onSubmit = (data) => {
        // Create a new Date object from the selected cell values
        const selectedDate = new Date(selectedCell.year, selectedCell.month - 1, selectedCell.date);

        // Format the date to 'YYYY-MM-DD'
        const formattedDate = formatDateToISOString(selectedDate);

        // Create the payload with the formatted date
        const payload = {
            date: formattedDate, // Use the formatted date here
            time: selectedCell.time,
            day: selectedCell.day,
            scheduledBy: data?.from,
            interviewer: data.hiringManagerTo[0]?.value,
            interviewDescription: data.notes,
            applicantEmail: data?.to
        };

        // Call the mutation function to schedule the interview
        scheduleInterviewMutation.mutate(payload);
    };


    const { data: employee } = useQuery(
        ["employee", organisationId],
        async () => {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/route/employee/${organisationId}/get-emloyee`,
                {
                    headers: { Authorization: authToken },
                }
            );
            return response.data.employees;
        }
    );

    const employeeEmail = employee
        ? employee?.map((emp) => ({
            label: emp.email,
            value: emp.email,
        }))
        : [];

    const goToNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const goToPreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };
    const formatDate = (day, month, year) => {
        const date = new Date(year, month - 1, day); // JavaScript months are 0-indexed, so subtract 1 from month
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options); // en-GB format gives us "24 Dec, 2024"
    };
    console.log("selfApplicantID", selfApplicantID);

    ///////////applicant side view////
    const { data: applicantData } = useQuery(
        ["allicantData", organisationId, selfApplicantID],
        async () => {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/applicant/${selfApplicantID}/applied-jobs`,
                {
                    headers: { Authorization: authToken },
                }
            );
            return response.data?.data;
        },
        { enabled: !!authToken }
    );

    console.log("applicantData", applicantData);
    const [dialogOpen1, setDialogOpen1] = useState(false);
    const [selectedInterview, setSelectedInterview] = useState(null);

    const applicantAcceptRejectISchedule = useMutation(
        async (payload) => {
            const response = await axios.patch(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/interview-schedule-accept-reject/${selectedInterview.applicantId}`,
                payload,
                { headers: { Authorization: authToken } }
            );
            return response.data;
        },
        {
            onSuccess: () => {
                handleAlert(true, "success", "Interview scheduled status accept/reject");
            },
            onError: (error) => {
                handleAlert(true, "error", "Failed. Try again.");
            },
        }
    );

    const handleInterviewStatus = (status) => {
        if (selectedInterview) {
            // Prepare the payload to send to the API
            const payload = {
                status: status, // "Accepted" or "Rejected"
            };

            // Call the mutation to update the interview status
            applicantAcceptRejectISchedule.mutate(payload);
        }
    };



    return (
        <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ minWidth: "300px" }}>
                <h3>Select Date</h3>
                <Controller
                    control={control}
                    name="timeRange"
                    render={({ field }) => (
                        <div className="flex rounded-md py-2">
                            <DatePicker
                                selected={startDate}
                                onChange={handleDateRangeChange}
                                startDate={startDate}
                                endDate={endDate}
                                selectsRange
                                inline
                            />
                        </div>
                    )}
                />
            </div>
            <div style={{ flex: 1 }}>
                <table border="1" style={{ width: "100%", textAlign: "center", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={{ backgroundColor: "#f0f0f0" }}>
                                <Button onClick={goToPreviousMonth}>Prev</Button>
                            </th>
                            <th colSpan={6} style={{ backgroundColor: "#f0f0f0", textAlign: "center" }}>
                                {new Date(currentYear, currentMonth).toLocaleString("default", { month: "long", year: "numeric" })}
                            </th>
                            <th style={{ backgroundColor: "#f0f0f0" }}>
                                <Button onClick={goToNextMonth}>Next</Button>
                            </th>
                        </tr>
                        <tr>
                            <th style={{ backgroundColor: "#f0f0f0" }}>Time</th>
                            {dates.map((d, index) => (
                                <th key={index} style={{ backgroundColor: "#f0f0f0" }}>
                                    {d.day} <br /> {d.date}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {applicantId ? (
                            <>
                                {times.map((time, rowIndex) => (
                                    <tr key={rowIndex}>
                                        <td style={{ backgroundColor: "#fafafa" }}>{time}</td>
                                        {dates.map((d, colIndex) => {
                                            const interviewDetails = application?.interviewDetails;
                                            const selectedDate = new Date(currentYear, currentMonth, d.date);
                                            const interviewDate = new Date(interviewDetails?.date);
                                            const cellMatchesInterview =
                                                interviewDate.toLocaleDateString() === selectedDate.toLocaleDateString() &&
                                                interviewDetails?.time === convertTo24HourFormat(time);

                                            return (
                                                <td
                                                    key={colIndex}
                                                    style={{
                                                        cursor: "pointer",
                                                        background: cellMatchesInterview ? "#d3ffd3" : "#fff", // Highlight cells with an interview
                                                        padding: "10px",
                                                        border: "1px solid #ddd",
                                                        height: "50px",
                                                        fontSize: "12px"
                                                    }}
                                                    onClick={() => handleCellClick(d.day, d.date, time, currentMonth + 1, currentYear)}
                                                >
                                                    {cellMatchesInterview && (
                                                        <div>
                                                            <p><strong>Interviewer:</strong> {interviewDetails?.interviewer}</p>
                                                            <p><strong>Employee</strong> {interviewDetails?.applicantEmail}</p>
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </>
                        ) : (
                            <>
                                {applicantData?.map((applicant, applicantIndex) => (
                                    <React.Fragment key={applicantIndex}>
                                        {times?.map((time, rowIndex) => (
                                            <tr key={rowIndex}>
                                                <td style={{ backgroundColor: "#fafafa" }}>{time}</td>
                                                {dates?.map((d, colIndex) => {
                                                    const interviewDetails = applicant?.interviewDetails;
                                                    const selectedDate = new Date(currentYear, currentMonth, d.date);
                                                    const interviewDate = new Date(interviewDetails?.date);
                                                    const cellMatchesInterview =
                                                        interviewDate.toLocaleDateString() === selectedDate.toLocaleDateString() &&
                                                        interviewDetails?.time === convertTo24HourFormat(time);

                                                    return (
                                                        <td
                                                            key={colIndex}
                                                            style={{
                                                                cursor: "pointer",
                                                                background: cellMatchesInterview ? "#d3ffd3" : "#fff", // Highlight cells with an interview
                                                                padding: "10px",
                                                                border: "1px solid #ddd",
                                                                height: "50px",
                                                                fontSize: "12px"
                                                            }}
                                                            onClick={() => handleCellClick(d.day, d.date, time, currentMonth + 1, currentYear, applicant)}
                                                        >
                                                            {cellMatchesInterview && (
                                                                <div>
                                                                    <p>Interview Scheduled</p>
                                                                    <p><strong>Interviewer:</strong> {interviewDetails?.interviewer}</p>

                                                                </div>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}

                            </>
                        )}


                    </tbody>

                </table>
            </div>
            <Dialog sx={{
                '& .MuiDialog-paper': {
                    width: '60%',
                    maxWidth: 'none',
                },
            }} open={dialogOpen} onClose={closeDialog} >
                <DialogTitle>Schedule Interview</DialogTitle>
                <DialogContent>
                    <p><strong>Day:</strong> {selectedCell.day}</p>
                    <p><strong>Date:</strong> {selectedCell.year && selectedCell.month && selectedCell.date
                        ? formatDate(selectedCell.date, selectedCell.month, selectedCell.year) // Call the formatDate function
                        : 'Invalid Date'}</p>
                    <p><strong>Time:</strong> {selectedCell.time}</p>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <AuthInputFiled
                            className="bg-white"
                            name="employeeName"
                            control={control}
                            type="text"
                            placeholder="Employee Name"
                            label="Employee Name*"
                            maxLimit={100}
                            errors={errors}
                            error={errors.employeeName}
                            value={application?.applicantId?.first_name + " " + application?.applicantId?.last_name}
                        />
                        <AuthInputFiled
                            name="from"
                            icon={Email}
                            control={control}
                            type="text"
                            placeholder="Email"
                            label="from*"
                            value={user?.email}
                            maxLimit={15}
                            errors={errors}
                            error={!!errors.from}
                            helperText={errors.from ? errors.from.message : ""}
                        />
                        <AuthInputFiled
                            name="hiringManagerTo"
                            icon={Email}
                            control={control}
                            type="autocomplete"
                            placeholder="Hiring Manager*"
                            label="Hiring Manager*"
                            maxLimit={15}
                            errors={errors}
                            optionlist={employeeEmail ? employeeEmail : []}
                            error={!!errors.hiringManagerTo}
                            helperText={errors.hiringManagerTo ? errors.hiringManagerTo.message : ""}
                        />
                        <AuthInputFiled
                            name="to"
                            icon={Email}
                            control={control}
                            type="text"
                            placeholder="To"
                            label="Employee*"
                            maxLimit={15}
                            value={application?.email}
                            errors={errors}
                            error={!!errors.to}
                            helperText={errors.to ? errors.to.message : ""}
                        />
                        <Controller
                            control={control}
                            name="notes"
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Notes"
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                />
                            )}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        color="primary"
                        disabled={scheduleInterviewMutation.isLoading}
                    >
                        {scheduleInterviewMutation.isLoading ? "Saving..." : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Applicant side */}
            <Dialog open={dialogOpen1} onClose={() => setDialogOpen1(false)}>
                <DialogTitle>Interview Status</DialogTitle>
                <DialogContent>
                    <p><strong>Day:</strong> {selectedCell.day}</p>
                    <p><strong>Date:</strong> {selectedCell.year && selectedCell.month && selectedCell.date
                        ? formatDate(selectedCell.date, selectedCell.month, selectedCell.year) // Call the formatDate function
                        : 'Invalid Date'}</p>
                    <p><strong>Time:</strong> {selectedCell.time}</p>
                </DialogContent>
                <DialogActions>
                    <div style={{ marginTop: "20px" }}>
                        <Button onClick={() => handleInterviewStatus("Accepted")} color="primary">
                            Accept
                        </Button>
                        <Button onClick={() => handleInterviewStatus("Rejected")} color="secondary">
                            Reject
                        </Button>
                    </div>

                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CalenderInterviewShedule;

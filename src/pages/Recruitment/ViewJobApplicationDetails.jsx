import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { CircularProgress, Box, Typography, Snackbar, Alert, Grid, Link } from '@mui/material';
import axios from 'axios';
import useGetUser from '../../hooks/Token/useUser';
import BasicButton from '../../components/BasicButton';

const ViewJobApplicationDetails = () => {
    const { organisationId, jobId, applicationId } = useParams();
    const queryClient = useQueryClient();
    const { authToken } = useGetUser();
    const navigate = useNavigate();
    const [feedback, setFeedback] = React.useState({ open: false, message: '', severity: 'success' });

    const { data: application, isLoading, isError, error } = useQuery(
        ["jobApplicationDetails", organisationId, jobId, applicationId],
        async () => {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/job-application/${jobId}/${applicationId}`,
                {
                    headers: { Authorization: authToken },
                }
            );
            return response.data.data;
        },
        { enabled: !!authToken }
    );

    // Mutation to update status via PATCH API
    const mutation = useMutation(
        async (status) => {
            console.log("status", status);
            const statusByHR = status;
            const response = await axios.patch(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/job-application/${applicationId}/statusbyhr`,
                { statusByHR },
                { headers: { Authorization: authToken } }
            );
            return response.data; // Assuming API returns the updated data
        },
        {
            onSuccess: () => {
                setFeedback({ open: true, message: "Status updated successfully", severity: "success" });
                queryClient.invalidateQueries(["jobApplicationDetails", organisationId, jobId, applicationId]);
            },
            onError: () => setFeedback({ open: true, message: "Failed to update status", severity: "error" }),
        }
    );

    const handleAction = (status, applicantId) => {
        if (status === "Cancel") {
            navigate(`/organisation/${organisationId}/open-job-position`);
            return;
        }
        if (status === "ScheduledInterview") {
            navigate(`/organisation/${organisationId}/interview-Shedule/${jobId}/${applicantId}`);
            return;
        }
        mutation.mutate(status);
    };

    return (
        <Box p={3}>
            {isLoading ? (
                <CircularProgress />
            ) : isError ? (
                <Typography color="error">Error: {error.message}</Typography>
            ) : (
                <div>
                    <Typography variant="h5" mb={3}>Application Details</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1">
                                <strong>Applicant Name:</strong> {application?.applicantId?.first_name} {application?.applicantId?.last_name}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Email:</strong> {application?.applicantId?.email}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Phone:</strong> {application?.phone}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Education:</strong> {application?.education}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Experience:</strong> {application?.experience} years
                            </Typography>
                            <Typography variant="body1">
                                <strong>Applied Date:</strong> {new Date(application?.appliedDate).toLocaleString()}
                            </Typography>

                            <Typography variant="body1">
                                <strong>Job Position:</strong> {application?.jobId?.jobPosition}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Experience:</strong> {application?.jobId?.experienceRequired}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Vacancies:</strong> {application?.jobId?.vacancies}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Cover Letter:</strong> {application?.coverLetter}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Skills:</strong>{" "}
                                {application?.skills.length > 0
                                    ? application.skills.map((skill, index) => (
                                        <span key={index}>
                                            {skill.label} {index < application.skills.length - 1 && ", "}
                                        </span>
                                    ))
                                    : "No skills listed"}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Certifications:</strong> {application?.certifications.length > 0
                                    ? application?.certifications.join(", ")
                                    : "None"}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Resume:</strong>{" "}
                                <Link href={application?.resume} target="_blank" rel="noopener">
                                    View Resume
                                </Link>
                            </Typography>
                        </Grid>
                    </Grid>

                    {/* Action Buttons */}
                    <Box className="flex gap-2" mt={3}>
                        {
                            application?.statusByManager === "Shortlisted" ?
                                null : <BasicButton
                                    title="Shortlisted"
                                    onClick={() => handleAction("Shortlisted")}
                                    disabled={application?.statusByHR === "Shortlisted"}
                                />
                        }
                        <BasicButton
                            title="Reject"
                            color="danger"
                            onClick={() => handleAction("Rejected")}
                            disabled={application?.applicationStatus === "Rejected"}
                        />
                        <BasicButton
                            title="Cancel"
                            variant="outlined"
                            onClick={() => handleAction("Cancel")}
                        />
                        {
                            application?.statusByHR === "Shortlisted" &&
                                application?.statusByManager === "Shortlisted" ?
                                <BasicButton
                                    title="Scheduled interview"
                                    onClick={() => handleAction("ScheduledInterview", application?._id)}
                                /> : null
                        }
                    </Box>
                </div>
            )}

            <Snackbar
                open={feedback.open}
                autoHideDuration={3000}
                onClose={() => setFeedback((prev) => ({ ...prev, open: false }))}
            >
                <Alert severity={feedback.severity}>{feedback.message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default ViewJobApplicationDetails;

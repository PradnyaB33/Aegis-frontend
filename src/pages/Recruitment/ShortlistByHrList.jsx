import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { CircularProgress, Typography, Box, Link } from '@mui/material';
import useGetUser from '../../hooks/Token/useUser';
import BasicButton from '../../components/BasicButton';

const ShortlistByHrList = () => {
    const { vacancyId, organisationId } = useParams(); // Extract vacancyId and organisationId from URL params
    const { authToken } = useGetUser(); // Get the authToken for authentication
    const navigate = useNavigate();
    const queryClient = useQueryClient(); // For invalidating queries after mutation

    // Fetch shortlisted applications using the vacancyId and organisationId
    const { data, isLoading, isError, error } = useQuery(
        ['shortlistedApplications', vacancyId],
        async () => {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/job/${vacancyId}/shortlisted-applications`,
                {
                    headers: {
                        Authorization: authToken, // Send the auth token for authorization
                    },
                }
            );
            return response?.data?.data;
        },
        {
            enabled: !!authToken && !!vacancyId, // Ensure the query is only enabled when the auth token and vacancyId are available
        }
    );

    // Mutation to update the status of the application (Shortlisted/Rejected)
    const mutation = useMutation(
        async ({ status, applicationId }) => {
            const response = await axios.patch(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/job-application/${applicationId}/statusbymr`,
                { statusByManager: status },
                { headers: { Authorization: authToken } }
            );
            return response.data; // Assuming API returns the updated data
        },
        {
            onSuccess: () => {
                // Invalidate queries to re-fetch the updated data
                queryClient.invalidateQueries(['shortlistedApplications', vacancyId]);
            },
            onError: (e) => {
                console.log("Error updating application status:", e);
            }
        }
    );

    // Show loading spinner while fetching data
    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="90vh">
                <CircularProgress />
            </Box>
        );
    }

    // Show error message if fetching data fails
    if (isError) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="90vh">
                <Typography color="error">Error loading shortlisted applications: {error.message}</Typography>
            </Box>
        );
    }

    const handleAction = (status, applicationId) => {
        if (status === "Cancel") {
            navigate(`/organisation/${organisationId}/open-job-position`);
            return;
        }
        mutation.mutate({ status, applicationId }); // Trigger status update
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Shortlisted Applications
            </Typography>
            {data?.length === 0 ? (
                <Typography>No shortlisted applications found for this job position.</Typography>
            ) : (
                data.map((application, index) => (
                    <Box key={index} border={1} p={2} my={2} borderRadius={2}>
                        <Typography variant="h6">
                            Name: {application?.first_name} {application?.last_name}
                        </Typography>
                        <Typography>Email: {application?.email}</Typography>
                        <Typography>Phone: {application?.phone}</Typography>
                        <Typography>Applied on: {new Date(application.appliedDate).toLocaleString()}</Typography>
                        <Typography>Job Position: {application?.jobId?.jobPosition}</Typography>
                        <Typography>Experience: {application.experience} years</Typography>
                        <Typography>Education: {application.education}</Typography>
                        <Typography>Skills:  {application?.skills?.length > 0
                            ? application.skills.map((skill, index) => (
                                <span key={index}>
                                    {skill.label} {index < application.skills.length - 1 && ", "}
                                </span>
                            ))
                            : "No skills listed"}</Typography>
                        <Typography>Cover Letter: {application.coverLetter}</Typography>
                        <Typography>Certifications: {application.certifications || 'None'}</Typography>
                        {/* If you want to link to the resume or show a "view resume" option */}
                        <Typography>
                            <strong>Resume:</strong>{" "}
                            <Link href={application?.resume} target="_blank" rel="noopener noreferrer">
                                View Resume
                            </Link>
                        </Typography>
                        <Box className="flex gap-2" mt={3}>
                            <BasicButton
                                title="Shortlisted"
                                onClick={() => handleAction("Shortlisted", application?._id)}
                                // You could also disable this button if the status is already "Shortlisted"
                                disabled={application?.statusByManager === "Shortlisted"}
                            />
                            <BasicButton
                                title="Reject"
                                color="danger"
                                onClick={() => handleAction("Rejected", application?._id)}
                                // Disable this button if the status is already "Rejected"
                                disabled={application?.statusByManager === "Rejected"}
                            />
                            <BasicButton
                                title="Cancel"
                                variant="outlined"
                                onClick={() => handleAction("Cancel")}
                            />

                        </Box>
                    </Box>
                ))
            )}
        </div>
    );
};

export default ShortlistByHrList;

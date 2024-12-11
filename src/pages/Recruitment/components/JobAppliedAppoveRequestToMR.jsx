import React, { useContext, useState } from 'react';
import axios from 'axios';
import { CircularProgress, Button, Card, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { UseContext } from '../../../State/UseState/UseContext';
import UserProfile from '../../../hooks/UserData/useUser';
import BasicButton from '../../../components/BasicButton';
import { useNavigate } from 'react-router-dom';

const JobAppliedApproveRequestToMR = ({ jobId, organisationId }) => {
    const { getCurrentUser } = UserProfile();
    const user = getCurrentUser();
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [requestStatus, setRequestStatus] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch the current permission request status
    const { data: permissionStatus } = useQuery(
        ['jobPermissionStatus', organisationId, jobId],
        async () => {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-job-application-status/${jobId}`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                    params: { employeeId: user._id }, // Use the employeeId to fetch permission for the current user
                }
            );
            return response.data;
        },
        {
            onSuccess: (data) => {
                setRequestStatus(data.success ? data.data[0]?.managerApproval || 'Pending' : 'Not Requested');
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            },
            enabled: !!user._id && !!organisationId && !!jobId, // Only run the query if all dependencies are available
        }
    );
    console.log("permissionStatus", permissionStatus);

    // Mutation to request permission
    const { mutate: requestPermission, isLoading: isSubmitting } = useMutation(
        async () => {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/job-request-permission/${jobId}`,
                { employeeId: user._id }, // Pass the employee ID
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return response.data; // Assuming the response returns data on success
        },
        {
            onSuccess: () => {
                // Invalidate the query to refetch the status after mutation
                queryClient.invalidateQueries(['jobPermissionStatus', organisationId, jobId]);
            },
            onError: (error) => {
                console.error('Error requesting permission:', error);
            },
        }
    );

    if (loading) {
        return (
            <Card style={{ padding: '20px', margin: '20px', backgroundColor: '#fff', borderRadius: '10px' }}>
                <Typography variant="h5" gutterBottom>
                    Job Application Permission
                </Typography>
                <CircularProgress />
            </Card>
        );
    }
    const handleApply = () => {
        navigate(`/organisation/${organisationId}/apply-job/${jobId}`);
    }
    return (
        <Card style={{ padding: '20px', margin: '20px', backgroundColor: '#fff', borderRadius: '10px' }}>
            <Typography variant="h5" gutterBottom>
                Job Application Permission
            </Typography>
            <Typography variant="body1" gutterBottom>
                To apply for this job, you need approval from your manager.
            </Typography>

            <Typography variant="body2" gutterBottom>
                <strong>Approval Status:</strong> {requestStatus || 'Not Requested'}
            </Typography>

            {requestStatus === 'Approved' ? (
                <>
                    <Typography variant="body2" style={{ color: 'green' }} gutterBottom>
                        You have permission! You can now apply for this job.
                    </Typography>
                    <BasicButton title="Apply for Job" onClick={handleApply} />

                </>
            ) : requestStatus === 'Rejected' ? (
                <Typography variant="body2" style={{ color: 'red' }}>
                    Your request has been rejected by your manager.
                </Typography>
            ) : (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => requestPermission()}
                    disabled={isSubmitting || requestStatus === 'Pending'}
                >
                    {isSubmitting ? <CircularProgress size={20} /> : 'Request Permission'}
                </Button>
            )}
        </Card>
    );
};

export default JobAppliedApproveRequestToMR;

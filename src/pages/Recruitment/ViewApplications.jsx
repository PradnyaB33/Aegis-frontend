import React from 'react';
import axios from 'axios';
import { useQuery } from 'react-query'; // Import useQuery from react-query
import BoxComponent from '../../components/BoxComponent/BoxComponent';
import HeadingOneLineInfo from '../../components/HeadingOneLineInfo/HeadingOneLineInfo';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, CircularProgress } from '@mui/material';  // For loading state
import useGetUser from '../../hooks/Token/useUser';
import { MdEmail } from "react-icons/md";
import { PiPhoneCallFill } from "react-icons/pi";
import BasicButton from '../../components/BasicButton';

const ViewApplications = () => {
    const { organisationId, jobId } = useParams();
    const navigate = useNavigate();


    const { authToken } = useGetUser(); // Retrieve the auth token

    const { data: applications, isLoading, isError, error } = useQuery(
        ["jobApplications", organisationId, authToken],
        async () => {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/job-applications/${jobId}`,
                {
                    headers: {
                        Authorization: authToken, // Correct header format
                    },
                }
            );
            return response.data.data;
        },
        {
            enabled: Boolean(authToken),
            onSuccess: (data) => console.log("Fetched Job Openings:", data),
            onError: (err) => console.error("Error fetching job openings:", err),
        }
    );
    // Fetch job applications using useQuery

    console.log("applications", applications);
    const handleViewDetail = (applicationId) => {
        navigate(`/organisation/${organisationId}/view-job-detail-application/${jobId}/${applicationId}`);
    };
    return (
        <BoxComponent>
            <HeadingOneLineInfo heading="Job Application" info="Here you can see job applications" />

            {/* Loading state */}
            {isLoading && <CircularProgress />}

            {/* Error state */}
            {isError && <p>{error.message}</p>}

            {/* Render the applications */}
            <div>
                {applications && applications.length === 0 ? (
                    <p>No applications found for this job.</p>
                ) : (

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '16px',
                            padding: '20px 0',
                        }}
                    >
                        {applications?.map((application) => (
                            <div
                                key={application._id}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '8px',
                                    padding: '16px',
                                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                                    transition: 'box-shadow 0.3s ease',
                                    border: '1px solid #e0e0e0',

                                }}
                            >
                                {application?.applicantId?.user_logo_url
                                    ? <img
                                        src={application?.applicantId?.user_logo_url}
                                        alt="Profile"
                                        style={{
                                            width: "80px",
                                            height: "80px",
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                        }}
                                    /> : <Avatar />}



                                <h3 style={{ marginTop: 0, fontSize: '1.25rem', color: '#333' }}>
                                    {application?.applicantId?.first_name
                                    }{" "}{application?.applicantId?.last_name
                                    }
                                </h3>
                                <h3 style={{ marginTop: 0, color: '#333' }}>
                                    {application?.jobId?.jobPosition}
                                </h3>
                                <div className='flex'>
                                    <MdEmail className='mt-1' />
                                    <p>{application.email}</p></div>
                                <div className='flex '>
                                    <PiPhoneCallFill className='mt-1' />
                                    <p> {application.phone}</p>
                                </div>
                                <div className='flex justify-end'>
                                    <BasicButton
                                        title="view details"
                                        variant='outlined'
                                        onClick={() => handleViewDetail(application?._id)} // Corrected
                                    />
                                </div>
                                {/* Add more fields as necessary */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </BoxComponent>
    );
};

export default ViewApplications;

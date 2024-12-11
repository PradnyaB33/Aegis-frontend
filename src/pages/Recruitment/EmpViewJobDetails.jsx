import React, { useState } from 'react';
import BoxComponent from '../../components/BoxComponent/BoxComponent';
import HeadingOneLineInfo from '../../components/HeadingOneLineInfo/HeadingOneLineInfo';
import { Avatar, Box, CircularProgress, Dialog, Grid, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import useGetUser from '../../hooks/Token/useUser';
import BasicButton from '../../components/BasicButton';
import { formatDistanceToNow, parseISO } from "date-fns";
import JobAppliedAppoveRequestToMR from './components/JobAppliedAppoveRequestToMR';
import { IoLocationSharp } from 'react-icons/io5';

const EmpViewJobDetails = () => {
    const { vacancyId, organisationId } = useParams();
    const { authToken } = useGetUser();
    const navigate = useNavigate();
    const [open, setOpen] = useState();
    // Fetch specific job opening
    const { data, isLoading, isError, error } = useQuery(
        ['jobOpening', vacancyId],
        async () => {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/job-open/${vacancyId}`,
                {
                    headers: {
                        Authorization: authToken, // Replace with actual auth token
                    },
                }
            );
            return response.data.data;
        },
        {
            enabled: !!vacancyId, // Ensure the query only runs if vacancyId is available
        }
    );
    console.log("data", data);

    const { data: openJob } = useQuery(
        ["openJobPosition", organisationId, authToken],
        async () => {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/job-open`,
                {
                    headers: { Authorization: authToken },
                }
            );
            return response?.data?.data;
        },
        {
            enabled: Boolean(authToken),
            onSuccess: (data) => console.log("Fetched Job Openings:", data),
            onError: (err) => console.error("Error fetching job openings:", err),
        }
    );

    if (isLoading) {
        return (
            <BoxComponent>
                <CircularProgress />
            </BoxComponent>
        );
    }

    if (isError) {
        return (
            <BoxComponent>
                <Typography color="error">
                    Error fetching job details: {error?.response?.data?.message || error.message}
                </Typography>
            </BoxComponent>
        );
    }

    const jobDetails = data;

    const formatPostedDate = (dateString) => {
        if (!dateString) return "Unknown Date";
        try {
            return `${formatDistanceToNow(parseISO(dateString))} ago`; // Example: "Posted 2 days ago"
        } catch (error) {
            console.error("Error formatting posted date:", error);
            return "Invalid Date";
        }
    };

    const handleApply = () => {
        navigate(`/organisation/${organisationId}/apply-job/${vacancyId}`);
    };
    const handleAttachment = () => {
        window.open(data?.additionalCertificate, '_blank');
    };

    const handleDetails = (vacancyId) => {
        navigate(`/organisation/${organisationId}/view-job-details/${vacancyId}`);
    };
    return (
        <BoxComponent>
            <HeadingOneLineInfo heading="Job Details" info="Here employee view and apply for job" />
            <Grid container spacing={2} lg={12}>
                <Grid item lg={9}>
                    <Grid item lg={12} className='p-2 bg-white' sx={{
                        border: "1px solid #D2D2D2",
                        borderRadius: "15px"
                    }}>
                        <div
                            style={{
                                backgroundColor: "#ECEFF4",
                                padding: "20px",
                                borderRadius: "15px",
                                flex: "1", // Allows the container to stretch
                                display: "flex",
                                flexDirection: "column",
                                // Arrange children vertically
                            }}
                        >
                            <span
                                style={{
                                    backgroundColor: "white",
                                    padding: "5px 10px",
                                    borderRadius: "50px",
                                    alignSelf: "start",
                                }}
                            >
                                {formatPostedDate(jobDetails?.date)}
                            </span>
                            <div className="flex justify-between items-center mt-4">
                                <div>
                                    <h4>{jobDetails?.organizationId?.orgName}</h4>
                                    <span
                                        style={{
                                            marginTop: 0,
                                            fontSize: "30px",
                                            color: "#333",
                                            lineHeight: "30px",
                                        }}
                                    >
                                        {jobDetails.jobPosition || "Position Not Specified"}
                                    </span>
                                </div>
                                {jobDetails?.organizationId?.logo_url ? (
                                    <img
                                        src={jobDetails?.organizationId?.logo_url}
                                        alt="Logo"
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                        }}
                                    />
                                ) : (
                                    <Avatar />
                                )}
                            </div>
                            <div className="flex space-x-1 justify-end my-3">
                                <BasicButton title="Apply" onClick={handleApply} />
                            </div>
                            {/* <p>
                                <strong>Opening:</strong>{" "}
                                {jobDetails?.vacancies || "Not Specified"}
                            </p> */}
                            {/* Add `marginTop: "auto"` to push this div to the bottom */}
                            <div className='flex '>
                                <div
                                    className="grid grid-cols-4 gap-2 mb-1"
                                    style={{
                                        margin: "0",
                                        padding: "0",
                                        marginTop: "auto", // Push this element to the bottom of the flex container
                                    }}
                                >
                                    <span
                                        className="border border-gray-300 py-1 text-center inline-block"
                                        style={{ borderRadius: "40px" }}
                                    >
                                        {jobDetails.experienceRequired}
                                    </span>
                                    <span
                                        className="border border-gray-300 py-1 text-center inline-block"
                                        style={{ borderRadius: "40px" }}
                                    >
                                        {jobDetails.modeOfWorking}
                                    </span>
                                    <span
                                        className="border border-gray-300 py-1 text-center inline-block"
                                        style={{ borderRadius: "40px" }}
                                    >
                                        {jobDetails.jobType}
                                    </span>

                                </div>
                                <div>
                                    <p className="flex">
                                        <IoLocationSharp className="m-1" />{" "}
                                        {jobDetails.location?.city || "Not Provided"},{" "}
                                        {jobDetails.location?.state || "Not Provided"},{" "}
                                        {jobDetails.location?.country || "Not Provided"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Box sx={{ bgcolor: "White", p: 2, mt: 3 }}>

                            <Typography>
                                <strong>Description:</strong> {jobDetails?.jobDescription || "N/A"}
                            </Typography><br />
                            <Typography>
                                <strong>Role:</strong> {jobDetails?.jobPosition || "N/A"}
                            </Typography>
                            <Typography>
                                <strong>Industry Type:</strong> {jobDetails?.organizationId?.industry_type || "N/A"}
                            </Typography>
                            <Typography>
                                <strong>Department:</strong> {jobDetails?.department?.departmentName || "N/A"}
                            </Typography>
                            <Typography>
                                <strong>Employment Type:</strong> {jobDetails?.jobType || "N/A"}
                            </Typography>
                            <Typography>
                                <strong>Mode of Working:</strong> {jobDetails?.modeOfWorking || "N/A"}
                            </Typography>
                            <Typography>
                                <strong>Job Type:</strong> {jobDetails?.jobType || "N/A"}
                            </Typography>
                            <Typography>
                                <strong>Working Time:</strong> {jobDetails?.workingTime || "N/A"}
                            </Typography>
                            <Typography>
                                <strong>Education:</strong> {jobDetails?.education || "N/A"}
                            </Typography>
                            <Typography>
                                <strong>Key Skills:</strong>{' '}
                                {jobDetails?.requiredSkill?.map(skill => skill.label).join(', ') || "N/A"}
                            </Typography><br />
                            <Typography>
                                <strong>Additional Attachment for job</strong>{' '}
                                <BasicButton variant='outlined' title={"View Attachment"} onClick={handleAttachment} />
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item lg={3}>
                    <Grid sx={{ width: "100%", height: "auto" }}>
                        {Array.isArray(openJob) && openJob.length > 0 ? (
                            openJob.map((vacancy) => (
                                <Grid item key={vacancy._id} >
                                    <div
                                        className="p-2 bg-white flex flex-col justify-between"
                                        style={{
                                            border: "1px solid #D2D2D2",
                                            borderRadius: "15px",
                                            minHeight: "350px", // Ensures uniform height
                                            display: "flex",
                                            flexDirection: "column",
                                            marginBottom: "10px"
                                        }}
                                    >
                                        <div
                                            style={{
                                                backgroundColor: "#ECEFF4",
                                                padding: "20px",
                                                borderRadius: "15px",
                                                flex: "1",
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    backgroundColor: "white",
                                                    padding: "5px 10px",
                                                    borderRadius: "50px",
                                                    alignSelf: "start",
                                                }}
                                            >
                                                {formatPostedDate(vacancy?.date)}
                                            </span>
                                            <div className="flex justify-between items-center mt-4">
                                                <div>
                                                    <h4>{vacancy?.organizationId?.orgName}</h4>
                                                    <span
                                                        style={{
                                                            marginTop: 0,
                                                            fontSize: "30px",
                                                            color: "#333",
                                                            lineHeight: "30px",
                                                        }}
                                                    >
                                                        {vacancy.jobPosition || "Position Not Specified"}
                                                    </span>
                                                </div>
                                                {vacancy?.organizationId?.logo_url ? (
                                                    <img
                                                        src={vacancy?.organizationId?.logo_url}
                                                        alt="Logo"
                                                        style={{
                                                            width: "40px",
                                                            height: "40px",
                                                            borderRadius: "50%",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                ) : (
                                                    <Avatar />
                                                )}
                                            </div>
                                            <div
                                                className="grid grid-cols-2 gap-2 mb-1"
                                                style={{
                                                    margin: "0",
                                                    padding: "0",
                                                    marginTop: "auto",
                                                }}
                                            >
                                                <span
                                                    className="border border-gray-300 py-1 text-center inline-block"
                                                    style={{ borderRadius: "40px" }}
                                                >
                                                    {vacancy.experienceRequired}
                                                </span>
                                                <span
                                                    className="border border-gray-300 py-1 text-center inline-block"
                                                    style={{ borderRadius: "40px" }}
                                                >
                                                    {vacancy.modeOfWorking}
                                                </span>
                                                <span
                                                    className="border border-gray-300 py-1 text-center inline-block"
                                                    style={{ borderRadius: "40px" }}
                                                >
                                                    {vacancy.jobType}
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            className={` my-2 px-3 flex  justify-end mt-3`}
                                        >

                                            <BasicButton title="Details" onClick={() => handleDetails(vacancy._id)} />
                                        </div>
                                    </div>
                                </Grid>
                            ))
                        ) : (
                            !isLoading && <p>No job vacancies found.</p>
                        )}
                    </Grid>
                </Grid>

            </Grid>
            {/* <Box>
                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "10px",
                        padding: "16px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        transition: "box-shadow 0.3s ease",
                        border: "1px solid #e0e0e0",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)")
                    }
                >
                    <h3
                        style={{
                            marginTop: 0,
                            fontSize: "1.5rem",
                            color: "#333",
                        }}
                    >
                        {jobDetails?.jobPosition || "Job Position Not Available"}
                    </h3>
                    <div>
                        <h4>{jobDetails?.organizationId?.orgName}</h4>
                    </div>
                    <div style={{ color: "#555" }}>
                        <p className="flex">
                            <IoBag className="my-1" />
                            {jobDetails.experienceRequired || "Not Provided"}
                        </p>
                        <p className="flex">
                            <IoLocationSharp className="my-1" />{" "}
                            {jobDetails.location?.city || "Not Provided"},{" "}
                            {jobDetails.location?.state || "Not Provided"},{" "}
                            {jobDetails.location?.country || "Not Provided"}
                        </p>
                        <div className="flex space-x-1">
                            <p>
                                <strong>Posted:</strong>{" "}
                                {formatPostedDate(jobDetails?.date)}
                            </p>
                            <p>
                                <strong>Opening:</strong>{" "}
                                {jobDetails?.vacancies || "Not Specified"}
                            </p>
                        </div>



                    </div>
                </div>
            </Box> */}

            <Dialog open={open} onClose={() => setOpen(false)} className="p-0">
                <JobAppliedAppoveRequestToMR jobId={vacancyId} organisationId={organisationId} />

            </Dialog>
        </BoxComponent>
    );
};

export default EmpViewJobDetails;

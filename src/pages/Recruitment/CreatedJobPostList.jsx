import React, { useState } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import useGetUser from '../../hooks/Token/useUser';
import UserProfile from '../../hooks/UserData/useUser';
import BoxComponent from '../../components/BoxComponent/BoxComponent';
import HeadingOneLineInfo from '../../components/HeadingOneLineInfo/HeadingOneLineInfo';
import MoreVert from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
    Visibility as ViewIcon,
} from "@mui/icons-material";

const CreatedJobPostList = () => {
    const { authToken } = useGetUser();
    const { organisationId } = useParams();
    const { getCurrentUser } = UserProfile();
    const navigate = useNavigate();
    const user = getCurrentUser();
    const hrId = user?._id;

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleView = (id) => {
        console.log('View clicked for ID:', id);
        handleClose();
    };

    const handleEdit = (vacancyId) => {


        navigate(`/organisation/${organisationId}/create-job-position/${vacancyId}`);
        handleClose();
    };

    const handleDelete = (id) => {
        console.log('Delete clicked for ID:', id);
        handleClose();
    };

    const { data: vacancyData, isLoading, isError, error } = useQuery(
        ["createdJobPosition", organisationId, authToken],
        async () => {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/vacancies/hr/${hrId}`,
                {
                    headers: { Authorization: authToken },
                }
            );
            return response?.data?.data;
        },
        {
            enabled: Boolean(organisationId && authToken),
            onSuccess: (data) => console.log("Vacancy Data:", data),
            onError: (error) => console.error("Error fetching vacancy:", error),
        }
    );

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error: {error?.response?.data?.message || 'Something went wrong'}</div>;
    }

    return (
        <BoxComponent>
            <HeadingOneLineInfo
                heading="Created Job Position"
                info="Here show created job position"
            />

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '16px',
                    padding: '16px 0px',
                }}
            >
                {Array.isArray(vacancyData) && vacancyData.length === 0 ? (
                    <p>No job vacancies found.</p>
                ) : (
                    vacancyData?.map((vacancy) => (
                        <div
                            key={vacancy._id}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '10px',
                                padding: '16px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                transition: 'box-shadow 0.3s',
                                border: '1px solid #e0e0e0',
                            }}
                        >
                            <div className='flex justify-between'>
                                <h3 style={{ marginTop: 0, fontSize: '1.5rem', color: '#333' }}>
                                    {vacancy.jobPosition}
                                </h3>
                                <div className="">
                                    <MoreVert
                                        onClick={handleClick}
                                        className="mt-1 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
                                    />
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleClose}
                                    >
                                        <MenuItem onClick={() => handleView(vacancy._id)}>
                                            <ViewIcon
                                                aria-label="view"
                                                style={{ marginRight: "8px", color: "gray" }}
                                            />
                                            View
                                        </MenuItem>
                                        <MenuItem onClick={() => handleEdit(vacancy._id)}>
                                            <EditOutlinedIcon
                                                color="primary"
                                                aria-label="edit"
                                                style={{ marginRight: "8px" }}
                                            />
                                            Edit
                                        </MenuItem>
                                        <MenuItem onClick={() => handleDelete(vacancy._id)}>
                                            <DeleteOutlineIcon
                                                color="error"
                                                aria-label="delete"
                                                style={{ marginRight: "8px" }}
                                            />
                                            Delete
                                        </MenuItem>
                                    </Menu>
                                </div>

                            </div>
                            <div style={{ color: '#555' }}>
                                <p>
                                    <strong>Location:</strong>
                                    {vacancy.location?.city || ''}{" "}
                                    {vacancy.location?.country || ''}{" "}
                                    {vacancy.location?.state || 'Not Provided'}
                                </p>
                                <p>
                                    <strong>Experience:</strong> {vacancy.experienceRequired || 'Not Provided'}
                                </p>
                                <p>
                                    <strong>Mode of Working:</strong> {vacancy.modeOfWorking || 'Not Provided'}
                                </p>
                                <p>
                                    <strong>Vacancies:</strong> {vacancy.vacancies || 'Not Provided'}
                                </p>
                            </div>

                        </div>
                    ))
                )}
            </div>
        </BoxComponent>
    );
};

export default CreatedJobPostList;

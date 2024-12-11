import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import BoxComponent from '../../components/BoxComponent/BoxComponent';
import HeadingOneLineInfo from '../../components/HeadingOneLineInfo/HeadingOneLineInfo';
import { UseContext } from '../../State/UseState/UseContext';
import { useNavigate, useParams } from 'react-router-dom';
import UserProfile from '../../hooks/UserData/useUser';
import BasicButton from '../../components/BasicButton';

const ManagerOpenJobVacancy = () => {
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"]; // Retrieve the auth token from context or cookies
    const { organisationId } = useParams(); // Retrieve organizationId from URL params

    const { getCurrentUser } = UserProfile();
    const user = getCurrentUser();
    const hrId = user?._id; // Retrieve HR ID from user profile


    // Fetch job vacancies for a specific HR assigned to a manager
    const { data, isLoading, isError, error } = useQuery(
        ["JobVacancyByHR", organisationId, hrId],
        async () => {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/manager/hr/${hrId}/vacancies`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            console.log("API Response:", response.data);  // Log to confirm data
            return response.data.data;
        }
    );
    console.log("xyzdata", data);

    const navigate = useNavigate();

    const handleCreateJob = (vacancyId) => {
        console.log("vacancyId", vacancyId);
        if (vacancyId) {
            // Navigates to the edit job position route if a vacancyId is provided
            navigate(`/organisation/${organisationId}/create-job-position/${vacancyId}`);
        } else {
            // Navigates to the create job position route if no vacancyId is provided
            navigate(`/organisation/${organisationId}/create-job-position`);
        }
    };

    return (
        <BoxComponent>
            {/* Header Section */}
            <div className="flex justify-between items-center">
                <HeadingOneLineInfo heading="Manager Open Job Vacancy" info="Here HR can view open job vacancies assigned by the manager" />
                <BasicButton title="Create Job Position" onClick={() => handleCreateJob()} />
            </div>

            {/* Content Section */}
            <div className=" mt-6">
                {isLoading && (
                    <div className="fixed z-[100000] flex items-center justify-center bg-black/10 top-0 bottom-0 left-0 right-0">
                        <CircularProgress />
                    </div>
                )}
                {isError && <p>Error loading vacancies: {error.message}</p>}
                {!isLoading && data && data.length === 0 && <p>No job vacancies found assigned to this HR.</p>}

                {/* Display Job Vacancies */}
                {!isLoading && data && data.length > 0 && (
                    <table className="min-w-full bg-white text-left !text-sm font-light">
                        <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                            <tr className="!font-semibold">
                                <th scope="col" className="!text-left pl-8 py-3">Sr. No</th>
                                <th scope="col" className="whitespace-nowrap !text-left pl-8 py-3">Job Position</th>
                                <th scope="col" className="whitespace-nowrap !text-left pl-8 py-3">Department</th>
                                <th scope="col" className="whitespace-nowrap !text-left pl-8 py-3">Experience</th>
                                <th scope="col" className="!text-left pl-8 py-3">
                                    Vacancy
                                </th>
                                <th scope="col" className="whitespace-nowrap !text-left pl-8 py-3">Created By</th>
                                <th scope="col" className="whitespace-nowrap !text-left pl-8 py-3">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {/* Render Vacancy Data */}
                            {data.map((vacancy, index) => (
                                <tr key={vacancy._id} className="border-b hover:bg-gray-100">
                                    <td className="pl-8 py-3">{index + 1}</td>
                                    <td className="pl-8 py-3">{vacancy.jobPosition}</td>
                                    <td className="pl-8 py-3">{vacancy.department?.departmentName || 'N/A'}</td> {/* Department name */}
                                    <td className="pl-8 py-3">{vacancy.experienceRequired}</td>
                                    <td className="pl-8 py-3">{vacancy.vacancies}</td>
                                    <td className="pl-8 py-3">{vacancy.createdBy?.email || 'N/A'}</td> {/* Creator name */}
                                    <td className="whitespace-nowrap pl-8">
                                        <BasicButton variant='outlined' title="Create Job" onClick={() => handleCreateJob(vacancy._id)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

        </BoxComponent>
    );
};

export default ManagerOpenJobVacancy;

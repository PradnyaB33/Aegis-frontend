import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { UseContext } from '../../../State/UseState/UseContext';
import UserProfile from '../../../hooks/UserData/useUser';
import { TestContext } from '../../../State/Function/Main';
import { Box, Tabs, Tab } from '@mui/material'

const AcceptRejectTaskModal = () => {
    const { organisationId } = useParams();
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const { handleAlert } = useContext(TestContext);
    const { getCurrentUser } = UserProfile();
    const user = getCurrentUser();
    const userEmail = user?.email;

    const [value, setValue] = useState(0);

    const { data, error, isLoading, refetch } = useQuery(["addedTask", organisationId], async () => {
        const response = await axios.get(
            `${process.env.REACT_APP_API}/route/set-remote-task/${organisationId}`,
            {
                headers: {
                    Authorization: authToken,
                },
            }
        );
        return response.data;
    });

    // Filter tasks where the user's email matches any of the emails in the 'to' field
    const filteredTasks = data?.remotePunchingTasks?.filter(task =>
        task.to.some(toItem => toItem.value === userEmail)
    );

    // Group tasks into available and accepted categories
    const groupedTasks = filteredTasks?.reduce(
        (acc, task) => {
            task.taskName.forEach(nameObj => {
                const acceptedByUser = nameObj.acceptedBy.find(entry => entry.employeeEmail === userEmail);
                const isAccepted = acceptedByUser?.accepted;

                if (isAccepted) {
                    acc.accepted.push({ ...task, taskName: nameObj.taskName, subtaskId: nameObj._id });
                } else if (!acceptedByUser || !isAccepted) {
                    acc.available.push({ ...task, taskName: nameObj.taskName, subtaskId: nameObj._id });
                }
            });
            return acc;
        },
        { available: [], accepted: [] }
    );

    const handleAccept = async (subtaskId, employeeEmail, taskId) => {
        try {
            await axios.patch(
                `${process.env.REACT_APP_API}/route/set-remote-task/${organisationId}/${taskId}/accept-reject`,
                {
                    subtaskId,
                    employeeEmail,
                    accepted: true
                },
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            handleAlert(true, "success", "Task accepted successfully");
            refetch(); // Refetch the tasks after updating
        } catch (error) {
            handleAlert(true, "error", "Failed to accept task");
            console.error('Error accepting task:', error);
        }
    };

    const handleReject = async (taskId, employeeEmail, subtaskId) => {
        try {
            await axios.patch(
                `${process.env.REACT_APP_API}/route/set-remote-task/${organisationId}/${taskId}/accept-reject`,
                {
                    subtaskId,
                    employeeEmail,
                    accepted: false
                },
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            handleAlert(true, "success", "Task rejected successfully");
            refetch(); // Refetch the tasks after updating
        } catch (error) {
            handleAlert(true, "error", "Failed to reject task");
            console.error('Error rejecting task:', error);
        }
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading tasks</p>;

    return (
        <div className="bg-gray-50 p-3 h-[400px] overflow-scroll">
            <div className="bg-white rounded-lg shadow-lg w-full">
                <Box sx={{ borderBottom: 1, borderColor: "divider", display: "flex", paddingLeft: "20px" }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="basic tabs example"
                    >
                        <Tab label="Available Task" />
                        <Tab label="Accepted Task" />
                    </Tabs>
                </Box>
                <div className="p-4">
                    {value === 0 && groupedTasks.available.length > 0 && groupedTasks.available.map(task => (
                        <div key={task._id} className="mb-4 p-2 border rounded">
                            <p><strong>Title:</strong> {task.title}</p>
                            <p><strong>Description:</strong> {task.description}</p>
                            <p><strong>Task:</strong> {task.taskName}</p>
                            <div className="flex justify-end items-center mt-2">
                                <button
                                    className="px-4 py-2 bg-green-500 text-white rounded mr-2"
                                    onClick={() => handleAccept(task.subtaskId, userEmail, task._id)}
                                >
                                    Accept
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-500 text-white rounded"
                                    onClick={() => handleReject(task._id, userEmail, task.subtaskId)}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                    {value === 1 && groupedTasks.accepted.length > 0 && groupedTasks.accepted.map(task => (
                        <div key={task._id} className="mb-4 p-2 border rounded">
                            <p><strong>Title:</strong> {task.title}</p>
                            <p><strong>Description:</strong> {task.description}</p>
                            <p><strong>Task:</strong> {task.taskName}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AcceptRejectTaskModal;

































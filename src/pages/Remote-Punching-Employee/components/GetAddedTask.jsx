// import axios from "axios";
// import React, { useContext, useState } from "react";
// import { useQuery, useMutation } from "react-query";
// import { useParams } from "react-router-dom";
// import { UseContext } from "../../../State/UseState/UseContext";
// import { Dialog, DialogContent, DialogTitle, DialogActions, Button, Tooltip } from "@mui/material";
// import ReusableModal from "../../../components/Modal/component";
// import RemotePunchingTaskForm from "./RemotePunchingTaskForm";
// import ModalForStatusShow from "./modalForStatusShow";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

// const GetAddedTask = () => {
//     const { organisationId } = useParams();
//     const { cookies } = useContext(UseContext);
//     const authToken = cookies["aegis"];

//     const [open, setOpen] = useState(false);
//     const [selectedTask, setSelectedTask] = useState(null);
//     const [showStatus, setShowStatus] = useState(false);
//     const [taskForStatus, setTaskForStatus] = useState(null);
//     const [selectedTaskId, setSelectedTaskId] = useState(null);
//     const [deleteConfirmation, setDeleteConfirmation] = useState(null);

//     const { data, error, isLoading, refetch } = useQuery(["addedTask", organisationId], async () => {
//         const response = await axios.get(
//             `${process.env.REACT_APP_API}/route/set-remote-task/${organisationId}`,
//             {
//                 headers: {
//                     Authorization: authToken,
//                 },
//             }
//         );
//         return response.data;
//     });
//     console.log("ssssdata", data);

//     const deleteTask = useMutation(
//         async (taskId) => {
//             await axios.delete(
//                 `${process.env.REACT_APP_API}/route/set-remote-task/${organisationId}/${taskId}`,
//                 {
//                     headers: {
//                         Authorization: authToken,
//                     },
//                 }
//             );
//         },
//         {
//             onSuccess: () => {
//                 refetch();
//                 setDeleteConfirmation(null);
//             },
//             onError: (err) => {
//                 console.error("Error deleting task:", err);
//             },
//         }
//     );

//     // if (isLoading) return <div>Loading...</div>;
//     // if (error) return <div>Error fetching tasks: {error.message}</div>;

//     // if (!data || !data.success || !data.remotePunchingTasks || !data.remotePunchingTasks.length) {
//     //     return <div>No remote punching tasks found for this organization.</div>;
//     // }

//     const handleEdit = async (taskId) => {
//         const response = await axios.get(
//             `${process.env.REACT_APP_API}/route/set-remote-task/${organisationId}/${taskId}`,
//             {
//                 headers: {
//                     Authorization: authToken,
//                 },
//             }
//         );
//         setSelectedTask(response.data.remoteTask);
//         setOpen(true);
//     };

//     const confirmDelete = (taskId) => {
//         setDeleteConfirmation(taskId);
//     };

//     const handleDelete = () => {
//         if (deleteConfirmation) {
//             deleteTask.mutate(deleteConfirmation);
//         }
//     };

//     const handleCloseConfirmation = () => {
//         setDeleteConfirmation(null);
//     };

//     const handleRowClick = (task) => {
//         setTaskForStatus(task);
//         setSelectedTaskId(task._id);
//         setShowStatus(true);
//     };

//     return (
//         <div className="overflow-auto">
//             <table className="w-full table-auto border border-collapse min-w-full bg-white text-left !text-sm font-light">
//                 <thead className="border-b bg-gray-100 font-bold">
//                     <tr className="!font-semibold">
//                         <th scope="col" className="py-3 text-sm px-2">Sr. No.</th>
//                         <th scope="col" className="py-3 text-sm px-2">Title</th>
//                         <th scope="col" className="py-3 text-sm px-2"></th>
//                         <th scope="col" className="py-3 text-sm px-2">Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {data === undefined ?
//                         <tr
//                             className="border-b"
//                         >
//                             <td className="py-3 px-2">
//                                 "data not available" </td></tr> ?

//                             data.remotePunchingTasks.map((task, index) => (
//                                 <tr
//                                     key={task._id}
//                                     className="border-b"
//                                 >
//                                     <td className="py-3 px-2">{index + 1}</td>
//                                     <td className="py-3 px-2">{task.title}</td>
//                                     <td className="py-3 px-2"><Button
//                                         onClick={() => handleRowClick(task)}
//                                         variant="outlined"
//                                         color="primary"
//                                         size="small"
//                                     >
//                                         view Details
//                                     </Button></td>
//                                     <td className="py-3 px-2">
//                                         <Tooltip title="Edit">
//                                             <EditIcon
//                                                 color="primary"
//                                                 aria-label="edit"
//                                                 style={{
//                                                     color: "#2196f3",
//                                                     marginRight: "10px",
//                                                 }}
//                                                 onClick={(e) => { e.stopPropagation(); handleEdit(task._id); }}
//                                             />
//                                         </Tooltip>
//                                         <Tooltip title="Delete">
//                                             <DeleteOutlineIcon
//                                                 color="error"
//                                                 aria-label="delete"
//                                                 style={{
//                                                     marginRight: "10px",
//                                                 }}
//                                                 onClick={(e) => { e.stopPropagation(); confirmDelete(task._id); }}
//                                             />
//                                         </Tooltip>
//                                     </td>
//                                 </tr>
//                             ))
//                     }

//                 </tbody>
//             </table>

//             {selectedTask && (
//                 <ReusableModal
//                     open={open}
//                     heading={"Edit Remote Punching Task"}
//                     subHeading={"Here you can Edit remote punching task"}
//                     onClose={() => setOpen(false)}
//                 >
//                     <RemotePunchingTaskForm taskData={selectedTask} onClose={() => setOpen(false)} />
//                 </ReusableModal>
//             )}

//             {taskForStatus && (
//                 <ReusableModal
//                     className="!w-[800px]"
//                     open={showStatus}
//                     heading={"Task Status"}
//                     subHeading={"Here is the status of the selected task"}
//                     onClose={() => setShowStatus(false)}
//                 >
//                     <ModalForStatusShow taskId={selectedTaskId} taskData={taskForStatus} />
//                 </ReusableModal>
//             )}

//             <Dialog
//                 open={deleteConfirmation !== null}
//                 onClose={handleCloseConfirmation}
//             >
//                 <DialogTitle>Confirm Deletion</DialogTitle>
//                 <DialogContent>
//                     <p>Please confirm your decision to delete this task, as this action cannot be undone.</p>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button
//                         onClick={handleCloseConfirmation}
//                         variant="outlined"
//                         color="primary"
//                         size="small"
//                     >
//                         Cancel
//                     </Button>
//                     <Button
//                         variant="contained"
//                         size="small"
//                         onClick={handleDelete}
//                         color="error"
//                     >
//                         Delete
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </div>
//     );
// };

// export default GetAddedTask;
import axios from "axios";
import React, { useContext, useState } from "react";
import { useQuery, useMutation } from "react-query";
import { useParams } from "react-router-dom";
import { UseContext } from "../../../State/UseState/UseContext";
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, Tooltip } from "@mui/material";
import ReusableModal from "../../../components/Modal/component";
import RemotePunchingTaskForm from "./RemotePunchingTaskForm";
import ModalForStatusShow from "./modalForStatusShow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { format } from "date-fns";

const GetAddedTask = () => {
    const { organisationId } = useParams();
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];

    const [open, setOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showStatus, setShowStatus] = useState(false);
    const [taskForStatus, setTaskForStatus] = useState(null);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);

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
    console.log("remotePunchData", data);

    const deleteTask = useMutation(
        async (taskId) => {
            await axios.delete(
                `${process.env.REACT_APP_API}/route/set-remote-task/${organisationId}/${taskId}`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
        },
        {
            onSuccess: () => {
                refetch();
                setDeleteConfirmation(null);
            },
            onError: (err) => {
                console.error("Error deleting task:", err);
            },
        }
    );

    const handleEdit = async (taskId) => {
        const response = await axios.get(
            `${process.env.REACT_APP_API}/route/set-remote-task/${organisationId}/${taskId}`,
            {
                headers: {
                    Authorization: authToken,
                },
            }
        );
        setSelectedTask(response.data.remoteTask);
        setOpen(true);
    };

    const confirmDelete = (taskId) => {
        setDeleteConfirmation(taskId);
    };

    const handleDelete = () => {
        if (deleteConfirmation) {
            deleteTask.mutate(deleteConfirmation);
        }
    };

    const handleCloseConfirmation = () => {
        setDeleteConfirmation(null);
    };

    const handleRowClick = (task) => {
        setTaskForStatus(task);
        setSelectedTaskId(task._id);
        setShowStatus(true);
    };

    return (
        <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
            <table className="min-w-full bg-white  text-left !text-sm font-light">
                <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                    <tr className="!font-semibold">
                        <th scope="col" className="!text-left pl-8 py-3">Sr. No.</th>
                        <th scope="col" className="!text-left pl-8 py-3">Title</th>
                        <th scope="col" className="!text-left pl-8 py-3">Date</th>
                        <th scope="col" className="!text-left pl-8 py-3"></th>
                        <th scope="col" className="!text-left pl-8 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan="4" className="py-6 px-2">Loading...</td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan="4" className="py-6 px-2">Data not available</td>
                        </tr>
                    ) : data && data.remotePunchingTasks && data.remotePunchingTasks.length > 0 ? (
                        data.remotePunchingTasks.map((task, index) => (
                            <tr
                                key={task._id}
                                className="!font-medium border-b"
                            >
                                <td className="!text-left pl-8 py-3">{index + 1}</td>
                                <td className="py-3 pl-8">{task.title}</td>
                                <td className="py-3 pl-8"> {task.deadlineDate ? format(new Date(task.deadlineDate), "PP") : "N/A"}</td>
                                <td className="py-3 pl-8"><Button
                                    onClick={() => handleRowClick(task)}
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                >
                                    View Details
                                </Button></td>
                                <td className="py-3 pl-8">
                                    <Tooltip title="Edit">
                                        <EditIcon
                                            color="primary"
                                            aria-label="edit"
                                            style={{
                                                color: "#2196f3",
                                                marginRight: "10px",
                                            }}
                                            onClick={(e) => { e.stopPropagation(); handleEdit(task._id); }}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <DeleteOutlineIcon
                                            color="error"
                                            aria-label="delete"
                                            style={{
                                                marginRight: "10px",
                                            }}
                                            onClick={(e) => { e.stopPropagation(); confirmDelete(task._id); }}
                                        />
                                    </Tooltip>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr className="border-b">
                            <td colSpan="4" className="py-3 px-2">Data not available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {selectedTask && (
                <ReusableModal
                    className="h-[600px]"
                    open={open}
                    heading={"Edit Remote Punching Task"}
                    subHeading={"Here you can Edit remote punching task"}
                    onClose={() => setOpen(false)}
                >
                    <RemotePunchingTaskForm taskData={selectedTask} onClose={() => setOpen(false)} />
                </ReusableModal>
            )}

            {taskForStatus && (
                <ReusableModal
                    className="sm:!w-[full] lg:!w-[1000px] h-[600px]"
                    open={showStatus}
                    heading={"Task Status"}
                    subHeading={"Here is the status of the selected task"}
                    onClose={() => setShowStatus(false)}
                >
                    <ModalForStatusShow taskId={selectedTaskId} taskData={taskForStatus} />
                </ReusableModal>
            )}

            <Dialog
                open={deleteConfirmation !== null}
                onClose={handleCloseConfirmation}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <p>Please confirm your decision to delete this task, as this action cannot be undone.</p>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseConfirmation}
                        variant="outlined"
                        color="primary"
                        size="small"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={handleDelete}
                        color="error"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default GetAddedTask;

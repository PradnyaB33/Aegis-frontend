// import { PlayArrow } from "@mui/icons-material";
// import { Button, Dialog, DialogContent, Fab } from "@mui/material";
// import * as React from "react";
// import { useState, useEffect } from "react";
// import useLocationMutation from "./useLocationMutation";
// import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";
// import useGeoFencingCircle from "./useGeoFencingCircle";
// import StopGeoFencing from "./StopGeoFencing";

// export default function StartGeoFencing() {
//     //hooks
//     const { start, setStart, setStartTime, setGeoFencingArea } = useSelfieStore();
//     const { getUserImage } = useLocationMutation();
//     console.log("getUserImage", getUserImage);

//     const { employeeGeoArea } = useGeoFencingCircle();

//     //state
//     const [open, setOpen] = useState(false);
//     const [isInGeoFence, setIsInGeoFence] = useState(false);
//     const geoFencing = "geoFencing";

//     useEffect(() => {
//         const checkGeoFence = () => {
//             if (!employeeGeoArea || !employeeGeoArea?.area || !navigator?.geolocation) return;

//             navigator.geolocation.getCurrentPosition((position) => {
//                 const { latitude, longitude } = position.coords;
//                 const isWithinGeoFence = employeeGeoArea.area.some((area) => {
//                     const distance = calculateDistance(
//                         latitude,
//                         longitude,
//                         area.center.coordinates[0],
//                         area.center.coordinates[1]
//                     );
//                     return distance <= area.radius;
//                 });

//                 setIsInGeoFence(isWithinGeoFence);
//             });
//         };

//         checkGeoFence();
//     }, [employeeGeoArea]);

//     // Function to calculate the distance between two points (Haversine formula)
//     const calculateDistance = (lat1, lon1, lat2, lon2) => {
//         const toRad = (value) => (value * Math.PI) / 180;
//         const R = 6371e3; // Radius of the Earth in meters
//         const dLat = toRad(lat2 - lat1);
//         const dLon = toRad(lon2 - lon1);
//         const a =
//             Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//             Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
//             Math.sin(dLon / 2) * Math.sin(dLon / 2);
//         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//         const distance = R * c; // Distance in meters
//         return distance;
//     };

//     const handleOperate = () => {
//         setOpen(false);
//         getUserImage.mutate();
//         setStartTime();
//         setGeoFencingArea(true);
//     };

//     return (
//         <>
//             {!start ? (
//                 <Fab
//                     disabled={!isInGeoFence}
//                     onClick={() => setOpen(true)}
//                     color="primary"
//                     variant="extended"
//                     className="!absolute bottom-12 right-12 !text-white"
//                 >
//                     <PlayArrow sx={{ mr: 1 }} className={`animate-pulse text-white`} />
//                     Start
//                 </Fab>
//             ) : (
//                 <StopGeoFencing {...{ setStart, geoFencing, isInGeoFence }} />
//             )}

//             <Dialog open={open} onClose={() => setOpen(false)}>
//                 <DialogContent>
//                     <div className="w-full text-center text-red-500">
//                         <h1 className="font-semibold text-3xl">Confirm Action</h1>
//                     </div>
//                     <h1 className="text-lg mt-2">
//                         Are you sure you want to start geo access?
//                     </h1>
//                     <div className="flex gap-4 mt-4">
//                         <Button onClick={handleOperate} size="small" variant="contained">
//                             Yes
//                         </Button>
//                         <Button
//                             onClick={() => setOpen(false)}
//                             variant="contained"
//                             color="error"
//                             size="small"
//                         >
//                             No
//                         </Button>
//                     </div>
//                 </DialogContent>
//             </Dialog>
//         </>
//     );
// }import { PlayArrow } from "@mui/icons-material";

import {
    Button,
    Dialog,
    DialogContent,
    Fab,
    CircularProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
} from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import useLocationMutation from "./useLocationMutation";
import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";
import useGeoFencingCircle from "./useGeoFencingCircle";
import StopGeoFencing from "./StopGeoFencing";
import UserProfile from "../../../hooks/UserData/useUser";
import { PlayArrow } from "@mui/icons-material"; // Ensure this line is present
import StudentVerification from "./Fullskapestudent";


export default function StartGeoFencing() {
    // hooks
    const { start, setStart, setStartTime, setGeoFencingArea } = useSelfieStore();
    const { getUserImage } = useLocationMutation();
    const { employeeGeoArea } = useGeoFencingCircle();

    // state
    const [open, setOpen] = useState(false);
    const [isInGeoFence, setIsInGeoFence] = useState(false);
    const [studentsDialogOpen, setStudentsDialogOpen] = useState(false);
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [zoneId, setZoneId] = useState(null);
    const { getCurrentUser, useGetCurrentRole } = UserProfile();
    const user = getCurrentUser();
    const role = useGetCurrentRole();
    const organizationId = user && user.organizationId;
    const [searchQuery, setSearchQuery] = useState("");

    const [classFilter, setClassFilter] = useState("");
    const [divisionFilter, setDivisionFilter] = useState("");

    const filteredStudents = students.filter((student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!classFilter || student.class.toLowerCase().includes(classFilter.toLowerCase())) &&
        (!divisionFilter || student.division.toLowerCase().includes(divisionFilter.toLowerCase()))
    );
    

    const [selectedStudent, setSelectedStudent] = useState(null);

    const geoFencing = "geoFencing";


    // Function to calculate the distance between two points (Haversine formula)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const toRad = (value) => (value * Math.PI) / 180;
        const R = 6371e3; // Radius of the Earth in meters
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // Distance in meters
    };

    // Function to fetch Zone ID
    const fetchZoneId = useCallback(async () => {
        try {
            const token = localStorage.getItem("Authorization") || ""; // Replace with your token fetching logic
            const response = await fetch(
                `${process.env.REACT_APP_API}/route/fullskape/organization/${organizationId}`, // Replace organizationId
                { headers: { Authorization: token } }
            );
    
            if (response.ok) {
                const responseData = await response.json();
                const zone = responseData?.data[0]; // Adjust based on the actual API structure
                if (zone) {
                    setZoneId(zone._id);
                    console.log("Zone ID fetched successfully:", zone._id);
                } else {
                    console.error("No zones found in the API response.");
                }
            } else {
                console.error("Failed to fetch zone ID. HTTP Status:", response.status);
            }
        } catch (error) {
            console.error("Error fetching zone ID:", error);
        }
    }, [organizationId]);
    

    // Fetch students API function
    // Fetch Students API Function
    const fetchStudents = async () => {
        if (!zoneId) {
            console.error("Zone ID is not available. Cannot fetch students.");
            return;
        }
    
        console.log("Fetching students for Zone ID:", zoneId);
    
        try {
            setIsLoading(true);
            const token = localStorage.getItem("Authorization") || "";
    
            const url = `${process.env.REACT_APP_API}/route/fullskape/zones/${zoneId}/students`;
            console.log("API URL:", url);
    
            const response = await fetch(url, { headers: { Authorization: token } });
            if (response.ok) {
                const responseData = await response.json();
                setStudents(responseData?.data || []);
                console.log("Students fetched successfully:", responseData.data);
                setHasError(false);
            } else {
                console.error("Failed to fetch students. HTTP Status:", response.status);
                setHasError(true);
            }
        } catch (error) {
            console.error("Error fetching students:", error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };
    


    // Function to check GeoFence
    useEffect(() => {
        if (!employeeGeoArea || !employeeGeoArea?.area || !navigator?.geolocation) return;
    
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
    
                // Check if the current location is within any geofence area
                const isWithinGeoFence = employeeGeoArea.area.some((area) => {
                    const distance = calculateDistance(
                        latitude,
                        longitude,
                        area.center.coordinates[0],
                        area.center.coordinates[1]
                    );
                    return distance <= area.radius;
                });
    
                // Update state with the result
                setIsInGeoFence(isWithinGeoFence);
            },
            (error) => {
                console.error("Error fetching live location:", error);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000,
            }
        );
    
        // Cleanup watcher when component unmounts
        return () => {
            if (watchId !== undefined) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [employeeGeoArea]);
    

    useEffect(() => {
        fetchZoneId();
    }, [fetchZoneId]);

    // Function to handle GeoFencing Start
    const handleOperate = () => {
        setOpen(false);
        getUserImage.mutate();
        setStartTime();
        setGeoFencingArea(true);
    };

    // Handle Student List Button Click
    const handleStudentListClick = () => {

        setStudentsDialogOpen(true);
        fetchStudents(); // Ensure this is called
    };

    const handlePunchIn = (student) => {
        console.log(`Punching In for student: ${student.name}`);
        setSelectedStudent({ ...student, activity: "Punch In" }); // Pass activity as "Punch In"
    };
    
    const handlePunchOut = (student) => {
        console.log(`Punching Out for student: ${student.name}`);
        setSelectedStudent({ ...student, activity: "Punch Out" }); // Pass activity as "Punch Out"
    };
    

    return (
        <>
            {/* Conditionally show the Student List button */}
            { start && role === "Teacher" && (
                <Button
                    variant="contained"
                    color="primary"
                    className="!fixed bottom-40 right-12 !text-white"
                    onClick={handleStudentListClick}
                >
                    Student List
                </Button>
            )}

            {start && role === "Teacher" && (
                <div className="fixed bottom-28 left-0 right-0 flex justify-center items-center py-4">
                    {/* Center-aligned Punch In and Punch Out Buttons */}
                    <div className="flex space-x-4">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handlePunchIn(filteredStudents)}
                            className="text-white"
                        >
                            Punch In
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handlePunchOut(filteredStudents)}
                            className="text-white"
                        >
                            Punch Out
                        </Button>
                    </div>
                </div>
            )}



            {!start ? (
                <Fab
                disabled={!isInGeoFence}
                onClick={() => setOpen(true)}
                color="primary"
                variant="extended"
                className="!absolute bottom-12 right-12 !text-white"
                sx={{
                    width: '200px', // Adjust the width as needed
                    height: '50px', // Adjust the height as needed
                }}
            >
                <PlayArrow sx={{ mr: 1 }} className={`animate-pulse text-white`} />
                Start
            </Fab>
            
            
            ) : (
                <StopGeoFencing {...{ setStart, geoFencing, isInGeoFence }} />
            )}

            {/* Dialog for starting GeoFencing */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent>
                    <div className="w-full text-center text-red-500">
                        <h1 className="font-semibold text-3xl">Confirm Action</h1>
                    </div>
                    <h1 className="text-lg mt-2">
                        Are you sure you want to start geo access?
                    </h1>
                    <div className="flex gap-4 mt-4">
                        <Button onClick={handleOperate} size="small" variant="contained">
                            Yes
                        </Button>
                        <Button
                            onClick={() => setOpen(false)}
                            variant="contained"
                            color="error"
                            size="small"
                        >
                            No
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Dialog for displaying the Student List */}
            <Dialog open={studentsDialogOpen} onClose={() => setStudentsDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogContent>
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-2xl">Student List</h2>
                        <Button
                            size="small"
                            onClick={() => setStudentsDialogOpen(false)}
                            className="text-gray-500"
                        >
                            ✖
                        </Button>
                    </div>
                     {/* Filter inputs */}
                     <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border p-2 rounded mt-2"
                    />
                   <div className="flex space-x-4 mt-2">
                    <input
                        type="text"
                        placeholder="Filter by class..."
                        value={classFilter}
                        onChange={(e) => setClassFilter(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Filter by division..."
                        value={divisionFilter}
                        onChange={(e) => setDivisionFilter(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <CircularProgress />
                        </div>
                    ) : hasError ? (
                        <div className="text-center text-red-500">Failed to load students.</div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="text-center text-gray-500">No students found.</div>
                    ) : (
                        <List>
                        {filteredStudents.map((student) => (
                            <ListItem key={student._id} className="flex items-center space-x-4">
                                {/* Avatar */}
                                <ListItemAvatar>
                                    <Avatar
                                        src={student.imageUrl || ""}
                                        alt={student.name || "Unnamed"}
                                    />
                                </ListItemAvatar>
                    
                                {/* Student Name and Email */}
                                <div className="flex-1">
                                <ListItemText
                                            primary={student.name || "Unnamed"}
                                            secondary={`${student.class} - ${student.division}`}
                                        />
                                </div>
                    
                                {/* Buttons */}
                                <div className="flex space-x-2">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() => handlePunchIn(student)}
                                    >
                                        Punch In
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="small"
                                        onClick={() => handlePunchOut(student)}
                                    >
                                        Punch Out
                                    </Button>
                                </div>
                            </ListItem>
                        ))}
                    </List>
                    

                    )}
                </DialogContent>
            </Dialog>


         {/* Render the StudentVerification component when a student is selected */}
        {selectedStudent && (
            <StudentVerification
                student={selectedStudent}
                activity={selectedStudent.activity}
                zoneId={zoneId}
                onClose={() => setSelectedStudent(null)} // Reset selectedStudent on close
            />
        )}
        </>
    );
}


// import React, { useState, useRef, useEffect, useCallback } from "react";
// import { Dialog, DialogContent, Button, CircularProgress } from "@mui/material";
// import axios from "axios";
// import * as faceapi from "face-api.js";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import useSetupRemotePunching from "../../../hooks/QueryHook/Setup/remote-punching";
// import { useParams } from "react-router-dom";
// import { IconButton } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

// export default function StudentVerification({ student, onClose, zoneId, activity }) {
//     const [isLoading, setIsLoading] = useState(false);
//     const [verificationResult, setVerificationResult] = useState(null);
//     const [capturedImage, setCapturedImage] = useState(null);
//     const [isUploading, setIsUploading] = useState(false);
//     const { organisationId } = useParams();
//     const { data } = useSetupRemotePunching(organisationId);
//     const isnotifywhatsapp = data?.remotePunchingObject?.notifyWhatsApp;
//     const videoRef = useRef(null);
//     const canvasRef = useRef(null);
//     const authToken = useAuthToken();
//     const [isFaceDetected, setIsFaceDetected] = useState(false);

//     useEffect(() => {
//         const loadModels = async () => {
//             try {
//                 await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
//             } catch (error) {
//                 console.error("Error loading face-api.js models:", error);
//             }
//         };
    
//         const startCamera = async () => {
//             try {
//                 const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//                 if (videoRef.current) {
//                     videoRef.current.srcObject = stream;
//                     videoRef.current.onloadedmetadata = () => videoRef.current.play();
//                 }
//             } catch (error) {
//                 console.error("Error accessing camera:", error);
//             }
//         };
    
//         loadModels();
//         startCamera();
    
//         // Capture the current value of the ref
//         const videoElement = videoRef.current;
    
//         return () => {
//             if (videoElement?.srcObject) {
//                 const tracks = videoElement.srcObject.getTracks();
//                 tracks.forEach((track) => track.stop());
//                 videoElement.srcObject = null; // Ensure proper cleanup
//             }
//         };
//     }, []); // Ensure no unnecessary dependencies are added

//     useEffect(() => {
//         const detectFace = async () => {
//             if (videoRef.current) {
//                 const detections = await faceapi.detectAllFaces(
//                     videoRef.current,
//                     new faceapi.TinyFaceDetectorOptions()
//                 );
    
//                 if (detections.length > 0 && !isFaceDetected) {
//                     setIsFaceDetected(true);
//                     handleCapture();
//                 }
//             }
//         };
    
//         let intervalId;
//         if (!isFaceDetected) {
//             intervalId = setInterval(detectFace, 500); // Check every 500ms
//         }
    
//         return () => {
//             clearInterval(intervalId);
//         };
//     }, [isFaceDetected]);
    
   
    
    

//     const handleCapture = () => {
//         const canvas = canvasRef.current;
//         if (!canvas || !videoRef.current) return;

//         const context = canvas.getContext("2d");
//         context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
//         setCapturedImage(canvas.toDataURL("image/png"));

//         if (videoRef.current.srcObject) {
//             const tracks = videoRef.current.srcObject.getTracks();
//             tracks.forEach((track) => track.stop());
//             videoRef.current.srcObject = null;
//         }
//     };

//     const handleVerificationReset = useCallback(() => {
//         setCapturedImage(null);
//         setVerificationResult(null);
//         setIsFaceDetected(false);
//         startCamera();
//     }, [startCamera]);
    
//     const handleSuccessfulVerification = useCallback(() => {
//         setVerificationResult("Verification successful!");
//         setTimeout(() => {
//             handleVerificationReset();
//         }, 10000);
//     }, [handleVerificationReset]);

//     const handleMarkAttendance = useCallback(
//         async (studentResponse) => {
//             try {
//                 const response = await axios.post(
//                     `${process.env.REACT_APP_API}/route/fullskape-attendance/${zoneId}/${studentResponse._id}`,
//                     { type: activity },
//                     { headers: { Authorization: authToken } }
//                 );
//                 console.log(`Attendance ${activity.toLowerCase()} recorded successfully:`, response.data);
//             } catch (error) {
//                 console.error("Error marking attendance:", error.response?.data || error.message);
//             }
//         },
//         [activity, authToken, zoneId]
//     );
    
//     const sendWhatsAppMessage = useCallback(
//         async (studentResponse) => {
//             try {
//                 await axios.post(
//                     `${process.env.REACT_APP_API}/route/whatsapp/send-message`,
//                     {
//                         parentPhoneNumber: `+91${studentResponse.parentPhoneNumber}`,
//                         studentName: studentResponse.name,
//                         standard: studentResponse.class ?? "",
//                         activity: activity,
//                     },
//                     { headers: { Authorization: `Bearer ${authToken}` } }
//                 );
//             } catch (error) {
//                 console.error("Error sending WhatsApp message:", error.response?.data || error.message);
//             }
//         },
//         [authToken, activity]
//     );
    
//     const compareFaces = useCallback(async () => {
//         try {
//             setIsUploading(true);
//             if (!capturedImage) throw new Error("Captured image is not available.");
    
//             const base64ToBlob = (base64) => {
//                 const byteString = atob(base64.split(",")[1]);
//                 const byteArray = new Uint8Array(byteString.length);
//                 for (let i = 0; i < byteString.length; i++) {
//                     byteArray[i] = byteString.charCodeAt(i);
//                 }
//                 return new Blob([byteArray], { type: "image/png" });
//             };
    
//             const capturedBlob = base64ToBlob(capturedImage);
    
//             const formData = new FormData();
//             formData.append("uploadedImage", capturedBlob, "captured-image.png");
//             formData.append("activity", activity);
    
//             const response = await axios.post(
//                 `${process.env.REACT_APP_API}/route/face-model/Fullskape/compare`,
//                 formData,
//                 {
//                     headers: { Authorization: authToken, "Content-Type": "multipart/form-data" },
//                 }
//             );
    
//             if (response.data?.match) {
//                 const studentResponse = response.data.student;
//                 if (isnotifywhatsapp) await sendWhatsAppMessage(studentResponse);
//                 await handleMarkAttendance(studentResponse);
//                 handleSuccessfulVerification();
//             } else {
//                 setVerificationResult("Verification failed. Please try again.");
//                 setTimeout(handleVerificationReset, 3000);
//             }
//         } catch (error) {
//             console.error("Face comparison error:", error);
//             setVerificationResult("An error occurred during verification.");
//             setTimeout(handleVerificationReset, 3000);
//         } finally {
//             setIsUploading(false);
//         }
//     }, [
//         activity,
//         authToken,
//         capturedImage,
//         handleMarkAttendance,
//         handleVerificationReset,
//         handleSuccessfulVerification,
//         isnotifywhatsapp,
//         sendWhatsAppMessage,
//     ]);

//     useEffect(() => {
//         const autoSubmit = async () => {
//             if (capturedImage) {
//                 try {
//                     await compareFaces();
//                 } catch (error) {
//                     console.error("Automated submission failed:", error);
//                 }
//             }
//         };
    
//         autoSubmit();
//     }, [capturedImage, compareFaces]);
    
//     // Add startCamera as a standalone function for reuse
//     const startCamera = async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//             if (videoRef.current) {
//                 videoRef.current.srcObject = stream;
//                 videoRef.current.play();
//             }
//         } catch (error) {
//             console.error("Error accessing camera:", error);
//         }
//     };
    

//     const handleSubmit = async () => {
//         setIsLoading(true);
//         try {
//             const result = await compareFaces();
//             setVerificationResult(result.match ? "Verification successful!" : "Verification failed.");
//         } catch {
//             setVerificationResult("An error occurred during verification.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // const handleRetake = () => {
//     //     setCapturedImage(null);
//     //     const startCamera = async () => {
//     //         try {
//     //             const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//     //             if (videoRef.current) {
//     //                 videoRef.current.srcObject = stream;
//     //                 videoRef.current.play();
//     //             }
//     //         } catch (error) {
//     //             console.error("Error accessing camera:", error);
//     //         }
//     //     };
//     //     startCamera();
//     // };

//     return (
//         <Dialog open={!!student} onClose={onClose} fullWidth maxWidth="sm">
//         <DialogContent>
//             <div className="flex justify-between items-center">
//                 <h2 className="text-center font-bold text-2xl">Verify Student</h2>
//                 <IconButton onClick={onClose} size="small">
//                     <CloseIcon />
//                 </IconButton>
//             </div>
//             <div className="flex justify-center">
//                 {!capturedImage ? (
//                     <video
//                         ref={videoRef}
//                         width="640"
//                         height="480"
//                         style={{ borderRadius: "8px" }}
//                     />
//                 ) : (
//                     <img
//                         src={capturedImage}
//                         alt="Captured"
//                         className="rounded-md my-4"
//                         width="640"
//                         height="480"
//                     />
//                 )}
//                 <canvas ref={canvasRef} width="640" height="480" style={{ display: "none" }} />
//             </div>
//             {!capturedImage ? (
//                 <div className="flex justify-center mt-4">
//                     <Button variant="contained" color="primary" onClick={handleCapture}>
//                         Capture Selfie
//                     </Button>
//                 </div>
//             ) : (
//                 <div className="flex justify-center gap-4 mt-4">
                    
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         onClick={handleSubmit}
//                         disabled={isUploading}
//                     >
//                         Submit
//                     </Button>
//                 </div>
//             )}

//             {isLoading && (
//                 <div className="flex justify-center items-center py-4">
//                     <CircularProgress />
//                 </div>
//             )}
//             {verificationResult && <p className="text-center mt-4 text-lg">{verificationResult}</p>}
//         </DialogContent>
//     </Dialog>
//     );
// }

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Dialog, DialogContent, Button, CircularProgress, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import * as faceapi from "face-api.js";
import useAuthToken from "../../../hooks/Token/useAuth";
import useSetupRemotePunching from "../../../hooks/QueryHook/Setup/remote-punching";
import { useParams } from "react-router-dom";

export default function StudentVerification({ student, onClose, zoneId, activity }) {
    const [setIsLoading] = useState(false);
    const [verificationResult, setVerificationResult] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const { organisationId } = useParams();
    const { data } = useSetupRemotePunching(organisationId);
    const isnotifywhatsapp = data?.remotePunchingObject?.notifyWhatsApp;
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const authToken = useAuthToken();
    const [isFaceDetected, setIsFaceDetected] = useState(false);
    const streamRef = useRef(null);

    // Initialize models and start the camera
    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = stream; // Store the stream in the ref
            
            if (videoRef.current && videoRef.current.srcObject !== streamRef.current) {
                videoRef.current.srcObject = stream;  // Only set srcObject if it's different
                await videoRef.current.play(); // Ensure video plays after setting srcObject
            }
        } catch (error) {
            console.error("Error accessing camera:", error);
        }
    }, []);

    useEffect(() => {
        const loadModels = async () => {
            try {
                await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
            } catch (error) {
                console.error("Error loading face-api.js models:", error);
            }
        };

        loadModels();
        startCamera();

        return () => {
            // Capture the value of the ref in a variable to avoid direct usage of 'streamRef.current'
            const stream = streamRef.current;
            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach((track) => track.stop());
            }
        };
    }, [startCamera]);

    const handleCapture = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !videoRef.current) return;

        const context = canvas.getContext("2d");
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        setCapturedImage(canvas.toDataURL("image/png"));

        if (videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }
    }, []);
    
    useEffect(() => {
        const detectFace = async () => {
            if (videoRef.current) {
                const detections = await faceapi.detectAllFaces(
                    videoRef.current,
                    new faceapi.TinyFaceDetectorOptions()
                );
                if (detections.length > 0 && !isFaceDetected) {
                    setIsFaceDetected(true);
                    handleCapture();
                }
            }
        };
    
        let intervalId;
        if (!isFaceDetected) {
            intervalId = setInterval(detectFace, 500); // Check every 500ms
        }
    
        return () => clearInterval(intervalId);
    }, [isFaceDetected, handleCapture]);
    

    const handleVerificationReset = useCallback(() => {
        setCapturedImage(null);
        setVerificationResult(null);
        setIsFaceDetected(false);
        startCamera();
    }, [startCamera]);

    const handleSuccessfulVerification = useCallback(() => {
        setVerificationResult("Verification successful!");
        setTimeout(() => {
            handleVerificationReset();
        }, 10000);
    }, [handleVerificationReset]);

    const handleMarkAttendance = useCallback(
        async (studentResponse) => {
            try {
                await axios.post(
                    `${process.env.REACT_APP_API}/route/fullskape-attendance/${zoneId}/${studentResponse._id}`,
                    { type: activity },
                    { headers: { Authorization: authToken } }
                );
            } catch (error) {
                console.error("Error marking attendance:", error.response?.data || error.message);
            }
        },
        [activity, authToken, zoneId]
    );

    const sendWhatsAppMessage = useCallback(
        async (studentResponse) => {
            try {
                await axios.post(
                    `${process.env.REACT_APP_API}/route/whatsapp/send-message`,
                    {
                        parentPhoneNumber: `+91${studentResponse.parentPhoneNumber}`,
                        studentName: studentResponse.name,
                        standard: studentResponse.class ?? "",
                        activity,
                    },
                    { headers: { Authorization: `Bearer ${authToken}` } }
                );
            } catch (error) {
                console.error("Error sending WhatsApp message:", error.response?.data || error.message);
            }
        },
        [authToken, activity]
    );

    const compareFaces = useCallback(async () => {
        try {
            setIsUploading(true);
            if (!capturedImage) throw new Error("Captured image is not available.");

            const base64ToBlob = (base64) => {
                const byteString = atob(base64.split(",")[1]);
                const byteArray = new Uint8Array(byteString.length);
                for (let i = 0; i < byteString.length; i++) {
                    byteArray[i] = byteString.charCodeAt(i);
                }
                return new Blob([byteArray], { type: "image/png" });
            };

            const capturedBlob = base64ToBlob(capturedImage);

            const formData = new FormData();
            formData.append("uploadedImage", capturedBlob, "captured-image.png");
            formData.append("activity", activity);

            const response = await axios.post(
                `${process.env.REACT_APP_API}/route/face-model/Fullskape/compare`,
                formData,
                {
                    headers: { Authorization: authToken, "Content-Type": "multipart/form-data" },
                }
            );

            if (response.data?.match) {
                const studentResponse = response.data.student;
                if (isnotifywhatsapp) await sendWhatsAppMessage(studentResponse);
                await handleMarkAttendance(studentResponse);
                handleSuccessfulVerification();
            } else {
                setVerificationResult("Verification failed. Please try again.");
                setTimeout(handleVerificationReset, 3000);
            }
        } catch (error) {
            console.error("Face comparison error:", error);
            setVerificationResult("An error occurred during verification.");
            setTimeout(handleVerificationReset, 3000);
        } finally {
            setIsUploading(false);
        }
    }, [
        activity,
        authToken,
        capturedImage,
        handleMarkAttendance,
        handleVerificationReset,
        handleSuccessfulVerification,
        isnotifywhatsapp,
        sendWhatsAppMessage,
    ]);

    useEffect(() => {
        if (capturedImage) compareFaces();
    }, [capturedImage, compareFaces]);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            await compareFaces();
        } catch {
            setVerificationResult("An error occurred during verification.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={!!student} onClose={onClose} fullWidth maxWidth="sm">
            <DialogContent>
                <div className="flex justify-between items-center">
                    <h2 className="text-center font-bold text-2xl">Verify Student</h2>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </div>
    
                {/* Instructions */}
                <p className="text-center text-gray-600 mt-2">
                    Please stand in front of the camera for face detection. Ensure your face is well-lit, 
                    centered, and clearly visible within the frame.
                </p>
    
                <div className="flex flex-col justify-center items-center relative mt-4">
                    {/* Preview area with overlay */}
                    <div className="relative w-full max-w-md">
                        {!capturedImage ? (
                            <video
                                ref={videoRef}
                                width="100%"
                                height="auto"
                                className="rounded-md"
                            />
                        ) : (
                            <img
                                src={capturedImage}
                                alt="Captured"
                                className="rounded-md w-full"
                            />
                        )}
                        <canvas ref={canvasRef} width="640" height="480" style={{ display: "none" }} />
    
                        {/* Loading spinner */}
                        {isUploading && (
                            <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75">
                                <CircularProgress />
                            </div>
                        )}
    
                        {/* Verification result */}
                        {verificationResult && (
                            <div className="absolute inset-0 flex justify-center items-center">
                                <p className="text-lg font-bold text-center bg-white bg-opacity-75 px-4 py-2 rounded-md shadow-md">
                                    {verificationResult}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
    
                {/* Action buttons */}
                {!capturedImage ? (
                    <div className="flex justify-center mt-4">
                        <Button variant="contained" color="primary" onClick={handleCapture}>
                            Capture Selfie
                        </Button>
                    </div>
                ) : (
                    <div className="flex justify-center gap-4 mt-4">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={isUploading}
                        >
                            Submit
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
    
    
    
}

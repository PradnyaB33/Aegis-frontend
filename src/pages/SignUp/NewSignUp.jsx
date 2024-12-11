// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Badge,
//   CheckCircle,
//   DriveFileRenameOutlineOutlined,
//   Email,
//   Fingerprint,
//   Lock,
//   PermContactCalendar,
//   Phone,
// } from "@mui/icons-material";
// import { Grid, SvgIcon, Typography } from "@mui/material";
// import axios from "axios";
// import React, { useContext, useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import Carousel from "react-multi-carousel";
// import { useMutation } from "react-query";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { z } from "zod";
// import { TestContext } from "../../State/Function/Main";
// import aegislogo from "../../assets/AegisFLogo.jpeg";
// import login1 from "../../assets/login1.svg";
// import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
// import UserProfile from "../../hooks/UserData/useUser";
// import useAuthentication from "./useAuthentication";

// const SignIn = () => {
//   // hooks
//   const { handleAlert } = useContext(TestContext);
//   const location = useLocation();
//   const { countryCode } = useAuthentication();
//   // state
//   const [display, setdisplay] = useState(false);
//   const [isVerified, setIsVerified] = useState(false);
//   const [otp, setOTP] = useState("");
//   const [time, setTime] = useState(1);
//   const [isTimeVisible, setIsTimeVisible] = useState(false);
//   const [readOnly, setReadOnly] = useState(false);
//   const [visiblePassword, setVisiblePassword] = useState(false);
//   const [visibleCPassword, setVisibleCPassword] = useState(false);

//   const responsive = {
//     superLargeDesktop: {
//       // the naming can be any, depends on you.
//       breakpoint: { max: 4000, min: 1024 },
//       items: 1,
//     },
//     desktop: {
//       breakpoint: { max: 1024, min: 768 },
//       items: 1,
//     },
//     tablet: {
//       breakpoint: { max: 768, min: 464 },
//       items: 1,
//     },
//     mobile: {
//       breakpoint: { max: 464, min: 0 },
//       items: 1,
//     },
//   };

//   // to get current user
//   const { getCurrentUser } = UserProfile();
//   // const { countryCode } = useAuthentication();
//   const user = getCurrentUser();

//   // navigate
//   const navigate = useNavigate("");

//   useEffect(() => {
//     if (user?._id) {
//       navigate(-1);
//     }
//     // eslint-disable-next-line
//   }, []);

//   useEffect(() => {
//     let interval;
//     if (time > 0) {
//       interval = setInterval(() => {
//         setTime((prevTimer) => prevTimer - 1);
//       }, 1000);
//     } else {
//       setIsTimeVisible(false);
//     }

//     // Clean up the interval when the component unmounts
//     return () => clearInterval(interval);

//     // eslint-disable-next-line
//   }, [time, isTimeVisible]);

//   const passwordRegex =
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

//   // define the validation using zod
//   const SignUpSchema = z
//     .object({
//       first_name: z
//         .string()
//         .min(2, { message: "Minimum 2 character " })
//         .max(15)
//         .regex(/^[a-zA-Z]+$/, { message: "only character allow" }),

//       last_name: z
//         .string()
//         .min(2)
//         .max(15)
//         .regex(/^[a-zA-Z]+$/),
//       phone: z
//         .string()
//         .min(10, { message: "Phone Number must be 10 digit" })
//         .regex(/^[0-9]+$/),
//       email: z.string().email(),
//       password: z
//         .string()
//         .min(8)
//         .refine((value) => passwordRegex.test(value), {
//           message: "Password must contain one capital letter, one number & one special character",
//         }),
//       confirmPassword: z.string(),
//       isChecked: z.boolean().refine((value) => value === true, {
//         message: "Please accept the Terms and Conditions to sign up.",
//       }),
//     })
//     .refine((data) => data.password === data.confirmPassword, {
//       message: "Password does not match",
//       path: ["confirmPassword"],
//     });

//   // use useForm
//   const {
//     handleSubmit,
//     control,
//     getValues,
//     watch,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(SignUpSchema),
//   });

//   const number = watch("phone");
//   // to define the onSubmit function
//   const onSubmit = async (data) => {
//     try {
//       if (!isVerified) {
//         handleAlert(true, "warning", "Please verify your phone number");
//         return false;
//       }

//       const response = await axios.post(
//         `${process.env.REACT_APP_API}/route/employee/create`,
//         data
//       );
//       handleAlert(true, "success", response.data.message);
//       window.location.reload();
//     } catch (error) {
//       handleAlert(
//         true,
//         "error",
//         error.response.data.message || "Failed to sign up. Please try again."
//       );
//     }
//   };

//   const OtpRequest = useMutation(
//     (data) =>
//       axios.post(`${process.env.REACT_APP_API}/route/employee/sendOtp`, {
//         number: data,
//         countryCode,
//       }),
//     {
//       onSuccess: (data) => {
//         handleAlert(
//           true,
//           "success",
//           "OTP has been send successfully on your device"
//         );
//         setdisplay(true);
//         setTime(1);
//         setIsTimeVisible(true);
//       },

//       onError: (data) => {
//         if (data?.response?.status === 500) {
//           handleAlert(true, "warning", `${data?.response?.data?.message}`);
//         }
//         if (data?.response?.data?.success === false)
//           handleAlert(true, "error", data?.response?.data?.message);
//       },
//     }
//   );

//   const VerifyOtpRequest = useMutation(
//     (data) =>
//       axios.post(`${process.env.REACT_APP_API}/route/employee/verifyOtp`, data),
//     {
//       onSuccess: (data) => {
//         if (data?.data?.success === false) {
//           handleAlert(true, "error", data?.data?.message);
//         }

//         if (data?.data?.success === true) {
//           handleAlert(true, "success", `OTP verified successfully`);
//           setdisplay(false);
//           setIsVerified(true);
//           setIsTimeVisible(false);
//           setReadOnly(true);
//         }
//       },
//     }
//   );

//   const phone = getValues("phone");
//   const SendOtp = () => {
//     OtpRequest.mutate(phone);
//   };

//   const VerifyOtp = () => {
//     const data = { number: phone, otp };

//     if (!otp || !number) {
//       handleAlert(true, "warning", "Otp and number are required fields");
//       return false;
//     }
//     VerifyOtpRequest.mutate(data);
//   };

//   return (
//     <Grid container>
//       <Grid
//         className="h-screen"
//         item
//         xs={12}
//         sm={12}
//         md={12}
//         lg={6}
//         sx={{
//           overflow: "hidden",
//           p: "2%",
//           display: { lg: "block", md: "none", sm: "none", xs: "none" },
//         }}
//       >
//         <div className="flex h-[80vh] flex-col items-center justify-center">
//           <div className="h-1/2 w-[80%]">
//             <Carousel
//               swipeable={true}
//               draggable={false}
//               showDots={true}
//               responsive={responsive}
//               infinite={true}
//               autoPlay={true}
//               autoPlaySpeed={3000}
//               keyBoardControl={true}
//               customTransition="all .5"
//               transitionDuration={500}
//               containerClass="carousel-container"
//               dotListClass="custom-dot-list-style"
//               itemClass="carousel-item-padding-40-px"
//               arrows={false}
//             >
//               {Array.from({ length: 3 }).map((_, index) => (
//                 <img
//                   src={login1}
//                   alt="logo"
//                 //className="h-[300px] object-cover"
//                 />
//               ))}
//             </Carousel>
//           </div>
//         </div>
//       </Grid>

//       <Grid
//         item
//         xs={12}
//         sm={12}
//         md={12}
//         lg={6}
//         className=" overflow-scroll  h-screen   border  border-l-[.5px] bg-gray-50"
//         sx={{
//           display: "flex",
//           justifyContent: "center",

//           p: { xs: "5%", sm: "5%", md: "5%", lg: "5% 5% 5% 5%" },

//           overflowY: "auto",
//         }}
//       >
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           autoComplete="off"
//           className="w-full"
//         //className="flex   my-16 sm:!px-20 px-6 lg:w-[80%] w-full bg-white flex-col h-fit gap-1"
//         >
//           <img
//             src={aegislogo}
//             alt="logo"
//             className="h-[50px]  object-cover  mix-blend-multiply mb-2"
//           />
//           <div>
//             <Typography
//               component="p"
//               sx={{ fontSize: "32px", fontWeight: "600", color: "#1414fe" }}
//             >
//               Register Account
//             </Typography>
//           </div>
//           <div className="mt-6 grid md:grid-cols-2 grid-cols-1 gap-2">
//             {/* First Name */}
//             <AuthInputFiled
//               name="first_name"
//               icon={PermContactCalendar}
//               control={control}
//               type="text"
//               placeholder="First Name"
//               label="First Name *"
//               maxLimit={15}
//               errors={errors}
//               error={errors.first_name}
//             />
//             <AuthInputFiled
//               name="middle_name"
//               icon={Badge}
//               control={control}
//               type="text"
//               placeholder="Middle Name"
//               label="Middle Name"
//               errors={errors}
//               maxLimit={15}
//               error={errors.middle_name}
//             />
//           </div>
//           {/* Last Name */}
//           <AuthInputFiled
//             name="last_name"
//             icon={DriveFileRenameOutlineOutlined}
//             control={control}
//             type="text"
//             label="Last Name *"
//             placeholder="Last Name"
//             errors={errors}
//             maxLimit={15}
//             error={errors.last_name}
//           />
//           {/* Phone Number */}
//           <div className="flex sm:flex-row flex-col w-full sm:items-center items-start gap-0 sm:gap-2 sm:mb-0 mb-3">
//             <div className="w-full">
//               <AuthInputFiled
//                 name="phone"
//                 icon={Phone}
//                 readOnly={readOnly}
//                 control={control}
//                 label={"Phone Number *"}
//                 type="contact"
//                 errors={errors}
//                 error={errors.phone}
//                 placeholder={"1234567890"}
//               />
//             </div>

//             <>
//               {isVerified ? (
//                 <>
//                   <SvgIcon color="success">
//                     <CheckCircle />
//                   </SvgIcon>
//                   Verified
//                 </>
//               ) : (
//                 <div className="w-[20%]">
//                   <button
//                     type="button"
//                     disabled={
//                       number?.length !== 10 || isTimeVisible ? true : false
//                     }
//                     onClick={SendOtp}
//                     className={`w-max flex group justify-center gap-2 items-center rounded-md h-max px-4 py-1 text-md font-semibold text-white bg-[#1414fe]  ${(number?.length !== 10 || isTimeVisible) &&
//                       "bg-gray-400 text-gray-900"
//                       }`}
//                   >
//                     Get OTP
//                   </button>
//                 </div>
//               )}

//               {isTimeVisible && (
//                 <p>
//                   Resend OTP {Math.floor(time / 60)}:
//                   {(time % 60).toString().padStart(2, "0")}
//                 </p>
//               )}
//             </>
//           </div>
//           {display && (
//             <div className="w-max flex items-center gap-2">
//               <div className="space-y-1">
//                 <label className={`font-semibold text-gray-500 text-md`}>
//                   Verify OTP
//                 </label>
//                 <div className="flex  rounded-md px-2 border-gray-200 border-[.5px] bg-white py-[6px]">
//                   <Fingerprint className="text-gray-700" />
//                   <input
//                     type={"number"}
//                     onChange={(e) => setOTP(e.target.value)}
//                     placeholder={"1235"}
//                     className="border-none bg-white w-full outline-none px-2"
//                   />
//                 </div>

//                 <div className="h-4  !mb-1 "></div>
//               </div>

//               <button
//                 type="button"
//                 onClick={VerifyOtp}
//                 className="w-max flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-1 text-md font-semibold text-white bg-[#1414fe] hover:bg-[#1414fe] "
//               >
//                 Verify OTP
//               </button>
//             </div>
//           )}
//           <AuthInputFiled
//             name="email"
//             icon={Email}
//             control={control}
//             type="email"
//             placeholder="Email"
//             label="Email Address *"
//             errors={errors}
//             error={errors.email}
//           />

//           <div className="grid md:grid-cols-2 grid-cols-1  gap-2">
//             <AuthInputFiled
//               name="password"
//               visible={visiblePassword}
//               setVisible={setVisiblePassword}
//               icon={Lock}
//               control={control}
//               type="Password1"
//               placeholder="****"
//               label="Password *"
//               errors={errors}
//               error={errors.password}
//             />

//             <AuthInputFiled
//               name="confirmPassword"
//               icon={Lock}
//               visible={visibleCPassword}
//               setVisible={setVisibleCPassword}
//               control={control}
//               type="password"
//               placeholder="****"
//               label="Confirm Password *"
//               errors={errors}
//               error={errors.confirmPassword}
//             />
//           </div>

//           <div className="flex items-center ">
//             <div className="w-max">
//               <AuthInputFiled
//                 name="isChecked"
//                 control={control}
//                 type="checkbox"
//                 label={`I accept the`}
//                 errors={errors}
//                 error={errors.isChecked}
//               />
//             </div>
//           </div>

//           {/* Signup Button */}
//           <div className="flex  mb-2">
//             <button
//               type="submit"
//               className={`flex group justify-center text-lg w-full gap-2 items-center rounded-md h-[30px] px-4 py-4 font-semibold text-white bg-[#1414fe]`}
//             >
//               Register Account{" "}
//             </button>
//           </div>
//           {/* <button
//             type="submit"
//             className="flex group justify-center text-lg w-full gap-2 items-center rounded-md h-[30px] px-4 py-4 font-semibold text-white bg-[#1414fe]"
//           >
//             Register Account
//           </button> */}

//           <Typography
//             className="text-gray-500"
//             component="p"
//             sx={{ fontSize: "18px" }}
//           >
//             {" "}
//             Already have an account?{" "}
//             <Link
//               to={location.pathname === "/sign-up" ? "/sign-in" : "/sign-up"}
//               className="font-medium text-blue-500 hover:underline  transition-all "
//             >
//               Sign In
//             </Link>
//           </Typography>
//         </form>
//       </Grid>
//     </Grid>
  
//   );
// };

// export default SignIn;




// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Badge,
//   CheckCircle,
//   DriveFileRenameOutlineOutlined,
//   Email,
//   Fingerprint,
//   Lock,
//   PermContactCalendar,
//   Phone,
// } from "@mui/icons-material";
// import { Grid, SvgIcon, Typography } from "@mui/material";
// import axios from "axios";
// import React, { useContext, useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import Carousel from "react-multi-carousel";
// import { useMutation } from "react-query";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { z } from "zod";
// import { TestContext } from "../../State/Function/Main";
// import aegislogo from "../../assets/AegisFLogo.jpeg";
// import login1 from "../../assets/login1.svg";
// import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
// import UserProfile from "../../hooks/UserData/useUser";
// import useAuthentication from "./useAuthentication";

// const SignIn = () => {
//   // hooks
//   const { handleAlert } = useContext(TestContext);
//   const location = useLocation();
//   const { countryCode } = useAuthentication();
//   // state
//   const [display, setdisplay] = useState(false);
//   const [isVerified, setIsVerified] = useState(false);
//   const [otp, setOTP] = useState("");
//   const [time, setTime] = useState(1);
//   const [isTimeVisible, setIsTimeVisible] = useState(false);
//   const [readOnly, setReadOnly] = useState(false);
//   const [visiblePassword, setVisiblePassword] = useState(false);
//   const [visibleCPassword, setVisibleCPassword] = useState(false);

//   const responsive = {
//     superLargeDesktop: {
//       // the naming can be any, depends on you.
//       breakpoint: { max: 4000, min: 1024 },
//       items: 1,
//     },
//     desktop: {
//       breakpoint: { max: 1024, min: 768 },
//       items: 1,
//     },
//     tablet: {
//       breakpoint: { max: 768, min: 464 },
//       items: 1,
//     },
//     mobile: {
//       breakpoint: { max: 464, min: 0 },
//       items: 1,
//     },
//   };

//   // to get current user
//   const { getCurrentUser } = UserProfile();
//   // const { countryCode } = useAuthentication();
//   const user = getCurrentUser();

//   // navigate
//   const navigate = useNavigate("");

//   useEffect(() => {
//     if (user?._id) {
//       navigate(-1);
//     }
//     // eslint-disable-next-line
//   }, []);

//   useEffect(() => {
//     let interval;
//     if (time > 0) {
//       interval = setInterval(() => {
//         setTime((prevTimer) => prevTimer - 1);
//       }, 1000);
//     } else {
//       setIsTimeVisible(false);
//     }

//     // Clean up the interval when the component unmounts
//     return () => clearInterval(interval);

//     // eslint-disable-next-line
//   }, [time, isTimeVisible]);

//   // const passwordRegex =
//   //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


// // Define the password validation schema
// const passwordSchema = z
//   .string()
//   .min(8, "Password must be at least 8 characters long")
//   .max(16, "Password must be at most 16 characters long")
//   .regex(/^(?=.*[a-z])/, "Password must contain at least one lowercase letter")
//   .regex(/^(?=.*\d)/, "Password must contain at least one number")
//   .refine((value) => {
//     const conditions = [
//       value.length >= 8 && value.length <= 16, // Length condition
//       /[a-z]/.test(value), // Lowercase condition
//       /\d/.test(value), // Number condition
//       /[!@#$%^&*(),.?":{}|<>]/.test(value), // Special character condition
//     ];
//     const passedConditions = conditions.filter(Boolean).length;

//     if (passedConditions >= 3) {
//       return true;
//     } else {
//       return false;
//     }
//   }, "You can make password stronger, meeting conditions");





//   // define the validation using zod
//   const SignUpSchema = z
//     .object({
//       first_name: z
//         .string()
//         .min(2, { message: "Minimum 2 character " })
//         .max(15)
//         .regex(/^[a-zA-Z]+$/, { message: "only character allow" }),

//       last_name: z
//         .string()
//         .min(2)
//         .max(15)
//         .regex(/^[a-zA-Z]+$/),
//       phone: z
//         .string()
//         .min(10, { message: "Phone Number must be 10 digit" })
//         .regex(/^[0-9]+$/),
//       email: z.string().email(),
//       password: passwordSchema,
//       confirmPassword: z.string(),
//       isChecked: z.boolean().refine((value) => value === true, {
//         message: "Please accept the Terms and Conditions to sign up.",
//       }),
//     })
//     .refine((data) => data.password === data.confirmPassword, {
//       message: "Password does not match",
//       path: ["confirmPassword"],
//     });

//   // use useForm
//   const {
//     handleSubmit,
//     control,
//     getValues,
//     watch,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(SignUpSchema),
//   });

//   const number = watch("phone");
//   // to define the onSubmit function
//   const onSubmit = async (data) => {
//     try {
//       if (!isVerified) {
//         handleAlert(true, "warning", "Please verify your phone number");
//         return false;
//       }


//       const password = data.password;
//       const conditions = [
//         password.length >= 8 && password.length <= 16,
//         /[a-z]/.test(password),
//         /\d/.test(password),
//         /[!@#$%^&*(),.?":{}|<>]/.test(password),
//       ];
//       const passedConditions = conditions.filter(Boolean).length;
    
//       if (passedConditions === 4) {
//         // All conditions met
//         handleAlert(true, "success", "Good job, you have set a strong password");
//       } else if (passedConditions >= 3) {
//         // At least 3 conditions met
//         handleAlert(true, "info", "You can make password stronger, meeting conditions");
//       }
    
//       // Continue with the submit process if necessary
    




//       const response = await axios.post(
//         `${process.env.REACT_APP_API}/route/employee/create`,
//         data
//       );
//       handleAlert(true, "success", response.data.message);
//       window.location.reload();
//     } catch (error) {
//       handleAlert(
//         true,
//         "error",
//         error.response.data.message || "Failed to sign up. Please try again."
//       );
//     }
//   };

//   const OtpRequest = useMutation(
//     (data) =>
//       axios.post(`${process.env.REACT_APP_API}/route/employee/sendOtp`, {
//         number: data,
//         countryCode,
//       }),
//     {
//       onSuccess: (data) => {
//         handleAlert(
//           true,
//           "success",
//           "OTP has been send successfully on your device"
//         );
//         setdisplay(true);
//         setTime(1);
//         setIsTimeVisible(true);
//       },

//       onError: (data) => {
//         if (data?.response?.status === 500) {
//           handleAlert(true, "warning", `${data?.response?.data?.message}`);
//         }
//         if (data?.response?.data?.success === false)
//           handleAlert(true, "error", data?.response?.data?.message);
//       },
//     }
//   );

//   const VerifyOtpRequest = useMutation(
//     (data) =>
//       axios.post(`${process.env.REACT_APP_API}/route/employee/verifyOtp`, data),
//     {
//       onSuccess: (data) => {
//         if (data?.data?.success === false) {
//           handleAlert(true, "error", data?.data?.message);
//         }

//         if (data?.data?.success === true) {
//           handleAlert(true, "success", `OTP verified successfully`);
//           setdisplay(false);
//           setIsVerified(true);
//           setIsTimeVisible(false);
//           setReadOnly(true);
//         }
//       },
//     }
//   );

//   const phone = getValues("phone");
//   const SendOtp = () => {
//     OtpRequest.mutate(phone);
//   };

//   const VerifyOtp = () => {
//     const data = { number: phone, otp };

//     if (!otp || !number) {
//       handleAlert(true, "warning", "Otp and number are required fields");
//       return false;
//     }
//     VerifyOtpRequest.mutate(data);
//   };

//   return (
//     <Grid container>
//       <Grid
//         className="h-screen"
//         item
//         xs={12}
//         sm={12}
//         md={12}
//         lg={6}
//         sx={{
//           overflow: "hidden",
//           p: "2%",
//           display: { lg: "block", md: "none", sm: "none", xs: "none" },
//         }}
//       >
//         <div className="flex h-[80vh] flex-col items-center justify-center">
//           <div className="h-1/2 w-[80%]">
//             <Carousel
//               swipeable={true}
//               draggable={false}
//               showDots={true}
//               responsive={responsive}
//               infinite={true}
//               autoPlay={true}
//               autoPlaySpeed={3000}
//               keyBoardControl={true}
//               customTransition="all .5"
//               transitionDuration={500}
//               containerClass="carousel-container"
//               dotListClass="custom-dot-list-style"
//               itemClass="carousel-item-padding-40-px"
//               arrows={false}
//             >
//               {Array.from({ length: 3 }).map((_, index) => (
//                 <img
//                   src={login1}
//                   alt="logo"
//                 //className="h-[300px] object-cover"
//                 />
//               ))}
//             </Carousel>
//           </div>
//         </div>
//       </Grid>

//       <Grid
//         item
//         xs={12}
//         sm={12}
//         md={12}
//         lg={6}
//         className=" overflow-scroll  h-screen   border  border-l-[.5px] bg-gray-50"
//         sx={{
//           display: "flex",
//           justifyContent: "center",

//           p: { xs: "5%", sm: "5%", md: "5%", lg: "5% 5% 5% 5%" },

//           overflowY: "auto",
//         }}
//       >
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           autoComplete="off"
//           className="w-full"
//         //className="flex   my-16 sm:!px-20 px-6 lg:w-[80%] w-full bg-white flex-col h-fit gap-1"
//         >
//           <img
//             src={aegislogo}
//             alt="logo"
//             className="h-[50px]  object-cover  mix-blend-multiply mb-2"
//           />
//           <div>
//             <Typography
//               component="p"
//               sx={{ fontSize: "32px", fontWeight: "600", color: "#1414fe" }}
//             >
//               Register Account
//             </Typography>
//           </div>
//           <div className="mt-6 grid md:grid-cols-2 grid-cols-1 gap-2">
//             {/* First Name */}
//             <AuthInputFiled
//               name="first_name"
//               icon={PermContactCalendar}
//               control={control}
//               type="text"
//               placeholder="First Name"
//               label="First Name *"
//               maxLimit={15}
//               errors={errors}
//               error={errors.first_name}
//             />
//             <AuthInputFiled
//               name="middle_name"
//               icon={Badge}
//               control={control}
//               type="text"
//               placeholder="Middle Name"
//               label="Middle Name"
//               errors={errors}
//               maxLimit={15}
//               error={errors.middle_name}
//             />
//           </div>
//           {/* Last Name */}
//           <AuthInputFiled
//             name="last_name"
//             icon={DriveFileRenameOutlineOutlined}
//             control={control}
//             type="text"
//             label="Last Name *"
//             placeholder="Last Name"
//             errors={errors}
//             maxLimit={15}
//             error={errors.last_name}
//           />
//           {/* Phone Number */}
//           <div className="flex sm:flex-row flex-col w-full sm:items-center items-start gap-0 sm:gap-2 sm:mb-0 mb-3">
//             <div className="w-full">
//               <AuthInputFiled
//                 name="phone"
//                 icon={Phone}
//                 readOnly={readOnly}
//                 control={control}
//                 label={"Phone Number *"}
//                 type="contact"
//                 errors={errors}
//                 error={errors.phone}
//                 placeholder={"1234567890"}
//               />
//             </div>

//             <>
//               {isVerified ? (
//                 <>
//                   <SvgIcon color="success">
//                     <CheckCircle />
//                   </SvgIcon>
//                   Verified
//                 </>
//               ) : (
//                 <div className="w-[20%]">
//                   <button
//                     type="button"
//                     disabled={
//                       number?.length !== 10 || isTimeVisible ? true : false
//                     }
//                     onClick={SendOtp}
//                     className={`w-max flex group justify-center gap-2 items-center rounded-md h-max px-4 py-1 text-md font-semibold text-white bg-[#1414fe]  ${(number?.length !== 10 || isTimeVisible) &&
//                       "bg-gray-400 text-gray-900"
//                       }`}
//                   >
//                     Get OTP
//                   </button>
//                 </div>
//               )}

//               {isTimeVisible && (
//                 <p>
//                   Resend OTP {Math.floor(time / 60)}:
//                   {(time % 60).toString().padStart(2, "0")}
//                 </p>
//               )}
//             </>
//           </div>
//           {display && (
//             <div className="w-max flex items-center gap-2">
//               <div className="space-y-1">
//                 <label className={`font-semibold text-gray-500 text-md`}>
//                   Verify OTP
//                 </label>
//                 <div className="flex  rounded-md px-2 border-gray-200 border-[.5px] bg-white py-[6px]">
//                   <Fingerprint className="text-gray-700" />
//                   <input
//                     type={"number"}
//                     onChange={(e) => setOTP(e.target.value)}
//                     placeholder={"1235"}
//                     className="border-none bg-white w-full outline-none px-2"
//                   />
//                 </div>

//                 <div className="h-4  !mb-1 "></div>
//               </div>

//               <button
//                 type="button"
//                 onClick={VerifyOtp}
//                 className="w-max flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-1 text-md font-semibold text-white bg-[#1414fe] hover:bg-[#1414fe] "
//               >
//                 Verify OTP
//               </button>
//             </div>
//           )}
//           <AuthInputFiled
//             name="email"
//             icon={Email}
//             control={control}
//             type="email"
//             placeholder="Email"
//             label="Email Address *"
//             errors={errors}
//             error={errors.email}
//           />

//           <div className="grid md:grid-cols-2 grid-cols-1  gap-2">
//             <AuthInputFiled
//               name="password"
//               visible={visiblePassword}
//               setVisible={setVisiblePassword}
//               icon={Lock}
//               control={control}
//               type="Password1"
//               placeholder="****"
//               label="Password *"
//               errors={errors}
//               error={errors.password}
//             />

//             <AuthInputFiled
//               name="confirmPassword"
//               icon={Lock}
//               visible={visibleCPassword}
//               setVisible={setVisibleCPassword}
//               control={control}
//               type="password"
//               placeholder="****"
//               label="Confirm Password *"
//               errors={errors}
//               error={errors.confirmPassword}
//             />
//           </div>

//           <div className="flex items-center ">
//             <div className="w-max">
//               <AuthInputFiled
//                 name="isChecked"
//                 control={control}
//                 type="checkbox"
//                 label={`I accept the`}
//                 errors={errors}
//                 error={errors.isChecked}
//               />
//             </div>
//           </div>

//           {/* Signup Button */}
//           <div className="flex  mb-2">
//             <button
//               type="submit"
//               className={`flex group justify-center text-lg w-full gap-2 items-center rounded-md h-[30px] px-4 py-4 font-semibold text-white bg-[#1414fe]`}
//             >
//               Register Account{" "}
//             </button>
//           </div>
//           {/* <button
//             type="submit"
//             className="flex group justify-center text-lg w-full gap-2 items-center rounded-md h-[30px] px-4 py-4 font-semibold text-white bg-[#1414fe]"
//           >
//             Register Account
//           </button> */}

//           <Typography
//             className="text-gray-500"
//             component="p"
//             sx={{ fontSize: "18px" }}
//           >
//             {" "}
//             Already have an account?{" "}
//             <Link
//               to={location.pathname === "/sign-up" ? "/sign-in" : "/sign-up"}
//               className="font-medium text-blue-500 hover:underline  transition-all "
//             >
//               Sign In
//             </Link>
//           </Typography>
//         </form>
//       </Grid>
//     </Grid>
  
//   );
// };

// export default SignIn;






import { zodResolver } from "@hookform/resolvers/zod";
import {
  Badge,
  CheckCircle,
  DriveFileRenameOutlineOutlined,
  Email,
  Fingerprint,
  Lock,
  PermContactCalendar,
  Phone,
} from "@mui/icons-material";
import { Grid, SvgIcon, Typography } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Carousel from "react-multi-carousel";
import { useMutation } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { TestContext } from "../../State/Function/Main";
import aegislogo from "../../assets/AegisFLogo.jpeg";
import login1 from "../../assets/login1.svg";
import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
import UserProfile from "../../hooks/UserData/useUser";
import useAuthentication from "./useAuthentication";

const SignIn = () => {
  // hooks
  const { handleAlert } = useContext(TestContext);
  const location = useLocation();
  const { countryCode } = useAuthentication();
  // state
  const [display, setdisplay] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [otp, setOTP] = useState("");
  const [time, setTime] = useState(1);
  const [isTimeVisible, setIsTimeVisible] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleCPassword, setVisibleCPassword] = useState(false);


 // State to track password strength
 const [passwordStrength, setPasswordStrength] = useState([false, false, false]);
 const [passwordMessage, setPasswordMessage] = useState('');

 // Regex for password validation
 const passwordRegex = /^(?=.*[a-z])(?=.*\d)/;  // Lowercase + Number (mandatory conditions)

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 1024 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 1024, min: 768 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 768, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  // to get current user
  const { getCurrentUser } = UserProfile();
  // const { countryCode } = useAuthentication();
  const user = getCurrentUser();

  // navigate
  const navigate = useNavigate("");

  useEffect(() => {
    if (user?._id) {
      navigate(-1);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let interval;
    if (time > 0) {
      interval = setInterval(() => {
        setTime((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setIsTimeVisible(false);
    }

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);

    // eslint-disable-next-line
  }, [time, isTimeVisible]);

  // const passwordRegex =
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;






  // define the validation using zod
  const SignUpSchema = z
    .object({
      first_name: z
        .string()
        .min(2, { message: "Minimum 2 character " })
        .max(15)
        .regex(/^[a-zA-Z]+$/, { message: "only character allow" }),

      last_name: z
        .string()
        .min(2)
        .max(15)
        .regex(/^[a-zA-Z]+$/),
      phone: z
        .string()
        .min(10, { message: "Phone Number must be 10 digit" })
        .regex(/^[0-9]+$/),
      email: z.string().email(),
      password: z.string().min(8).max(16).refine((value) => passwordRegex.test(value), {
        message: "Password must contain one lowercase letter and one number",
      }),
       confirmPassword: z.string(),
      isChecked: z.boolean().refine((value) => value === true, {
        message: "Please accept the Terms and Conditions to sign up.",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password does not match",
      path: ["confirmPassword"],
    });

  // use useForm
  const {
    handleSubmit,
    control,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignUpSchema),
  });

   // Track password changes
   const password = watch("password");

  const number = watch("phone");
  // to define the onSubmit function


  const checkPasswordStrength = (password) => {
    const conditions = [
      password?.length >= 8 && password?.length <= 16,  // Length condition
      /[a-z]/.test(password),  // Lowercase condition
      /\d/.test(password),  // Number condition
      /[!@#$%^&*(),.?":{}|<>]/.test(password),  // Special character condition (optional)
    ];

    const fulfilledConditions = conditions.filter(Boolean).length;
    setPasswordStrength([fulfilledConditions >= 1, fulfilledConditions >= 2, fulfilledConditions >= 4]);
    
    if (fulfilledConditions === 4) {
      setPasswordMessage("Good job, you have set a strong password");
    } else if (fulfilledConditions === 3) {
      setPasswordMessage("Your password is decent, but can be improved.");
    } else if (fulfilledConditions === 2) {
      setPasswordMessage("Password is weak, try adding more criteria.");
    } else {
      setPasswordMessage("Password is very weak, please meet the required conditions.");
    }
  };

  // Listen to password changes to update the strength
  React.useEffect(() => {
    checkPasswordStrength(password);
  }, [password]);


  const onSubmit = async (data) => {
    try {
      if (!isVerified) {
        handleAlert(true, "warning", "Please verify your phone number");
        return false;
      }


      const password = data.password;
      const conditions = [
        password.length >= 8 && password.length <= 16,
        /[a-z]/.test(password),
        /\d/.test(password),
        /[!@#$%^&*(),.?":{}|<>]/.test(password),
      ];
      const passedConditions = conditions.filter(Boolean).length;
    
      if (passedConditions === 4) {
        
      } else if (passedConditions >= 3) {
      }
    
      // Continue with the submit process if necessary
    




      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/employee/create`,
        data
      );
      handleAlert(true, "success", response.data.message);
      window.location.reload();
    } catch (error) {
      handleAlert(
        true,
        "error",
        error.response.data.message || "Failed to sign up. Please try again."
      );
    }
  };

  const OtpRequest = useMutation(
    (data) =>
      axios.post(`${process.env.REACT_APP_API}/route/employee/sendOtp`, {
        number: data,
        countryCode,
      }),
    {
      onSuccess: (data) => {
        handleAlert(
          true,
          "success",
          "OTP has been send successfully on your device"
        );
        setdisplay(true);
        setTime(1);
        setIsTimeVisible(true);
      },

      onError: (data) => {
        if (data?.response?.status === 500) {
          handleAlert(true, "warning", `${data?.response?.data?.message}`);
        }
        if (data?.response?.data?.success === false)
          handleAlert(true, "error", data?.response?.data?.message);
      },
    }
  );

  const VerifyOtpRequest = useMutation(
    (data) =>
      axios.post(`${process.env.REACT_APP_API}/route/employee/verifyOtp`, data),
    {
      onSuccess: (data) => {
        if (data?.data?.success === false) {
          handleAlert(true, "error", data?.data?.message);
        }

        if (data?.data?.success === true) {
          handleAlert(true, "success", `OTP verified successfully`);
          setdisplay(false);
          setIsVerified(true);
          setIsTimeVisible(false);
          setReadOnly(true);
        }
      },
    }
  );

  const phone = getValues("phone");
  const SendOtp = () => {
    OtpRequest.mutate(phone);
  };

  const VerifyOtp = () => {
    const data = { number: phone, otp };

    if (!otp || !number) {
      handleAlert(true, "warning", "Otp and number are required fields");
      return false;
    }
    VerifyOtpRequest.mutate(data);
  };

  return (
    <Grid container>
      <Grid
        className="h-screen"
        item
        xs={12}
        sm={12}
        md={12}
        lg={6}
        sx={{
          overflow: "hidden",
          p: "2%",
          display: { lg: "block", md: "none", sm: "none", xs: "none" },
        }}
      >
        <div className="flex h-[80vh] flex-col items-center justify-center">
          <div className="h-1/2 w-[80%]">
            <Carousel
              swipeable={true}
              draggable={false}
              showDots={true}
              responsive={responsive}
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={3000}
              keyBoardControl={true}
              customTransition="all .5"
              transitionDuration={500}
              containerClass="carousel-container"
              dotListClass="custom-dot-list-style"
              itemClass="carousel-item-padding-40-px"
              arrows={false}
            >
              {Array.from({ length: 3 }).map((_, index) => (
                <img
                  src={login1}
                  alt="logo"
                //className="h-[300px] object-cover"
                />
              ))}
            </Carousel>
          </div>
        </div>
      </Grid>

      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={6}
        className=" overflow-scroll  h-screen   border  border-l-[.5px] bg-gray-50"
        sx={{
          display: "flex",
          justifyContent: "center",

          p: { xs: "5%", sm: "5%", md: "5%", lg: "5% 5% 5% 5%" },

          overflowY: "auto",
        }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          className="w-full"
        //className="flex   my-16 sm:!px-20 px-6 lg:w-[80%] w-full bg-white flex-col h-fit gap-1"
        >
          <img
            src={aegislogo}
            alt="logo"
            className="h-[50px]  object-cover  mix-blend-multiply mb-2"
          />
          <div>
            <Typography
              component="p"
              sx={{ fontSize: "32px", fontWeight: "600", color: "#1414fe" }}
            >
              Register Account
            </Typography>
          </div>
          <div className="mt-6 grid md:grid-cols-2 grid-cols-1 gap-2">
            {/* First Name */}
            <AuthInputFiled
              name="first_name"
              icon={PermContactCalendar}
              control={control}
              type="text"
              placeholder="First Name"
              label="First Name *"
              maxLimit={15}
              errors={errors}
              error={errors.first_name}
            />
            <AuthInputFiled
              name="middle_name"
              icon={Badge}
              control={control}
              type="text"
              placeholder="Middle Name"
              label="Middle Name"
              errors={errors}
              maxLimit={15}
              error={errors.middle_name}
            />
          </div>
          {/* Last Name */}
          <AuthInputFiled
            name="last_name"
            icon={DriveFileRenameOutlineOutlined}
            control={control}
            type="text"
            label="Last Name *"
            placeholder="Last Name"
            errors={errors}
            maxLimit={15}
            error={errors.last_name}
          />
          {/* Phone Number */}
          <div className="flex sm:flex-row flex-col w-full sm:items-center items-start gap-0 sm:gap-2 sm:mb-0 mb-3">
            <div className="w-full">
              <AuthInputFiled
                name="phone"
                icon={Phone}
                readOnly={readOnly}
                control={control}
                label={"Phone Number *"}
                type="contact"
                errors={errors}
                error={errors.phone}
                placeholder={"1234567890"}
              />
            </div>

            <>
              {isVerified ? (
                <>
                  <SvgIcon color="success">
                    <CheckCircle />
                  </SvgIcon>
                  Verified
                </>
              ) : (
                <div className="w-[20%]">
                  <button
                    type="button"
                    disabled={
                      number?.length !== 10 || isTimeVisible ? true : false
                    }
                    onClick={SendOtp}
                    className={`w-max flex group justify-center gap-2 items-center rounded-md h-max px-4 py-1 text-md font-semibold text-white bg-[#1414fe]  ${(number?.length !== 10 || isTimeVisible) &&
                      "bg-gray-400 text-gray-900"
                      }`}
                  >
                    Get OTP
                  </button>
                </div>
              )}

              {isTimeVisible && (
                <p>
                  Resend OTP {Math.floor(time / 60)}:
                  {(time % 60).toString().padStart(2, "0")}
                </p>
              )}
            </>
          </div>
          {display && (
            <div className="w-max flex items-center gap-2">
              <div className="space-y-1">
                <label className={`font-semibold text-gray-500 text-md`}>
                  Verify OTP
                </label>
                <div className="flex  rounded-md px-2 border-gray-200 border-[.5px] bg-white py-[6px]">
                  <Fingerprint className="text-gray-700" />
                  <input
                    type={"number"}
                    onChange={(e) => setOTP(e.target.value)}
                    placeholder={"1235"}
                    className="border-none bg-white w-full outline-none px-2"
                  />
                </div>

                <div className="h-4  !mb-1 "></div>
              </div>

              <button
                type="button"
                onClick={VerifyOtp}
                className="w-max flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-1 text-md font-semibold text-white bg-[#1414fe] hover:bg-[#1414fe] "
              >
                Verify OTP
              </button>
            </div>
          )}
          <AuthInputFiled
            name="email"
            icon={Email}
            control={control}
            type="email"
            placeholder="Email"
            label="Email Address *"
            errors={errors}
            error={errors.email}
          />

          <div className="grid md:grid-cols-2 grid-cols-1  gap-2">
            <AuthInputFiled
              name="password"
              visible={visiblePassword}
              setVisible={setVisiblePassword}
              icon={Lock}
              control={control}
              type="Password1"
              placeholder="****"
              label="Password *"
              errors={errors}
              error={errors.password}
            />

              {/* Password Strength Meter */}
     
            <AuthInputFiled
              name="confirmPassword"
              icon={Lock}
              visible={visibleCPassword}
              setVisible={setVisibleCPassword}
              control={control}
              type="password"
              placeholder="****"
              label="Confirm Password *"
              errors={errors}
              error={errors.confirmPassword}
            />
          </div>

         { password && ( <div className="grid md:grid-cols-2 grid-cols-1  gap-2 ">
        <div className="flex flex-col space-y-1">
          {/* Strips to show password strength */}
          <div className="flex space-x-1">
            <div
              className={`h-1 w-1/3 ${passwordStrength[0] ? 'bg-red-500' : 'bg-gray-300'}`}
            />
            <div
              className={`h-1 w-1/3 ${passwordStrength[1] ? 'bg-yellow-500' : 'bg-gray-300'}`}
            />
            <div
              className={`h-1 w-1/3 ${passwordStrength[2] ? 'bg-green-500' : 'bg-gray-300'}`}
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">{passwordMessage}</p>
        </div>
      </div>)}


          <div className="flex items-center ">
            <div className="w-max">
              <AuthInputFiled
                name="isChecked"
                control={control}
                type="checkbox"
                label={`I accept the`}
                errors={errors}
                error={errors.isChecked}
              />
            </div>
          </div>

          {/* Signup Button */}
          <div className="flex  mb-2">
            <button
              type="submit"
              className={`flex group justify-center text-lg w-full gap-2 items-center rounded-md h-[30px] px-4 py-4 font-semibold text-white bg-[#1414fe]`}
            >
              Register Account{" "}
            </button>
          </div>
          {/* <button
            type="submit"
            className="flex group justify-center text-lg w-full gap-2 items-center rounded-md h-[30px] px-4 py-4 font-semibold text-white bg-[#1414fe]"
          >
            Register Account
          </button> */}

          <Typography
            className="text-gray-500"
            component="p"
            sx={{ fontSize: "18px" }}
          >
            {" "}
            Already have an account?{" "}
            <Link
              to={location.pathname === "/sign-up" ? "/sign-in" : "/sign-up"}
              className="font-medium text-blue-500 hover:underline  transition-all "
            >
              Sign In
            </Link>
          </Typography>
        </form>
      </Grid>
    </Grid>
  
  );
};

export default SignIn;





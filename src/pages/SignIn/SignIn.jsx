import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import GoogleButton from "react-google-button";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import UserProfile from "../../hooks/UserData/useUser";
import useSignup from "../../hooks/useLoginForm";

const SignIn = () => { 
  console.log(process.env.REACT_APP_API);
  // state
  const { setEmail, setPassword, email, password } = useSignup();
  const { handleAlert } = useContext(TestContext);
  // navigate
  const redirect = useNavigate();

  // to get current user information and user role
  const { getCurrentUser, useGetCurrentRole } = UserProfile();
  const user = getCurrentUser();
  const role = useGetCurrentRole();
  console.log(user, role);

  useEffect(() => {
    if (user?._id) {
      if (role === "Super-Admin" || role === "Delegate-Super-Admin")
        return redirect("/");
      else if (role === "HR")
        return redirect(
          `/organisation/${user?.organizationId}/dashboard/HR-dashboard`
        );
      else if (
        role === "Delegate-Department-Head" ||
        role === "Department-Head"
      )
        return redirect(
          `/organisation/${user?.organizationId}/dashboard/DH-dashboard`
        );
      else if (role === "Accountant")
        return redirect(
          `/organisation/${user?.organizationId}/dashboard/employee-dashboard`
        );
      else if (role === "Manager")
        return redirect(
          `/organisation/${user?._id}/dashboard/manager-dashboard`
        );
      else if (role === "Employee" || role ==="Teacher")
        return redirect(
          `/organisation/${user?.organizationId}/dashboard/employee-dashboard`
        );
    }
    // eslint-disable-next-line
  }, [role, window.location.pathname]);

  // to define the funciton for handle role
  const handleRole = useMutation(
    (data) => {
      console.log("Data==", data);
      const res = axios.post(
        `${process.env.REACT_APP_API}/route/employee/changerole`,
        data
      );
      return res;
    },
    {
      onSuccess: (response) => {
        // Cookies.set("role", response?.data?.roleToken);

        Cookies.set("role", response.data.roleToken, {
          expires: 4 / 24,
        });
        window.location.reload();
      },
    }
  );

  // to define the fuction for logged in
  const handleLogin = useMutation(
    async (data) => {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/route/employee/login`,
        data
      );

      return res;
    },

    {
      onSuccess: async (response) => {
        console.log("response show", response);
        Cookies.set("aegis", response.data.token, { expires: 4 / 24 });
        handleAlert(
          true,
          "success",
          `Welcome ${response.data.user.first_name} you are logged in successfully`
        );

        console.log("response====",response.data.user)

          
        // SelfOnboarding
        if (response?.data?.user?.isSelfOnboard) {
          console.log("selfOnboarded", response.data);
          console.log("Organisation ID:", response.data.user?.organizationId);
          handleRole.mutate({
            role: "Employee",
            email: response.data.user?.email,
          });
          return redirect(
            `/organisation/${response.data.user?.organizationId}/Selfemployee-onboarding/${response.data.user?._id}`
          );
          }else if (response.data.user?.profile?.includes("Super-Admin")) {
          handleRole.mutate({
            role: "Super-Admin",
            email: response.data.user?.email,
          });
          return redirect("/");
        } else if (
          response.data.user?.profile?.includes("Delegate-Super-Admin")
        ) {
          handleRole.mutate({
            role: "Delegate-Super-Admin",
            email: response.data.user?.email,
          });
          return redirect("/");
        } else if (response.data.user?.profile?.includes("HR")) {
          handleRole.mutate({ role: "HR", email: response.data.user?.email });
          return redirect(
            `/organisation/${response?.data?.user?.organizationId}/dashboard/HR-dashboard`
          );
        } else if (response?.data?.user?.profile?.includes("Manager")) {
          handleRole.mutate({
            role: "Manager",
            email: response.data.user?.email,
          });
          return redirect(
            `/organisation/${response?.data?.user?.organizationId}/dashboard/manager-dashboard`
          );
        } else if (response.data.user?.profile?.includes("Department-Head")) {
          handleRole.mutate({
            role: "Department-Head",
            email: response?.data.user?.email,
          });
          return redirect(
            `/organisation/${response?.data.user?.organizationId}/dashboard/DH-dashboard`
          );
        } else if (
          response?.data.user?.profile?.includes("Delegate-Department-Head")
        ) {
          handleRole.mutate({
            role: "Delegate-Department-Head",
            email: response?.data?.user?.email,
          });
          return redirect(
            `/organisation/${response?.data?.user?.organizationId}/dashboard/DH-dashboard`
          );
        } else if (response.data.user?.profile?.includes("Department-Admin")) {
          handleRole.mutate({
            role: "Department-Admin",
            email: response.data.user?.email,
          });
          return redirect(
            `/organisation/${response?.data?.user?.organizationId}/dashboard/employee-dashboard`
          );
        } else if (response.data.user?.profile?.includes("Accountant")) {
          handleRole.mutate({
            role: "Accountant",
            email: response.data.user?.email,
          });
          return redirect(
            `/organisation/${response?.data?.user?.organizationId}/dashboard/employee-dashboard`
          );
        } else if (
          response.data.user?.profile?.includes("Delegate-Accountant")
        ) {
          handleRole.mutate({
            role: "Delegate-Accountant",
            email: response.data.user?.email,
          });
          return redirect(
            `/organisation/${response?.data?.user?.organizationId}/dashboard/employee-dashboard`
          );
        } else if (response.data.user?.profile?.includes("Employee")) {
          handleRole.mutate({
            role: "Employee",
            email: response.data.user?.email,
          });
          return redirect(
            `/organisation/${response?.data?.user?.organizationId}/dashboard/employee-dashboard`
          );
        }
        // window.location.reload();
      },

      onError: (error) => {
        console.error(error);

        handleAlert(
          true,
          error?.response.status !== 401 ? "success" : "error",
          error?.response?.data?.message ||
            "Failed to sign in. Please try again."
        );
      },
    }
  );

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      handleAlert(true, "warning", "All fields are manadatory");
      return false;
    }
    // Check if email is in lowercase
    if (email !== email.toLowerCase()) {
      handleAlert(true, "warning", "Email must be in lowercase");
      return false;
    }
    const data = { email, password };
    handleLogin.mutate(data);
  };

  const [focusedInput, setFocusedInput] = React.useState(null);
  const [visible, setVisible] = useState(false);
  const handleFocus = (fieldName) => {
    setFocusedInput(fieldName);
  };

  // Create Axios instance
  const api = axios.create({
    baseURL: `${process.env.REACT_APP_API}/route`,
  });

  const navigate = useNavigate(); // Hook can be used in a functional component

  // Function to authenticate with Google and get user details
  const googleAuth = async (code) => {
    try {
      const response = await api.get(`/employee/google?code=${code}`);
      return response.data;
    } catch (err) {
      console.error("Error during Google authentication request", err);
      throw err;
    }
  };

  const handleGoogleResponse = async (authResult) => {
    try {
      if (authResult.code) {
        const result = await googleAuth(authResult.code);
        const { email, token, user } = result;

        localStorage.setItem(
          "user-info",
          JSON.stringify({ email, token, user })
        );
        Cookies.set("aegis", token, { expires: 4 / 24 });
        // const profile = user?.profile;
        // console.log("profile==", profile);
        // console.log("email==", result?.user?.email);
        // console.log("token==", token);

        handleAlert(
          true,
          "success",
          `Welcome ${user.first_name}, you are logged in successfully`
        );

        if (user.profile.includes("Super-Admin")) {
          handleRole.mutate({ role: "Super-Admin", email: result.user?.email });
          return navigate("/");
        } else if (user.profile.includes("Delegate-Super-Admin")) {
          handleRole.mutate({
            role: "Delegate-Super-Admin",
            email: result.user?.email,
          });
          return navigate("/");
        } else if (user.profile.includes("HR")) {
          handleRole.mutate({ role: "HR", email: result.user?.email });
          return navigate(
            `/organisation/${user.organizationId}/dashboard/HR-dashboard`
          );
        } else if (user.profile.includes("Manager")) {
          handleRole.mutate({ role: "Manager", email: result.user?.email });
          return navigate(
            `/organisation/${user.organizationId}/dashboard/manager-dashboard`
          );
        } else if (user.profile.includes("Department-Head")) {
          handleRole.mutate({
            role: "Department-Head",
            email: result.user?.email,
          });
          return navigate(
            `/organisation/${user.organizationId}/dashboard/DH-dashboard`
          );
        } else if (user.profile.includes("Delegate-Department-Head")) {
          handleRole.mutate({
            role: "Delegate-Department-Head",
            email: result.user?.email,
          });
          return navigate(
            `/organisation/${user.organizationId}/dashboard/DH-dashboard`
          );
        } else if (user.profile.includes("Department-Admin")) {
          handleRole.mutate({
            role: "Department-Admin",
            email: result.user?.email,
          });
          return navigate(
            `/organisation/${user.organizationId}/dashboard/employee-dashboard`
          );
        } else if (user.profile.includes("Accountant")) {
          handleRole.mutate({ role: "Accountant", email: result.user?.email });
          return navigate(
            `/organisation/${user.organizationId}/dashboard/employee-dashboard`
          );
        } else if (user.profile.includes("Delegate-Accountant")) {
          handleRole.mutate({
            role: "Delegate-Accountant",
            email: result.user?.email,
          });
          return navigate(
            `/organisation/${user.organizationId}/dashboard/employee-dashboard`
          );
        } else if (user.profile.includes("Employee")) {
          handleRole.mutate({ role: "Employee", email: result.user?.email });
          return navigate(
            `/organisation/${user.organizationId}/dashboard/employee-dashboard`
          );
        }

        window.location.reload();
      }
    } catch (err) {
      console.error("Error while processing authentication result", err);
      handleAlert(
        true,
        "error",
        "Failed to sign in. check user has intermidate plan or valid email address"
      );
    }
  };

  // Google login configuration
  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleResponse,
    onFailure: (error) => {
      console.error("Google login failed", error);
    },
    flow: "auth-code",
  });

  return (
    <>
      <section className="lg:min-h-screen  flex w-full">
        <div className="!w-[40%]  md:justify-start lg:flex hidden text-white flex-col items-center justify-center lg:h-screen relative">
          <div className="bg__gradient  absolute inset-0 "></div>
          <ul className="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
          <div className="space-y-2 mb-8 flex-col flex items-center justify-center"></div>
        </div>

        <article className="lg:w-[60%] h-screen  !bg-white w-full flex lg:justify-start justify-center  items-center lg:items-start flex-col ">
          <form
            onSubmit={onSubmit}
            autoComplete="off"
            className="flex  lg:px-20  sm:w-max w-[90%]  justify-center flex-col  lg:h-[80vh]"
          >
            <div className="flex flex-col space-x-4 lg:items-start items-center">
              <div className="flex flex-col gap-1  w-full items-center justify-center space-y-1">
                <img src="/logo.svg" className="h-[45px]" alt="logo" />
                <h1 className="font-[600] text-center w-full text-3xl">
                  Log in to AEGIS
                </h1>
              </div>
            </div>
            <div className="mt-6 sm:w-[400px] w-full space-y-2 ">
              <label
                htmlFor={email}
                className={" font-semibold text-gray-500 text-md"}
              >
                Email Address
              </label>
              <div
                className={`
                flex  rounded-md px-2  bg-white py-[6px]
                ${
                  focusedInput === "email"
                    ? "outline-blue-500 outline-3 !border-blue-500 border-[2px]"
                    : "border-gray-200 border-[.5px]"
                }`}
              >
                <Email className="text-gray-700" />
                <input
                  name="email"
                  autoComplete="off"
                  id="email"
                  placeholder="abc@gmail.com"
                  onFocus={() => {
                    handleFocus("email");
                  }}
                  onBlur={() => setFocusedInput(null)}
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value.toLowerCase())
                  }
                  type="email"
                  className={` 
                  border-none  bg-white w-full outline-none px-2`}
                />
              </div>

              <div className="space-y-1 !mt-5 w-full ">
                <label
                  htmlFor={password}
                  className={" font-semibold text-gray-500 text-md"}
                >
                  Password
                </label>

                <div
                  className={`
                flex  rounded-md px-2 sm:w-[400px] w-full  bg-white py-[6px]
                ${
                  focusedInput === "password"
                    ? "outline-blue-500 outline-3 !border-blue-500 border-[2px]"
                    : "border-gray-200 border-[.5px]"
                }`}
                >
                  <Lock className="text-gray-700" />
                  <input
                    name="password"
                    autoComplete="off"
                    id="password"
                    onFocus={() => {
                      handleFocus("password");
                    }}
                    onBlur={() => setFocusedInput(null)}
                    type={visible ? "text" : "password"}
                    placeholder="*****"
                    label="Password"
                    onChange={(event) => setPassword(event.target.value)}
                    className={` 
                 
                    border-none bg-white w-full outline-none px-2`}
                  />

                  <button
                    type="button"
                    onClick={() => setVisible(visible === true ? false : true)}
                  >
                    {visible ? (
                      <VisibilityOff className="text-gray-700" />
                    ) : (
                      <Visibility className="text-gray-700" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-5 mt-4">
              <button
                type="submit"
                disabled={handleLogin.isLoading}
                className={`${
                  handleLogin.isLoading && "!bg-gray-200 shadow-lg"
                } flex group justify-center w-full gap-2 items-center rounded-md h-[30px] px-4 py-3 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500`}
              >
                {handleLogin.isLoading ? (
                  <>
                    <CircularProgress CircularProgress size={20} /> Log in
                  </>
                ) : (
                  "Log in"
                )}
              </button>
            </div>
            <div className="flex items-center justify-center  gap-2 my-2">
              <Link
                to="/forgot-password"
                className="font-medium hover:font-bold transition-all "
              >
                Forgot password?
              </Link>

              <Link
                to={
                  window.location.pathname === "/sign-up"
                    ? "/sign-in"
                    : "/sign-up"
                }
                className="font-medium text-blue-500 hover:underline transition-all "
              >
                Sign up for AEGIS
              </Link>
            </div>

            <GoogleButton
              // className="items-center rounded-md h-[30px] w-[400px] px-4 py-3 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
              type="dark" // can be light or dark
              onClick={googleLogin}
              style={{
                width: "400px",
                height: "40px",
                paddingTop: "-10px",
                paddingBottom: "-10px",
              }}
              // style={{ width: '400px', height:"50px",borderRadius:"5px"  }}
            />
          </form>
        </article>
      </section>
    </>
  );
};

export default SignIn;

// import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
// import { CircularProgress } from "@mui/material";
// import axios from "axios";
// import Cookies from "js-cookie";
// import React, { useContext, useEffect, useState } from "react";
// import { useMutation } from "react-query";
// import { Link, useNavigate } from "react-router-dom";
// import { TestContext } from "../../State/Function/Main";
// import UserProfile from "../../hooks/UserData/useUser";
// import useSignup from "../../hooks/useLoginForm";
// import AOS from 'aos';
// import 'aos/dist/aos.css';
// import { motion } from "framer-motion";

// const SignIn = () => {
//   // Initialize AOS
//   useEffect(() => {
//     AOS.init({ duration: 1000 });
//   }, []);

//   // state
//   const { setEmail, setPassword, email, password } = useSignup();
//   const { handleAlert } = useContext(TestContext);
//   const redirect = useNavigate();

//   const { getCurrentUser, useGetCurrentRole } = UserProfile();
//   const user = getCurrentUser();
//   const role = useGetCurrentRole();

//   useEffect(() => {
//     if (user?._id) {
//       if (role === "Super-Admin" || role === "Delegate-Super-Admin")
//         return redirect("/");
//       else if (role === "HR")
//         return redirect(`/organisation/${user?.organizationId}/dashboard/HR-dashboard`);
//       else if (role === "Delegate-Department-Head" || role === "Department-Head")
//         return redirect(`/organisation/${user?.organizationId}/dashboard/DH-dashboard`);
//       else if (role === "Accountant")
//         return redirect(`/organisation/${user?.organizationId}/dashboard/employee-dashboard`);
//       else if (role === "Manager")
//         return redirect(`/organisation/${user?._id}/dashboard/manager-dashboard`);
//       else if (role === "Employee")
//         return redirect(`/organisation/${user?.organizationId}/dashboard/employee-dashboard`);
//     }
//     // eslint-disable-next-line
//   }, [role, window.location.pathname]);

//   const handleRole = useMutation(
//     (data) => {
//       const res = axios.post(`${process.env.REACT_APP_API}/route/employee/changerole`, data);
//       return res;
//     },
//     {
//       onSuccess: (response) => {
//         Cookies.set("role", response.data.roleToken, { expires: 4 / 24 });
//         window.location.reload();
//       },
//     }
//   );

//   const handleLogin = useMutation(
//     async (data) => {
//       const res = await axios.post(`${process.env.REACT_APP_API}/route/employee/login`, data);
//       return res;
//     },
//     {
//       onSuccess: async (response) => {
//         Cookies.set("aegis", response.data.token, { expires: 4 / 24 });
//         handleAlert(true, "success", `Welcome ${response.data.user.first_name}, you are logged in successfully`);

//         const userRole = response.data.user?.profile[0];
//         const routeMap = {
//           "Super-Admin": "/",
//           "Delegate-Super-Admin": "/",
//           "HR": `/organisation/${response.data.user.organizationId}/dashboard/HR-dashboard`,
//           "Manager": `/organisation/${response.data.user.organizationId}/dashboard/manager-dashboard`,
//           "Department-Head": `/organisation/${response.data.user.organizationId}/dashboard/DH-dashboard`,
//           "Delegate-Department-Head": `/organisation/${response.data.user.organizationId}/dashboard/DH-dashboard`,
//           "Department-Admin": `/organisation/${response.data.user.organizationId}/dashboard/employee-dashboard`,
//           "Accountant": `/organisation/${response.data.user.organizationId}/dashboard/employee-dashboard`,
//           "Delegate-Accountant": `/organisation/${response.data.user.organizationId}/dashboard/employee-dashboard`,
//           "Employee": `/organisation/${response.data.user.organizationId}/dashboard/employee-dashboard`
//         };

//         handleRole.mutate({ role: userRole, email: response.data.user.email });
//         return redirect(routeMap[userRole] || "/");
//       },
//       onError: (error) => {
//         handleAlert(true, error?.response.status !== 401 ? "success" : "error", error?.response?.data?.message || "Failed to sign in. Please try again.");
//       },
//     }
//   );

//   const onSubmit = async (event) => {
//     event.preventDefault();
//     if (!email || !password) {
//       handleAlert(true, "warning", "All fields are mandatory");
//       return false;
//     }
//     const data = { email, password };
//     handleLogin.mutate(data);
//   };

//   const [focusedInput, setFocusedInput] = useState(null);
//   const [visible, setVisible] = useState(false);
//   const handleFocus = (fieldName) => setFocusedInput(fieldName);

//   return (
//     <motion.section
//       className="lg:min-h-screen flex w-full"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//     >
//       <motion.div
//         className="!w-[40%] md:justify-start lg:flex hidden text-white flex-col items-center justify-center lg:h-screen relative"
//         data-aos="fade-left"
//         initial={{ x: -200, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         transition={{ type: "spring", stiffness: 50 }}
//       >
//         <div className="bg__gradient absolute inset-0"></div>
//         <ul className="circles">
//           <li></li>
//           <li></li>
//           <li></li>
//           <li></li>
//           <li></li>
//           <li></li>
//           <li></li>
//           <li></li>
//           <li></li>
//           <li></li>
//         </ul>
//       </motion.div>

//       <motion.article
//         className="lg:w-[60%] h-screen !bg-white w-full flex lg:justify-start justify-center items-center lg:items-start flex-col"
//         data-aos="fade-right"
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <motion.form
//           onSubmit={onSubmit}
//           autoComplete="off"
//           className="flex lg:px-20 sm:w-max w-[90%] justify-center flex-col lg:h-[80vh]"
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <motion.div
//             className="flex flex-col space-x-4 lg:items-start items-center"
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.5 }}
//           >
//             <div className="flex flex-col gap-1 w-full items-center justify-center space-y-1">
//               <img src="/logo.svg" className="h-[45px]" alt="logo" />
//               <h1 className="font-[600] text-center w-full text-3xl">Log in to AEGIS</h1>
//             </div>
//           </motion.div>

//           <div className="mt-6 sm:w-[400px] w-full space-y-2">
//             <motion.label
//               htmlFor="email"
//               className="font-semibold text-gray-500 text-md"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.5 }}
//             >
//               Email Address
//             </motion.label>
//             <motion.div
//               className={`flex rounded-md px-2 bg-white py-[6px] ${focusedInput === "email" ? "outline-blue-500 outline-3 !border-blue-500 border-[2px]" : "border-gray-200 border-[.5px]"}`}
//               initial={{ x: -10, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ duration: 0.5 }}
//             >
//               <Email className="text-gray-700" />
//               <input
//                 name="email"
//                 autoComplete="off"
//                 id="email"
//                 placeholder="abc@gmail.com"
//                 onFocus={() => handleFocus("email")}
//                 onBlur={() => setFocusedInput(null)}
//                 value={email}
//                 onChange={(event) => setEmail(event.target.value)}
//                 type="email"
//                 className="border-none bg-white w-full outline-none px-2"
//               />
//             </motion.div>

//             <motion.div
//               className="space-y-1 !mt-5 w-full"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.5 }}
//             >
//               <motion.label
//                 htmlFor="password"
//                 className="font-semibold text-gray-500 text-md"
//               >
//                 Password
//               </motion.label>
//               <motion.div
//                 className={`flex rounded-md px-2 sm:w-[400px] w-full bg-white py-[6px] ${focusedInput === "password" ? "outline-blue-500 outline-3 !border-blue-500 border-[2px]" : "border-gray-200 border-[.5px]"}`}
//                 initial={{ x: -10, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <Lock className="text-gray-700" />
//                 <input
//                   name="password"
//                   autoComplete="off"
//                   id="password"
//                   onFocus={() => handleFocus("password")}
//                   onBlur={() => setFocusedInput(null)}
//                   type={visible ? "text" : "password"}
//                   placeholder="*****"
//                   label="Password"
//                   onChange={(event) => setPassword(event.target.value)}
//                   className="border-none bg-white w-full outline-none px-2"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setVisible(!visible)}
//                   className="ml-2"
//                 >
//                   {visible ? <VisibilityOff className="text-gray-700" /> : <Visibility className="text-gray-700" />}
//                 </button>
//               </motion.div>
//             </motion.div>
//           </div>

//           <motion.div
//             className="flex gap-5 mt-4"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             <button
//               type="submit"
//               disabled={handleLogin.isLoading}
//               className={`${handleLogin.isLoading && "!bg-gray-200 shadow-lg"} flex group justify-center w-full gap-2 items-center rounded-md h-[30px] px-4 py-3 text-md font-semibold text-white bg-blue-500 hover:bg-blue-600 focus-visible:outline-blue-500 transition-all`}
//             >
//               {handleLogin.isLoading ? <><CircularProgress size={20} /> Log in</> : "Log in"}
//             </button>
//           </motion.div>

//           <motion.div
//             className="flex items-center justify-center gap-2 my-2"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             <Link to="/forgot-password" className="font-medium hover:font-bold transition-all">Forgot password?</Link>
//             <Link
//               to={window.location.pathname === "/sign-up" ? "/sign-in" : "/sign-up"}
//               className="font-medium text-blue-500 hover:underline transition-all"
//             >
//               Sign up for AEGIS
//             </Link>
//           </motion.div>
//         </motion.form>
//       </motion.article>
//     </motion.section>
//   );
// };

// export default SignIn;

// import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
// import { CircularProgress } from "@mui/material";
// import axios from "axios";
// import Cookies from "js-cookie";
// import React, { useContext, useEffect, useState } from "react";
// import { useMutation } from "react-query";
// import { Link, useNavigate } from "react-router-dom";
// import { TestContext } from "../../State/Function/Main";
// import UserProfile from "../../hooks/UserData/useUser";
// import useSignup from "../../hooks/useLoginForm";
// import AOS from 'aos';
// import 'aos/dist/aos.css';
// import { motion } from "framer-motion";

// const SignIn = () => {
//   // Initialize AOS
//   useEffect(() => {
//     AOS.init({ duration: 1000 });
//   }, []);

//   // state
//   const { setEmail, setPassword, email, password } = useSignup();
//   const { handleAlert } = useContext(TestContext);
//   const redirect = useNavigate();

//   const { getCurrentUser, useGetCurrentRole } = UserProfile();
//   const user = getCurrentUser();
//   const role = useGetCurrentRole();

//   useEffect(() => {
//     if (user?._id) {
//       if (role === "Super-Admin" || role === "Delegate-Super-Admin")
//         return redirect("/");
//       else if (role === "HR")
//         return redirect(`/organisation/${user?.organizationId}/dashboard/HR-dashboard`);
//       else if (role === "Delegate-Department-Head" || role === "Department-Head")
//         return redirect(`/organisation/${user?.organizationId}/dashboard/DH-dashboard`);
//       else if (role === "Accountant")
//         return redirect(`/organisation/${user?.organizationId}/dashboard/employee-dashboard`);
//       else if (role === "Manager")
//         return redirect(`/organisation/${user?._id}/dashboard/manager-dashboard`);
//       else if (role === "Employee")
//         return redirect(`/organisation/${user?.organizationId}/dashboard/employee-dashboard`);
//     }
//     // eslint-disable-next-line
//   }, [role, window.location.pathname]);

//   const handleRole = useMutation(
//     (data) => {
//       const res = axios.post(`${process.env.REACT_APP_API}/route/employee/changerole`, data);
//       return res;
//     },
//     {
//       onSuccess: (response) => {
//         Cookies.set("role", response.data.roleToken, { expires: 4 / 24 });
//         window.location.reload();
//       },
//     }
//   );

//   const handleLogin = useMutation(
//     async (data) => {
//       const res = await axios.post(`${process.env.REACT_APP_API}/route/employee/login`, data);
//       return res;
//     },
//     {
//       onSuccess: async (response) => {
//         Cookies.set("aegis", response.data.token, { expires: 4 / 24 });
//         handleAlert(true, "success", `Welcome ${response.data.user.first_name}, you are logged in successfully`);

//         const userRole = response.data.user?.profile[0];
//         const routeMap = {
//           "Super-Admin": "/",
//           "Delegate-Super-Admin": "/",
//           "HR": `/organisation/${response.data.user.organizationId}/dashboard/HR-dashboard`,
//           "Manager": `/organisation/${response.data.user.organizationId}/dashboard/manager-dashboard`,
//           "Department-Head": `/organisation/${response.data.user.organizationId}/dashboard/DH-dashboard`,
//           "Delegate-Department-Head": `/organisation/${response.data.user.organizationId}/dashboard/DH-dashboard`,
//           "Department-Admin": `/organisation/${response.data.user.organizationId}/dashboard/employee-dashboard`,
//           "Accountant": `/organisation/${response.data.user.organizationId}/dashboard/employee-dashboard`,
//           "Delegate-Accountant": `/organisation/${response.data.user.organizationId}/dashboard/employee-dashboard`,
//           "Employee": `/organisation/${response.data.user.organizationId}/dashboard/employee-dashboard`
//         };

//         handleRole.mutate({ role: userRole, email: response.data.user.email });
//         return redirect(routeMap[userRole] || "/");
//       },
//       onError: (error) => {
//         handleAlert(true, error?.response.status !== 401 ? "success" : "error", error?.response?.data?.message || "Failed to sign in. Please try again.");
//       },
//     }
//   );

//   const onSubmit = async (event) => {
//     event.preventDefault();
//     if (!email || !password) {
//       handleAlert(true, "warning", "All fields are mandatory");
//       return false;
//     }
//     const data = { email, password };
//     handleLogin.mutate(data);
//   };

//   const [focusedInput, setFocusedInput] = useState(null);
//   const [visible, setVisible] = useState(false);
//   const handleFocus = (fieldName) => setFocusedInput(fieldName);

//   return (
//     <motion.section
//       className="relative flex items-center justify-center w-full h-screen overflow-hidden"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//     >
//       <motion.div
//         className="absolute inset-0"
//         style={{
//           background: `url('/path-to-your-background-video.mp4') no-repeat center center/cover`,
//           filter: "brightness(50%)"
//         }}
//         data-aos="fade"
//       >
//         {/* Add a background video or image here */}
//       </motion.div>

//       <motion.article
//         className="relative flex flex-col justify-center items-center w-full max-w-md p-6 bg-white bg-opacity-80 rounded-lg shadow-lg"
//         data-aos="fade"
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <motion.form
//           onSubmit={onSubmit}
//           autoComplete="off"
//           className="flex flex-col w-full"
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <motion.div
//             className="flex flex-col items-center mb-6"
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.5 }}
//           >
//             <img src="/logo.svg" className="h-[45px]" alt="logo" />
//             <h1 className="text-3xl font-semibold text-center">Log in to AEGIS</h1>
//           </motion.div>

//           <div className="space-y-4 w-full">
//             <motion.label
//               htmlFor="email"
//               className="font-semibold text-gray-700 text-md"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.5 }}
//             >
//               Email Address
//             </motion.label>
//             <motion.div
//               className={`flex items-center rounded-md px-2 py-2 bg-white ${focusedInput === "email" ? "border-blue-500 border-2" : "border-gray-200 border"}`}
//               initial={{ x: -10, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ duration: 0.5 }}
//             >
//               <Email className="text-gray-700" />
//               <input
//                 name="email"
//                 autoComplete="off"
//                 id="email"
//                 placeholder="abc@gmail.com"
//                 onFocus={() => handleFocus("email")}
//                 onBlur={() => setFocusedInput(null)}
//                 value={email}
//                 onChange={(event) => setEmail(event.target.value)}
//                 type="email"
//                 className="border-none bg-white w-full outline-none px-2"
//               />
//             </motion.div>

//             <motion.div className="space-y-1">
//               <motion.label
//                 htmlFor="password"
//                 className="font-semibold text-gray-700 text-md"
//               >
//                 Password
//               </motion.label>
//               <motion.div
//                 className={`flex items-center rounded-md px-2 py-2 bg-white ${focusedInput === "password" ? "border-blue-500 border-2" : "border-gray-200 border"}`}
//                 initial={{ x: -10, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <Lock className="text-gray-700" />
//                 <input
//                   name="password"
//                   autoComplete="off"
//                   id="password"
//                   onFocus={() => handleFocus("password")}
//                   onBlur={() => setFocusedInput(null)}
//                   type={visible ? "text" : "password"}
//                   placeholder="*****"
//                   label="Password"
//                   onChange={(event) => setPassword(event.target.value)}
//                   className="border-none bg-white w-full outline-none px-2"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setVisible(!visible)}
//                   className="ml-2"
//                 >
//                   {visible ? <VisibilityOff className="text-gray-700" /> : <Visibility className="text-gray-700" />}
//                 </button>
//               </motion.div>
//             </motion.div>
//           </div>

//           <motion.div
//             className="flex gap-5 mt-4"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5 }}
//           >
//             <button
//               type="submit"
//               className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
//               disabled={handleLogin.isLoading}
//             >
//               {handleLogin.isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
//             </button>
//           </motion.div>
//         </motion.form>

//         <motion.div
//           className="mt-4"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <Link to="/reset-password" className="text-blue-500 hover:underline">
//             Forgot password?
//           </Link>
//         </motion.div>
//       </motion.article>
//     </motion.section>
//   );
// };

// export default SignIn;

import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { CircularProgress, Grid, Typography } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Cookies from "js-cookie";
import { default as React, useContext, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import login1 from "../../assets/login1.svg"; // Adjust import according to your structure
import aegislogo from "../../assets/AegisFLogo.jpeg"; // Adjust import according to your structure
// import UserProfile from "../../hooks/UserData/useUser";
import useSignup from "../../hooks/useLoginForm";


const LoginPage = () => {
  const { setEmail, setPassword, email, password } = useSignup();
  const { handleAlert } = useContext(TestContext);
  // navigate
  const redirect = useNavigate();

  // to get current user information and user role
  // const { getCurrentUser, useGetCurrentRole } = UserProfile();
  // const user = getCurrentUser();
  // const role = useGetCurrentRole();
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

  // useEffect(() => {
  //   if (user?._id) {
  //     if (role === "Super-Admin" || role === "Delegate-Super-Admin")
  //       return redirect("/");
  //     else if (role === "HR")
  //       return redirect(
  //         `/organisation/${user?.organizationId}/dashboard/HR-dashboard`
  //       );
  //     else if (
  //       role === "Delegate-Department-Head" ||
  //       role === "Department-Head"
  //     )
  //       return redirect(
  //         `/organisation/${user?.organizationId}/dashboard/DH-dashboard`
  //       );
  //     else if (role === "Accountant")
  //       return redirect(
  //         `/organisation/${user?.organizationId}/dashboard/employee-dashboard`
  //       );
  //     else if (role === "Manager")
  //       return redirect(
  //         `/organisation/${user?._id}/dashboard/manager-dashboard`
  //       );
  //     else if (role === "Employee")
  //       return redirect(
  //         `/organisation/${user?.organizationId}/dashboard/employee-dashboard`
  //       );
  //   }
  //   // eslint-disable-next-line
  // }, [role, window.location.pathname]);

  // to define the funciton for handle role
  const handleRole = useMutation(
    (data) => {
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
        Cookies.set("aegis", response.data.token, { expires: 4 / 24 });
        handleAlert(
          true,
          "success",
          `Welcome ${response.data.user.first_name} you are logged in successfully`
        );
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
        }
        else if (response.data.user?.profile?.includes("Super-Admin")) {
          handleRole.mutate({
            role: "Super-Admin",
            email: response.data.user?.email,
          });
          return redirect("/");
        }
        else if (response.data.user?.profile?.includes("Teacher")) {
          handleRole.mutate({
            role: "Teacher",
            email: response.data.user?.email,
          });
          return redirect(
            `/organisation/${response?.data?.user?.organizationId}/dashboard/employee-dashboard`
          );
        } else if (
          response.data.user?.profile?.includes("Delegate-Super-Admin")
        ) {
          handleRole.mutate({
            role: "Delegate-Super-Admin",
            email: response.data.user?.email,
          });
          return redirect("/");
        } else if (response.data.user?.profile?.includes("HR")) {
          handleRole.mutate({
            role: "HR",
            email: response.data.user?.email,
          });
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
        window.location.reload();
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
          handleRole.mutate({
            role: "Super-Admin",
            email: result.user?.email,
          });
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
          handleRole.mutate({
            role: "Accountant",
            email: result.user?.email,
          });
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
          handleRole.mutate({
            role: "Employee",
            email: result.user?.email,
          });
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
    <Grid container>
      <Grid item xs={12} sm={12} md={12} lg={6} sx={{ p: "2%", display: { lg: "block", md: "none", sm: "none", xs: "none" } }}>
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

      <Grid item xs={12} sm={12} md={12} lg={6} className="border h-screen  border-l-[.5px] bg-gray-50" sx={{ display: 'flex', justifyContent: 'center', alignItems: { lg: "center" }, p: { xs: "5%", sm: "5% 20%", md: "5% 25%", lg: "5% 10%" } }}>
        <form
          onSubmit={onSubmit}
          autoComplete="off"
          className="w-full"
        >
          <img
            src={aegislogo}
            alt="logo"
            className="h-[50px]  object-cover  mix-blend-multiply mb-2"
          />
          <div>
            <Typography component="p" sx={{ color: "#1414fe", fontSize: "32px", fontWeight: "600" }}>
              Welcome Back!
              <Typography className="text-gray-500" component="p" sx={{ fontSize: "18px", m: "0", p: "0" }}>Doesn't have an account yet?  <Link to="/sign-up" className="font-medium text-blue-500 hover:underline  transition-all ">
                Sign Up
              </Link></Typography>
            </Typography> </div>

          <div className="mt-6  w-full space-y-2 ">
            <label
              htmlFor={email}
              className={" font-semibold text-gray-500 text-md"}
            >
              Email Address
            </label>
            <div
              className={` p-2
                flex  rounded-md   bg-white
                ${focusedInput === "email"
                  ? "outline-blue-500 outline-3 !border-blue-500 border-[2px]"
                  : "border-gray-200 border-[.5px]"
                }`}
            >
              <Email className="text-gray-700" />
              <input
                name="email"
                autoComplete="off"
                id="email"
                placeholder="Email"
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
            <div className="space-y-1 !mt-5 !w-full ">
              <label
                htmlFor={password}
                className={" font-semibold text-gray-500 text-md"}
              >
                Password
              </label>
              <div
                className={`
                flex  rounded-md px-2  w-full  bg-white py-[6px]
                ${focusedInput === "password"
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
                    <Visibility className="text-gray-700" />
                  ) : (
                    <VisibilityOff className="text-gray-700" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="text-gray-700 my-2">
            <Link
              to="/forgot-password"
              className="font-medium text-blue-500 hover:underline  transition-all "
            >
              Forgot Password?
            </Link>
          </div>
          <div className="flex  mb-2">

            <button
              type="submit"
              className={` flex group justify-center text-lg w-full gap-2 items-center rounded-md h-[30px] px-4 py-4 font-semibold text-white bg-[#1414fe]`}
            >
              {handleLogin.isLoading ? (
                <>
                  <CircularProgress size={20} style={{ color: "white" }} />
                </>
              ) : (
                "Login"
              )}
            </button>
          </div>
          <div className="flex items-center justify-center w-full my-4">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="mx-2 text-gray-500">or login with</span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>
          <button
            type="button"
            onClick={googleLogin}
            className={`!bg-white flex  group justify-center w-full gap-2 items-center rounded-md h-[30px] px-4 py-4 text-md    border-gray-300 border    `}
          >
            <FcGoogle className="text-2xl" /> Continue with Google
          </button>
        </form>
      </Grid>
    </Grid>
  );
};

export default LoginPage;

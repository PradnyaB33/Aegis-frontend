import axios from "axios";
import React, { useContext } from "react";
import { TestContext } from "../../State/Function/Main";
import useSignup from "../../hooks/useLoginForm";
import forgotPass from "../../assets/forgotPass.png"
import { Grid, Typography } from "@mui/material";
import aegislogo from "../../assets/AegisFLogo.jpeg";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const { setEmail, email } = useSignup();
  const { handleAlert } = useContext(TestContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/employee/forgot-password`,
        {
          email,
        }
      );
      handleAlert(true, "success", response.data.message);
    } catch (error) {
      console.error("API error:", error.response);
      handleAlert(true, "error", error?.response?.data?.message);
    }
  };

  return (
    <Grid container>
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={6}
        sx={{
          p: "2%",
          display: { lg: "flex", md: "none", sm: "none", xs: "none" },  // Show only on large screens
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={forgotPass}
          alt="img"
          className="h-[400px] object-cover"
        />
      </Grid>


      <Grid item xs={12} sm={12} md={12} lg={6} className="border h-screen  border-l-[.5px] bg-gray-50" sx={{ display: 'flex', justifyContent: 'center', p: { xs: "5%", sm: "5% 20%", md: "5% 25%", lg: "5% 10%" } }}>
        <form onSubmit={handleSubmit} className="w-full" >
          <img
            src={aegislogo}
            alt="logo"
            className="h-[50px]  object-cover  mix-blend-multiply mb-2"
          />
          <div className="mb-2">
            <Typography component="p" sx={{ fontSize: "32px", fontWeight: "600", color: "#1414fe" }}>
              Forgot Password
            </Typography>
            <Typography component="p" sx={{ fontSize: "18px" }}>Enter your email address and we'll send you a link to reset your password.</Typography> </div>
          <div>
            <label
              htmlFor={email}
              className={" font-semibold text-gray-500 text-md"}
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent px-3 py-2"
              placeholder="Email"
            />
          </div>
          <button
            type="submit"
            className={` my-2 mt-4 flex group justify-center text-lg w-full gap-2 items-center rounded-md h-[30px] px-4 py-4 font-semibold text-white bg-[#1414fe]`}
          >
            Submit </button>
          <Typography className="text-gray-500" component="p" sx={{ fontSize: "18px" }}>Back to <Link to="/sign-in" className="font-medium text-blue-500 hover:underline  transition-all ">
            Sign In
          </Link></Typography>

        </form>
      </Grid>
    </Grid>
    // <>
    //   <div className="flex items-center justify-center min-h-screen bg-gray-50">
    //     <div className="bg-white p-8 rounded-lg shadow-lg w-96">
    //       <div className="flex flex-col items-center mb-6">
    //         <div className="flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-full mb-4">
    //           <LockOutlinedIcon style={{ fontSize: '2rem' }} />
    //         </div>
    //         <h2 className="text-2xl font-bold text-gray-800">Forgot Password</h2>
    //         <p className="text-sm text-gray-600 text-center mt-2">
    //           Enter your email address and we'll send you a link to reset your password.
    //         </p>
    //       </div>
    //       <form onSubmit={handleSubmit} className="space-y-4">
    //         <div>
    //           <label htmlFor="email" className="block text-sm font-medium text-gray-700">
    //             Email Address
    //           </label>
    //           <input
    //             type="email"
    //             id="email"
    //             name="email"
    //             required
    //             value={email}
    //             onChange={(event) => setEmail(event.target.value)}
    //             className="mt-1 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent px-3 py-2"
    //             placeholder="you@example.com"
    //           />
    //         </div>
    //         <button
    //           type="submit"
    //           className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
    //         >
    //           Submit
    //         </button>
    //       </form>
    //       <div className="mt-6 text-center">
    //         <a href="/sign-in" className="text-blue-600 hover:underline">
    //           Back to Sign In
    //         </a>
    //       </div>
    //     </div>
    //   </div>
    // </>


  );
};

export default ForgotPassword;











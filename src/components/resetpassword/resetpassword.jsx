

import React, { useState, useContext } from "react";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import aegislogo from "../../assets/ResetPassword.svg";
import { z } from "zod";


import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthInputFiled from "../InputFileds/AuthInputFiled";

// Regex for password validation
const passwordRegex = /^(?=.*[a-z])(?=.*\d)/;  // Lowercase + Number (mandatory conditions)


const EmployeeSchema = z.object({
  password: z.string().min(8).max(16).refine((value) => passwordRegex.test(value), {
    message: "Password must contain one lowercase letter and one number",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPassword = () => {

  const { token } = useParams();
  const { handleAlert } = useContext(TestContext);
  const redirect = useNavigate(UseContext);

  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleCPassword, setVisibleCPassword] = useState(false);
   // State to track password strength
 const [passwordStrength, setPasswordStrength] = useState([false, false, false]);
 const [passwordMessage, setPasswordMessage] = useState('');

 
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(EmployeeSchema),
  });



     // Track password changes
     const password = watch("password");
console.log("errors", errors);


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
  



  const handleSubmitForm = async (data) => {
    try {


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
    


      // Proceed with the API request if validation passes
     await axios.post(
        `${process.env.REACT_APP_API}/route/employee/reset-password/${token}`,
        { password: data.password }
      );
      handleAlert(true, "success", `Password reset successful!`);
      redirect("/sign-in");
    } catch (error) {
      handleAlert(true, "error", "Something went wrong! Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center p-8 box-border h-[500px] lg:w-[900px] m-auto">
      <div className="flex w-full h-full rounded-lg shadow-xl border bg-white">
        <form
          className="w-full md:w-1/2 p-8 flex flex-col items-center gap-4 justify-center"
          onSubmit={handleSubmit(handleSubmitForm)}
        >
          <Typography
            color={"primary"}
            fontWeight={800}
            fontSize={20}
            className="text-2xl my-2"
          >
            Reset Password
          </Typography>

          {/* Password input field */}
          <div className="w-full sm:[250px]">
            <AuthInputFiled
              name="password"
              control={control}
              label="Enter New Password"
              type="Password1"
              error={errors.password}
              visible={visiblePassword}
              setVisible={setVisiblePassword}
              errors={errors}
              placeholder="Ex: Test@123"
            />
               { password && ( <div className=" gap-2 pt-2">
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


            {/* Confirm Password input field */}
            <AuthInputFiled
              name="confirmPassword"
              control={control}
              label="Confirm Password"
              type="password"
              visible={visibleCPassword}
              setVisible={setVisibleCPassword}
              errors={errors}
              placeholder="Ex: Test@123"
            />
          </div>
       
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="m-auto w-fit"
          >
            Reset Password
          </Button>
        </form>

        <div className="md:w-1/2 md:flex hidden p-8 rounded-r-lg items-center flex-col justify-around">
          <img src={aegislogo} alt="Reset Password" />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

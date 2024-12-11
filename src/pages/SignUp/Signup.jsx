// This file is not used
import { Button, TextField } from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import TermsCondition from "../../components/termscondition/termsCondition";
import useSignupFormStore from "../../hooks/useSignUpForm";

const Signup = () => {
  const { handleAlert } = useContext(TestContext);
  const router = useNavigate();

  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    firstNameError,
    setFirstNameError,
    lastNameError,
    setLastNameError,
    emailError,
    setEmailError,
    orgnizationName,
    setOrganizationName,
  } = useSignupFormStore();

  const [middleName, setMiddleName] = useState("");
  const [middleNameError, setMiddleNameError] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const handlePasswordChange = (enteredPassword) => {
    setPassword(enteredPassword);
    if (!enteredPassword) {
      setPasswordError("Password is required");
    } else if (!enteredPassword.match(passwordRegex)) {
      setPasswordError(
        "Password must contain one number & one special character"
      );
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (enteredConfirmPassword) => {
    setConfirmPassword(enteredConfirmPassword);
    if (!enteredConfirmPassword) {
      setConfirmPasswordError("Confirm Password is required");
    } else if (enteredConfirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };
  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const validDomain =
      email.endsWith(".com") || email.endsWith(".net") || email.endsWith(".in");
    return emailRegex.test(email) && validDomain && email.includes("@");
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const user = {
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      email,
      password,
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/employee/create`,
        user
      );
      handleAlert(true, "success", response.data.message);
      // Redirect to a waiting page after successful signup
      router("/waiting"); // Redirect to a waiting page

      window.location.reload();
    } catch (error) {
      handleAlert(
        true,
        "error",
        error.response.data.message || "Failed to sign up. Please try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center p-8 box-border ">
      <div className="flex w-full h-full rounded-lg shadow-xl border bg-white">
        <div className="w-full md:w-1/2 p-8 flex flex-col items-center gap-4 justify-center">
          <form onSubmit={handleSignup}>
            <h1 className="text-3xl font-semibold  text-center text-blue-500">
              Register
            </h1>
            <div className=" w-[300px]">
              <TextField
                size="small"
                type="text"
                label="First Name"
                name="firstName"
                id="firstName"
                value={firstName}
                onChange={(e) => {
                  const enteredFirstName = e.target.value;
                  setFirstName(enteredFirstName);
                  if (!enteredFirstName.trim()) {
                    setFirstNameError("First Name is required");
                  } else if (
                    enteredFirstName.length < 2 ||
                    enteredFirstName.length > 30 ||
                    /[^a-zA-Z]/.test(enteredFirstName)
                  ) {
                    setFirstNameError(
                      "First Name must be between 2 and 30 characters and should only contain letters."
                    );
                  } else {
                    setFirstNameError(""); // Clear error message when criteria are met
                  }
                }}
                required
                fullWidth
                margin="normal"
                error={!!firstNameError}
                helperText={firstNameError}
              />

              <TextField
                size="small"
                type="text"
                label="Middle Name"
                name="middleName"
                id="middleName"
                value={middleName}
                onChange={(e) => {
                  const enteredMiddleName = e.target.value;
                  setMiddleName(enteredMiddleName);

                  if (enteredMiddleName.trim() === "") {
                    setMiddleNameError("");
                  } else if (/[^a-zA-Z]/.test(enteredMiddleName)) {
                    setMiddleNameError(
                      "Middle Name should only contain letters."
                    );
                  } else {
                    // Valid middle name with only letters
                    setMiddleNameError("");
                  }
                }}
                fullWidth
                margin="normal"
                error={!!middleNameError}
                helperText={middleNameError}
              />
              <TextField
                size="small"
                type="text"
                label="Last Name"
                name="lastName"
                id="lastName"
                value={lastName}
                onChange={(e) => {
                  const enteredLastName = e.target.value;
                  setLastName(enteredLastName);
                  if (!enteredLastName.trim()) {
                    setLastNameError("Last Name is required");
                  } else if (
                    enteredLastName.length < 2 ||
                    enteredLastName.length > 30 ||
                    /[^a-zA-Z]/.test(enteredLastName)
                  ) {
                    setLastNameError(
                      "Last Name must be between 2 and 30 characters and should only contain letters."
                    );
                  } else {
                    setLastNameError(""); // Clear error message when criteria are met
                  }
                }}
                error={!!lastNameError}
                helperText={lastNameError}
                required
                fullWidth
                margin="normal"
              />

              <TextField
                size="small"
                type="email"
                label="Email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => {
                  const enteredEmail = e.target.value;
                  setEmail(enteredEmail);
                  if (!enteredEmail.trim()) {
                    setEmailError("Email is required");
                  } else if (!isValidEmail(enteredEmail)) {
                    setEmailError("Invalid Email Format");
                  } else {
                    setEmailError(""); // Clear error message when criteria are met
                  }
                }}
                required
                fullWidth
                margin="normal"
                error={!!emailError}
                helperText={emailError}
              />

              <TextField
                size="small"
                type="password"
                label="Password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                required
                fullWidth
                margin="normal"
                error={!!passwordError}
                helperText={passwordError}
                InputProps={{
                  inputProps: {
                    pattern: passwordRegex.source,
                  },
                }}
              />
              <TextField
                size="small"
                type="password"
                label="Confirm Password"
                name="confirmPassword"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                required
                fullWidth
                margin="normal"
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
              />

              <TextField
                size="small"
                type="text"
                label="Organization Name"
                name="orgnizationName"
                id="orgnizationName"
                value={orgnizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                required
                fullWidth
                margin="normal"
              />
              <div>
                <TermsCondition />
              </div>

              <div className="text-center m-6">
                <Button
                  className="px-4 py-2 text-base bg-blue-500 text-white rounded-lg"
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth={false}
                  margin="normal"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </form>
        </div>
        <div className="w-full md:w-1/2 p-8 bg-blue-500 rounded-r-lg items-center flex-col justify-center hidden md:flex ">
          <div className="flex flex-col items-center justify-center gap-2">
            <img
              src="aeigs-log-final.svg"
              alt="My Img"
              className="w-36 before:bottom-0 h-36 object-cover  rounded-lg p-6 bg-white"
            />
            <h1 className="text-white text-2xl mb-6">AEGIS</h1>
          </div>
          <Link to="/sign-in">
            <Button
              variant="contained"
              fullWidth
              size="small"
              className=" bg-white"
              style={{
                marginTop: "38px",
                background: "white",
                color: "#1976d2",
              }}
            >
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;

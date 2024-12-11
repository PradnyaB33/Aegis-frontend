import Button from "@mui/material/Button";
import React from "react";
import { Link } from "react-router-dom";
import WaitingPage from "./components/waiting";

const WaitMain = () => {
  return (
    <div className="flex items-center justify-center p-8 box-border h-[500px] lg:w-[900px] m-auto">
      <div className="flex w-full h-full rounded-lg shadow-xl border bg-white">
        <WaitingPage />
        <div className="md:w-1/2 md:flex hidden p-8 bg-blue-500 rounded-r-lg items-center flex-col justify-around">
          <img
            src="/argan_logo.png"
            alt="My Img"
            className="w-36 h-36 object-cover mb-6 rounded-lg p-6 bg-white"
          />
          <Link to="/sign-in">
            <Button
              variant="contained"
              fullWidth
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

export default WaitMain;

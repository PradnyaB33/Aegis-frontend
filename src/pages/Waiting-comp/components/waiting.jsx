import { Email } from "@mui/icons-material";
import { Button } from "@mui/material";
import React, { useRef } from "react";

const WaitingPage = () => {
  const envelopeTopRef = useRef(null);
  const docRef = useRef(null);

  const ani = () => {
    if (envelopeTopRef.current && docRef.current) {
      envelopeTopRef.current.classList.add("foldy");
      docRef.current.classList.add("gone");
    }
  };

  return (
    <div className=" md:w-1/2 md:flex hidden p-8 rounded-r-lg items-center flex-col justify-around">
      <div className="container-2 w-[-webkit-fill-available]" onClick={ani}>
        <div className="envelope-main"></div>
        <div className="envelope-bottom"></div>
        <div className="envelope-right"></div>
        <div className="envelope-left"></div>
        <div className="envelope-top foldy" ref={envelopeTopRef}></div>
        <div className="gone" id="doc">
          <Email />
        </div>
      </div>
      <Button
        disabled
        variant="contained"
        fullWidth
        className=" bg-[#1976d2]"
        style={{
          marginTop: "38px",
          background: "white",
          color: "#1976d2",
        }}
      >
        Email is sended to you mail-box
      </Button>
    </div>
  );
};

export default WaitingPage;

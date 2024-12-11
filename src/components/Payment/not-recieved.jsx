import { PaymentOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const PaymentNotReceived = ({ link }) => {
  return (
    <div className="flex flex-col items-center w-full p-12 gap-8">
      <img
        src="\payment-not-received.svg"
        alt="payment-not-received"
        className="h-[500px] w-min border-b-2"
      />
      <Link to={link} target="blank">
        <Button size="large" variant="contained" className="gap-4 !font-bold">
          <PaymentOutlined />
          Pay
        </Button>
      </Link>
    </div>
  );
};

export default PaymentNotReceived;

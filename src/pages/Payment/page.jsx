import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const PaymentFailed = () => {
  return (
    <div className="flex justify-center items-center flex-col gap-16 pt-24">
      <img
        src="/payment-failed.svg"
        alt="payment is failed"
        className=" w-[300px]"
      />
      <Link to={"/"}>
        <Button variant="contained" size="large">
          Go to Home page{" "}
        </Button>
      </Link>
    </div>
  );
};

export default PaymentFailed;

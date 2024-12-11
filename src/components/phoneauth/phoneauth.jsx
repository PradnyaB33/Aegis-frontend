import { Button, TextField } from "@mui/material";
import axios from "axios";
import { React, useContext, useState } from "react";
import { TestContext } from "../../State/Function/Main";

function PhoneAuth() {
  const [phone_number, setPhoneNumber] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const { handleAlert } = useContext(TestContext);

  const sendCode = async () => {
    const user = {
      phone_number,
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/employee/send-code`,
        user
      );
      console.log(`🚀 ~ response:`, response);
      handleAlert(true, "success", response.data);
      setCodeSent(true);
    } catch (error) {
      console.error("API error:", error.response);
      handleAlert(
        true,
        "error",
        error.response.data || "Could not send phone number"
      );
    }
  };

  const verifyCode = async () => {
    const user = {
      phone_number,
      code,
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/employee/verify-code`,
        user
      );
      console.log(`🚀 ~ response:`, response);
      handleAlert(true, "success", response.data);
    } catch (error) {
      console.error("API error:", error.response);
      handleAlert(true, "error", error.response.data);
    }
  };

  return (
    <div>
      {!codeSent && (
        <TextField
          size="small"
          type="number"
          label="Enter your Phone Number"
          name="phone_number"
          id="phone_number"
          value={phone_number}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
      )}
      <br />
      {phone_number && !codeSent && (
        <Button
          className="px-4 py-2 text-base bg-blue-500 text-white rounded-lg"
          type="submit"
          variant="contained"
          color="primary"
          fullWidth={false}
          margin="normal"
          onClick={async () => await sendCode()}
        >
          Send Code Via SMS
        </Button>
      )}
      {codeSent && (
        <div>
          <TextField
            size="small"
            type="Number"
            label="Enter your code"
            name="code"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
        </div>
      )}
      {code && (
        <>
          <Button
            className="px-4 py-2 text-base bg-blue-500 text-white rounded-lg"
            type="submit"
            variant="contained"
            color="primary"
            fullWidth={false}
            margin="normal"
            onClick={async () => await verifyCode()}
          >
            Verify code
          </Button>
        </>
      )}
    </div>
  );
}

export default PhoneAuth;

import React, { useContext } from "react";
import Alert from "@mui/material/Alert";
import UserProfile from "../../hooks/UserData/useUser";
import { useQuery } from "react-query";
import axios from "axios";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import { UseContext } from "../../State/UseState/UseContext";
const Form16Emp = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  console.log(user);
  const employeeId = user._id;
  const organizationId = user.organizationId;

  console.log(employeeId);
  const { data: getForm16 } = useQuery(["getForm16"], async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/get/form16/${organizationId}/${employeeId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data.data;
  });

  console.log(getForm16);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = getForm16;
    link.download = "Form16.pdf";
    link.click();
  };

  return (
    <>
      <div className="mt-5">
        {getForm16 ? (
          <>
            <Typography variant="h4" className="text-center pl-10">
              Form 16
            </Typography>
            <object
              type="application/pdf"
              width="100%"
              height="500px"
              data={`${getForm16}#toolbar=0&background=FFFFFF`}
              aria-label="Form 16 PDF"
              className="w-full"
              style={{ overflow: "hidden" }}
            />

            <div className="flex justify-center mt-4 mb-4">
              <Button
                onClick={handleDownload}
                variant="contained"
                color="primary"
              >
                Download Form 16
              </Button>
            </div>
          </>
        ) : (
          <div className=" ml-80 mt-1">
            <div>
              <img
                src="/form16.jpg"
                style={{ height: "600px", marginLeft: "10%" }}
                alt="none"
              />
            </div>
            <div>
              <Alert
                severity="error"
                sx={{
                  width: "100%",
                  maxWidth: "600px",
                  marginLeft: "10%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                "Form 16 is not available for viewing at the moment. Please
                contact your HR department to ensure that Form 16 has been
                uploaded for your profile. Thank you for your understanding."
              </Alert>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Form16Emp;

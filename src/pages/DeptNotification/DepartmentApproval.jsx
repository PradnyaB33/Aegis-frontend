import React, { useContext } from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import axios from "axios";
import { UseContext } from "../../State/UseState/UseContext";
import { TestContext } from "../../State/Function/Main";
import { useQueryClient } from "react-query";

const DepartmentApproval = ({ employee, onApprovalCompletion }) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();
  console.log(employee);
  const departmentId = employee._id;
  console.log(departmentId);

  const handleApprovalReject = async (status) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/route/accept/reject/${departmentId}`,
        {
          action: status === "accept" ? "accept" : "reject",
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log(response);
      queryClient.invalidateQueries(["get-department"]);
      if (status === "accept") {
        handleAlert(
          true,
          "success",
          `Approved the request for add department.`
        );
      } else {
        handleAlert(true, "error", `Rejected the request for add department.`);
      }
      onApprovalCompletion();
    } catch (error) {
      console.error("Error while approving the requests.:", error);
      handleAlert(true, "error", "Something went wrong");
    }
  };

  return (
    <>
      <div>
        <Card
          variant="outlined"
          sx={{ width: "100%", maxWidth: "95%", marginTop: "50px" }}
        >
          <Box sx={{ p: 2 }}>
            <Typography color="text.secondary" variant="body2">
              {employee?.creator?.first_name || ""} has raised a request for
              adding the department.
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography gutterBottom variant="h6" component="div">
                Department Name
              </Typography>
              <Typography gutterBottom component="div">
                {employee?.departmentName}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography gutterBottom variant="h6" component="div">
                Department Cost Center Id
              </Typography>
              <Typography gutterBottom component="div">
                {employee?.dept_cost_center_id}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography gutterBottom variant="h6" component="div">
                Department Location
              </Typography>
              <Typography gutterBottom component="div">
                {" "}
                {employee?.departmentLocation?.city}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography gutterBottom variant="h6" component="div">
                Department Head Name
              </Typography>
              <Typography gutterBottom component="div">
                {" "}
                {`${employee?.departmentHeadName?.first_name || ""} ${
                  employee?.departmentHeadName?.last_name || ""
                }`}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography gutterBottom variant="h6" component="div">
                Delegate Department Head Name
              </Typography>
              <Typography gutterBottom component="div">
                {" "}
                {`${employee?.departmentHeadDelegateName?.first_name || ""} ${
                  employee?.departmentHeadDelegateName?.last_name || ""
                }`}
              </Typography>
            </Stack>
          </Box>
          <Divider />
          <Box sx={{ p: 2 }}>
            <div className="flex justify-center gap-10">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleApprovalReject("accept")}
              >
                Accept
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleApprovalReject("reject")}
              >
                Reject
              </button>
            </div>
          </Box>
        </Card>
      </div>
    </>
  );
};

export default DepartmentApproval;

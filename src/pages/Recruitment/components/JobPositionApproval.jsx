import React, { useContext } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useMutation, useQueryClient } from "react-query";
import { UseContext } from "../../../State/UseState/UseContext";
import { TestContext } from "../../../State/Function/Main";
import { Grid, Chip } from "@mui/material";
import MovingIcon from "@mui/icons-material/Moving";
import { formatDistanceToNow } from "date-fns";
import { useForm } from "react-hook-form";

const JobPositionApproval = ({ employee, onActionComplete }) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();
  const { setError } = useForm();

  const jobPositionId = employee?._id;

  // Accept the job position
  const acceptJobPosition = useMutation(
    () =>
      axios.put(
        `${process.env.REACT_APP_API}/route/${jobPositionId}/accept-job-position`,
        {},
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("job-position");
        handleAlert(true, "success", "Request approved successfully");
        onActionComplete();
      },
      onError: () => {
        setError("An error occurred while approving the request.");
      },
    }
  );

  const handleAcceptJobPosition = async () => {
    acceptJobPosition.mutate();
  };

  // Reject the job position
  const deleteJobPosition = useMutation(
    () =>
      axios.put(
        `${process.env.REACT_APP_API}/route/${jobPositionId}/reject-job-posistion`,
        {},
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("job-position");
        handleAlert(true, "success", "Request rejected successfully");
        onActionComplete();
      },
      onError: () => {
        setError("An error occurred while rejecting the request.");
      },
    }
  );

  const handleDeleteJobPosition = async () => {
    deleteJobPosition.mutate();
  };

  return (
    <div>
      <Card
        variant="outlined"
        sx={{ width: "100%", maxWidth: "95%", marginTop: "50px" }}
      >
        <Box sx={{ p: 2 }}>
          <Typography gutterBottom variant="h4" component="div">
            {employee?.first_name || ""}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {employee?.first_name || ""} has raised a request for job position.
          </Typography>
        </Box>
        <Divider />
        <Grid key={employee?._id} className="w-full">
          <Box className="w-full rounded-sm bg-white border py-4">
            <div>
              <div className="px-4 py-1">
                <Chip
                  color="primary"
                  label={
                    employee?.status === "Approved"
                      ? "Published"
                      : "Not Published"
                  }
                  variant="outlined"
                  icon={<MovingIcon />}
                />
              </div>
              <h1 className="text-xl px-4 font-semibold">
                {employee?.position_name}
              </h1>
              <p className="px-4">{employee?.organizationId?.orgName}</p>
              <p className="px-4">
                {employee?.location_name?.city} (
                {employee?.mode_of_working?.label})
              </p>
              <p className="px-4">
                Department Name : {employee?.department_name?.departmentName}
              </p>
              <p className="px-4">Job Level : {employee?.job_level?.label}</p>
              <p className="px-4">Job Type : {employee?.job_type?.label}</p>
              <p className="px-4">
                Posted on: {formatDistanceToNow(new Date(employee.createdAt))}{" "}
                ago
              </p>
            </div>
          </Box>
        </Grid>

        <Box sx={{ p: 2 }}>
          <div className="flex justify-center gap-10">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleAcceptJobPosition}
            >
              Accept
            </button>

            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleDeleteJobPosition}
            >
              Reject
            </button>
          </div>
        </Box>
      </Card>
    </div>
  );
};

export default JobPositionApproval;

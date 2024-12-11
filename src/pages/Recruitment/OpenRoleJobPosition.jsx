import React from "react";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import useGetUser from "../../hooks/Token/useUser";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import UserProfile from "../../hooks/UserData/useUser";
import { Avatar, Button, Grid } from "@mui/material";
import { useDrawer } from "../../components/app-layout/components/Drawer";

const OpenJobPosition = () => {
  const { open } = useDrawer();
  const { organisationId } = useParams();
  const { authToken } = useGetUser();
  const navigate = useNavigate();
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();

  const { data: openJob, isLoading, isError, error } = useQuery(
    ["openJobPosition", organisationId, authToken],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/job-open`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response?.data?.data;
    },
    {
      enabled: Boolean(authToken),
      onSuccess: (data) => console.log("Fetched Job Openings:", data),
      onError: (err) => console.error("Error fetching job openings:", err),
    }
  );
  console.log("openJob", openJob);

  const handleDetails = (vacancyId) => {
    navigate(`/organisation/${organisationId}/view-job-details/${vacancyId}`);
  };

  const formatPostedDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    try {
      return `${formatDistanceToNow(parseISO(dateString))} ago`;
    } catch (error) {
      console.error("Error formatting posted date:", error);
      return "Invalid Date";
    }
  };

  return (
    <BoxComponent>
      <HeadingOneLineInfo
        heading="Open Job Positions"
        info="Explore the list of open job positions below"
      />

      {isLoading && <p>Loading job openings...</p>}
      {isError && <p>Error fetching job openings: {error?.message}</p>}

      <Grid container spacing={2} sx={{ height: "auto" }}>
        {Array.isArray(openJob) && openJob.length > 0 ? (
          openJob.map((vacancy) => (
            <Grid item lg={open ? 3 : 2.5}
              sm={open ? 6 : 6}
              md={open ? 6 : 4} key={vacancy._id} sx={{ height: "100%" }}>
              <div
                className="p-2 bg-white flex flex-col justify-between"
                style={{
                  border: "1px solid #D2D2D2",
                  borderRadius: "15px",
                  minHeight: "300px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#ECEFF4",
                    padding: "10px 10px ",
                    borderRadius: "15px",
                    flex: "1",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: "white",
                      padding: "5px",
                      borderRadius: "50px",
                      alignSelf: "start",
                    }}
                  >
                    {formatPostedDate(vacancy?.date)}
                  </span>
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <h4>{vacancy?.organizationId?.orgName}</h4>
                      <span
                        style={{
                          marginTop: 0,
                          fontSize: "24px",
                          color: "#333",
                          lineHeight: "30px",
                        }}
                      >
                        {vacancy.jobPosition || "Position Not Specified"}
                      </span>
                    </div>
                    {vacancy?.organizationId?.logo_url ? (
                      <img
                        src={vacancy?.organizationId?.logo_url}
                        alt="Logo"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Avatar />
                    )}
                  </div>

                  <div
                    className="grid grid-cols-2 gap-2 mb-1"
                    style={{
                      margin: "0",
                      padding: "0",
                      marginTop: "auto",
                    }}
                  >
                    <span
                      className="border border-gray-300 py-1 text-center inline-block"
                      style={{ borderRadius: "40px" }}
                    >
                      {vacancy.experienceRequired}
                    </span>
                    <span
                      className="border border-gray-300 py-1 text-center inline-block"
                      style={{ borderRadius: "40px" }}
                    >
                      {vacancy.modeOfWorking}
                    </span>
                    <span
                      className="border border-gray-300 py-1 text-center inline-block"
                      style={{ borderRadius: "40px" }}
                    >
                      {vacancy.jobType}
                    </span>

                  </div>
                </div>

                <div
                  className={` my-2 px-3 flex ${role === "HR" || role === "Super-Admin" || role === "Delegate-Super-Admin"
                    ? "justify-between"
                    : "justify-end"
                    } mt-3`}
                >
                  {(role === "HR" || role === "Super-Admin" || role === "Delegate-Super-Admin") && (
                    <Link
                      to={`/organisation/${organisationId}/view-job-application/${vacancy._id}`}
                      className="font-semibold text-blue-500 hover:underline text-md"
                    >
                      View Applications
                    </Link>
                  )}
                  <Button variant="contained" sx={{ borderRadius: "50px", bgcolor: "#1414FE" }} onClick={() => handleDetails(vacancy._id)}>Details</Button>

                </div>
              </div>
            </Grid>
          ))
        ) : (
          !isLoading && <p>No job vacancies found.</p>
        )}
      </Grid>




    </BoxComponent >
  );
};

export default OpenJobPosition;

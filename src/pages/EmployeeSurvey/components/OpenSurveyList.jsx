import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button, CircularProgress, Typography } from "@mui/material";
import { UseContext } from "../../../State/UseState/UseContext";
import DOMPurify from "dompurify";
import { useQuery } from "react-query";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { format } from "date-fns";
import UserProfile from "../../../hooks/UserData/useUser";

const OpenSurveyList = () => {
  // Hooks
  const navigate = useNavigate();
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();

  console.log("useGetCurrentRole..........", role)
  // Get organizationId
  const param = useParams();
  const organisationId = param?.organisationId;
  console.log("organisationId", organisationId);
  // Get cookies
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const [openSurvey, setOpenSurvey] = useState(false);

  // Get open surveys
  const { data: surveys, isLoading, isError } = useQuery(
    ["openSurveys", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-open-survey`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },
    {
      enabled: !!organisationId && !!authToken,
    }
  );

  // Get response surveys
  const { data: responseSurvey } = useQuery(
    ["responseSurveys", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-response-survey`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },
    {
      enabled: !!organisationId && !!authToken,
    }
  );

  // Handle form navigation
  const handleSurveyForm = (surveyId, responseId) => {
    navigate(`/organisation/${organisationId}/survey-form/${surveyId}/${responseId}`)
  };

  // Handle form navigation
  const handleTakeSurvey = (surveyId) => {
    navigate(`/organisation/${organisationId}/survey-form/${surveyId}`)
  };

  //handleOpenSurvey function
  const handleOpenSurvey = () => {
    setOpenSurvey(!openSurvey);
  };

  // Match surveys with their responses
  const matchedResponses = surveys?.map(survey => {
    const responses = responseSurvey?.filter(response => response.surveyId === survey?._id);
    return {
      ...survey,
      responses: responses || []
    };
  });

  return (
    <div>
      <div className="flex  justify-between  gap-3 w-full border-gray-300 my-2">
        <div className="flex justify-start ">
          <div className="mb-2 md:mb-0 md:mr-4">
            <p className="font-bold">Open Survey</p>
            <p className="text-sm text-gray-600">
              Here you can see list of currently active surveys.
            </p>
          </div>


        </div>
        <div className="flex justify-end">
          <AddCircleOutlineIcon style={{ width: "40px" }} onClick={handleOpenSurvey} />
          <Typography variant="p" className="">
            Count: {surveys?.length}
          </Typography>
        </div>
      </div>
      {openSurvey ? (
        <>
          <div className="border-t-[.5px] border-gray-300">
            {/* <div className="flex justify-end gap-3 mb-3 md:mb-0 w-full md:w-auto">
              <TextField
                placeholder="Search"
                variant="outlined"
                size="small"
                sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 200 }}
              />
            </div> */}
          </div>
          {isLoading ? (
            <div className="flex justify-center p-4">
              <CircularProgress />
            </div>
          ) : isError ? (
            <div className="flex justify-center p-4 text-red-500">
              Error fetching data
            </div>
          ) :
            surveys && surveys?.length > 0 ? (
              <div className="overflow-auto !p-0 border-[.5px] border-gray-200 mt-4">
                <table className="min-w-full bg-white text-left !text-sm font-light">
                  <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                    <tr className="!font-semibold">
                      <th scope="col" className="!text-left pl-8 py-3">
                        Title
                      </th>
                      <th scope="col" className="!text-left pl-8 py-3">
                        Start Date
                      </th>
                      <th scope="col" className="!text-left pl-8 py-3">
                        End Date
                      </th>
                      {role !== 'Super-Admin' && <th scope="col" className="!text-left pl-8 py-3">
                        Actions
                      </th>}
                    </tr>
                  </thead>
                  <tbody>
                    {matchedResponses?.map((survey, index) => (
                      <tr key={index} className="!font-medium border-b ">
                        <td className="!text-left pl-8 py-3">
                          {DOMPurify.sanitize(survey?.title, { USE_PROFILES: { html: false } })}
                        </td>
                        <td className="!text-left pl-8 py-3">
                          {survey && format(new Date(survey?.employeeSurveyStartingDate), "PP")}
                        </td>
                        <td className="!text-left pl-8 py-3">
                          {survey && format(new Date(survey?.employeeSurveyEndDate), "PP")}
                        </td>
                        {role !== 'Super-Admin' && <td className="!text-left pl-8 py-3">
                          {survey?.responses?.length > 0 ? (
                            <div>
                              {survey?.responses[0]?.responseStatus === "End" ?
                                <Button
                                  variant="outlined"
                                  onClick={() => handleSurveyForm(survey?._id, survey?.responses[0]?._id)}
                                  sx={{ textTransform: "none", width: "auto" }}
                                  disabled
                                >
                                  {survey.responses[0].responseStatus}
                                </Button>
                                :
                                <Button
                                  variant="outlined"
                                  onClick={() => handleSurveyForm(survey?._id, survey?.responses[0]?._id)}
                                  sx={{ textTransform: "none", width: "auto" }}
                                >
                                  {survey?.responses[0]?.responseStatus}
                                </Button>}
                            </div>
                          ) : (
                            <Button
                              variant="outlined"
                              onClick={() => handleTakeSurvey(survey?._id)}
                              sx={{ textTransform: "none", width: "auto" }}
                            >
                              Take Survey
                            </Button>
                          )}
                        </td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <section className="py-6 w-full">
                <p>No data available</p>
              </section>
            )}
        </>) : null}
    </div>
  );
};

export default OpenSurveyList;

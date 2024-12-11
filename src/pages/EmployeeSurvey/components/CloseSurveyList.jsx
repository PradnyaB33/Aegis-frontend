import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Button, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import { format } from "date-fns";
import DOMPurify from "dompurify";
import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { UseContext } from "../../../State/UseState/UseContext";

const CloseSurveyList = () => {
  // Hooks
  const navigate = useNavigate();

  //states
  const [closeSurvey, setCloseSurvey] = useState(false);

  // Get organizationId
  const param = useParams();
  const organisationId = param?.organisationId;

  // Get cookies
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  //get closed survey data
  const {
    data: surveys,
    isLoading,
    isError,
  } = useQuery(
    ["closedSurveys", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-close-survey`,
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

  //handleSurveyDetails function
  const handleSurveyDetails = (surveyId) => {
    navigate(`/organisation/${organisationId}/survey-details/${surveyId}`);
  };

  //handleCloseSurvey function
  const handleCloseSurvey = () => {
    setCloseSurvey(!closeSurvey);
  };

  // Fetch a single survey data
  const fetchSingleSurvey = async (surveyId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-response-survey-surveyId/${surveyId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching survey:", error);
      throw error;
    }
  };

  // Generate Excel function
  const generateExcelForSurvey = (surveys) => {
    if (!surveys || surveys.length === 0) return;

    // Extract title and description from the first survey
    const title = surveys[0].title
    const description = surveys[0].description

    // Extract all questions from the surveys
    const questionSet = new Set();
    surveys.forEach(survey => {
      survey.questions.forEach(q => questionSet.add(q.question));
    });

    const questions = Array.from(questionSet);

    // Create the header rows
    const headers = [
      ["Title", "Description"],
      [title, description],
      [],
      questions
    ];

    // Prepare the data rows
    const data = surveys.map(survey => {
      const row = questions.map(q => {
        const question = survey.questions.find(qn => qn.question === q);
        return question ? question.answer : 'N/A';
      });
      return row;
    });

    // Create worksheet and workbook
    const ws = XLSX.utils.aoa_to_sheet([...headers, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Survey Data");

    // Write to file
    XLSX.writeFile(wb, `${title}.xlsx`);
  };

  // Handle Excel click function
  const handleExcelClick = async (surveyId) => {
    try {
      const survey = await fetchSingleSurvey(surveyId);
      generateExcelForSurvey(survey);
    } catch (error) {
      console.error("Error fetching survey:", error);
    }
  };

  return (
    <div>
      <div className="flex  justify-between  gap-3 w-full border-gray-300 my-2">
        <div className="flex justify-start ">
          <div className="mb-2 md:mb-0 md:mr-4">
            <p className="font-bold">Closed Survey</p>
            <p className="text-sm text-gray-600">
              Here you see closed surveys along with their responses.
            </p>
          </div></div>
        <div className="flex justify-end">
          <AddCircleOutlineIcon
            style={{ width: "40px" }}
            onClick={handleCloseSurvey}
          />
          <Typography variant="p" className="">
            Count: {surveys?.length}
          </Typography>
        </div>
      </div>
      {closeSurvey ? (
        <>
          <div className="border-t-[.5px] border-gray-300"></div>
          {isLoading ? (
            <div className="flex justify-center p-4">
              <CircularProgress />
            </div>
          ) : isError ? (
            <div className="flex justify-center p-4 text-red-500">
              Error fetching data
            </div>
          ) : surveys && surveys?.length > 0 ? (
            <>
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
                      <th scope="col" className="!text-left pl-8 py-3">
                        Status
                      </th>
                      <th scope="col" className="!text-left pl-8 py-3">
                        Generate Excel
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {surveys?.map((survey, index) => (
                      <tr key={index} className="!font-medium border-b ">
                        <td className="!text-left pl-8 py-3">
                          {DOMPurify.sanitize(survey.title, {
                            USE_PROFILES: { html: false },
                          })}
                        </td>
                        <td className="!text-left pl-8 py-3">
                          {survey && format(new Date(survey?.employeeSurveyStartingDate), "PP")}
                        </td>
                        <td className="!text-left pl-8 py-3">
                          {survey && format(new Date(survey?.employeeSurveyEndDate), "PP")}
                        </td>
                        <td className="!text-left pl-8 py-3">
                          <Button
                            variant="outlined"
                            onClick={() => handleSurveyDetails(survey._id)}
                            sx={{ textTransform: "none", width: "auto" }}
                          >
                            View Details
                          </Button>
                        </td>
                        <td className="!text-left pl-8 py-3">
                          <Button
                            variant="outlined"
                            color="warning"
                            onClick={() => handleExcelClick(survey._id)}
                            sx={{ textTransform: "none", width: "auto" }}
                          >
                            Excel
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <section className="py-6  w-full">
              <p>No data available</p>
            </section>
          )}
        </>
      ) : null}
    </div>
  );
};

export default CloseSurveyList;

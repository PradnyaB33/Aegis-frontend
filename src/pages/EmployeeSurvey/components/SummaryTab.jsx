import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { UseContext } from '../../../State/UseState/UseContext';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { Button } from "@mui/material";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const SummaryTab = () => {
  const { surveyId } = useParams();
  const param = useParams();
  const organisationId = param?.organisationId;
  const { cookies } = useContext(UseContext);
  const authToken = cookies['aegis'];

  const { data: surveyData } = useQuery(
    ['surveyResponseSurverId', organisationId, surveyId, authToken],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-response-survey-surveyId/${surveyId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    }
  );

  console.log("surveyDataResponse", surveyData);

  // Filter data based on responseStatus
  const filteredSurveyData = surveyData?.filter(item => item.responseStatus === 'End') || [];

  const employeeCredentialArray = filteredSurveyData.map(item => item?.employeeCredential).filter(credential => credential !== undefined);
  const allTrue = employeeCredentialArray.every(credential => credential === true);

  const PaginatedAnswers = ({ answers, employeeName }) => {
    const [currentPage, setCurrentPage] = useState(0);

    const handleNext = () => {
      if (currentPage < answers.length - 1) {
        setCurrentPage(currentPage + 1);
      }
    };

    const handlePrevious = () => {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    };

    return (
      <div>
        {!allTrue && <div>Employee Name: {employeeName[currentPage]}</div>}
        <div>{answers[currentPage]}</div>
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="outlined" onClick={handlePrevious} disabled={currentPage === 0}>
            Previous
          </Button>
          <Button variant="outlined" onClick={handleNext} disabled={currentPage === answers.length - 1}>
            Next
          </Button>
        </div>
      </div>
    );
  };

  const aggregateAnswers = (responses) => {
    const aggregatedData = {};

    responses.forEach(response => {
      response.questions.forEach(question => {
        if (!aggregatedData[question.questionId]) {
          aggregatedData[question.questionId] = {
            question: question.question,
            type: question.questionType,
            answers: [],
          };
        }

        const answerArray = Array.isArray(question.answer) ? question.answer : [question.answer];
        aggregatedData[question.questionId].answers.push(...answerArray);
      });
    });

    Object.keys(aggregatedData).forEach(questionId => {
      if (aggregatedData[questionId].answers.length === 0) {
        delete aggregatedData[questionId];
      }
    });

    return aggregatedData;
  };

  const renderChart = (question) => {
    const data = question.answers;
    const labels = [...new Set(data)];
    const values = labels.map(label => data.filter(answer => answer === label).length);

    const employeeNames = filteredSurveyData.map(response => {
      const firstName = response.employeeId?.first_name || 'Unknown';
      const lastName = response.employeeId?.last_name || '';
      return `${firstName} ${lastName}`.trim();
    });

    switch (question.type) {
      case 'Checkboxes':
        const barData = {
          labels: labels,
          datasets: [
            {
              label: 'Responses',
              data: values,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
            },
          ],
        };
        return (
          <div style={{ display: 'flex' }}>
            <div className='bg-white h-max shadow-md rounded-sm border items-center p-4 '>
              <div className="p-2 w-auto">
                <Bar data={barData} />
              </div>
            </div>
          </div>
        );

      case 'Dropdown':
      case 'Multi-choice':
        const pieData = {
          labels: labels,
          datasets: [
            {
              label: 'Responses',
              data: values,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
            },
          ],
        };

        return (
          <div style={{ display: 'flex' }}>
            <div className='bg-white shadow-md rounded-sm border items-center p-4'>
              <div className="p-2 w-">
                <Pie data={pieData} />
              </div>
            </div>
          </div>
        );

      case 'Paragraph':
      case 'Short Answer':
      case 'Date':
      default:
        return (
          <div className='bg-white w-full h-max shadow-md rounded-sm border items-center p-4' style={{ padding: "30px" }}>
            <PaginatedAnswers answers={data} employeeName={employeeNames} />
          </div>
        );
    }
  };

  const aggregatedData = filteredSurveyData.length > 0 ? aggregateAnswers(filteredSurveyData) : {};

  return (
    <>
      {filteredSurveyData.length > 0 ?
        <div>
          <div style={{ padding: '20px' }}>
            {Object.keys(aggregatedData).map(questionId => (
              <div key={questionId} style={{ marginBottom: '20px' }}>
                <p className='text-xl py-2'>Q. {aggregatedData[questionId].question}</p>
                {renderChart(aggregatedData[questionId])}
              </div>
            ))}
          </div>
        </div> : <p>No response data available</p>
      }
    </>
  );
};

export default SummaryTab;


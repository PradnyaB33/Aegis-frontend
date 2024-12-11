import React, { useState, useContext } from 'react';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';
import { UseContext } from '../../../State/UseState/UseContext';

const PaginatedAnswers = ({ answers, employeeName }) => {
  console.log("employeeName", employeeName);
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
      {/* <div>Employee Name: {employeeName[currentPage]}</div> */}
      <div>{answers[currentPage]}</div>
      <div className="flex justify-end mt-4 space-x-2">
        <Button variant="outlined" onClick={handlePrevious} disabled={currentPage === 0}>
          Pre
        </Button>
        <Button variant="outlined" onClick={handleNext} disabled={currentPage === answers.length - 1}>
          Next
        </Button>
      </div>
    </div>
  );
};

const QuestionStats = () => {
  const { surveyId } = useParams();
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);

  const param = useParams();
  const organisationId = param?.organisationId;

  const { cookies } = useContext(UseContext);
  const authToken = cookies['aegis'];

  const { data: surveyResponses, isLoading, isError } = useQuery(
    ['surveyResponses', organisationId, surveyId, authToken],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-response-survey-surveyId/${surveyId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response?.data;
    }
  );
  console.log("surveyResponses", surveyResponses);

  const handleOpenPopup = (questionId) => {
    const answers = [];
    const employeeNames = [];
    surveyResponses.forEach((survey) => {
      const question = survey?.questions.find((q) => q?.questionId === questionId);
      if (question && question?.answer !== undefined) {
        answers.push(question?.answer);
        employeeNames.push(survey?.employeeName);
      }
    });

    const selectedQues = surveyResponses.find((survey) =>
      survey?.questions.some((q) => q?.questionId === questionId)
    ).questions.find((question) => question?.questionId === questionId);

    setSelectedQuestion({ ...selectedQues, answers, employeeNames });
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setSelectedQuestion(null);
    setOpenPopup(false);
  };

  const renderDetailedResponses = () => {
    if (!selectedQuestion) {
      return null;
    }

    const { answers, employeeNames, questionType } = selectedQuestion;

    let answerContent = null;

    switch (questionType) {
      case 'Short Answer':
      case 'Paragraph':
      case 'Date':
        answerContent = <PaginatedAnswers answers={answers} employeeName={employeeNames} />;
        break;
      case 'Checkboxes':
      case 'Multi-choice':
        answerContent = (
          <ul>
            {answers.map((ans, index) => (
              <li key={index}>{ans}</li>
            ))}
          </ul>
        );
        break;
      case 'Dropdown':
        answerContent = answers.map((ans, index) => (
          <p key={index}>{ans}</p>
        ));
        break;
      default:
        answerContent = <p>No answer found</p>;
    }

    return <div>{answerContent}</div>;
  };

  const calculateQuestionCounts = (questionId) => {
    if (!surveyResponses) return 0;

    const questionResponses = surveyResponses.filter((survey) => {
      const question = survey?.questions?.find((q) => q?.questionId === questionId);
      return question && question?.answer !== undefined;
    });

    return questionResponses.length;
  };

  const getUniqueQuestionIds = () => {
    if (!surveyResponses) return [];

    const questionIds = new Set();
    surveyResponses.forEach((survey) => {
      survey.questions.forEach((question) => {
        questionIds.add(question.questionId);
      });
    });

    return Array.from(questionIds);
  };

  const questionIds = getUniqueQuestionIds();

  return (
    <div>
      {surveyResponses && surveyResponses.length > 0 ? (
        <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
          {isLoading ? (
            <CircularProgress />
          ) : isError ? (
            <p>Error fetching data</p>
          ) : (
            <table className="min-w-full bg-white text-left !text-sm font-light">
              <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                <tr className="!font-semibold">
                  <th scope="col" className="!text-left pl-8 py-3">
                    Question
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Count
                  </th>
                </tr>
              </thead>
              <tbody>
                {questionIds.map((questionId, index) => {
                  const matchingQuestion = surveyResponses
                    .find((survey) =>
                      survey.questions.some((q) => q.questionId === questionId)
                    )
                    ?.questions.find((q) => q.questionId === questionId);

                  return (
                    <tr key={index} className="!font-medium border-b">
                      <td className="!text-left pl-8 py-3">
                        {matchingQuestion?.question}
                      </td>
                      <td className="py-3 pl-8">
                        <Button
                          variant="outlined"
                          sx={{ textTransform: 'none', width: 'auto' }}
                          onClick={() => handleOpenPopup(questionId)}
                        >
                          {calculateQuestionCounts(questionId)}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <p>No response data available</p>
      )}

      <Dialog open={openPopup} onClose={handleClosePopup} maxWidth="md" fullWidth>
        <DialogTitle>{selectedQuestion?.question}</DialogTitle>
        <DialogContent dividers>{renderDetailedResponses()}</DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default QuestionStats;

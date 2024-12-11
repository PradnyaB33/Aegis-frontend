import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
    CircularProgress,
    FormControlLabel,
    Checkbox,
    Radio,
    RadioGroup,
    FormControl,
    TextField,
    Button
} from "@mui/material";
import { UseContext } from "../../../State/UseState/UseContext";
import DOMPurify from "dompurify";
import { useQuery } from 'react-query';

const IndividualResponse = () => {
    //hooks
    const { surveyId } = useParams();

    //states
    const [currentPage, setCurrentPage] = useState(1);
    const [currentBlock, setCurrentBlock] = useState(1);

    //get authToken
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];

    //get organisationId
    const param = useParams();
    const organisationId = param?.organisationId;

    //get survey response data
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
            return response.data;
        }
    );

    //pagination
    const totalResponses = surveyResponses ? surveyResponses.length : 0;
    const totalPages = Math.ceil(totalResponses);
    const currentSurvey = surveyResponses ? surveyResponses[currentPage - 1] : null;
   
    const pagesPerBlock = 10;
    const totalBlocks = Math.ceil(totalPages / pagesPerBlock);

    const startPage = (currentBlock - 1) * pagesPerBlock + 1;
    const endPage = Math.min(currentBlock * pagesPerBlock, totalPages);
    const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleNextBlock = () => {
        if (currentBlock < totalBlocks) {
            setCurrentBlock(currentBlock + 1);
            setCurrentPage((currentBlock * pagesPerBlock) + 1);
        }
    };

    const handlePreviousBlock = () => {
        if (currentBlock > 1) {
            setCurrentBlock(currentBlock - 1);
            setCurrentPage(((currentBlock - 2) * pagesPerBlock) + 1);
        }
    };

    return (
        <>
            {isLoading ? (
                <CircularProgress />
            ) : isError ? (
                <p>Error fetching data</p>
            ) : (
                surveyResponses && surveyResponses.length > 0 ? (
                    <section className="md:px-8 flex space-x-2 md:py-6 font-family">
                        <article className="w-full rounded-lg bg-white">
                            <div className="w-full md:px-5 px-1">
                                {currentSurvey && (
                                    <div key={currentSurvey._id}>
                                        <div className="w-full mt-4 p-4">
                                            {currentSurvey?.employeeCredential ? null : <div><h3>Employee Name: {currentSurvey?.employeeId?.first_name} {currentSurvey?.employeeId?.last_name}</h3></div>}
                                            <h1 className="text-2xl mb-4 font-bold">
                                                {DOMPurify.sanitize(currentSurvey.title, { USE_PROFILES: { html: false } })}
                                            </h1>
                                            <p className="mb-5">
                                                {DOMPurify.sanitize(currentSurvey?.description, { USE_PROFILES: { html: false } })}
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                                {currentSurvey?.questions.map((q, qIndex) => (
                                                    <div key={q._id}>
                                                        <div>
                                                            <p className="text-xl mb-4">{q.question}</p>
                                                        </div>
                                                        <div>
                                                            {q.questionType === "Short Answer" && (
                                                                <TextField
                                                                    value={q.answer || ""}
                                                                    readOnly
                                                                    fullWidth
                                                                />
                                                            )}
                                                            {q.questionType === "Paragraph" && (
                                                                <TextField
                                                                    value={q.answer || ""}
                                                                    readOnly
                                                                    multiline
                                                                    fullWidth
                                                                />
                                                            )}
                                                            {q.questionType === "Checkboxes" && (
                                                                q.answer.map((answer, optIndex) => (
                                                                    <div key={optIndex} className="flex items-center">
                                                                        <Checkbox checked readOnly />
                                                                        <span className="ml-2">{answer}</span>
                                                                    </div>
                                                                ))
                                                            )}
                                                            {q.questionType === "Dropdown" && (
                                                                <TextField
                                                                    value={q.answer || ""}
                                                                    readOnly
                                                                    fullWidth
                                                                />
                                                            )}
                                                            {q.questionType === "Date" && (
                                                                <TextField
                                                                    value={q.answer || ""}
                                                                    type="date"
                                                                    readOnly
                                                                    fullWidth
                                                                    InputLabelProps={{ shrink: true }}
                                                                />
                                                            )}
                                                            {q.questionType === "Multi-choice" && (
                                                                <FormControl component="fieldset">
                                                                    <RadioGroup value={q.answer || ""} readOnly>
                                                                        {q.answer && (
                                                                            <FormControlLabel
                                                                                value={q.answer}
                                                                                control={<Radio checked />}
                                                                                label={q.answer}
                                                                            />
                                                                        )}
                                                                    </RadioGroup>
                                                                </FormControl>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="flex justify-end mt-4 space-x-2">
                                    {currentBlock > 1 && (
                                        <Button onClick={handlePreviousBlock} variant="contained" sx={{ textTransform: "none" }}>Pre</Button>
                                    )}
                                    {pageNumbers.map(page => (
                                        <Button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            variant={currentPage === page ? "contained" : "outlined"}
                                        >
                                            {page}
                                        </Button>
                                    ))}
                                    {currentBlock < totalBlocks && (
                                        <Button onClick={handleNextBlock} variant="contained" sx={{ textTransform: "none" }}>Next</Button>
                                    )}
                                </div>
                            </div>
                        </article>
                    </section>
                ) : (
                    <p>No response data available</p>
                )
            )}
        </>
    );
};

export default IndividualResponse;


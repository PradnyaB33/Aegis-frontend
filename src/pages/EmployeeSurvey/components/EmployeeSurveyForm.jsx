import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CircularProgress, Button, FormControlLabel, Checkbox, Radio, RadioGroup, FormControl, Select, MenuItem } from "@mui/material";
import { UseContext } from "../../../State/UseState/UseContext";
import UserProfile from "../../../hooks/UserData/useUser";
import DOMPurify from "dompurify";
import { useForm, Controller } from "react-hook-form";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import { useQuery, useMutation } from 'react-query';
import { TestContext } from "../../../State/Function/Main";
import useGetUser from "../../../hooks/Token/useUser";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

const EmployeeSurveyForm = () => {
    //hooks
    const navigate = useNavigate();
    const { handleAlert } = useContext(TestContext);
    const { surveyId, responseId } = useParams();

    //Get Cookies
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const { decodedToken: decoded } = useGetUser();
    console.log("authToken", decoded?.user?.organizationId);

    // Get organizationId
    const { getCurrentUser } = UserProfile();
    const user = getCurrentUser();

    const organisationId = decoded?.user?.organizationId;

    // useForm 
    const { control, handleSubmit, setValue, formState: { errors } } = useForm();

    // Get question Form
    const { data: surveyData, error, isLoading } = useQuery(
        ['survey', organisationId, surveyId, authToken],
        async () => {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-single-open-survey/${surveyId}`,
                // {
                //     headers: {
                //         Authorization: authToken,
                //     },
                // }
            );
            return response.data;
        }
    );

    // Get single survey answer form
    const [singleResponseSurvey, setSingleResponseSurvey] = useState(null);
    console.log("singleResponseSurvey", singleResponseSurvey)
    const { isLoading: isLoading1 } = useQuery(
        ["singleResponseSurvey", organisationId, surveyId, responseId, authToken],
        async () => {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-single-response-survey/${surveyId}/${responseId}`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return response.data;
        },
        {
            enabled: !!surveyId && !!responseId && !!organisationId,
            onSuccess: (data) => {
                setSingleResponseSurvey(data);
                data.questions.forEach((q, index) => {
                    setValue(`answer_${index}`, q.answer);
                });
            },
        }
    );

    // Post Data
    const mutation = useMutation(async (data) => {
        let response;
        if (data.isUpdate) {
            // Update response survey
            response = await axios.put(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/update-employee-survey-response-form/${responseId}`,
                data,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
        } else {
            // Add new response survey
            response = await axios.post(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/add-employee-survey-response-form`,
                data,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
        }
        return response;
    },
        {
            onSuccess: (response) => {
                if (response.status === 201 || response.status === 200) {
                    navigate(`/organisation/${organisationId}/employee-survey`);
                }

                handleAlert(true, "success", "Saved survey response successfully");
            },
            onError: (error) => {
                console.error("Error submitting survey responses:", error);
                if (error?.response?.status === 400) {
                    handleAlert(true, "error", error?.response?.data?.error);
                }
            }
        }
    );

    const onSubmit = (formData, responseStatus, isUpdate) => {
        const data = {
            surveyId: surveyData._id,
            title: surveyData.title,
            description: surveyData.description,
            questions: surveyData.questions.map((q, index) => ({
                questionId: q?._id,
                questionType: q?.questionType,
                question: q?.question,
                answer: q.questionType === "Checkboxes"
                    ? q.options.filter((_, optIndex) => formData[`question_${index}_option_${optIndex}`])
                    : formData[`answer_${index}`],
            })),
            responseStatus: responseStatus,
            employeeId: user._id,
            isUpdate: isUpdate,
            employeeCredential: surveyData?.employeeCredential
        };

        mutation.mutate(data);
    };

    if (isLoading || isLoading1) {
        return <CircularProgress />;
    }

    if (error) {
        return <div>Error fetching survey data</div>;
    }

    const handleClose = () => {
        navigate(`/organisation/${organisationId}/employee-survey`);
    };

    return (
        <BoxComponent sx={{ px: "2%" }}>
            <HeadingOneLineInfo heading="Employee Survey" info="Here you can fill survey" />
            <div className="bg-gray-50 min-h-screen h-auto font-family">
                <section className="md:px-8 flex space-x-2 md:py-6">
                    <article className="w-full rounded-lg bg-white">
                        <div className="w-full md:px-5 px-1">
                            <div className="w-full mt-4 p-4">
                                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(surveyData?.title || '') }}></div>
                                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(surveyData?.description || '') }}></div>
                                <form onSubmit={handleSubmit((data) => onSubmit(data, "End", false))} className="w-full flex flex-1 space-y-2 flex-col">
                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                        {surveyData?.questions.map((q, index) => (
                                            <div key={q._id}>
                                                <div>
                                                    <p className="text-xl mb-4">{q.question}</p>
                                                </div>
                                                <div>
                                                    {q.questionType === "Short Answer" && (
                                                        <AuthInputFiled
                                                            name={`answer_${index}`}
                                                            control={control}
                                                            type="text"
                                                            placeholder="Enter answer*"
                                                            readOnly={false}
                                                            maxLimit={100}
                                                            errors={errors}
                                                            error={errors[`answer_${index}`]}
                                                        />
                                                    )}
                                                    {q.questionType === "Paragraph" && (
                                                        <AuthInputFiled
                                                            name={`answer_${index}`}
                                                            control={control}
                                                            type="textarea"
                                                            placeholder="Enter detailed answer*"
                                                            readOnly={false}
                                                            maxLimit={150}
                                                            errors={errors}
                                                            error={errors[`answer_${index}`]}
                                                        />
                                                    )}
                                                    {q.questionType === "Checkboxes" && (
                                                        q.options.map((option, optIndex) => (
                                                            <div key={optIndex} className="space-y-1 flex items-center">
                                                                <Controller
                                                                    name={`question_${index}_option_${optIndex}`}
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <Checkbox {...field} />
                                                                    )}
                                                                />
                                                                <span className="ml-2">{option}</span>
                                                            </div>
                                                        ))
                                                    )}
                                                    {q.questionType === "Dropdown" && (
                                                        <div className="space-y-1">
                                                            <Controller
                                                                name={`answer_${index}`}
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Select {...field} fullWidth>
                                                                        {q.options.map((option, optIndex) => (
                                                                            <MenuItem key={optIndex} value={option}>
                                                                                {option}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                )}
                                                            /></div>
                                                    )}
                                                    {q.questionType === "Date" && (
                                                        <div className="space-y-1">
                                                            <AuthInputFiled
                                                                name={`answer_${index}`}
                                                                control={control}
                                                                type="date"
                                                                placeholder="dd-mm-yyyy"
                                                                errors={errors}
                                                                error={errors[`answer_${index}`]}
                                                            /></div>
                                                    )}
                                                    {q.questionType === "Multi-choice" && (
                                                        <FormControl component="fieldset">
                                                            <Controller
                                                                name={`answer_${index}`}
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <RadioGroup {...field}>
                                                                        {q.options.map((option, optIndex) => (
                                                                            <FormControlLabel
                                                                                key={optIndex}
                                                                                value={option}
                                                                                control={<Radio />}
                                                                                label={option}
                                                                            />
                                                                        ))}
                                                                    </RadioGroup>
                                                                )}
                                                            />
                                                        </FormControl>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-4 mt-4 justify-end">
                                        {responseId ? <><Button type="button" variant="contained" color="primary" onClick={handleSubmit((data) => onSubmit(data, "End", true))}>
                                            Submit
                                        </Button><Button type="button" variant="outlined" color="primary" onClick={handleSubmit((data) => onSubmit(data, "Complete Survey", true))}>
                                                Save For Now
                                            </Button>
                                        </> :
                                            <>
                                                <Button type="submit" variant="contained" color="primary" className="mt-4" onClick={handleSubmit((data) => onSubmit(data, "End"))}>
                                                    Submit
                                                </Button>
                                                <Button type="button" variant="outlined" color="primary" onClick={handleSubmit((data) => onSubmit(data, "Complete Survey"))}>
                                                    Save For Now
                                                </Button>
                                            </>

                                        }
                                        <Button onClick={handleClose} variant="outlined" color="error">
                                            Close
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </article>
                </section>
            </div>
        </BoxComponent>
    );
};

export default EmployeeSurveyForm;

























import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import {
  Select,
  TextField,
  MenuItem,
  Checkbox,
  Button,
  IconButton,
  FormControlLabel,
  Switch,
  Radio,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import WorkIcon from "@mui/icons-material/Work";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Email } from "@mui/icons-material";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import UserProfile from "../../../hooks/UserData/useUser";
import { UseContext } from "../../../State/UseState/UseContext";
import { TestContext } from "../../../State/Function/Main";
import useCreateEmployeeSurveyState from "../../../hooks/EmployeeSurvey/EmployeeSurvey";
import DOMPurify from "dompurify";
import ClearIcon from "@mui/icons-material/Clear";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BasicButton from "../../../components/BasicButton";

const CreateNewSurvey = ({ isEditable }) => {
  //hooks
  const navigate = useNavigate();
  const { handleAlert } = useContext(TestContext);
  const { id } = useParams();

  //states
  const [org, setOrg] = useState();
  const [questions, setQuestions] = useState([
    { question: "", questionType: "", options: [], required: false },
  ]);
  const [showSelectAll, setShowSelectAll] = useState(false);
  const [questionTypeSelected, setQuestionTypeSelected] = useState(
    Array.from({ length: questions.length }, () => false)
  );
  const [surveyData, setSurveyData] = useState();
  const [employeeCredential, setEmployeeCredential] = useState(false);

  //get organisationId
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const param = useParams();
  const organisationId = param?.organisationId;

  //get authToken
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  //get useCreateEmployeeSurveyState
  const {
    title,
    description,
    employeeSurveyStartingDate,
    employeeSurveyEndDate,
    to,
    from,
    subject,
    body,
  } = useCreateEmployeeSurveyState();

  //EmployeeSurveySchema
  const EmployeeSurveySchema = z.object({
    title: z.string(),
    description: z.string(),
    employeeSurveyStartingDate: z.string(),
    employeeSurveyEndDate: z.string(),
    to: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    ),
  });

  //useForm
  const {
    control,
    formState,
    handleSubmit,
    getValues,
    setValue,
    watch,
    trigger,
  } = useForm({
    defaultValues: {
      title,
      description,
      employeeSurveyStartingDate,
      employeeSurveyEndDate,
      to,
      from,
      subject,
      body,
    },
    resolver: zodResolver(EmployeeSurveySchema),
  });

  const { errors } = formState;

  //Get Organisation Perticular Data
  useEffect(() => {
    (async () => {
      const resp = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/get/${organisationId}`
      );
      setOrg(resp.data.organizations);
    })();
  }, [organisationId]);

  // Fetch single survey data
  const { isLoading } = useQuery(
    ["singleDraftSurvey", id],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-single-draft-survey/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },
    {
      onSuccess: (data) => {
        console.log("data..........", data);

        setSurveyData(data);
        if (data) {
          setValue("title", data?.title);
          setValue("description", data?.description);
          setValue(
            "employeeSurveyStartingDate",
            dayjs(data?.employeeSurveyStartingDate).format("YYYY-MM-DD")
          );
          setValue(
            "employeeSurveyEndDate",
            dayjs(data?.employeeSurveyEndDate).format("YYYY-MM-DD")
          );
          setQuestions(
            data?.questions?.map((q) => ({
              question: q.question,
              questionType: q.questionType,
              options: q.options?.map((opt) => ({
                title: opt,
                checked: false,
              })),
              required: q.required,
            }))
          );

          const transformedToField = data.to.map((option) => ({
            label: option.value,
            value: option.value,
          }));

          setValue("to", transformedToField);
          setEmployeeCredential(data?.employeeCredential)
        }
      },
      enabled: !!id,
    }
  );

  //Add and Update employee survey
  const mutation = useMutation(
    async (formData) => {
      let response;
      if (id) {
        // Update survey
        response = await axios.put(
          `${process.env.REACT_APP_API}/route/organization/${organisationId}/update-employee-survey/${id}`,
          formData,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
      } else {
        // Add new survey
        response = await axios.post(
          `${process.env.REACT_APP_API}/route/organization/${organisationId}/add-employee-survey-form`,
          formData,
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
        handleAlert(true, "success", "Saved employee survey successfully");
      },
      onError: (error) => {
        console.error("Error submitting form", error);
      },
    }
  );

  //handleQuestionTypeChange function
  const handleQuestionTypeChange = (index, event) => {
    const selectedType = event.target.value;
    const newQuestions = [...questions];
    newQuestions[index].questionType = selectedType;
    newQuestions[index].options = [];
    setQuestions(newQuestions);
    const updatedSelected = [...questionTypeSelected];
    updatedSelected[index] = selectedType !== "";
    setQuestionTypeSelected(updatedSelected);
  };

  //handleAddOption function
  const handleAddOption = (index) => {
    const newQuestions = [...questions];
    newQuestions[index].options.push({ title: "", checked: false });
    setQuestions(newQuestions);
  };

  //handleOptionChange function
  const handleOptionChange = (qIndex, oIndex, key, value) => {
    const newQuestions = [...questions];
    if (key === "title") {
      newQuestions[qIndex].options[oIndex].title = value;
    } else if (key === "checked") {
      newQuestions[qIndex].options[oIndex].checked =
        !newQuestions[qIndex].options[oIndex].checked;
    } else if (key === "radio") {
      newQuestions[qIndex].options.forEach((opt, index) => {
        opt.checked = index === oIndex;
      });
    }
    setQuestions(newQuestions);
  };

  //handleRequiredChange function
  const handleRequiredChange = (index) => {
    const newQuestions = [...questions];
    newQuestions[index].required = !newQuestions[index].required;
    setQuestions(newQuestions);
  };

  //handleAddQuestion function
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", questionType: "", options: [], required: false },
    ]);
  };

  //handleRemoveQuestion function
  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, qIndex) => qIndex !== index);
    setQuestions(newQuestions);
  };

  //handleQuestionChange function
  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index].question = event.target.value;
    setQuestions(newQuestions);
  };

  //handleCopyQuestion function
  const handleCopyQuestion = (index) => {
    const newQuestions = [...questions];
    const copiedQuestion = { ...newQuestions[index] };
    newQuestions.splice(index + 1, 0, copiedQuestion);
    setQuestions(newQuestions);
  };

  //handleSuffleQuestion function
  const handleSuffleQuestion = (index) => {
    const newQuestions = [...questions];
    if (index > 0) {
      const shuffledQuestion = newQuestions[index];
      newQuestions.splice(index, 1);
      newQuestions.splice(index - 1, 0, shuffledQuestion);
      setQuestions(newQuestions);
    }
  };

  //get employee in to field
  const { data: employee } = useQuery(
    ["employee", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/${organisationId}/get-emloyee`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.employees;
    }
  );

  const employeeEmail = employee
    ? employee?.map((emp) => ({
      label: emp.email,
      value: emp.email,
    }))
    : [];

  //handleSelectAll function
  const handleSelectAll = async (fieldName) => {
    await setValue(fieldName, employeeEmail);
    await trigger(fieldName);
  };

  //renderAnswerInput function
  const renderAnswerInput = (qIndex) => {
    const { questionType, options } = questions[qIndex];

    const handleRemoveOption = (qIndex, oIndex) => {
      const newQuestions = [...questions];
      newQuestions[qIndex].options.splice(oIndex, 1);
      setQuestions(newQuestions);
    };

    switch (questionType) {
      case "Short Answer":
      case "Paragraph":
        return (
          <TextField
            id="answer-input"
            label={
              questionType === "Short Answer"
                ? "Short-answer text"
                : "Long-answer text"
            }
            placeholder={`Enter ${questionType} Answer`}
            fullWidth
            variant="standard"
            disabled
          />
        );
      case "Checkboxes":
      case "Dropdown":
        return (
          <div>
            {options?.map((option, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                {questionType === "Checkboxes" ? (
                  <Checkbox
                    checked={option.checked}
                    onChange={() =>
                      handleOptionChange(qIndex, index, "checked")
                    }
                    disabled
                  />
                ) : null}
                <TextField
                  value={option.title}
                  onChange={(e) =>
                    handleOptionChange(qIndex, index, "title", e.target.value)
                  }
                  fullWidth
                  style={{ marginLeft: "10px" }}
                  variant="standard"
                  disabled={!isEditable}
                />
                {isEditable && (
                  <IconButton
                    onClick={() => handleRemoveOption(qIndex, index)}
                    aria-label="remove option"
                  >
                    <ClearIcon />
                  </IconButton>
                )}
              </div>
            ))}
            {isEditable && (
              <div className="mt-2">
                <Button
                  onClick={() => handleAddOption(qIndex)}
                  aria-label="add option"
                >
                  Add Options
                </Button>
              </div>
            )}
          </div>
        );
      case "Date":
        return (
          <TextField
            id="date-input"
            label="Select Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            disabled
            sx={{ mt: "20px" }}
          />
        );
      case "Multi-choice":
        return (
          <div>
            {options?.map((option, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <Radio
                  checked={option.checked}
                  onChange={() => handleOptionChange(qIndex, index, "radio")}
                  disabled
                />
                <TextField
                  value={option.title}
                  onChange={(e) =>
                    handleOptionChange(qIndex, index, "title", e.target.value)
                  }
                  fullWidth
                  style={{ marginLeft: "10px" }}
                  variant="standard"
                  disabled={!isEditable}
                />
                {isEditable && (
                  <IconButton
                    onClick={() => handleRemoveOption(qIndex, index)}
                    aria-label="remove option"
                  >
                    <ClearIcon />
                  </IconButton>
                )}
              </div>
            ))}
            {isEditable && (
              <Button
                onClick={() => handleAddOption(qIndex)}
                aria-label="add option"
              >
                Add Options
              </Button>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  //handleSubmitForm
  const handleSubmitForm = (data, status) => {
    const formData = {
      title: data.title,
      description: data.description,
      questions: questions?.map((q) => ({
        question: q.question,
        questionType: q.questionType,
        options: q.options?.map((opt) => opt.title),
        required: q.required,
      })),
      employeeSurveyStartingDate: data.employeeSurveyStartingDate,
      employeeSurveyEndDate: data.employeeSurveyEndDate,
      to: data.to?.map((option) => option),
      creatorId: user?._id,
      status: status,
      from: org?._id,
      employeeCredential: employeeCredential
    };

    mutation.mutate(formData, {
      onError: (error) => {
        console.error("Error submitting form", error);
      },
    });
  };

  //handleClose function
  const handleClose = () => {
    navigate(`/organisation/${organisationId}/employee-survey`);
  };

  //handleSaveForLater function
  const handleSaveForLater = async () => {
    const formData = {
      title: watch("title"),
      description: watch("description"),
      employeeSurveyStartingDate: watch("employeeSurveyStartingDate"),
      employeeSurveyEndDate: watch("employeeSurveyEndDate"),
      // questions: questions?.map((q) => ({
      //   question: q.question,
      //   questionType: q.questionType,
      //   options: q.options?.map((opt) => opt.title),
      //   required: q.required,
      // })),

      questions,
      to: watch("to"),
      responseStatus: false,
      employeeCredential: employeeCredential
    };

    try {
      await mutation.mutateAsync(formData);
    } catch (error) {
      handleAlert(true, "error", error?.response?.data?.message);
    }
  };

  return (
    <BoxComponent>
      <HeadingOneLineInfo
        heading={
          id
            ? isEditable
              ? "Edit Employee Survey"
              : "View Employee Survey"
            : "Create Employee Survey"
        }
        info={
          `Here you can ${id ? (isEditable ? "edit" : "view") : "create"} employee survey form`
        }
      />
      {isLoading ? (
        <div className="flex justify-center p-4">
          <CircularProgress />
        </div>
      ) : (

        <div className="w-full">
          <div className="w-full mt-4 ">
            <form
              onSubmit={handleSubmit((data) =>
                handleSubmitForm(data, true)
              )}
              className="w-full flex flex-col space-y-4"
            >
              {isEditable ? (
                <>
                  <div className="w-full">
                    <AuthInputFiled
                      className="bg-white"
                      name="title"
                      control={control}
                      type="textEditor"
                      placeholder="Title"
                      label="Title*"
                      maxLimit={100}
                      errors={errors}
                      error={errors.title}
                      readOnly={!isEditable}
                    />
                  </div>
                  <div className="w-full">
                    <AuthInputFiled
                      name="description"
                      control={control}
                      type="textEditor"
                      placeholder="Description"
                      label="Description*"
                      maxLimit={1000}
                      errors={errors}
                      error={errors.description}
                      readOnly={!isEditable}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(surveyData?.title || ""),
                    }}
                  ></div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        surveyData?.description || ""
                      ),
                    }}
                  ></div>
                </>
              )}

              {questions?.map((q, index) => (
                <div className="grid grid-cols-1 w-full" key={index}>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: "20px",
                      }}
                    >
                      <label className="font-semibold text-gray-500 text-md">
                        Question {index + 1}
                      </label>
                      <div>
                        <label

                          className=" font-semibold text-gray-500 text-md"
                        >
                          Question Type*
                        </label><br />
                        <Select
                          style={{ width: "200px", height: "42px", backgroundColor: "white" }}
                          labelId={`question-type-label-${index}`}
                          id={`question-type-select-${index}`}
                          value={q.questionType || ""}
                          onChange={(e) =>
                            handleQuestionTypeChange(index, e)
                          }
                          displayEmpty
                          disabled={!isEditable}
                        >
                          <MenuItem value="" disabled>
                            Select Question Type
                          </MenuItem>
                          <MenuItem value="Short Answer">
                            Short Answer
                          </MenuItem>
                          <MenuItem value="Paragraph">Paragraph</MenuItem>
                          <MenuItem value="Checkboxes">Checkboxes</MenuItem>
                          <MenuItem value="Dropdown">Dropdown</MenuItem>
                          <MenuItem value="Date">Date</MenuItem>
                          <MenuItem value="Multi-choice">
                            Multi-choice
                          </MenuItem>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <div>
                        <TextField
                          placeholder="Enter Question"
                          variant="standard"
                          fullWidth
                          value={q.question}
                          onChange={(e) => handleQuestionChange(index, e)}
                          disabled={!isEditable}
                        />
                      </div>
                    </div>
                    {renderAnswerInput(index)}
                    <div className="flex justify-end">
                      {isEditable && (
                        <>
                          {index > 0 && (
                            <IconButton
                              onClick={() => handleSuffleQuestion(index)}
                              aria-label="shuffle question"
                            >
                              <ArrowUpwardIcon />
                            </IconButton>
                          )}
                          <IconButton
                            onClick={() => handleCopyQuestion(index)}
                            aria-label="copy question"
                          >
                            <FileCopyIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleRemoveQuestion(index)}
                            aria-label="remove question"
                          >
                            <DeleteIcon />
                          </IconButton>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={q.required}
                                onChange={() => handleRequiredChange(index)}
                                name={`required-${index}`}
                                color="primary"
                              />
                            }
                            label="Required"
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isEditable && (
                <div className="flex gap-4 mt-4 justify-end">
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={handleAddQuestion}
                  >
                    Add Question
                  </Button>
                </div>
              )}
              <div
                className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                style={{ marginTop: "30px" }}
              >
                <AuthInputFiled
                  name="employeeSurveyStartingDate"
                  icon={WorkIcon}
                  control={control}
                  type="date"
                  placeholder="dd-mm-yyyy"
                  label="Start date*"
                  errors={errors}
                  error={errors.employeeSurveyStartingDate}
                  min={new Date().toISOString().slice(0, 10)}
                  // min={new Date().toISOString().split("T")[0]}
                  disabled={!isEditable}
                />
                <AuthInputFiled
                  name="employeeSurveyEndDate"
                  icon={WorkIcon}
                  control={control}
                  type="date"
                  placeholder="dd-mm-yyyy"
                  label="End date*"
                  errors={errors}
                  error={errors.employeeSurveyEndDate}
                  min={watch("employeeSurveyStartingDate") ? new Date(new Date(watch("employeeSurveyStartingDate")).getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)}
                  disabled={!isEditable}
                />
              </div>
              {isEditable && (
                <div className="space-y-2 ">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={showSelectAll}
                        onChange={(e) => setShowSelectAll(e.target.checked)}
                      />
                    }
                    label="Do you want to select all employee emails?"
                  />
                </div>
              )}

              {showSelectAll && (
                <div className="space-y-2 ">
                  <Button
                    variant="outlined"
                    onClick={() => handleSelectAll("to")}
                  >
                    Select All
                  </Button>
                </div>
              )}

              <div className="space-y-2 ">
                <AuthInputFiled
                  name="to"
                  icon={Email}
                  control={control}
                  type="autocomplete"
                  placeholder="To"
                  label="To*"
                  maxLimit={15}
                  errors={errors}
                  optionlist={employeeEmail ? employeeEmail : []}
                  error={!!errors.to}
                  helperText={errors.to ? errors.to.message : ""}
                  readOnly={!isEditable}
                />
              </div>
              <div>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={employeeCredential}
                      onChange={(e) => setEmployeeCredential(e.target.checked)}
                    />
                  }
                  label="Employee name confidential"
                />
              </div>
              {isEditable && (
                <div className="flex flex-col xs:flex-row gap-4 mt-4 justify-end">
                  <BasicButton type="submit" title={"Submit"} />
                  <BasicButton title={"Save For Now"} type="button" onClick={() => handleSaveForLater(getValues())} variant="outlined" />
                  <BasicButton title="Cancel" onClick={handleClose} variant="outlined" color={"danger"} />
                </div>
              )}
            </form>
          </div>
        </div>
      )}

    </BoxComponent>
  );
};

export default CreateNewSurvey;

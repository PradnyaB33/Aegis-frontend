import React, { useContext, useEffect, useState } from "react";
import useCreateJobPositionState from "../../../hooks/RecruitmentHook/useCreateJobPositionState";
import { z } from "zod";
import { useForm } from "react-hook-form";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import WorkIcon from "@mui/icons-material/Work";
import useEmpOption from "../../../hooks/Employee-OnBoarding/useEmpOption";
import { useParams } from "react-router-dom";
import { MdOutlineWork } from "react-icons/md";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import SchoolIcon from "@mui/icons-material/School";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import axios from "axios";
import { useQuery } from "react-query";
import { UseContext } from "../../../State/UseState/UseContext";
import UserProfile from "../../../hooks/UserData/useUser";
import DOMPurify from "dompurify";

const modeOfWorkingOptions = [
  { label: "Remote", value: "remote" },
  { label: "Hybrid", value: "hybrid" },
  { label: "On-site", value: "on-site" },
];

const jobTypeOptions = [
  { label: "Full time", value: "full_time" },
  { label: "Vendor", value: "vendor" },
  { label: "Contractor", value: "contractor" },
  { label: "Consultant", value: "consultant" },
  { label: "Part time", value: "part_time" },
  { label: "Partial", value: "partial" },
];

const Test2 = ({ isLastStep, nextStep, prevStep }) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const hrId = user?._id;
  const organisationId = useParams("");
  const {
    setStep2Data,
    location,
    date,
    modeOfWorking,
    jobType,
    requiredSkill,
    workingTime,
    age,
    additionalCertificate,

  } = useCreateJobPositionState();
  console.log("additionalCertificate", additionalCertificate);

  const { locationoption } = useEmpOption(organisationId);
  console.log("locationoption", locationoption);
  const JobPositionSchema = z.object({
    location: z.object({
      label: z.string(),
      value: z.string(),
    }),
    date: z.string(),
    modeOfWorking: z.object({ // Match the key exactly
      label: z.string(),
      value: z.string(),
    }),
    jobType: z.object({ // Match the key exactly
      label: z.string(),
      value: z.string(),
    }),
    requiredSkill: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    ),
    age: z.number().optional(),
    workingTime: z.number().optional(),
    additionalCertificate: z.any().optional(),
    education: z
      .string().optional(),
    addQuestions: z.array(
      z.object({
        questionText: z.string().min(1, "Question text is required"),
        questionType: z.string().min(1, "Question type is required"),
        options: z.array(z.string()).optional(), // Optional for multiple-choice questions
        isRequired: z.boolean().default(false), // Optional boolean indicating whether the question is required
      })
    ),
  });



  const { control, formState, handleSubmit, setValue } = useForm({


    defaultValues: {
      location: location || { label: "", value: "" },
      date: date || "",
      modeOfWorking: modeOfWorking || { label: "", value: "" },
      jobType: jobType || { label: "", value: "" },
      requiredSkill: requiredSkill || [],
      workingTime: workingTime || "",
      age: age || "",
      additionalCertificate: additionalCertificate || null,
      education: "",
      termsAndCondition: "",
      addQuestions: [],
    },
    resolver: async (data) => {
      console.log("arrdata before modification:", data);

      // Transform data
      const transformedData = {
        ...data,
        age: Number(data.age), // Ensure `age` is a number
        workingTime: Number(data.workingTime), // Ensure `workingTime` is a number
      };

      try {
        console.log("Validating transformed data:", transformedData); // Check the data passed to Zod
        return { values: JobPositionSchema.parse(transformedData), errors: {} };
      } catch (err) {
        console.error("Validation error:", err.errors); // Log validation errors from Zod
        return {
          values: {},
          errors: err.errors.reduce((acc, error) => {
            acc[error.path[0]] = error.message; // Format errors for `React Hook Form`
            return acc;
          }, {}),
        };
      }
    },

  });
  const { errors } = formState;


  const { data: vacancyData } = useQuery(
    ["JobSpecificVacancy", organisationId?.vacancyId, hrId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId?.organisationId}/manager/hr/${hrId}/vacancies/${organisationId?.vacancyId}`,
        {
          headers: { Authorization: authToken },
        }
      );
      // Return only the data part of the response
      return response?.data?.data;
    },
    {
      // Enable the query only if vacancyId is available
      enabled: Boolean(organisationId?.vacancyId),
      onSuccess: (data) => console.log("Vacancy Data:", data),
      onError: (error) => {
        console.error("Error fetching vacancy:", error);
        // Optionally display an error message to the user
      },
    }
  );
  console.log("getData", vacancyData);

  const [isChecked, setIsChecked] = useState(false);
  console.log("isChecked", isChecked);

  const { data: termsConditionData } = useQuery(
    ["terms-condition"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId?.organisationId}/get-terms-condition`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response?.data?.data || { termsAndCondition: "" }; // Default fallback
    },
    {
      enabled: Boolean(organisationId?.organisationId && authToken), // Conditional fetching
      onError: (error) => {
        const errorMessage = error?.response?.data?.message || "An unexpected error occurred.";
        console.error("Error fetching terms and conditions:", errorMessage);
        alert(errorMessage); // Replace with a toast or Snackbar for better UI
      },
    }
  );

  const handleCheckboxChange = (event) => {
    console.log("Checkbox Value:", event.target.checked); // Debug: Check if event fires
    setIsChecked(event.target.checked); // Update state
  };
  console.log("termsConditionData", termsConditionData);

  // useEffect(() => {
  //   if (vacancyData) {
  //     setValue("age", Number(vacancyData.age) || 0);
  //     setValue("workingTime", Number(vacancyData.workingTime) || 0);
  //   }
  // }, [vacancyData, setValue]);
  // const onSubmit = async (data) => {
  //   console.log("finaldata before modification", data);
  //   const file = data.pdf;
  //   if (file) {
  //     const fileUrl = await uploadVendorDocument(file);
  //     data.pdf = fileUrl; // Assign the uploaded file URL
  //   }
  //   const modifiedData = {
  //     ...data,
  //     age: Number(data.age),
  //     workingTime: Number(data.workingTime),
  //     termsAndCondition: termsConditionData?.termsAndCondition || "",
  //   };

  //   console.log("finaldata after modification", modifiedData);

  //   setStep2Data(modifiedData);
  //   nextStep();
  // };

  const uploadVendorDocument = async (file) => {
    const {
      data: { url },
    } = await axios.get(
      `${process.env.REACT_APP_API}/route/s3createFile/addCertificate`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      }
    );

    await axios.put(url, file, {
      headers: {
        "Content-Type": file.type, // Ensure the correct file type is set
      },
    });

    return url.split("?")[0]; // Return URL without query parameters
  };

  const onSubmit = async (data) => {
    console.log("abcdata", data);

    const file = data.additionalCertificate;
    console.log("xyzfile", file);

    let fileUrl = null;  // Declare fileUrl here to ensure it's accessible in the modifiedData

    if (file) {
      if (file.type !== "application/pdf") {
        alert("Please upload a valid PDF file.");
        return; // Prevent submission if file is not PDF
      }
      try {
        fileUrl = await uploadVendorDocument(file);  // Assign the file URL after successful upload
      } catch (error) {
        console.error("File upload failed:", error);
        alert("File upload failed. Please try again.");
        return;
      }
    }

    const modifiedData = {
      ...data,
      age: Number(data.age),
      workingTime: Number(data.workingTime),
      termsAndCondition: termsConditionData?.termsAndCondition || "",
      additionalCertificate: fileUrl || null, // Assign fileUrl or null if no file was uploaded
    };

    console.log("finaldata after modification", modifiedData);

    setStep2Data(modifiedData);
    nextStep();
  };



  useEffect(() => {
    if (vacancyData) {
      // Set form values
      const locationValue = {
        label: vacancyData?.location?.city, // You can customize the label as per your needs
        value: vacancyData?.location?._id, // Assuming you want to store the _id as the value
      };
      setValue("location", locationValue);

      // Format the date to 'YYYY-MM-DD'
      const formattedDate =
        vacancyData?.date && !isNaN(new Date(vacancyData.date).getTime())
          ? new Date(vacancyData.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];

      console.log("formattedDate", formattedDate);
      setValue("date", formattedDate);

      setValue("modeOfWorking", {
        label: vacancyData.modeOfWorking,
        value: vacancyData.modeOfWorking,
      });
      setValue("jobType", {
        label: vacancyData.jobType,
        value: vacancyData.jobType,
      });
      setValue("workingTime", vacancyData?.workingTime);
      setValue("education", vacancyData.education);
      setValue("age", vacancyData.age);

      // Map requiredSkill if it's an array
      const requiredSkills = vacancyData.requiredSkill?.map(skill => ({
        label: skill.label,
        value: skill?._id,
      })) || [];
      setValue("requiredSkill", requiredSkills);
      setValue("termsAndCondition", termsConditionData?.termsAndCondition)
    }
  }, [vacancyData, setValue, termsConditionData]);


  ///////////////////
  const [questions, setQuestions] = useState([]);

  // Handle adding a new question
  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: "", questionType: "" }]);
  };

  // Handle removing a question
  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  // Handle changing the question text or type
  const handleChangeQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
    setValue("addQuestions", updatedQuestions); // Update react-hook-form
  };


  return (
    <div className="w-full mt-4">
      <h1 className="text-2xl mb-4 font-bold">Additional Info</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex space-y-2 flex-1 flex-col"
      >
        {/* Row 1: Location, Date */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <AuthInputFiled
            name="location"
            control={control}
            type="select"
            placeholder="Select Location"
            label="Select Location*"
            icon={MdOutlineWork}
            options={locationoption}
            errors={errors}
            error={errors.location}
          />
          <AuthInputFiled
            name="date"
            icon={CalendarTodayIcon}
            control={control}
            type="date"
            placeholder="Select Date"
            label="Start Date*"
            errors={errors}
            error={errors.date}
          />
          <AuthInputFiled
            name="modeOfWorking"
            icon={WorkIcon}
            control={control}
            type="select"
            placeholder="Mode of Working"
            label="Mode of Working*"
            errors={errors}
            error={errors.modeOfWorking}
            options={modeOfWorkingOptions}
          />
        </div>

        {/* Row 2: Mode of Working, Job Type */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <AuthInputFiled
            name="jobType"
            icon={WorkIcon}
            control={control}
            type="select"
            placeholder="Job Type"
            label="Job Type*"
            errors={errors}
            error={errors.jobType}
            options={jobTypeOptions}
          />
          <AuthInputFiled
            name="workingTime"
            icon={AccessTimeFilledIcon}
            control={control}
            type="number" // Input type as number
            placeholder="Working Time"
            label="Working Time*"
            errors={errors}
            error={errors.workingTime}
          />
          <AuthInputFiled
            name="education"
            icon={SchoolIcon}
            control={control}
            type="text"
            placeholder="Education"
            label="Education*"
            errors={errors}
            error={errors.education}
          />
          <AuthInputFiled
            name="age"
            icon={SchoolIcon}
            control={control}
            type="number" // Input type as number
            placeholder="Age"
            label="Age*"
            errors={errors}
            error={errors.age}
          />
        </div>
        {/* Row 5: Required Skills, Attachments */}
        <div className="w-full">
          <AuthInputFiled
            name="requiredSkill"
            icon={WorkIcon}
            control={control}
            type="autocomplete"
            placeholder="Required Skills"
            label="Required Skills*"
            errors={errors}
            error={errors.requiredSkill}
          />
          {/* <AuthInputFiled
            name="additionalCertificate"
            icon={AttachFile}
            control={control}
            type="file"
            placeholder="Upload Certificate"
            label="Add Attachments"
            errors={errors}
            error={errors.additionalCertificate}
          /> */}
          <div className="flex-1">
            <label className="block text-gray-700">
              Upload PDF Document *
            </label>
            <input
              type="file"
              accept="application/pdf"  // Change to accept PDF files
              onChange={(e) => {
                if (e.target.files.length > 0) {
                  const file = e.target.files[0];
                  setValue("additionalCertificate", file); // Assuming you're setting the PDF file in the form value
                }
              }}
              className="mt-1 border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-green-500"
            />
          </div>

        </div>
        <div className="w-full">
          <label className="block text-gray-700">Add Questions</label>

          {questions.map((question, index) => (
            <div key={index} className="flex space-x-3 mt-2">
              <input
                type="text"
                placeholder={`Question ${index + 1}`}
                value={question.questionText}
                onChange={(e) => handleChangeQuestion(index, "questionText", e.target.value)}
                className="mt-1 border border-gray-300 rounded-md p-2 w-full"
              />
              <select
                value={question.questionType}
                onChange={(e) => handleChangeQuestion(index, "questionType", e.target.value)}
                className="mt-1 border border-gray-300 rounded-md p-2"
              >
                <option value="">Select Type</option>
                <option value="multiple-choice">Multiple Choice</option>
                <option value="text">Text</option>
              </select>
              <button
                type="button"
                onClick={() => handleRemoveQuestion(index)}
                className="text-red-500 ml-2"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddQuestion}
            className="mt-3 text-blue-500"
          >
            Add Another Question
          </button>
        </div>

        <div>
          {/* Terms and Conditions Checkbox */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Terms and Conditions</span>
          </label>

          {/* Display Terms and Conditions Content Conditionally */}
          {isChecked && (
            <div className="mt-4 p-4 border rounded bg-gray-100">

              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    termsConditionData?.termsAndCondition || "No terms and conditions available."
                  ),
                }}
              ></div>
            </div>
          )}
        </div>
        {/* Navigation Buttons */}
        <div className="flex items-end w-full justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="!w-max flex group justify-center px-6 gap-2 items-center rounded-md py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
          >
            Prev
          </button>
          <button
            type="submit"
            disabled={isLastStep}
            className="!w-max flex group justify-center px-6 gap-2 items-center rounded-md py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default Test2;





















































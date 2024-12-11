import React, { useContext } from "react";
import { UseContext } from "../../../State/UseState/UseContext";
import { TestContext } from "../../../State/Function/Main";
import { useNavigate, useParams } from "react-router-dom";
import useCreateJobPositionState from "../../../hooks/RecruitmentHook/useCreateJobPositionState";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import UserProfile from "../../../hooks/UserData/useUser";
import { CircularProgress, Button, Box } from "@mui/material";
import { useForm } from "react-hook-form";

const Test3 = ({ prevStep }) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { handleAlert } = useContext(TestContext);
  const { organisationId, vacancyId } = useParams();
  const navigate = useNavigate();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const hrId = user?._id;
  const queryClient = useQueryClient();
  const { reset } = useForm();



  const {
    jobPosition,
    department,
    jobDescription,
    experienceRequired,
    vacancies,
    createdBy,
    location,
    date,
    modeOfWorking,
    jobType,
    requiredSkill,
    education,
    additionalCertificate,
    age,
    workingTime,
    termsAndCondition,
    addQuestions
  } = useCreateJobPositionState();
  console.log("department", department);

  // Submit Job Position
  const handleSubmit = useMutation(
    () => {
      const jobPositionData = {
        jobPosition,
        department: department?.value,
        jobDescription: jobDescription,
        experienceRequired,
        vacancies,
        createdBy,
        location: location?.value,
        date,
        modeOfWorking: modeOfWorking?.value,
        jobType: jobType?.value,
        requiredSkill,
        education,
        additionalCertificate,
        age,
        workingTime,
        termsAndCondition,
        addQuestions
      };
      console.log("jobPositionData", jobPositionData);

      if (vacancyId) {
        return axios.patch(

          `${process.env.REACT_APP_API}/route/organization/${organisationId}/hr/${hrId}/vacancy/${vacancyId}`,
          jobPositionData,
          {
            headers: { Authorization: authToken },
          }
        )
      } else {
        return axios.post(

          `${process.env.REACT_APP_API}/route/organization/${organisationId}/hr/${hrId}/hr-create-job-position`,
          jobPositionData,
          {
            headers: { Authorization: authToken },
          }
        )
      };
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["job-position"] });
        handleAlert(true, "success", "Job position added successfully!");
        reset();
        navigate(`/organisation/${organisationId}/created-job-post`);
      },
      onError: (error) => {
        handleAlert(
          true,
          "error",
          error.response?.data?.message || "An error occurred while creating the job position."
        );
      },
    }
  );

  // Save for Later
  const saveForLater = useMutation(
    () => {
      const jobPositionData = {
        jobPosition,
        department: department?.value,
        jobDescription: jobDescription,
        experienceRequired,
        vacancies,
        createdBy,
        location: location?.value,
        date,
        modeOfWorking: modeOfWorking?.value,
        jobType: jobType?.value,
        requiredSkill,
        education,
        // additionalCertificate,
        age,
        workingTime,
        termsAndCondition
      };

      return axios.post(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/updated-HR/${hrId}/vacancy/${vacancyId}`,
        jobPositionData,
        {
          headers: { Authorization: authToken },
        }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["job-position"] });
        handleAlert(true, "success", "Job position saved successfully!");
        navigate(`/organisation/${organisationId}/created-job-post`);
      },
      onError: () => {
        handleAlert(true, "error", "An error occurred while saving the job position.");
      },
    }
  );

  return (
    <>
      {handleSubmit.isLoading && (
        <div className="flex items-center justify-center fixed inset-0 bg-black/20">
          <CircularProgress />
        </div>
      )}

      <div className="w-full mt-4">
        <h1 className="text-2xl mb-4 font-bold">Confirm Details</h1>

        <div className="">
          {/* Job Details */}
          <h1 className="text-lg bg-gray-200 px-4 py-2 w-full my-2">Job Details</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <DetailField label="Job Position" value={jobPosition} />
            <DetailField label="Department" value={department?.label} />

            <DetailField label="Experience" value={experienceRequired} />
            <DetailField label="Vacancies" value={vacancies} />
            <DetailField label="Hiring Manager" value={createdBy} />
            <Box sx={{ height: "100px", overflowY: "auto" }}>
              <DetailField label="Job Description" value={jobDescription} />
            </Box>
          </div>

          {/* Additional Info */}
          <h1 className="text-lg bg-gray-200 px-4 py-2 w-full my-2">Additional Info</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <DetailField label="Location" value={location?.label} />
            <DetailField label="Start Date" value={date} />
            <DetailField label="Mode of Working" value={modeOfWorking?.label} />
            <DetailField label="Job Type" value={jobType?.label} />
            <DetailField label="Required Skills" value={requiredSkill?.map((skill) => skill.label).join(", ")} />
            <DetailField label="Education" value={education} />
            <DetailField label="Age Limit" value={age} />
            <DetailField label="Working Time" value={workingTime} />
            <DetailField label="Additional Certificates" value={additionalCertificate?.name || "N/A"} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4">
          <Button onClick={prevStep} variant="outlined" color="primary">
            Prev
          </Button>
          <div className="flex gap-4">
            <Button
              onClick={() => saveForLater.mutate()}
              variant="outlined"
              color="primary"
            >
              Save for Later
            </Button>
            <Button
              onClick={() => handleSubmit.mutate()}
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

// Helper Component for Repeated Fields
const DetailField = ({ label, value }) => (
  <div>
    <h1 className="text-gray-500 text-sm">{label}</h1>
    <p>{value || "N/A"}</p>
  </div>
);

export default Test3;

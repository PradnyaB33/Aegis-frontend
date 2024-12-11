import React, { useContext } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useCreateJobPositionState from "../../../hooks/RecruitmentHook/useCreateJobPositionState";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import WorkIcon from "@mui/icons-material/Work";
import { useParams } from "react-router-dom";
import useEmpOption from "../../../hooks/Employee-OnBoarding/useEmpOption";
import { useQuery } from "react-query";
import axios from "axios";
import { UseContext } from "../../../State/UseState/UseContext";
import { CircularProgress } from "@mui/material";

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

const jobLevelOptions = [
  { label: "Fresher", value: "fresher" },
  { label: "Junior", value: "junior" },
  { label: "Engineer", value: "engineer" },
  { label: "Consultant", value: "consultant" },
  { label: "Senior Engineer", value: "senior_engineer" },
  { label: "Management", value: "management" },
  { label: "Mid Management", value: "mid_management" },
  { label: "Senior Management", value: "senior_management" },
  { label: "Executive", value: "executive" },
  { label: "Chief Officer", value: "chief_officer" },
];

const EditTest1 = ({ nextStep, isLastStep }) => {
  const { jobPositionId, organisationId } = useParams();
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  console.log({ jobPositionId, organisationId });

  const {
    setStep1Data,
    position_name,
    department_name,
    location_name,
    date,
    job_type,
    mode_of_working,
    job_level,
    job_description,
    role_and_responsibility,
  } = useCreateJobPositionState();

  const { Departmentoptions, locationoption } = useEmpOption(organisationId);

  const JobPositionSchema = z.object({
    position_name: z
      .string()
      .min(2, { message: "Minimum two characters required" })
      .max(50),
    department_name: z.object({
      label: z.string(),
      value: z.string(),
    }),
    location_name: z.object({
      label: z.string(),
      value: z.string(),
    }),
    date: z.string(),
    mode_of_working: z.object({
      label: z.string(),
      value: z.string(),
    }),
    job_type: z.object({
      label: z.string(),
      value: z.string(),
    }),
    job_level: z.object({
      label: z.string(),
      value: z.string(),
    }),
    job_description: z.string(),
    role_and_responsibility: z.string(),
  });

  const { control, formState, handleSubmit, getValues, setValue } = useForm({
    defaultValues: {
      position_name,
      department_name,
      location_name,
      date,
      mode_of_working,
      job_type,
      job_level,
      job_description,
      role_and_responsibility,
    },
    resolver: zodResolver(JobPositionSchema),
  });
  const { errors } = formState;

  const { isFetching } = useQuery(
    ["jjob-position", jobPositionId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/${jobPositionId}/get-job-position`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    },
    {
      onSuccess: (data) => {
        console.log("data", data);
        if (data) {
          setValue("position_name", data?.position_name || "");
          setValue("department_name", {
            label: data?.department_name?.departmentName,
            value: data?.department_name._id,
          });
          setValue("location_name", {
            label: data?.location_name?.city,
            value: data?.location_name?._id,
          });
          setValue("job_level", {
            label: data?.job_level?.label,
            value: data?.job_level?.value,
          });
          setValue("mode_of_working", {
            label: data?.mode_of_working?.label,
            value: data?.mode_of_working?.value,
          });
          setValue("job_type", {
            label: data?.job_type?.label,
            value: data?.job_type?.value,
          });
          setValue("job_description", data?.job_description || "");
          setValue(
            "role_and_responsibility",
            data?.role_and_responsibility || ""
          );
          setValue(
            "date",
            new Date(data?.date).toISOString().split("T")[0] || ""
          );
        }
      },
    }
  );

  const onSubmit = async (data) => {
    console.log("🚀 ~ data:", data);
    console.log(getValues());
    setStep1Data(data);
    nextStep();
  };

  return (
    <div className="w-full mt-4 px-2 sm:px-4 lg:px-6">
      <h1 className="text-xl mb-4 font-bold">Job Details</h1>
      {isFetching ? (
        <CircularProgress />
      ) : (
        <>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col space-y-4"
          >
            <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-3">
              <AuthInputFiled
                name="position_name"
                icon={WorkIcon}
                control={control}
                type="text"
                placeholder="Position Name"
                label="Position Name*"
                errors={errors}
                error={errors.position_name}
              />
              <AuthInputFiled
                name="department_name"
                icon={WorkIcon}
                control={control}
                type="select"
                placeholder="Select Department"
                label="Select Department*"
                errors={errors}
                error={errors.department_name}
                options={Departmentoptions}
              />
              <AuthInputFiled
                name="location_name"
                icon={WorkIcon}
                control={control}
                type="select"
                placeholder="Select Location"
                label="Select Location*"
                errors={errors}
                error={errors.location_name}
                options={locationoption}
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <AuthInputFiled
                name="job_level"
                icon={WorkIcon}
                control={control}
                type="select"
                placeholder="Job Level"
                label="Job Level*"
                errors={errors}
                error={errors.job_level}
                options={jobLevelOptions}
              />
              <AuthInputFiled
                name="date"
                icon={WorkIcon}
                control={control}
                type="date"
                placeholder="dd-mm-yyyy"
                label="Date*"
                errors={errors}
                error={errors.date}
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <AuthInputFiled
                name="mode_of_working"
                icon={WorkIcon}
                control={control}
                type="select"
                placeholder="Mode of Working"
                label="Mode of Working*"
                errors={errors}
                error={errors.mode_of_working}
                options={modeOfWorkingOptions}
              />
              <AuthInputFiled
                name="job_type"
                icon={WorkIcon}
                control={control}
                type="select"
                placeholder="Select Job Type"
                label="Select Job Type*"
                errors={errors}
                error={errors.job_type}
                options={jobTypeOptions}
              />
            </div>
            <div className="w-full">
              <AuthInputFiled
                name="job_description"
                icon={WorkIcon}
                control={control}
                type="texteditor"
                placeholder="Job Description"
                label="Job Description"
                errors={errors}
                error={errors.job_description}
              />
            </div>
            <div className="w-full">
              <AuthInputFiled
                name="role_and_responsibility"
                icon={WorkIcon}
                control={control}
                type="texteditor"
                placeholder="Roles and Responsibility"
                label="Roles and Responsibility"
                errors={errors}
                error={errors.role_and_responsibility}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLastStep}
                className="w-full sm:w-auto flex justify-center px-4 py-2 rounded-md text-md font-semibold text-white bg-blue-500 hover:bg-blue-700 focus:outline-none"
              >
                Next
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default EditTest1;

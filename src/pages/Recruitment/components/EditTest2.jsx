import React, { useContext } from "react";
import useCreateJobPositionState from "../../../hooks/RecruitmentHook/useCreateJobPositionState";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import WorkIcon from "@mui/icons-material/Work";
import useEmpOption from "../../../hooks/Employee-OnBoarding/useEmpOption";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import { UseContext } from "../../../State/UseState/UseContext";
import { CircularProgress } from "@mui/material";

const EditTest2 = ({ isLastStep, nextStep, prevStep }) => {
  const { jobPositionId, organisationId } = useParams();
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const {
    setStep2Data,
    required_skill,
    hiring_manager,
    hiring_hr,
    education,
    experience_level,
    age_requirement,
    working_time,
  } = useCreateJobPositionState();
  const { onBoardManageroptions, HrOptions } = useEmpOption(organisationId);

  const JobPositionSchema = z.object({
    required_skill: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    ),
    hiring_manager: z
      .object({
        label: z.string().optional(),
        value: z.string().optional(),
      })
      .optional()
      .nullable(),
    hiring_hr: z.object({
      label: z.string(),
      value: z.string(),
    }),
    education: z
      .string()
      .min(2, { message: "Minimum two characters required" })
      .max(1500),
    experience_level: z
      .string()
      .min(2, { message: "Minimum two characters required" })
      .max(1500),
    age_requirement: z.union([z.string(), z.number()]).optional(),
    working_time: z.union([z.string(), z.number()]).optional(),
  });

  const { control, formState, handleSubmit, setValue } = useForm({
    defaultValues: {
      required_skill: required_skill,
      hiring_manager: hiring_manager,
      hiring_hr: hiring_hr,
      education: education,
      experience_level: experience_level,
      age_requirement: age_requirement,
      working_time: working_time,
    },
    resolver: zodResolver(JobPositionSchema),
  });
  const { errors } = formState;

  const { isFetching } = useQuery(
    ["job-position", jobPositionId],
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
          setValue("hiring_manager", {
            label: data?.hiring_manager?.first_name,
            value: data?.hiring_manager._id,
          });
          setValue("hiring_hr", {
            label: data?.hiring_hr?.first_name,
            value: data?.hiring_hr._id,
          });
          setValue("age_requirement", data?.age_requirement || "");
          setValue("education", data?.education || "");
          setValue("experience_level", data?.experience_level || "");
          setValue("working_time", data?.working_time || "");
          if (data?.required_skill && data?.required_skill.length > 0) {
            const formattedSkills = data.required_skill.map((skill) => ({
              label: skill.label,
              value: skill.value,
            }));
            setValue("required_skill", formattedSkills);
          } else {
            setValue("required_skill", []);
          }
        }
      },
    }
  );

  const onsubmit = (data) => {
    console.log(data);
    setStep2Data(data);
    nextStep();
  };

  return (
    <div className="w-full mt-4">
      <h1 className="text-2xl mb-4 font-bold">Additional Info</h1>
      {isFetching ? (
        <CircularProgress />
      ) : (
        <>
          <form
            onSubmit={handleSubmit(onsubmit)}
            className="w-full flex space-y-2 flex-1 flex-col"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <AuthInputFiled
                name="hiring_manager"
                value={hiring_manager}
                icon={WorkIcon}
                control={control}
                type="select"
                placeholder="Hiring Manager"
                label="Hiring Manager"
                errors={errors}
                error={errors.hiring_manager}
                options={onBoardManageroptions}
              />
              <AuthInputFiled
                name="hiring_hr"
                value={hiring_hr}
                icon={WorkIcon}
                control={control}
                type="select"
                placeholder="Hiring Hr"
                label="Hiring Hr*"
                errors={errors}
                error={errors.hiring_hr}
                options={HrOptions}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <AuthInputFiled
                name="age_requirement"
                icon={WorkIcon}
                control={control}
                type="number"
                placeholder="Age Requirement"
                label="Age Requirement"
                errors={errors}
                error={errors.age_requirement}
              />
              <AuthInputFiled
                name="working_time"
                icon={WorkIcon}
                control={control}
                type="number"
                placeholder="Working Time"
                label="Working Time"
                errors={errors}
                error={errors.working_time}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <AuthInputFiled
                name="education"
                icon={WorkIcon}
                control={control}
                type="text"
                placeholder="Education"
                label="Education*"
                errors={errors}
                error={errors.education}
              />
              <AuthInputFiled
                name="experience_level"
                icon={WorkIcon}
                control={control}
                type="text"
                placeholder="Experience Level"
                label="Experience Level*"
                errors={errors}
                error={errors.experience_level}
              />
            </div>

            <div className="w-full">
              <AuthInputFiled
                name="required_skill"
                icon={WorkIcon}
                control={control}
                type="autocomplete"
                placeholder="Required Skills"
                label="Required Skills *"
                errors={errors}
                error={errors.required_skill}
              />
            </div>

            <div className="flex items-end w-full justify-between">
              <button
                type="button"
                onClick={() => {
                  prevStep();
                }}
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
        </>
      )}
    </div>
  );
};

export default EditTest2;

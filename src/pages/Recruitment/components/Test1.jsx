import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import useCreateJobPositionState from "../../../hooks/RecruitmentHook/useCreateJobPositionState";
import useEmpOption from "../../../hooks/Employee-OnBoarding/useEmpOption";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import { Grid } from "@mui/material";
import { Work, Description, People } from "@mui/icons-material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import BasicButton from "../../../components/BasicButton";
import UserProfile from "../../../hooks/UserData/useUser";
import axios from "axios";
import { useQuery } from "react-query";
import useGetUser from "../../../hooks/Token/useUser";

const experienceOptions = [
  { label: "0-2 Years", value: "0-2 Years" },
  { label: "2-4 Years", value: "2-4 Years" },
  { label: "4-6 Years", value: "4-6 Years" },
  { label: "6-8 Years", value: "6-8 Years" },
  { label: "8+ Years", value: "8+ Years" },
];

const Test1 = ({ nextStep, isLastStep }) => {
  const organisationId = useParams("");



  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const hrId = user?._id;

  const { authToken } = useGetUser();

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

  console.log("vacancyData", vacancyData);



  const {
    setStep1Data,
    jobPosition,
    department,
    jobDescription,
    experienceRequired,
    vacancies,
    createdBy,
  } = useCreateJobPositionState();

  const { Departmentoptions, onBoardManageroptions } = useEmpOption(organisationId);

  // Form Schema
  const JobPositionSchema = z.object({
    jobPosition: z.string().min(1, "Job position is required"),
    department: z.object({ label: z.string(), value: z.string() }).refine(
      (data) => !!data.value,
      "Department selection is required"
    ),
    experienceRequired: z.object({
      label: z.string(),
      value: z.string(),
    }),
    jobDescription: z.string().min(1, "Description is required"),
    vacancies: z
      .number()
      .min(1, "There should be at least 1 vacancy")
      .max(100, "Vacancies cannot exceed 100")
      .or(z.string().regex(/^\d+$/, "Vacancies must be a number")),
    createdBy: z.object({ label: z.string(), value: z.string() }).refine(
      (data) => !!data.value,
      "Hiring Manager selection is required"
    ),
  });

  const { control, formState, handleSubmit, setValue } = useForm({
    defaultValues: {
      jobPosition: jobPosition || "",
      department: department || undefined,
      experienceRequired: experienceRequired || undefined,
      jobDescription: jobDescription || "",
      vacancies: vacancies || "",
      createdBy: createdBy || undefined,
    },
    resolver: zodResolver(JobPositionSchema),
  });

  const { errors } = formState;

  const onSubmit = async (data) => {

    // console.log(getValues());
    setStep1Data(data);
    console.log("final data", data);
    nextStep();
  };

  useEffect(() => {
    if (vacancyData) {
      console.log("Setting form values:", vacancyData);

      setValue("jobPosition", vacancyData.jobPosition);
      setValue("department", {
        label: vacancyData.department?.departmentName,
        value: vacancyData.department?._id,
      });
      setValue("experienceRequired", {
        label: vacancyData.experienceRequired,
        value: vacancyData.experienceRequired,
      });
      setValue("jobDescription", vacancyData.jobDescription);
      setValue("vacancies", vacancyData.vacancies);
      setValue("createdBy", {
        label: `${vacancyData.createdBy
          ?.first_name} ${vacancyData.createdBy?.last_name}`, // Combine first_name and last_name
        value: vacancyData.createdBy?._id,
      });
    }
  }, [vacancyData, setValue]);

  return (
    <div className="w-full mt-4">
      <h1 className="text-xl mb-4 font-bold">Job Details</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col space-y-4"
      >
        <Grid container >
          <Grid item xs={12} md={4} sx={{ pr: 2 }}>
            <AuthInputFiled
              name="jobPosition"
              icon={Work}
              control={control}
              type="text"
              placeholder="Job Position"
              label="Job Position*"
              errors={errors}
              error={errors.jobPosition}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ pr: 2 }}>
            <AuthInputFiled
              name="department"
              icon={ApartmentIcon}
              control={control}
              type="select"
              placeholder="Select Department"
              label="Department*"
              options={Departmentoptions}
              errors={errors}
              error={errors.department?.message}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ pr: 2 }}>
            <AuthInputFiled
              name="experienceRequired"
              icon={Work}
              control={control}
              type="select"
              placeholder="Experience"
              label="Experience Required*"
              options={experienceOptions}
              errors={errors}
              error={errors.experienceRequired}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ pr: 2 }}>
            <AuthInputFiled
              name="vacancies"
              icon={Work}
              control={control}
              type="number"
              placeholder="Number of Vacancies"
              label="Vacancies *"
              readOnly={false}
              errors={errors}
              error={errors.vacancies}
              min={0}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ pr: 2 }}>
            <AuthInputFiled
              name="createdBy"
              icon={People}
              control={control}
              type="select"
              placeholder="Select Hiring Manager"
              label="Hiring Manager*"
              options={onBoardManageroptions}
              errors={errors}
              error={errors.createdBy?.message}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <AuthInputFiled
              name="jobDescription"
              icon={Description}
              control={control}
              type="textarea"
              placeholder="Job Description"
              label="Job Description*"
              errors={errors}
              error={errors.jobDescription}
            />
          </Grid>
        </Grid>
        <div className="flex justify-end">
          <BasicButton title="Next" type="submit"
            disabled={isLastStep} />

        </div>
      </form>
    </div>
  );
};

export default Test1;






























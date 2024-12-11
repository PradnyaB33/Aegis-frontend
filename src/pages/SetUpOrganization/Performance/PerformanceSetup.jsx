import { zodResolver } from "@hookform/resolvers/zod";
import { AccessTime, ListAlt, Star, TrendingUp } from "@mui/icons-material";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useAuthToken from "../../../hooks/Token/useAuth";
import Setup from "../Setup";

const PerformanceSetup = () => {
  const { organisationId } = useParams();
  const authToken = useAuthToken();
  const { handleAlert } = useContext(TestContext);
  const PerformanceSchema = z.object({
    appraisalStartDate: z.object({
      startDate: z.date(),
      endDate: z.date(),
    }),
    appraisalEndDate: z.object({
      startDate: z.date(),
      endDate: z.date(),
    }),
    startdate: z.object({
      startDate: z.date(),
      endDate: z.date(),
    }),
    enddate: z.object({
      startDate: z.date(),
      endDate: z.date(),
    }),
    stages: z.object({
      label: z.string(),
      value: z.string(),
    }),
    goals: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    ),
    ratings: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    ),
    isDownCast: z.boolean().optional(),
    isFeedback: z.boolean().optional(),
    // isNonMeasurableAllowed: z.boolean().optional(),
    isManagerApproval: z.boolean().optional(),
    isMidGoal: z.boolean().optional(),
    // isSendFormInMid: z.boolean().optional(),
    // deleteFormEmployeeOnBoarding: z.boolean().optional(),
    // isKRA: z.boolean().optional(),
    isSelfGoal: z.boolean().optional(),
  });

  const { data: performance, isFetching } = useQuery(
    "performancePeriod",
    async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/route/performance/getSetup/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      return data;
    }
  );

  const {
    formState: { errors },
    control,
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(PerformanceSchema),
    defaultValues: {
      stages: undefined,
      isDownCast: false,
      isFeedback: false,
      isNonMeasurableAllowed: false,
      isManagerApproval: false,
      isMidGoal: false,
      // // isSendFormInMid: false,
      // deleteFormEmployeeOnBoarding: false,
      // isKRA: false,
      isSelfGoal: false,
    },
  });

  useEffect(() => {
    if (performance) {
      // setValue(
      //   "deleteFormEmployeeOnBoarding",
      //   performance.deleteFormEmployeeOnBoarding
      // );
      setValue("enddate", {
        startDate: performance.enddate,
        endDate: performance.enddate,
      });
      setValue("startdate", {
        startDate: new Date(performance?.startdate),
        endDate: new Date(performance.startdate),
      });
      setValue("appraisalStartDate", {
        startDate: new Date(performance.appraisalStartDate),
        endDate: new Date(performance.appraisalStartDate),
      });
      setValue("appraisalEndDate", {
        startDate: new Date(performance.appraisalEndDate),
        endDate: new Date(performance.appraisalEndDate),
      });
      setValue(
        "goals",
        performance.goals.map((goalType) => ({
          label: goalType,
          value: goalType,
        }))
      );
      setValue("isDownCast", performance.isDownCast);
      setValue("isFeedback", performance.isFeedback);
      // setValue("isKRA", performance.isKRA);
      setValue("isManagerApproval", performance.isManagerApproval);
      setValue("isMidGoal", performance.isMidGoal);
      setValue("isNonMeasurableAllowed", performance.isNonMeasurableAllowed);
      setValue("isSelfGoal", performance.isSelfGoal);
      // setValue("isSendFormInMid", performance.isSendFormInMid);
      setValue("organizationId", performance.organizationId);
      setValue("stages", {
        label: performance.stages,
        value: performance.stages,
      });

      setValue(
        "ratings",
        performance.ratings.map((rating) => ({
          label: rating,
          value: rating,
        }))
      );
    }
    // eslint-disable-next-line
  }, [isFetching]);

  let stagesOptions = [
    {
      value: "Goal setting",
      label: "Goal setting",
    },
    {
      value: "Monitoring stage/Feedback collection stage",
      label: "Monitoring stage/Feedback collection stage",
    },
    {
      value: "KRA stage/Ratings Feedback/Manager review stage",
      label: "KRA stage/Ratings Feedback/Manager review stage",
    },
    // {
    //   value: "Feedback collection stage",
    //   label: "Feedback collection stage",
    // },
    // {
    //   value: "Ratings Feedback/Manager review stage",
    //   label: "Ratings Feedback/Manager review stage",
    // },
    {
      value: "Employee acceptance/acknowledgement stage",
      label: "Employee acceptance/acknowledgement stage",
    },
  ];
  let goalsOptions = [
    {
      value: "Organizational Goals",
      label: "Organizational Goals",
    },
    {
      value: "Departmental Goals",
      label: "Departmental Goals",
    },
    {
      value: "Development Goal",
      label: "Development Goal",
    },
    {
      value: "Carrier Goals",
      label: "Carrier Goals",
    },
    {
      value: "Self Goals",
      label: "Self Goals",
    },
    {
      value: "Managerial Goals",
      label: "Managerial Goals",
    },
    {
      value: "Training Goals",
      label: "Training Goals",
    },
    {
      value: "Behavioral Goals",
      label: "Behavioral Goals",
    },
  ];

  const performanceSetup = useMutation(
    async (data) => {
      console.log(data.goalType);
      const performanceSetting = {
        ...data,
        startdate: data.startdate.startDate,
        enddate: data.enddate.endDate,
        appraisalStartDate: data.appraisalStartDate.startDate,
        appraisalEndDate: data.appraisalEndDate.startDate,
        goals: data.goals.map((goalType) => goalType.value),
        stages: data.stages.value,
        ratings: data.ratings.map((rating) => rating.value),
      };
      await axios.post(
        `${process.env.REACT_APP_API}/route/performance/createSetup/${organisationId}`,
        { performanceSetting },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
    },
    {
      onSuccess: () => {
        handleAlert(true, "success", "Performance setup created successfully");
      },
    }
  );

  const onSubmit = async (data) => {
    performanceSetup.mutate(data);
  };

  return (
    <BoxComponent sx={{ p: 0 }}>
      <Setup>
        <div className="h-[90vh] overflow-y-auto scroll px-3">
          <div className="xs:block sm:block md:flex justify-between items-center ">
            <HeadingOneLineInfo
              className="!my-3"
              heading="Performance"
              info="Setup performance settings for your organization"
            />
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <AuthInputFiled
                name="appraisalStartDate"
                icon={AccessTime}
                control={control}
                type="calender"
                label="Enter Appraisal Cycle Start Date *"
                errors={errors}
                error={errors.appraisalStartDate}
              />
              <AuthInputFiled
                name="appraisalEndDate"
                min={watch("appraisalStartDate")?.startDate}
                icon={AccessTime}
                control={control}
                type="calender"
                label="Enter Appraisal Cycle End Date *"
                errors={errors}
                error={errors.appraisalEndDate}
              />
            </div>

            <AuthInputFiled
              name="goals"
              icon={TrendingUp}
              control={control}
              type="autocomplete"
              options={goalsOptions}
              optionlist={goalsOptions}
              placeholder="Goals"
              label="Select Goal Type *"
              errors={errors}
              error={errors.goals}
            />

            <AuthInputFiled
              name="stages"
              icon={ListAlt}
              control={control}
              options={stagesOptions}
              type="select"
              placeholder="Stages"
              label="Select Stage *"
              errors={errors}
              error={errors.stages}
            />

            <div className="grid grid-cols-2 gap-4">
              <AuthInputFiled
                name="startdate"
                icon={AccessTime}
                control={control}
                type="calender"
                label="Enter Start Date *"
                errors={errors}
                error={errors.startdate}
              />
              <AuthInputFiled
                name="enddate"
                min={watch("startdate")?.startDate}
                icon={AccessTime}
                control={control}
                type="calender"
                label="Enter End Date *"
                errors={errors}
                error={errors.enddate}
              />
            </div>

            <AuthInputFiled
              name="ratings"
              icon={Star}
              control={control}
              type="autocomplete"
              optionlist={[]}
              options={goalsOptions}
              placeholder="Ex. 1"
              label="Enter Ratings Type *"
              errors={errors}
              error={errors.ratings}
            />

            <div className="grid grid-cols-2 gap-4">
              <AuthInputFiled
                name="isDownCast"
                icon={TrendingUp}
                control={control}
                type="checkbox"
                placeholder="Goals"
                label="Goals downcast downword "
                errors={errors}
                error={errors.isDownCast}
              />
              <AuthInputFiled
                name="isFeedback"
                icon={TrendingUp}
                control={control}
                type="checkbox"
                placeholder="Goals"
                label="360 feedback allowed"
                errors={errors}
                error={errors.isFeedback}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* <AuthInputFiled
                    name="isNonMeasurableAllowed"
                    icon={TrendingUp}
                    control={control}
                    type="checkbox"
                    placeholder="Goals"
                    label="Non-mesurable target can be added *"
                    errors={errors}
                    error={errors.isNonMeasurableAllowed}
                  /> */}
              <AuthInputFiled
                name="isManagerApproval"
                icon={TrendingUp}
                control={control}
                type="checkbox"
                placeholder="Goals"
                label="Manager approval on self added goals"
                errors={errors}
                error={errors.isManagerApproval}
              />

              <AuthInputFiled
                name="isMidGoal"
                icon={TrendingUp}
                control={control}
                type="checkbox"
                placeholder="Goals"
                label="Addition of goals mid of cycle stage"
                errors={errors}
                error={errors.isMidGoal}
              />
            </div>
            {/* 
                <div className="grid grid-cols-2 gap-4">
                  {" "}
                  <AuthInputFiled
                    name="isSendFormInMid"
                    icon={TrendingUp}
                    control={control}
                    type="checkbox"
                    placeholder="Goals"
                    label="Send the form to employee middle of cycle stage"
                    errors={errors}
                    error={errors.isSendFormInMid}
                  />
                </div> */}
            <div className="grid grid-cols-2 gap-4">
              {/* <AuthInputFiled
                    name="deleteFormEmployeeOnBoarding"
                    icon={TrendingUp}
                    control={control}
                    type="checkbox"
                    placeholder="Goals"
                    label="Delete the form when employee offboarded"
                    errors={errors}
                    error={errors.deleteFormEmployeeOnBoarding}
                  /> */}
              {/* <AuthInputFiled
                    name="isKRA"
                    icon={TrendingUp}
                    control={control}
                    type="checkbox"
                    placeholder="Goals"
                    label="Employee can add KRA"
                    errors={errors}
                    error={errors.isKRA}
                  /> */}
            </div>
            <AuthInputFiled
              name="isSelfGoal"
              icon={TrendingUp}
              control={control}
              type="checkbox"
              placeholder="Goals"
              label="Employee able to add self goals"
              errors={errors}
              error={errors.isSelfGoal}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ bgcolor: "#1414FE" }}
              // disabled={performanceSetup.isLoading}
            >
              {performanceSetup.isLoading ? (
                <CircularProgress size={20} />
              ) : (
                "submit"
              )}
            </Button>
          </form>
        </div>{" "}
      </Setup>
    </BoxComponent>
  );
};

export default PerformanceSetup;

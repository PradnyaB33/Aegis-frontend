import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarMonthOutlined,
  CalendarTodayOutlined,
  CalendarViewDayOutlined,
  CategoryOutlined,
  HowToRegOutlined,
  LocationOnOutlined,
  MeetingRoomOutlined,
  PowerInputOutlined,
  TrendingDownOutlined,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../../../components/InputFileds/AuthInputFiled";
import useTrainingStore from "../zustand-store";

let center = {
  lat: 0,
  lng: 0,
};

const Step2 = ({ nextStep, departments, orgTrainingType }) => {
  const departmentOptions = departments?.map((department) => ({
    label: department.departmentName,
    value: department._id,
  }));
  const {
    trainingType,
    trainingStartDate,
    trainingLocation,
    trainingLink,
    trainingEndDate,
    trainingPoints,
    trainingDuration,
    trainingDownCasted,
    setStep2,
    isDepartmentalTraining,
    trainingDepartment,
    proofSubmissionRequired,
  } = useTrainingStore();

  const trainingDetailSchema = z.object({
    trainingStartDate: z.string().optional(),
    trainingEndDate: z.string().optional(),
    trainingLocation: z.object({
      address: z.string(),
      position: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
    }),
    trainingLink: z.string().url(),
    trainingDownCasted: z.boolean(),
    trainingPoints: z
      .string()
      .optional()
      .refine(
        (data) => {
          if (Number(data) < 0) {
            return false;
          }
          return true;
        },
        { message: "Training must be greater than 0" }
      ),
    trainingType: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      )
      .optional(),
    trainingDuration: z.string(),
    isDepartmentalTraining: z.boolean(),
    trainingDepartment: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      )
      .optional(),
    proofSubmissionRequired: z.boolean(),
  });
  const { control, formState, handleSubmit, watch } = useForm({
    defaultValues: {
      trainingType,
      trainingStartDate: trainingStartDate ?? format(new Date(), "yyyy-MM-dd"),
      trainingLocation,
      trainingLink,
      trainingEndDate: trainingEndDate ?? format(new Date(), "yyyy-MM-dd"),
      trainingPoints,
      trainingDownCasted,
      trainingDuration,
      isDepartmentalTraining,
      trainingDepartment,
      proofSubmissionRequired,
    },
    resolver: zodResolver(trainingDetailSchema),
  });
  const { errors } = formState;
  const onSubmit = (data) => {
    setStep2(data);
    nextStep();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-8 items-center w-full"
      >
        <div className="w-full grid grid-cols-2 gap-4">
          <AuthInputFiled
            name="trainingStartDate"
            icon={CalendarTodayOutlined}
            label={"Training Start Date *"}
            type="date"
            placeholder="Training Start Date"
            className="items-center"
            control={control}
            error={errors.trainingStartDate}
            errors={errors}
            min={new Date().toISOString().split("T")[0]}
          />
          <AuthInputFiled
            name="trainingEndDate"
            icon={CalendarMonthOutlined}
            label={"Training End Date *"}
            type="date"
            placeholder="Training End Date"
            className="items-center"
            control={control}
            error={errors.trainingEndDate}
            errors={errors}
            min={
              new Date(watch("trainingStartDate")).toISOString().split("T")[0]
            }
          />
          <AuthInputFiled
            name="trainingDuration"
            icon={CalendarViewDayOutlined}
            label={"Training Duration"}
            type="text"
            placeholder="Training Duration"
            className="items-center"
            control={control}
            error={errors.trainingDuration}
            errors={errors}
          />
          <AuthInputFiled
            name="trainingPoints"
            icon={PowerInputOutlined}
            label={"Training Points"}
            type="number"
            placeholder="Training Points"
            className="items-center"
            control={control}
            error={errors.trainingPoints}
            errors={errors}
          />
          <AuthInputFiled
            name="trainingLink"
            icon={MeetingRoomOutlined}
            label={"Training Link *"}
            type="text"
            placeholder="eg. https://zoom.com/1234"
            className="items-center"
            control={control}
            error={errors.trainingLink}
            errors={errors}
          />
          <AuthInputFiled
            name="trainingType"
            icon={CategoryOutlined}
            control={control}
            type="autocomplete"
            placeholder="Training Type"
            label="Training Type *"
            readOnly={false}
            maxLimit={15}
            errors={errors}
            optionlist={orgTrainingType}
            error={errors.trainingType}
            isMulti={false}
          />
          <AuthInputFiled
            className="w-full"
            name="trainingLocation"
            icon={LocationOnOutlined}
            control={control}
            placeholder="eg. Kathmandu, Nepal"
            type="location-picker"
            label="Location *"
            errors={errors}
            error={errors.trainingLocation}
            center={center}
            value={watch("trainingLocation")}
          />
          <AuthInputFiled
            className={"w-full flex items-start justify-center flex-col"}
            name={"trainingDownCasted"}
            control={control}
            type="checkbox"
            placeholder="Downcasted"
            label="Down Cast"
            errors={errors}
            error={errors.trainingDownCasted}
            icon={TrendingDownOutlined}
            descriptionText={
              "Down-Casted Training will be automatically assigned to organization employees."
            }
          />
          <AuthInputFiled
            className={"w-full flex items-start justify-center flex-col"}
            name={"proofSubmissionRequired"}
            control={control}
            type="checkbox"
            placeholder="Proof Submission Required"
            label="Proof Submission Required"
            errors={errors}
            error={errors.proofSubmissionRequired}
            icon={HowToRegOutlined}
            descriptionText={
              "Proof of submission required will be automatically assigned to organization employees."
            }
          />
          <AuthInputFiled
            className={"w-full flex items-start justify-center flex-col"}
            name={"isDepartmentalTraining"}
            control={control}
            type="checkbox"
            placeholder="Departmental Training"
            label="Departmental Training"
            errors={errors}
            error={errors.isDepartmentalTraining}
            icon={TrendingDownOutlined}
            descriptionText={
              "Departmental Training will be automatically assigned to department employees."
            }
          />
          {watch("isDepartmentalTraining") && (
            <AuthInputFiled
              name="trainingDepartment"
              icon={CategoryOutlined}
              control={control}
              type="autocomplete"
              placeholder="Department"
              label="Department *"
              readOnly={false}
              maxLimit={15}
              errors={errors}
              optionlist={departmentOptions}
              error={errors.trainingDepartment}
              isMulti={true}
            />
          )}
        </div>
        <Button
          type="submit"
          size="large"
          className="!h-[40px] !w-[40px]"
          variant="contained"
        >
          Next
        </Button>
      </form>
    </>
  );
};

export default Step2;

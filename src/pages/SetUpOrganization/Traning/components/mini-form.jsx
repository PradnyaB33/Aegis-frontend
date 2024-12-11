import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AssignmentTurnedIn,
  AssignmentTurnedInOutlined,
  LoyaltyOutlined,
  PeopleOutlined,
  ShareOutlined,
  SupervisorAccountOutlined,
  TuneOutlined,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
import useSubscriptionGet from "../../../../hooks/QueryHook/Subscription/hook";
import BasicButton from "../../../../components/BasicButton";
const organizationSchema = z.object({
  canManagerAssign: z.boolean(),
  canDeptHeadAssign: z.boolean(),
  canHRAssign: z.boolean(),
  collectPoints: z.boolean(),
  canHRDefinePoints: z.boolean(),
  usePointsForExternal: z.boolean(),
  trainingType: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    })
  ),
});

const MiniForm = ({ data, mutate, organisationId }) => {
  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      canManagerAssign: data?.canManagerAssign ? data?.canManagerAssign : false,
      canDeptHeadAssign: data?.canDeptHeadAssign
        ? data?.canDeptHeadAssign
        : false,
      canHRAssign: data?.canHRAssign ? data?.canHRAssign : false,
      collectPoints: data?.collectPoints ? data?.collectPoints : false,
      canHRDefinePoints: data?.canHRDefinePoints
        ? data?.canHRDefinePoints
        : false,
      usePointsForExternal: data?.usePointsForExternal
        ? data?.usePointsForExternal
        : false,
      trainingType: data?.trainingType ? data?.trainingType : [],
    },
    resolver: zodResolver(organizationSchema),
  });
  const { data: newMan } = useSubscriptionGet({
    organisationId: organisationId,
  });

  const { errors, isDirty } = formState;
  const onSubmit = (data) => {
    mutate(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full p-4 flex flex-wrap gap-4">
        <AuthInputFiled
          name="canManagerAssign"
          icon={AssignmentTurnedInOutlined}
          control={control}
          type="checkbox"
          label="Manager"
          errors={errors}
          error={errors.canManagerAssign}
          descriptionText={"Manager can assign trainings to their reportees"}
        />
        <AuthInputFiled
          name={"canDeptHeadAssign"}
          icon={SupervisorAccountOutlined}
          control={control}
          type="checkbox"
          label="Department-Head"
          errors={errors}
          error={errors.canDeptHeadAssign}
          descriptionText={
            "Department Head can assign trainings to their employees"
          }
        />
        <AuthInputFiled
          name={"canHRAssign"}
          icon={PeopleOutlined}
          control={control}
          type="checkbox"
          label="HR"
          errors={errors}
          error={errors.canHRAssign}
          descriptionText={"HR can assign trainings to their employees."}
        />
        {newMan?.organisation?.packageInfo === "Enterprize Plan" && (
          <>
            <AuthInputFiled
              name={"collectPoints"}
              icon={LoyaltyOutlined}
              control={control}
              type="checkbox"
              label="Point"
              errors={errors}
              error={errors.collectPoints}
              descriptionText={
                "Here you can allow employees to collect points for completed trainings"
              }
            />
            <AuthInputFiled
              name={"canHRDefinePoints"}
              icon={TuneOutlined}
              control={control}
              type="checkbox"
              label="Points by HR"
              errors={errors}
              error={errors.canHRDefinePoints}
              descriptionText={"HR can define points to specific trainings"}
            />
            <AuthInputFiled
              name={"usePointsForExternal"}
              icon={ShareOutlined}
              control={control}
              type="checkbox"
              label="External"
              errors={errors}
              error={errors.usePointsForExternal}
              descriptionText={
                "Here earned points can be used for external trainings"
              }
            />
          </>
        )}
        <AuthInputFiled
          name="trainingType"
          icon={AssignmentTurnedIn}
          control={control}
          type="autocomplete"
          placeholder="Add Training Type"
          label="Add Training Type"
          readOnly={false}
          maxLimit={15}
          errors={errors}
          error={errors.trainingType}
          optionlist={data?.trainingType ? data?.trainingType : []}
        />
      </div>
      <div className="w-full flex justify-end">
        <BasicButton disabled={!isDirty} title="Apply For Changes" type="submit" />
      </div>
    </form>
  );
};

export default MiniForm;

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Assessment,
  AssuredWorkload,
  AutoGraph,
  BarChartOutlined,
  CheckCircleOutline,
  ConnectWithoutContact,
  ExtensionOutlined,
  Fastfood,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useOrg from "../../../State/Org/Org";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
const organizationSchema = z.object({
  remotePunchingPackage: z.boolean(),
  performancePackage: z.boolean(),
  basicTrainingPackage: z.boolean(),
  communicationPackage: z.boolean(),
  loanManagementPackage: z.boolean(),
  cateringFoodPackage: z.boolean(),
  analyticsAndReportingPackage: z.boolean(),
  skillMatrixPackage: z.boolean(),
});
const Step2MiniForm = ({
  remotePunchingPackage,
  performancePackage,
  basicTrainingPackage,
  communicationPackage,
  loanManagementPackage,
  cateringFoodPackage,
  analyticsAndReportingPackage,
  skillMatrixPackage,
  nextStep,
}) => {
  const { setStep2Data } = useOrg();
  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      remotePunchingPackage: remotePunchingPackage
        ? remotePunchingPackage
        : false,
      performancePackage: performancePackage ? performancePackage : false,
      basicTrainingPackage: basicTrainingPackage ? basicTrainingPackage : false,
      communicationPackage: communicationPackage ? communicationPackage : false,
      loanManagementPackage: loanManagementPackage
        ? loanManagementPackage
        : false,
      cateringFoodPackage: cateringFoodPackage ? cateringFoodPackage : false,
      analyticsAndReportingPackage: analyticsAndReportingPackage
        ? analyticsAndReportingPackage
        : false,
      skillMatrixPackage: skillMatrixPackage ? skillMatrixPackage : false,
    },
    resolver: zodResolver(organizationSchema),
  });
  const { errors, isDirty } = formState;
  const onSubmit = (data) => {
    setStep2Data(data);
    nextStep();
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="item-center flex flex-col"
      noValidate
    >
      <div className="grid md:grid-cols-2 md:gap-4 p-4">
        <AuthInputFiled
          name="remotePunchingPackage"
          icon={CheckCircleOutline}
          control={control}
          type="checkbox"
          placeholder="Remote Punching"
          label="Remote Punching"
          errors={errors}
          error={errors.remotePunchingPackage}
        />
        <AuthInputFiled
          name="performancePackage"
          icon={Assessment}
          control={control}
          type="checkbox"
          placeholder="Performance Management"
          label="Performance Management"
          errors={errors}
          error={errors.performancePackage}
          disabled={true}
        />
        <AuthInputFiled
          name="basicTrainingPackage"
          icon={BarChartOutlined}
          control={control}
          type="checkbox"
          placeholder="Basic and Training Package"
          label="Basic and Training Package"
          errors={errors}
          error={errors.basicTrainingPackage}
          disabled={true}
        />
        <AuthInputFiled
          name="communicationPackage"
          icon={ConnectWithoutContact}
          control={control}
          type="checkbox"
          placeholder="Communication Package"
          label="Communication Package"
          errors={errors}
          error={errors.communicationPackage}
          disabled={true}
        />
        <AuthInputFiled
          name="loanManagementPackage"
          icon={AssuredWorkload}
          control={control}
          type="checkbox"
          placeholder="Loan Management Package"
          label="Loan Management Package"
          errors={errors}
          error={errors.loanManagementPackage}
          disabled={true}
        />
        <AuthInputFiled
          name="cateringFoodPackage"
          icon={Fastfood}
          control={control}
          type="checkbox"
          placeholder="Catering Food Package"
          label="Catering Food Package"
          errors={errors}
          error={errors.cateringFoodPackage}
          disabled={true}
        />
        <AuthInputFiled
          name="analyticsAndReportingPackage"
          icon={AutoGraph}
          control={control}
          type="checkbox"
          placeholder="Analytics And Reporting Package"
          label="Analytics And Reporting Package"
          errors={errors}
          error={errors.analyticsAndReportingPackage}
          disabled={true}
        />
        <AuthInputFiled
          name="skillMatrixPackage"
          icon={ExtensionOutlined}
          control={control}
          type="checkbox"
          placeholder="Skill Matrix"
          label="Skill Matrix"
          errors={errors}
          error={errors.skillMatrixPackage}
          disabled={true}
        />
      </div>
      <Button type="submit" variant="contained" className="!w-max !mx-auto">
        {remotePunchingPackage || isDirty ? "Next" : "Skip"}
      </Button>
    </form>
  );
};

export default Step2MiniForm;

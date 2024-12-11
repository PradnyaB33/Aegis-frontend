import { zodResolver } from "@hookform/resolvers/zod";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useParams } from "react-router-dom";
import { z } from "zod";
import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
import useGetPfEsicSetup from "../../hooks/Salary/useGetPfEsicSetup";
import useAuthToken from "../../hooks/Token/useAuth";
import { TestContext } from "../../State/Function/Main";
import Setup from "./Setup";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";

const PFESIC = () => {
  // zod Schema
  const { organisationId } = useParams();
  const authToken = useAuthToken();
  const { handleAlert } = useContext(TestContext);
  const { PfSetup, isLoading, isFetching } = useGetPfEsicSetup({
    organisationId,
  });

  const PerformanceSchema = z.object({
    EPF: z
      .string()
      .max(100, { message: "EPF percentage must be under 100" })
      .optional(),
    EPS: z
      .string()
      .max(100, { message: "EPS percentage must be under 100" })
      .optional(),
    ECP: z
      .string()
      .max(100, { message: "ECP percentage must be under 100" })
      .optional(),
    ECS: z
      .string()
      .max(100, { message: "ECS percentage must be under 100" })
      .optional(),
  });

  const {
    formState: { errors },
    control,
    handleSubmit,
    setValue,
  } = useForm({
    resolver: zodResolver(PerformanceSchema),
    defaultValues: {
      EPF: "0",
      EPS: "0",
      ECP: "0",
      ECS: "0",
    },
  });

  useEffect(
    () => {
      if (PfSetup) {
        setValue("EPF", `${PfSetup?.EPF}`);
        setValue("EPS", `${PfSetup?.EPS}`);
        setValue("ECP", `${PfSetup?.ECP}`);
        setValue("ECS", `${PfSetup?.ECS}`);
      }
    },
    // eslint-disable-next-line
    [PfSetup]
  );

  const PFSetup = useMutation(
    async (data) => {
      await axios.put(
        `${process.env.REACT_APP_API}/route/PfEsic/${organisationId}`,
        { data },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
    },
    {
      onSuccess: () => {
        handleAlert(true, "success", "PF & ESIC norms submitted successfully");
      },
    }
  );

  const onSubmit = async (data) => {
    PFSetup.mutate(data);
  };

  return (
    <BoxComponent sx={{ p: 0 }}>
      <Setup>
        <div className="h-[90vh] overflow-y-auto scroll px-3">
          <div className="xs:block sm:block md:flex justify-between items-center ">
            <HeadingOneLineInfo
              className="!my-3"
              heading="PF & ESIC Calculation"
              info="Set PF and ESIC calculation norms for your orgnisation"
            /></div>
          {isFetching || isLoading ? (
            <div>
              <CircularProgress />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <h1 className="text-xl text-gray-700   font-semibold  tracking-tight">
                PF Calculation
              </h1>
              <div className="grid grid-cols-2 gap-4">
                <AuthInputFiled
                  name="EPF"
                  // icon={AccessTime}
                  control={control}
                  type="number"
                  label="Enter EPF percentage *"
                  errors={errors}
                  error={errors.EPF}
                />
                <AuthInputFiled
                  name="EPS"
                  // icon={AccessTime}
                  control={control}
                  type="number"
                  label="Enter EPS percentage *"
                  errors={errors}
                  error={errors.EPS}
                />
              </div>

              <h1 className="text-xl text-gray-700   font-semibold  tracking-tight">
                ESIC Calculation
              </h1>

              <div className="grid grid-cols-2 gap-4">
                <AuthInputFiled
                  name="ECP"
                  // icon={AccessTime}

                  control={control}
                  type="number"
                  label="Enter Employee Contribution percentage *"
                  errors={errors}
                  error={errors.ECP}
                />
                <AuthInputFiled
                  name="ECS"
                  // icon={AccessTime}
                  control={control}
                  type="number"
                  label="Enter Employer Contribution percentage *"
                  errors={errors}
                  error={errors.ECS}
                />
              </div>

              <Button type="submit" variant="contained" color="primary" sx={{ bgcolor: "#1414FE" }}>
                {PFSetup.isLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  "submit"
                )}
              </Button>
            </form>
          )}
        </div>
      </Setup>
    </BoxComponent>
  );
};

export default PFESIC;

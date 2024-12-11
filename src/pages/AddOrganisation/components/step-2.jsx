import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import useOrg from "../../../State/Org/Org";
import PriceInput from "./step-2-components/price-input";
import BasicButton from "../../../components/BasicButton";

const packageSchema = z.object({
  packageInfo: z.object({
    packageName: z.string(),
    packageId: z.string(),
  }),
});

const Step2 = ({ nextStep, prevStep }) => {
  // to define the state
  const { packageInfo, setStep2Data } = useOrg();

  // use useForm
  const { handleSubmit, control, formState } = useForm({
    defaultValues: {
      packageInfo,
    },
    resolver: zodResolver(packageSchema),
  });
  const { isDirty, errors } = formState;
 
  // to define the onSubmit function
  const onSubmit = (data) => {
    setStep2Data(data?.packageInfo);
    nextStep();
    // prevStep();
  };
  return (
    <div>
      <div className="item-center flex flex-col gap-4" noValidate>
        <h1 className="font-semibold text-gray-500 text-xl">
          Choose Your Package
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="item-center flex flex-col gap-4"
        >
          {/* <div className="grid md:grid-cols-4 md:gap-4 gap-0 px-4 grid-cols-1"> */}
          <div className="flex gap-4 flex-col">
            <Controller
              control={control}
              name={"packageInfo"}
              render={({ field }) => {
                return <PriceInput field={field} />;
              }}
            />
            <div className="h-4 !mb-1">
              <ErrorMessage
                errors={errors}
                name={"packageInfo"}
                render={({ message }) => (
                  <p className="text-sm text-red-500">
                    {message ? "Please Select the Package First" : ""}
                  </p>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <BasicButton title="Back" variant={"outlined"} onClick={prevStep} />
            <BasicButton type="submit" title={"Next"} disabled={!isDirty} />
          </div>

        </form>
      </div>
    </div>
  );
};

export default Step2;

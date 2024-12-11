import { zodResolver } from "@hookform/resolvers/zod";
import { ContactMail } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { React } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useEmpQuery from "../../../hooks/Employee-OnBoarding/useEmpQuery";
import useEmpState from "../../../hooks/Employee-OnBoarding/useEmpState";
import BasicButton from "../../../components/BasicButton";

const Test3 = ({ isLastStep, nextStep, prevStep, isFirstStep }) => {
  // define state, hook and other if needed
  const organisationId = useParams("");
  const { AdditionalListCall } = useEmpQuery(organisationId);
  const { addtionalFields, addtionalLoading } = AdditionalListCall();
  const { setStep3Data, data } = useEmpState();
  const EmployeeSchema = z.object({}).catchall(z.any().optional());

  // define the useForm
  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      ...data,
    },
    resolver: zodResolver(EmployeeSchema),
  });


  // to define the onSubmit function
  const onSubmit = (testData) => {
    console.log("Test 3", testData);
    setStep3Data(testData);
    nextStep();
  };

  const { errors } = formState;
  if (addtionalLoading) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <CircularProgress />
      </div>
    );
  }
  return (
    <div className="w-full mt-4">
      <h1 className="text-2xl mb-4 font-bold">Additional Info</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex  flex-1 flex-col"
      >
        {/* <div className="grid grid-cols-2 w-full gap-3"> */}
        <div className="grid grid-cols-1  md:grid-cols-3 w-full gap-4">
          {addtionalFields?.inputField?.inputDetail?.map((input, id) => (
            <>

              {input.isActive && (
                <AuthInputFiled
                  name={input.label}
                  placeholder={input.label}
                  label={input.placeholder}
                  icon={ContactMail}
                  control={control}
                  type={input.inputType}
                  errors={errors}
                  error={errors.label}
                  className="text-sm"
                />
              )}
            </>
          ))}
        </div>

        <div className="flex items-end w-full justify-between">
          <BasicButton title="Prev" type="button"
            onClick={() => {
              prevStep();
            }} />
          <BasicButton type="submit"
            disabled={isLastStep} title="Next" />
        </div>
      </form>
    </div>
  );
};

export default Test3;

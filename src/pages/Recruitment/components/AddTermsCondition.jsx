import React, { useContext, useState } from "react";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import Setup from "../../SetUpOrganization/Setup";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "react-query";
import axios from "axios";
import BasicButton from "../../../components/BasicButton"; // Assuming you have this component for buttons
import { useParams } from "react-router-dom";
import { UseContext } from "../../../State/UseState/UseContext";

const AddTermsCondition = () => {
  const [isEditable, setIsEditable] = useState(true);
  const organisationId = useParams()
  console.log("organisationId", organisationId);

  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  // Zod schema validation
  const TermsAndConditonSchema = z.object({
    termsAndCondition: z.string().min(1, "Terms and conditions cannot be empty"),
  });

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },

  } = useForm({
    defaultValues: {
      termsAndCondition: "",
    },
    resolver: zodResolver(TermsAndConditonSchema),
  });

  // Mutation to save terms and conditions
  const saveTermsAndConditions = async (data) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API}/route/organization/${organisationId?.organisationId}/create-terms-condition`,
      data,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data;
  };

  const { mutate, isLoading } = useMutation(saveTermsAndConditions, {
    onSuccess: () => {

      setIsEditable(false); // Disable editing after save
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Something went wrong.");
    },
  });

  // Form submission handler
  const onSubmit = (data) => {
    mutate({ termsAndCondition: data.termsAndCondition });
  };

  return (
    <BoxComponent sx={{ p: 0 }}>
      <Setup>
        <div className="h-[90vh] overflow-y-auto scroll px-3">
          <div className="xs:block sm:block md:flex justify-between items-center">
            <HeadingOneLineInfo
              className="!my-3"
              heading="Terms And Condition"
              info="Here you can see and add terms and conditions for job posts."
            />
          </div>
          <div className="w-full">
            <form onSubmit={handleSubmit(onSubmit)}>
              <AuthInputFiled
                name="termsAndCondition"
                control={control}
                type="textEditor" // Assuming this is a custom text editor component
                placeholder="Terms And Condition"
                label="Terms And Condition"
                maxLimit={1000}
                errors={errors}
                error={errors.termsAndCondition}
                readOnly={!isEditable}
              />
              {isEditable && (
                <div className="flex justify-end mt-4">
                  <BasicButton
                    title={isLoading ? "Saving..." : "Submit"}
                    type="submit"
                    loading={isLoading} // Show loader while saving
                    disabled={isLoading}
                  />
                </div>
              )}
            </form>
          </div>
        </div>
      </Setup>
    </BoxComponent>
  );
};

export default AddTermsCondition;

/* eslint-disable no-unused-vars */
import { ErrorMessage } from "@hookform/error-message/dist"; //a
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Business,
  Description,
  FactoryOutlined ,
  Link,
  LocalPostOfficeOutlined, 
  LocationOn,
  Phone,
  TodayOutlined, 
} from "@mui/icons-material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { FaLinkedin } from "react-icons/fa";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useOrganisationMutation from "../../../hooks/QueryHook/Organisation/mutation";
import ImageInput from "../../AddOrganisation/components/image-input";
const organizationSchema = z
  .object({
    orgName: z.string(),
    foundation_date: z.string().refine(
      (date) => {
        const currentDate = new Date().toISOString().split("T")[0];
        return date <= currentDate;
      },
      { message: "Foundation date must be less than or equal to current date" }
    ),
    web_url: z.string().optional(),

    industry_type: z
      .string()
      .optional()
      .refine(
        (val) => {
          const predefinedValues = [
            "Technology",
            "Finance",
            "Healthcare",
            "Education",
            "Manufacturing",
            "Retail",
            "Transportation",
            "Telecommunications",
            "Real Estate",
            "Hospitality",
            "Pharmaceuticals",
            "Automotive",
            "Insurance",
            "Nonprofit",
            "Government",
            "Consulting",
            "Media",
            "Advertising",
            "Biotechnology",
          ];
          return predefinedValues.includes(val) || val === "other";
        },
        { message: "Invalid industry type" }
      ),
    // custom_industry_type: z.string(),
    custom_industry_type: z.string().optional(),

    email: z.string().email(),
    organization_linkedin_url: z.string().optional(),
    location: z.any({
      address: z.string(),
      position: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
    }),
    contact_number: z
      .string()
      .max(10, { message: "contact number must be 10 digits" })
      .min(10, { message: "contact number must be 10 digits" }),
    description: z.string().optional(),
    logo_url: z.any().refine(
      (file) => {
        if (typeof file === "string") {
          return true;
        }
        return !!file && file.size >= 5 * 1024 && file.size <= 50 * 1024;
      },
      { message: "Image size must be 5kb to 50kb" }
    ),
  })
  .refine(
    (data) => {
      if (data.industry_type === "other" && !data.custom_industry_type) {
        return false;
      }
      return true;
    },
    {
      message: "Custom industry type is required when 'Other' is selected",
      path: ["custom_industry_type"],
    }
  );

const EditOrganisation = ({ item, handleCloseConfirmation }) => {
  const [selectedImage, setSelectedImage] = useState(item?.logo_url);

  const { updateOrganizationMutation } = useOrganisationMutation();
  const { control, formState, handleSubmit, watch } = useForm({
    defaultValues: {
      orgName: item?.orgName,
      foundation_date: item?.foundation_date,
      web_url: item?.web_url,
      industry_type: item?.industry_type,
      custom_industry_type: item?.custom_industry_type,
      email: item?.email,
      organization_linkedin_url: item?.organization_linkedin_url,
      location: item?.location,
      contact_number: `${item?.contact_number}`,
      description: item?.description,
      creator: item?.decodedToken?.user?._id,
      logo_url: item?.logo_url,
      isTrial: item?.isTrial,
    },
    resolver: zodResolver(organizationSchema),
  });
  const onSubmit = async (data) => {
    if (data.industry_type === "other") {
      data.industry_type = data.custom_industry_type;
    }
    updateOrganizationMutation.mutate({
      id: item?._id,
      data,
      handleCloseConfirmation,
      onSuccess: (updatedData) => {
        // Assuming updatedData.logo_url contains the updated logo
        setSelectedImage(updatedData.logo_url); 
        console.log("Organization updated successfully:", updatedData);
      },
    });
  };
  const { errors } = formState;

  return (
    <div className="flex flex-col gap-4 mt-3">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="item-center flex flex-col"
        noValidate
      >
        
        <div className="space-y-1 w-full items-center flex flex-col ">
          <Controller
            control={control}
            name={"logo_url"}
            render={({ field }) => {
              return <ImageInput field={field} />;
            }}
          /> 
          <div className="h-4 !mb-1">
            <ErrorMessage
              errors={errors}
              name={"logo_url"}
              render={({ message }) => (
                <p className="text-sm text-red-500">{message}</p>
              )}
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 md:gap-4 gap-0 px-4 grid-cols-1">
          <AuthInputFiled
            name="orgName"
            icon={Business}
            control={control}
            type="text"
            placeholder="Organisation Name"
            label="Organisation Name *"
            errors={errors}
            error={errors.orgName}
          />
          <AuthInputFiled
            name="foundation_date"
            icon={TodayOutlined}
            control={control}
            type="date"
            placeholder="Foundation Date"
            label="Foundation Date *"
            max={new Date().toISOString().split("T")[0]}
            errors={errors}
            error={errors.foundation_date}
          />
          <AuthInputFiled
            name="web_url"
            icon={Link}
            control={control}
            type="text"
            placeholder="Web URL "
            label="Web URL  "
            errors={errors}
            error={errors.web_url}
          />
          <AuthInputFiled
            name="organization_linkedin_url"
            icon={FaLinkedin}
            control={control}
            type="text"
            placeholder="LinkedIn URL "
            label="LinkedIn URL  "
            errors={errors}
            error={errors.organization_linkedin_url}
          />
          <AuthInputFiled
            name="industry_type"
            icon={FactoryOutlined}
            control={control}
            type="naresh-select"
            placeholder="Type of Industry "
            label="Type of Industry  *"
            errors={errors}
            error={errors.industry_type}
            options={[
              { value: "Technology", label: "Technology" },
              { value: "Finance", label: "Finance" },
              { value: "Healthcare", label: "Healthcare" },
              { value: "Education", label: "Education" },
              { value: "Manufacturing", label: "Manufacturing" },
              { value: "Retail", label: "Retail" },
              { value: "Transportation", label: "Transportation" },
              { value: "Telecommunications", label: "Telecommunications" },
              { value: "Real Estate", label: "Real Estate" },
              { value: "Hospitality", label: "Hospitality" },
              { value: "Pharmaceuticals", label: "Pharmaceuticals" },
              { value: "Automotive", label: "Automotive" },
              { value: "Insurance", label: "Insurance" },
              { value: "Nonprofit", label: "Nonprofit" },
              { value: "Government", label: "Government" },
              { value: "Consulting", label: "Consulting" },
              { value: "Media", label: "Media" },
              { value: "Advertising", label: "Advertising" },
              { value: "Biotechnology", label: "Biotechnology" },
              { value: "other", label: "Other" },
            ]}
          />

          {watch("industry_type") === "other" && (
            <AuthInputFiled
              name="custom_industry_type"
              icon={FactoryOutlined}
              control={control}
              type="text"
              placeholder="Specify Custom Industry"
              label="Specify Custom Industry *"
              errors={errors}
              error={errors.custom_industry_type}
            />
          )}
          <AuthInputFiled
            name="email"
            icon={LocalPostOfficeOutlined}
            control={control}
            type="email"
            placeholder="Organisation Email "
            label="Organisation Email  *"
            errors={errors}
            error={errors.email}
          />
          <AuthInputFiled
            name="contact_number"
            icon={Phone}
            control={control}
            type="number"
            placeholder="Contact Number "
            label="Contact Number  *"
            errors={errors}
            error={errors.contact_number}
          />
          <AuthInputFiled
            name="description"
            icon={Description}
            control={control}
            type="text"
            placeholder="Organisational Description "
            label="Organisational Description  "
            errors={errors}
            error={errors.description}
          />
          <AuthInputFiled
            className="w-full"
            name="location"
            icon={LocationOn}
            control={control}
            placeholder="eg. Kathmandu, Nepal"
            type="location-picker"
            label="Location *"
            errors={errors}
            error={errors.location}
            value={watch("location")}
          />
        </div>
        <button
          type="submit"
          className="!w-max !mx-auto  p-2 px-3 bg-[#1414FE] shadow-md rounded-md font-semibold text-white"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default EditOrganisation;

// custom_industry_type: z.string().optional().refine((val, ctx) => {
//   if (ctx.parent.industry_type === "other" && !val) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       message: "Custom industry type is required when industry type is 'other'.",
//     });
//   }
//   return true;
// }),

import { zodResolver } from "@hookform/resolvers/zod"; //a
import {
  Business,
  CalendarMonthOutlined,
  Description,
  FactoryOutlined,
  Link,
  LocalPostOfficeOutlined,
  LocationOn,
  Phone,
  TodayOutlined,
} from "@mui/icons-material";
import React from "react";
import { useForm } from "react-hook-form";
import { FaLinkedin } from "react-icons/fa";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useGetUser from "../../../hooks/Token/useUser";
import useOrg from "../../../State/Org/Org";
import BasicButton from "../../../components/BasicButton";

const organizationSchema = z.object({
  orgName: z
    .string()
    .max(32, { message: "Name must be at least 32 characters" }),
  foundation_date: z.string().refine(
    (date) => {
      const currentDate = new Date().toISOString().split("T")[0];
      return date <= currentDate;
    },
    { message: "Foundation date must be less than or equal to current date" }
  ),
  web_url: z.string().optional(),
  industry_type: z.string().optional().refine(
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
  location: z.any().refine(
    (val) => {
      return (
        val.address !== ("" || undefined) &&
        val.position.lat !== 0 &&
        val.position.lng !== 0
      );
    },
    { message: "Location is required" }
  ),
  contact_number: z
    .string()
    .length(10, { message: "Contact number must be 10 digits" }),
  description: z.string().optional(),
  creator: z.string().optional(),
  gst_number: z.string().optional(),
  isTrial: z.boolean(),
}).refine((data) => {
  if (data.industry_type === "other" && !data.custom_industry_type) {
    return false;
  }
  return true;
}, {
  message: "Custom industry type is required when 'Other' is selected",
  path: ["custom_industry_type"],
});

const Step1 = ({ nextStep }) => {
  // to state, hook , import other funciton
  const { decodedToken } = useGetUser();
  const {
    orgName,
    foundation_date,
    web_url,
    industry_type,
    custom_industry_type,
    email,
    organization_linkedin_url,
    location,
    contact_number,
    description,
    gst_number,
    setStep1Data,
    isTrial,
  } = useOrg();
  // use useForm
  const { control, formState, handleSubmit, watch } = useForm({
    defaultValues: {
      orgName,
      foundation_date,
      web_url,
      industry_type,
      custom_industry_type,
      email,
      organization_linkedin_url,
      location,
      contact_number,
      description,
      creator: decodedToken?.user?._id,
      gst_number,
      isTrial,
    },
    resolver: zodResolver(organizationSchema),
  });

  const { errors } = formState;
  // console.log("gst_number",gst_number);

  const onSubmit = async (data) => {
    if (data.industry_type === "other") {
      data.industry_type = data.custom_industry_type;
    }
    nextStep();
    await setStep1Data(data);
    nextStep();
    console.log("data", data);
    console.log("nextStep", nextStep());
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="item-center flex flex-col"
        noValidate
      >
        <div className="grid sm:grid-cols-2  sm:gap-4 md:grid-cols-3 md:gap-4 gap-0 px-4 grid-cols-1">
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
            name="email"
            icon={LocalPostOfficeOutlined}
            control={control}
            type="email"
            placeholder="Organisation Email"
            label="Organisation Email *"
            errors={errors}
            error={errors.email}
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
            name="contact_number"
            icon={Phone}
            control={control}
            type="number"
            placeholder="Contact Number"
            label="Contact Number *"
            errors={errors}
            error={errors.contact_number}
          />

          <AuthInputFiled
            name="industry_type"
            icon={FactoryOutlined}
            control={control}
            type="naresh-select"
            placeholder="Type Of Industry"
            label="Type Of Industry * "
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
          {/*  */}
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
          <AuthInputFiled
            name="web_url"
            icon={Link}
            control={control}
            type="text"
            placeholder="Web URL"
            label="Web URL"
            errors={errors}
            error={errors.web_url}
          />
          <AuthInputFiled
            name="organization_linkedin_url"
            icon={FaLinkedin}
            control={control}
            type="text"
            placeholder="LinkedIn URL"
            label="LinkedIn URL"
            errors={errors}
            error={errors.organization_linkedin_url}
          />
          <AuthInputFiled
            name="description"
            icon={Description}
            control={control}
            type="text"
            placeholder="Organisation Description"
            label="Organisation Description"
            errors={errors}
            error={errors.description}
          />
          <AuthInputFiled
            name="gst_number"
            icon={Description}
            control={control}
            type="text"
            placeholder="GST Number"
            label="GST Number"
            errors={errors}
            error={errors.gst_number}
          />
          <div className="mt-7">
            <AuthInputFiled
              name="isTrial"
              icon={CalendarMonthOutlined}
              control={control}
              type="checkbox"
              label="Do you want 7 day Trial"
              errors={errors}
              error={errors.isTrial}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <BasicButton type="submit" title={"Next"} />
        </div>
      </form>
    </div>
  );
};

export default Step1;


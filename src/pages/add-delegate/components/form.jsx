import { zodResolver } from "@hookform/resolvers/zod";
import {
  Adjust,
  CalendarMonth,
  Celebration,
  ContactEmergency,
  Email,
  Flag,
  Password,
  Person,
  Person2,
  Person3,
  Work,
} from "@mui/icons-material";
import moment from "moment";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useDelegateSuperAdmin from "../../../hooks/QueryHook/Delegate-Super-Admin/mutation";
import BasicButton from "../../../components/BasicButton";

let joinDate = moment().format("yyyy-MM-DD");
let pass;

const packageSchema = z.object({
  first_name: z.string().refine(
    (data) => {
      const name = data.replace(/\s/g, "");
      return name.length > 0;
    },
    {
      message: "First Name is required",
    }
  ),
  last_name: z.string().refine(
    (data) => {
      // remove space from string
      const name = data.replace(/\s/g, "");
      return name.length > 0;
    },
    {
      message: "Last Name is required",
    }
  ),
  middle_name: z.string().optional(),
  joining_date: z.string(),
  email: z.string().email(),
  phone_number: z
    .string()
    .min(10, { message: "Phone number must be of 10  digit" })
    .max(10, { message: "Phone number must be of 10  digit" }),
  password: z
    .string()
    .min(8, { message: "Password must be minimum of 8 characters" }),
  date_of_birth: z.string().refine(
    (date) => {
      // date will be has difference of 18 years from date of joining
      const dateOfBirth = moment(date);
      const dateOfJoining = joinDate ? moment(joinDate) : moment();
      const difference = dateOfJoining.diff(dateOfBirth, "years");
      return difference >= 18;
    },
    {
      message: "Age should be greater than 18 years",
    }
  ),
  gender: z.enum(["Male", "Female", "Other"]).refine(
    (data) => {
      const name = data.replace(/\s/g, "");
      return name.length > 0;
    },
    {
      message: "Gender is required",
    }
  ),
  profile: z.any(),
  citizenship: z.string().refine(
    (data) => {
      const name = data.replace(/\s/g, "");
      return name.length > 0;
    },
    {
      message: "Citizen Ship Name is required",
    }
  ),
  confirmPassword: z.string().refine((data) => {
    return data === pass("password");
  }),
  empId: z
    .string()
    .min(1, { message: "Employee code is required" })
    .max(25, { message: "Employee code is not greater than 25 character" }),
  _id: z.string().optional(),
});
const MiniForm = ({ data }) => {
  const { addDelegateMutation, deleteDelegateMutation } =
    useDelegateSuperAdmin();
  const [visible, setVisible] = useState(false);

  const { control, formState, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      first_name: data?.delegateSuperAdmin?.first_name,
      last_name: data?.delegateSuperAdmin?.last_name,
      middle_name: data?.delegateSuperAdmin?.middle_name || "",
      joining_date: moment(data?.delegateSuperAdmin?.joining_date).format(
        "yyyy-MM-DD"
      ),
      email: data?.delegateSuperAdmin?.email,
      phone_number: data?.delegateSuperAdmin?.phone_number,
      password: undefined,
      date_of_birth: moment(data?.delegateSuperAdmin?.date_of_birth).format(
        "yyyy-MM-DD"
      ),
      gender: data?.delegateSuperAdmin?.gender,
      profile: ["Delegate-Super-Admin", "Employee"],
      citizenship: data?.delegateSuperAdmin?.citizenship,
      _id: data?.delegateSuperAdmin?._id || undefined,
      confirmPassword: undefined,
      empId: data?.delegateSuperAdmin?.empId || "",
    },
    resolver: zodResolver(packageSchema),
  });
  joinDate = watch("joining_date");
  const { errors } = formState;
  const onSubmit = async (data) => {
    addDelegateMutation.mutate(data);
  };
  const reset = async () => {
    setValue("_id", undefined);
    setValue("first_name", undefined);
    setValue("last_name", undefined);
    setValue("citizenship", undefined);
    setValue("date_of_birth", undefined);
    setValue("email", undefined);
    setValue("gender", undefined);
    setValue("joining_date", undefined);
    setValue("middle_name", undefined);
    setValue("password", undefined);
    setValue("phone_number", undefined);
    setValue("confirmPassword", undefined);
    setValue("empId", undefined);
  };
  pass = watch;
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex  flex-col gap-4 w-full overflow-auto"
      noValidate
      autoComplete="off"
    >
      <div className="grid md:grid-cols-3 gap-4 grid-cols-1">
        <AuthInputFiled
          name={"first_name"}
          icon={Person}
          control={control}
          type="text"
          placeholder={"eg. Sahil"}
          label={`First Name *`}
          errors={errors}
          error={errors?.first_name}
          autoComplete={"off"}
        />
        <AuthInputFiled
          name={"middle_name"}
          icon={Person2}
          control={control}
          type="text"
          placeholder={"eg. Hanmant"}
          label={`Middle Name `}
          errors={errors}
          error={errors?.middle_name}
          autoComplete={"off"}
        />
        <AuthInputFiled
          name={"last_name"}
          icon={Person3}
          control={control}
          type="text"
          placeholder={"eg. Barge"}
          label={`Last Name *`}
          errors={errors}
          error={errors?.last_name}
          autoComplete={"off"}
        />
        <AuthInputFiled
          name={"date_of_birth"}
          icon={Celebration}
          control={control}
          type="date"
          placeholder={"date_of_birth here"}
          label={`Date Of Birth *`}
          errors={errors}
          error={errors?.date_of_birth}
        />
        <AuthInputFiled
          name={"joining_date"}
          icon={CalendarMonth}
          control={control}
          type="date"
          placeholder={"eg. Barge"}
          label={`Date Of Joining *`}
          errors={errors}
          error={errors?.joining_date}
        />
        <AuthInputFiled
          name={"email"}
          icon={Email}
          control={control}
          type="email"
          placeholder={"eg. sahilbarge@gmail.com"}
          label={`Email *`}
          errors={errors}
          autoComplete={"off"}
          error={errors?.email}
        />
        <AuthInputFiled
          name={"phone_number"}
          icon={ContactEmergency}
          control={control}
          type="number"
          placeholder={"eg. 33333-44444"}
          label={`Phone Number *`}
          errors={errors}
          error={errors?.phone_number}
          autoComplete={"off"}
        />
        <AuthInputFiled
          name={"gender"}
          icon={Adjust}
          control={control}
          type="naresh-select"
          placeholder={"eg. Male"}
          label={`Gender *`}
          errors={errors}
          error={errors?.gender}
          options={[
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
            { value: "Other", label: "Other" },
          ]}
        />
        <AuthInputFiled
          name={"password"}
          icon={Password}
          control={control}
          type={"password"}
          placeholder={"**********"}
          label={`Password *`}
          errors={errors}
          error={errors?.password}
          visible={visible}
          setVisible={setVisible}
          autoComplete={"off"}
        />
        <AuthInputFiled
          name={"confirmPassword"}
          icon={Password}
          control={control}
          type={"password"}
          placeholder={"**********"}
          label={`Confirm Password *`}
          errors={errors}
          error={errors?.confirmPassword}
          visible={visible}
          setVisible={setVisible}
          autoComplete={"off"}
        />
        <AuthInputFiled
          className={"!min-w-80 !max-w-80"}
          name={"citizenship"}
          icon={Flag}
          control={control}
          type="text"
          placeholder={"eg. Indian"}
          label={`Citizenship *`}
          errors={errors}
          error={errors?.citizenship}
        />
        <AuthInputFiled
          name="empId"
          icon={Work}
          control={control}
          type="text"
          placeholder="Employee Code"
          label="Employee Code *"
          errors={errors}
          error={errors.empId}
        />
      </div>
      <div className="flex gap-3 justify-end">
        <BasicButton type="button" title={"Delete"}
          disabled={!data?.delegateSuperAdmin?._id}
          onClick={async () => {
            deleteDelegateMutation.mutate({
              id: data?.delegateSuperAdmin?._id,
              reset,
            });
          }} />
        {/* <Button

          variant="contained"
          color="error"
          disabled={!data?.delegateSuperAdmin?._id}
          onClick={async () => {
            deleteDelegateMutation.mutate({
              id: data?.delegateSuperAdmin?._id,
              reset,
            });
          }}
          type="button"
        >
          Delete
        </Button> */}
        <BasicButton type="submit" title={"Submit"} />
      </div>
    </form>
  );
};

export default MiniForm;

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddBusiness,
  Badge,
  ClosedCaption,
  ContactMail,
  Key,
  KeyOff,
  LocationCity,
  MonetizationOn,
  PersonAddAlt,
  PersonPin,
  Today,
  TodayOutlined,
  Work,
} from "@mui/icons-material";
import moment from "moment";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaFingerprint } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useEmpOption from "../../../hooks/Employee-OnBoarding/useEmpOption";
import useEmpState from "../../../hooks/Employee-OnBoarding/useEmpState";
import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";
import BasicButton from "../../../components/BasicButton";

const Test2 = ({ isLastStep, nextStep, prevStep }) => {
  // state , hook and other if user needed
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleCPassword, setVisibleCPassword] = useState(false);
  const organisationId = useParams("");

  const {
    Departmentoptions,
    onBoardManageroptions,
    RolesOptions,
    Shiftoptions,
    locationoption,
    cosnotoptions,
    salaryTemplateoption,
    empTypesoption,
    Designationoption,
  } = useEmpOption(organisationId);

  console.log("department opeion", Departmentoptions);

  const {
    confirmPassword,
    designation,
    profile,
    worklocation,
    deptname,
    employmentType,
    empId,
    mgrempid,
    joining_date,
    salarystructure,
    dept_cost_center_no,
    companyemail,
    setStep2Data,
    password,
    shift_allocation,
    date_of_birth,
  } = useEmpState();

  const isAtLeastNineteenYearsOld = (value) => {
    const dob = new Date(value);
    const birth = moment(date_of_birth, "YYYY-MM-DD");
    const currentValue = moment(dob, "YYYY-MM-DD");
    const differenceInDOB = currentValue.diff(birth, "years");

    return differenceInDOB >= 19;
  };

  const { data } = useSubscriptionGet(organisationId);

  // employee schema using zod
  const EmployeeSchema = z
    .object({
      password: z
        .string()
        .min(8)
        .refine((value) => passwordRegex.test(value), {
          message:
            // "Password must contain at least one number, one special character, and be at least 8 characters long",
            "Password must be 8+ characters  with 1 number , 1 special character and 1 capital letter.",
        }),
      confirmPassword: z.string(),
      designation: z.object({
        label: z.string(),
        value: z.string(),
      }),
      worklocation: z.object({
        label: z.string(),
        value: z.string(),
      }),
      deptname: z.object({
        label: z.string(),
        value: z.string(),
      }),
      employmentType: z.object({
        label: z.string(),
        value: z.string(),
      }),
      machineid: z.string().optional(),
      empId: z
        .string()
        .min(1, { message: "Employee code is required" })
        .max(25, { message: "Employee code is not greater than 25 character" }),
      mgrempid: z
        .object({
          label: z.string().optional(),
          value: z.string().optional(),
        })
        .optional()
        .nullable(),
      joining_date: z
        .string()
        .refine(isAtLeastNineteenYearsOld, {
          message: "Employee must be at least 19 years old",
        })
        .refine(
          (value) => {
            const joiningDate = moment(value, "YYYY-MM-DD");
            console.log(`🚀 ~ joiningDate:`, joiningDate);
            const orgDate = moment(
              data?.organisation?.foundation_date,
              "YYYY-MM-DD"
            );
            console.log(`🚀 ~ orgDate:`, orgDate, joiningDate);
            return orgDate.isBefore(joiningDate);
          },
          {
            message:
              "Joining date cannot be before the organisation's foundation date",
          }
        )
        .refine(
          (value) => {
            const joiningDate = moment(value, "YYYY-MM-DD"); // replace 'YYYY-MM-DD' with your date format
            const currentDate = moment();
            return joiningDate.isSameOrBefore(currentDate);
          },
          {
            message: "Joining date cannot be in the future",
          }
        ),
      salarystructure: z.object({
        label: z.string(),
        value: z.string(),
      }),
      dept_cost_center_no: z.object({
        label: z.string(),
        value: z.string(),
      }),

      companyemail: z.string().email(),
      profile: z.string().array().optional(),
      shift_allocation: z
        .object({
          label: z.string().optional(),
          value: z.string().optional(),
        })
        .optional()
        .nullable(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password don't match",
      path: ["confirmPassword"],
    });

  // to define the useForm
  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      confirmPassword: confirmPassword,
      password: password,
      designation: designation,
      profile: profile,
      worklocation: worklocation,
      deptname: deptname,
      employmentType: employmentType,
      empId: empId,
      mgrempid: mgrempid,
      joining_date: joining_date,
      salarystructure: salarystructure,
      dept_cost_center_no: dept_cost_center_no,
      companyemail: companyemail,
      // shift_allocation: shift_allocation ,
    },
    resolver: zodResolver(EmployeeSchema),
  });

  const { errors } = formState;
  // to define the onSubmit
  const onsubmit = (data) => {
    console.log("data==", data);
    setStep2Data(data);
    nextStep();
  };

  return (
    <div className="w-full mt-1">
      <h1 className="text-2xl mb-3 font-bold">Company Info</h1>

      <form
        onSubmit={handleSubmit(onsubmit)}
        className="w-full flex space-y-1  flex-1 flex-col"
      >
        <div className="grid grid-cols-1  md:grid-cols-3 w-full gap-4">
          <AuthInputFiled
            name="empId"
            icon={Work}
            control={control}
            type="text"
            placeholder="Employee Code"
            label="Employee Code *"
            errors={errors}
            error={errors.empId}
            className="text-sm"
          />
          <AuthInputFiled
            name="companyemail"
            icon={ContactMail}
            control={control}
            type="text"
            placeholder="Email"
            label="Company Email *"
            errors={errors}
            error={errors.companyemail}
            className="text-sm"
            wrapperMessage={"Note this email is used for login credentails"}
          />
          <AuthInputFiled
            name="joining_date"
            icon={TodayOutlined}
            control={control}
            type="date"
            placeholder="dd-mm-yyyy"
            label="Date of Joining *"
            errors={errors}
            className="text-sm"
            error={errors.joining_date}
          />
        </div>
        {/* <div className="md:flex block w-full ">
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
        </div> */}
        <div className="grid grid-cols-1  md:grid-cols-3 w-full gap-4">
          <AuthInputFiled
            name="deptname"
            value={deptname}
            icon={AddBusiness}
            control={control}
            type="select"
            placeholder="Department"
            label="Select Department  *"
            errors={errors}
            error={errors.deptname}
            className="text-sm"
            options={Departmentoptions}
          />
          <AuthInputFiled
            name="mgrempid"
            value={mgrempid}
            icon={PersonAddAlt}
            control={control}
            isClearable={true}
            type="select"
            placeholder="Manager"
            label="Select Manager "
            errors={errors}
            error={errors.mgrempid}
            options={onBoardManageroptions}
            className="text-sm"
          />
          <AuthInputFiled
            name="profile"
            icon={PersonPin}
            control={control}
            type="mutltiselect"
            value={profile}
            placeholder="Role"
            label="Select Role "
            errors={errors}
            className="text-sm"
            error={errors.profile}
            options={RolesOptions}
          />
        </div>
        {/* 
        <div className="grid grid-cols-1  md:grid-cols-2 w-full gap-3">
          <AuthInputFiled
            name="companyemail"
            icon={ContactMail}
            control={control}
            type="text"
            placeholder="Email"
            label="Company Email *"
            errors={errors}
            error={errors.companyemail}
            wrapperMessage={"Note this email is used for login credentails"}
          />
          <AuthInputFiled
            name="joining_date"
            icon={TodayOutlined}
            control={control}
            type="date"
            placeholder="dd-mm-yyyy"
            label="Date of Joining *"
            errors={errors}
            error={errors.joining_date}
          />
        </div> */}
        <div className="grid grid-cols-1  md:grid-cols-3 w-full gap-4">
          <AuthInputFiled
            name="machineid"
            icon={FaFingerprint}
            control={control}
            type="text"
            placeholder="Ex: 12"
            label="Enter Machine ID "
            errors={errors}
            error={errors.password}
            className="text-sm"
          />
          <AuthInputFiled
            name="password"
            visible={visiblePassword}
            setVisible={setVisiblePassword}
            icon={Key}
            control={control}
            type="password"
            placeholder=""
            label="Password *"
            errors={errors}
            error={errors.password}
            className="text-sm"
          />
          <AuthInputFiled
            name="confirmPassword"
            visible={visibleCPassword}
            setVisible={setVisibleCPassword}
            icon={KeyOff}
            control={control}
            type="password"
            placeholder=""
            label="Confirm Password *"
            errors={errors}
            error={errors.confirmPassword}
            className="text-sm"
          />
        </div>
        <div className="grid grid-cols-1  md:grid-cols-3 w-full gap-4">
          <AuthInputFiled
            name="designation"
            icon={Work}
            control={control}
            value={designation}
            placeholder="Designation"
            label="Select Designation *"
            type="select"
            options={Designationoption}
            errors={errors}
            error={errors.designation}
            className="text-sm"
          />
          <AuthInputFiled
            name="shift_allocation"
            value={shift_allocation}
            icon={Today}
            control={control}
            type="select"
            options={Shiftoptions}
            placeholder="Shift"
            label="Select Shift"
            errors={errors}
            error={errors.shift_allocation}
            className="text-sm"
          />
          {/* </div>
        <div className="grid grid-cols-1  md:grid-cols-2 w-full gap-3"> */}
          <AuthInputFiled
            name="dept_cost_center_no"
            value={dept_cost_center_no}
            icon={ClosedCaption}
            control={control}
            options={cosnotoptions}
            type="select"
            placeholder="Department Cost No"
            label="Select Department Cost No*"
            errors={errors}
            error={errors.dept_cost_center_no}
            className="text-sm"
          />
        </div>
        <div className="grid grid-cols-1  md:grid-cols-3 w-full gap-4">
          <AuthInputFiled
            name="worklocation"
            value={worklocation}
            icon={LocationCity}
            control={control}
            type="select"
            placeholder="Location"
            label="Select Location *"
            options={locationoption}
            errors={errors}
            error={errors.worklocation}
            className="text-sm"
          />
          {/* </div>
        <div className="grid grid-cols-1  md:grid-cols-2 w-full gap-3"> */}
          <AuthInputFiled
            value={employmentType}
            name="employmentType"
            icon={Badge}
            control={control}
            type="select"
            placeholder="Employment Type "
            label="Select Employment Type *"
            options={empTypesoption}
            errors={errors}
            error={errors.employmentType}
            className="text-sm"
          />
          <AuthInputFiled
            name="salarystructure"
            value={salarystructure}
            icon={MonetizationOn}
            control={control}
            type="select"
            placeholder="Salary Temp"
            label="Select Salary Template *"
            options={salaryTemplateoption}
            errors={errors}
            error={errors.salarystructure}
            className="text-sm"
          />
        </div>

        <div className="flex items-end w-full justify-between">
          <BasicButton type="button"
            onClick={() => {
              prevStep();
            }} title="Prev" />
          <BasicButton type="submit"
            disabled={isLastStep} title="Next" />
        </div>
      </form>
    </div>
  );
};

export default Test2;

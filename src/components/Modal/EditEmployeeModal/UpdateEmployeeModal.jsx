import { zodResolver } from "@hookform/resolvers/zod";
import {
  AccountBalance,
  AccountBox,
  AddBusiness,
  Badge,
  ClosedCaption,
  ContactEmergency,
  ContactMail,
  Email,
  LocationCity,
  LocationOn,
  MonetizationOn,
  Person,
  PersonAddAlt,
  PersonPin,
  Today,
  TodayOutlined,
  Work,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
} from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { z } from "zod";
import { UseContext } from "../../../State/UseState/UseContext";
import useEmpQuery from "../../../hooks/Employee-OnBoarding/useEmpQuery";
import useEmployeeOptions from "../../../hooks/Employee-Update/useEmpOptions";
import useEmpState from "../../../hooks/Employee-Update/useEmpState";
import AuthInputFiled from "../../InputFileds/AuthInputFiled";
const UpdateEmployeeModal = ({
  handleClose,
  open,
  employeeId,
  organisationId,
}) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const {
    first_name,
    last_name,
    email,
    gender,
    phone_number,
    address,
    citizenship,
    adhar_card_number,
    pan_card_number,
    bank_account_no,
    date_of_birth,
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
    password,
    shift_allocation,
  } = useEmpState();

  const {
    Departmentoptions,
    Manageroptions,
    RolesOptions,
    Shiftoptions,
    locationoption,
    cosnotoptions,
    salaryTemplateoption,
    empTypesoption,
    Designationoption,
  } = useEmployeeOptions(organisationId);

  const { AdditionalListCall } = useEmpQuery(organisationId);
  const { addtionalFields } = AdditionalListCall();

  console.log("additional field", addtionalFields);

  const isAtLeastNineteenYearsOld = (value) => {
    const currentDate = new Date();
    const dob = new Date(value);
    let differenceInYears = currentDate.getFullYear() - dob.getFullYear();
    const monthDiff = currentDate.getMonth() - dob.getMonth();

    // If the birth month is after the current month, reduce the age by 1
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && currentDate.getDate() < dob.getDate())
    ) {
      differenceInYears--;
    }

    return differenceInYears >= 19;
  };

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const EmployeeSchema = z.object({
    first_name: z
      .string()
      .min(1, { message: "Minimum 1 character required" })
      .max(15, { message: "Maximum 15 character allowed" })
      .regex(/^[a-zA-Z]+$/, { message: "Only character allowed" }),
    last_name: z
      .string()
      .min(1, { message: "Minimum 1 character required" })
      .max(15, { message: "Maximum 15 character allowed" })
      .regex(/^[a-zA-Z]+$/, { message: "Only character allowed" }),
    gender: z.string(),
    email: z.string().email(),
    phone_number: z
      .string()
      .max(10, { message: "Phone Number must be 10 digits" })
      .refine((value) => value.length === 10, {
        message: "Phone Number must be exactly 10 digits",
      }),
    address: z.string(),
    date_of_birth: z.string().refine(isAtLeastNineteenYearsOld, {
      message: "Employee must be at least 19 years old",
    }),
    citizenship: z
      .string()
      .min(3, { message: "min 3 character required" })
      .regex(/^[a-zA-Z]+$/, { message: "Only character allowed" }),
    adhar_card_number: z
      .string()
      .length(12, { message: "Aadhar number must be 12 digits." })
      .regex(/^(?:0|[1-9]\d*)$/, {
        message: "Aadhar number cannot be negative.",
      }),
    pan_card_number: z
      .string()
      .regex(/^([A-Z]){5}([0-9]){4}([A-Z]){1}$/, {
        message: "Invalid PAN No.",
      })
      .regex(/^[^*@]+$/, {
        message: "A PAN No cannot contain a special character, e.g., *,#.",
      }),
    bank_account_no: z.string().regex(/^(?:0|[1-9]\d*)$/, {
      message: "Bank number cannot be negative.",
    }),
    password: z
      .string()
      .min(8)
      .refine((value) => passwordRegex.test(value), {
        message:
          "Password must contain at least one number, one special character, and be at least 8 characters long",
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
    empId: z.string(),

    mgrempid: z
      .object({
        label: z.string(),
        value: z.string(),
      })
      .optional(),
    joining_date: z.string(),
    salarystructure: z.object({
      label: z.string(),
      value: z.string(),
    }),
    dept_cost_center_no: z.object({
      label: z.string(),
      value: z.string(),
    }),
    companyemail: z.string().email(),
    profile: z.array(z.string()).optional(),
    shift_allocation: z.object({
      label: z.string(),
      value: z.string(),
    }),
  });
  console.log("watch", watch("mgrempid"));

  const { control, formState, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      first_name: first_name,
      last_name: last_name,
      date_of_birth: date_of_birth,
      email: email,
      gender: gender,
      phone_number: phone_number,
      address: address,
      citizenship: citizenship,
      adhar_card_number: adhar_card_number,
      pan_card_number: pan_card_number,
      bank_account_no: bank_account_no,
      confirmPassword: confirmPassword,
      password: password,
      designation: designation,
      profile: z.string().array().optional(),
      worklocation: worklocation,
      deptname: deptname,
      employmentType: employmentType,
      empId: empId,
      mgrempid: mgrempid,
      joining_date: joining_date,
      salarystructure: salarystructure,
      dept_cost_center_no: dept_cost_center_no,
      companyemail: companyemail,
      shift_allocation: shift_allocation,
    },
    resolver: zodResolver(EmployeeSchema),
  });

  const { isFetching } = useQuery(
    ["employeeId", employeeId],
    async () => {
      if (open && employeeId !== null && employeeId !== undefined) {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/employee/get/profile/${employeeId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        return response.data;
      }
    },
    {
      onSuccess: (data) => {
        console.log(data);
        if (data) {
          setValue("first_name", data.employee.first_name);
          setValue("last_name", data.employee.last_name);
          setValue(
            "date_of_birth",
            new Date(data.employee.date_of_birth).toLocaleDateString()
          );
          setValue(
            "joining_date",
            new Date(data.employee.joining_date).toLocaleDateString()
          );
          setValue("email", data.employee.email);
          setValue("gender", data.employee.gender);
          setValue("phone_number", data.employee.phone_number);
          setValue("address", data.employee.address);
          setValue("citizenship", data.employee.citizenship);
          setValue("adhar_card_number", data.employee.adhar_card_number);
          setValue("pan_card_number", data.employee.pan_card_number);
          setValue("bank_account_no", data.employee.bank_account_no);
          setValue("companyemail", data.employee.companyemail);
          setValue("empId", data.employee.empId);
          const designation = data.employee?.designation?.find(
            (item) => item.value === data.employee?.designation?.item?._id
          );
          if (designation) {
            setValue("designation", {
              label: designation.designationName,
              value: designation._id,
            });
          }
          const deptname = data.employee?.deptname?.find(
            (item) => item.value === data.employee?.deptname?.item?._id
          );
          if (deptname) {
            setValue("deptname", {
              label: deptname.departmentName,
              value: deptname._id,
            });
          }
          const worklocation = data.employee?.worklocation?.find(
            (item) => item.value === data.employee?.worklocation?.item?._id
          );
          if (worklocation) {
            setValue("worklocation", {
              label: worklocation.city,
              value: worklocation._id,
            });
          }

          const employmentType = data.employee?.employmentType;
          if (employmentType) {
            setValue("employmentType", {
              label: employmentType.title,
              value: employmentType._id,
            });
          }

          const salarystructure =
            data.employee?.salarystructure?.salaryStructure?.find(
              (item) =>
                item.value ===
                data.employee?.salarystructure?.salaryStructure.item?._id
            );
          if (salarystructure) {
            setValue("salarystructure", {
              label: salarystructure.salaryComponent,
              value: salarystructure._id,
            });
          }

          const employeeProfileData = data.employee?.profile || [];
          const profiles = employeeProfileData.map((role) => role);
          console.log("profile", profiles);
          setValue("profile", profiles);
        }
      },
      enabled: open && employeeId !== null && employeeId !== undefined,
    }
  );

  console.log(isFetching);
  const { errors } = formState;

  const onSubmit = async (data) => {};

  return (
    <Dialog
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "800px!important",
          height: "100%",
          maxHeight: "85vh!important",
        },
      }}
      open={open}
      onClose={handleClose}
      className="w-full"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="flex w-full justify-between py-4 items-center  px-4">
        <h1 id="modal-modal-title" className="text-lg pl-2 font-semibold">
          Edit Employee Data
        </h1>
        <IconButton onClick={handleClose}>
          <CloseIcon className="!text-[16px]" />
        </IconButton>
      </div>

      <DialogContent className="border-none  !pt-0 !px-0  shadow-md outline-none rounded-md">
        <div className="w-full">
          <Divider variant="fullWidth" orientation="horizontal" />
        </div>

        <form className=" ml-2 mr-2 mt-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full gap-2">
            <div className=" w-[50%] ">
              <AuthInputFiled
                name="first_name"
                icon={Person}
                control={control}
                type="text"
                placeholder="john"
                label="Employee First Name *"
                errors={errors}
                error={errors.first_name}
              />
            </div>
            <div className=" w-[50%]">
              <AuthInputFiled
                name="last_name"
                icon={Person}
                control={control}
                type="text"
                placeholder="Doe"
                label="Employee Last Name *"
                errors={errors}
                error={errors.last_name}
              />
            </div>
          </div>

          <div className="space-y-2 ">
            <AuthInputFiled
              name="date_of_birth"
              icon={TodayOutlined}
              control={control}
              type="text"
              placeholder="dd-mm-yyyy"
              label="Date Of Birth *"
              errors={errors}
              error={errors.date_of_birth}
            />
          </div>

          <div className="space-y-2 ">
            <AuthInputFiled
              name="email"
              icon={Email}
              control={control}
              type="text"
              placeholder="Employee Email"
              label="Employee  Email *"
              errors={errors}
              error={errors.email}
            />
          </div>

          <div className="space-y-2 ">
            <AuthInputFiled
              name="phone_number"
              icon={ContactEmergency}
              control={control}
              type="text"
              placeholder="1234567890"
              label="Contact *"
              errors={errors}
              error={errors.phone_number}
            />
          </div>

          <div className="space-y-2 ">
            <AuthInputFiled
              name="address"
              icon={Person}
              control={control}
              type="textarea"
              placeholder="Address"
              label="Current Address *"
              errors={errors}
              error={errors.address}
            />
          </div>

          <div className="flex w-full gap-2">
            <div className=" w-[50%] ">
              <AuthInputFiled
                name="adhar_card_number"
                icon={AccountBox}
                control={control}
                type="number"
                placeholder="Aadhar No"
                label="Employee Aadhar No *"
                errors={errors}
                error={errors.adhar_card_number}
              />
            </div>
            <div className=" w-[50%]">
              <AuthInputFiled
                name="pan_card_number"
                icon={AccountBox}
                control={control}
                type="text"
                placeholder="Employee PAN No"
                label="Employee PAN No *"
                errors={errors}
                error={errors.pan_card_number}
              />
            </div>
          </div>

          <div className="flex w-full gap-2">
            <div className=" w-[50%] ">
              <AuthInputFiled
                name="bank_account_no"
                icon={AccountBalance}
                control={control}
                type="number"
                placeholder="Bank Account No"
                label="Bank Account No*"
                errors={errors}
                error={errors.bank_account_no}
              />
            </div>
            <div className=" w-[50%]">
              <AuthInputFiled
                name="citizenship"
                icon={LocationOn}
                control={control}
                type="text"
                placeholder="Citizenship Status."
                label="Citizenship Status. *"
                errors={errors}
                error={errors.citizenship}
                pattern="[A-Za-z\s]+"
              />
            </div>
          </div>

          <div className="space-y-2 ">
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

          <div className="flex w-full gap-2">
            <div className=" w-[50%] ">
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
                options={Departmentoptions}
              />
            </div>
            <div className=" w-[50%]">
              <AuthInputFiled
                name="mgrempid"
                value={mgrempid}
                icon={PersonAddAlt}
                control={control}
                type="select"
                placeholder="Manager"
                label="Select Manager *"
                errors={errors}
                error={errors.mgrempid}
                options={Manageroptions}
              />
            </div>
          </div>

          <div className="flex w-full gap-2">
            <div className=" w-[50%] ">
              <AuthInputFiled
                name="profile"
                icon={PersonPin}
                control={control}
                type="mutltiselect"
                value={profile}
                placeholder="Role"
                label="Select Role "
                errors={errors}
                error={errors.profile}
                options={RolesOptions}
              />
            </div>
            <div className=" w-[50%]">
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
            </div>
          </div>

          <div className="flex w-full gap-2">
            <div className=" w-[50%] ">
              <AuthInputFiled
                name="joining_date"
                icon={TodayOutlined}
                control={control}
                type="text"
                placeholder="dd-mm-yyyy"
                label="Date of Joining *"
                errors={errors}
                error={errors.joining_date}
              />
            </div>
            <div className=" w-[50%]">
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
              />
            </div>
          </div>

          <div className="flex w-full gap-2">
            <div className=" w-[50%] ">
              <AuthInputFiled
                name="shift_allocation"
                value={shift_allocation}
                icon={Today}
                control={control}
                type="select"
                options={Shiftoptions}
                placeholder="Shift"
                label="Select Shift *"
                errors={errors}
                error={errors.shift_allocation}
              />
            </div>
            <div className=" w-[50%]">
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
              />
            </div>
          </div>

          <div className="flex w-full gap-2">
            <div className=" w-[50%] ">
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
              />
            </div>
            <div className=" w-[50%]">
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
              />
            </div>
          </div>

          <div className="space-y-2 ">
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
            />
          </div>

          <div className="space-y-2 ">
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
                  />
                )}
              </>
            ))}
          </div>

          <div className="space-y-2 ">
            <label
              htmlFor={"gender"}
              className={`${
                errors.gender && "text-red-500"
              }  text-gray-500  font-bold  text-sm md:text-md`}
            >
              Gender *
            </label>
            <Controller
              control={control}
              name={"gender"}
              id={"gender"}
              render={({ field }) => (
                <>
                  <div
                    className={`flex items-center gap-5 rounded-md  px-2   bg-white py-1 md:py-[6px]`}
                  >
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      {...field}
                    >
                      <FormControlLabel
                        value="female"
                        control={<Radio />}
                        label="Female"
                      />
                      <FormControlLabel
                        value="male"
                        control={<Radio />}
                        label="Male"
                      />
                      <FormControlLabel
                        value="transgender"
                        control={<Radio />}
                        label="Transgender"
                      />
                    </RadioGroup>
                  </div>
                </>
              )}
            />
          </div>
        </form>
        <DialogActions>
          <Button onClick={handleClose} color="error" variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Apply
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateEmployeeModal;

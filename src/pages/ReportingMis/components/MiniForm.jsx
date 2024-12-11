import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { SiMicrosoftexcel } from "react-icons/si";
import { useMutation } from "react-query";
import { useParams } from "react-router-dom";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useAuthToken from "../../../hooks/Token/useAuth";
import { getTDSYearsOptions, reportTypeOptions } from "./data";

import * as XLSX from "xlsx";
import { TestContext } from "../../../State/Function/Main";
import useGetAllManager from "../../../hooks/Employee/useGetAllManager";

const ReportForm = () => {
  const { handleAlert } = useContext(TestContext);
  const tdsYearOptions = getTDSYearsOptions();
  const formSchema = z
    .object({
      reportType: z.object({
        label: z.string(),
        value: z.string(),
      }),
      timeRange: z
        .object({
          startDate: z.string().optional(),
          endDate: z.string().optional(),
        })
        .optional(),
      start: z.string().optional(),
      end: z.string().optional(),
      manager: z
        .object({
          label: z.string().optional(),
          value: z.string().optional(),
        })
        .optional(),
      financialYear: z
        .object({
          label: z.string().optional(),
          value: z.string().optional(),
        })
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (data.reportType.value === "Attendance") {
        if (
          !data.timeRange ||
          !data.timeRange.startDate ||
          !data.timeRange.endDate
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Time range is required for Attendance reports",
          });
        }
      }

      // If reportType is 'Salary', then start and end are required
      if (data.reportType.value === "Salary") {
        if (!data.start) {
          ctx.addIssue({
            path: ["start"],
            message: "Start date is required for Salary reports",
            code: z.ZodIssueCode.custom,
          });
        }
        if (!data.end) {
          ctx.addIssue({
            path: ["end"],
            message: "End date is required for Salary reports",
            code: z.ZodIssueCode.custom,
          });
        }
      }
    });

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    getValues,
    setError,
    setValue,
  } = useForm({
    defaultValues: {},
    resolver: zodResolver(formSchema),
  });

  const startValue = watch("start");
  useEffect(() => {
    if (startValue && watch("end") && startValue > watch("end")) {
      // If the start date is greater than the end date, reset the end date
      setValue("end", "");
    }
    //eslint-disabled-next-line
  }, [startValue, setValue, watch]);
  const { organisationId } = useParams();
  const authToken = useAuthToken();

  const GenerateAttendence = (data) => {
    const dateRange = data[0]?.attendance?.map((date) => date.date) || [];

    const headers = [
      "Employee Id",
      "Employee Name",
      "Total Present",
      "Total Absent",
      "Not Applied",
      ...dateRange,
    ];

    const employeeInfo = data?.map((item) => [
      item?.empID,
      item?.name,
      item?.totalDaysPresent,
      item?.totalDaysAbsent,
      item?.totalDaysNotApplied,
      ...item?.attendance?.map((date) => date?.present),
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...employeeInfo]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "AttendanceReport.xlsx");
    console.log("invoked in outside");
    handleAlert(true, "success", "Attendance Report Generated successfully");
  };

  const GenerateSalary = (employees) => {
    const isSalaryExists = employees.every(
      (employee) => employee.salary.length === 0
    );

    if (isSalaryExists) {
      handleAlert(true, "error", "No data to generate salary report");
      return false;
    }
    const wb = XLSX.utils.book_new();

    // Array of month names for conversion
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    employees?.forEach((employee, index) => {
      // Create a new worksheet
      let ws_data = [
        ["Serial No", "Employee Name", "Emp ID"],
        [1, employee.employeeName, employee.empId],
      ];

      // Get the keys from the first salary object (assuming all salary objects have the same structure)
      const salaryKeys = Object.keys(employee?.salary[0]);
      ws_data[0] = ws_data[0].concat(salaryKeys);

      employee?.salary?.forEach((salary, salaryIndex) => {
        let salaryValues = Object.values(salary);

        // Convert month number to name
        if (salary.hasOwnProperty("month")) {
          salaryValues = salaryValues.map((value, index) =>
            salaryKeys[index] === "month" ? monthNames[value - 1] : value
          );
        }

        ws_data.push(
          [salaryIndex + 1].concat(ws_data[1].slice(1), salaryValues)
        );
      });

      // Remove the employee details from the second row after using them
      ws_data.splice(1, 1);

      const ws = XLSX.utils.aoa_to_sheet(ws_data);

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, `${employee.employeeName}`);
    });

    // Write the workbook to a file
    XLSX.writeFile(wb, "Salary.xlsx");
  };

  const GenerateTDS = (data) => {
    if (data.length <= 0) {
      handleAlert(true, "error", "No data to generate TDS report");
      return false;
    }
    const headers = [
      "",
      "Employee Id",
      "Employee Name",
      "Regime",
      "Salary",
      "Other Declaration",
      "Salary Declaration",
      "Section Declaration",
      "Before Cess",
      "After Standard Deduction Taxable Income",
      "Cess",
      "Taxable Income",
    ];

    const employeeInfo = data?.map((item) => [
      "",
      item?.empId,
      item?.employeeName,
      item?.regime,
      item?.salary,
      item?.afterStandardDeduction,
      item?.otherDeclaration,
      item?.salaryDeclaration,
      item?.sectionDeclaration,
      item?.beforeCess,
      item?.cess,
      item?.taxableIncome,
    ]);
    const title = ["", "TDS Challan Report"];
    const year = ["", getValues("financialYear")?.label];
    const ws = XLSX.utils.aoa_to_sheet([
      "",
      title,
      year,
      "",
      headers,
      ...employeeInfo,
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "TDSReport.xlsx");
  };

  const OnSubmit = useMutation(
    async (data) => {
      let queryData = {
        reportType: data.reportType.value,
        startDate: data?.timeRange?.startDate,
        endDate: data?.timeRange?.endDate,
        manager: data?.manager?.value ?? "",
      };

      if (data.reportType.value === "salary") {
        let startMonth = data.start.split("-")[1];
        let endMonth = data.end.split("-")[1];
        let startYear = data.start.split("-")[0];
        let endYear = data.end.split("-")[0];
        queryData = {
          reportType: data.reportType.value,
          startMonth: startMonth,
          endMonth: endMonth,
          startYear: startYear,
          endYear: endYear,
        };
      }

      if (data.reportType.value === "tds") {
        queryData = {
          reportType: data.reportType.value,
          financialYear: data.financialYear.value,
        };
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/mis/generateReport/${organisationId}`,
        {
          params: queryData,
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },
    {
      onSuccess: (data) => {
        if (getValues("reportType")?.value === "Attendence") {
          GenerateAttendence(data);
        }
        if (getValues("reportType")?.value === "salary") {
          GenerateSalary(data);
        }
        if (getValues("reportType")?.value === "tds") {
          GenerateTDS(data);
        }
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  console.log(errors);

  const ManagerList = useGetAllManager(organisationId);

  const Manageroptions = ManagerList?.manager?.map((item) => {
    return {
      value: item?._id,
      label: `${item?.first_name} ${item?.last_name}`,
    };
  });

  return (
    <form
      onSubmit={handleSubmit((data, event) => {
        console.log("before condition runs ", data);
        if (watch("reportType").value === "Attendence") {
          console.log("this runs ", data);
          if (
            !data.timeRange ||
            !data.timeRange.startDate ||
            !data.timeRange.endDate
          ) {
            setError("timeRange", {
              type: "custom",
              message: "Time range is required for Attendance reports",
            });
          }
        }

        if (watch("reportType").value === "salary") {
          if (!data.start) {
            setError("start", {
              type: "custom",
              message: "Start date is required for Salary reports",
            });
          }
          if (!data.end) {
            setError("end", {
              type: "custom",
              message: "End date is required for Salary reports",
            });
          }
        }

        if (
          watch("reportType").value === "tds" &&
          !watch("financialYear").value
        ) {
          setError("financialYear", {
            type: "custom",
            message: "Select year is required for tds reports",
          });
        }

        OnSubmit.mutate(data);
      })}
    >
      <div className="grid gap-2 grid-cols-2">
        <AuthInputFiled
          name="reportType"
          control={control}
          type="select"
          placeholder="Report Type"
          label="Select Report Type *"
          readOnly={false}
          maxLimit={15}
          options={reportTypeOptions}
          errors={errors}
          error={errors.reportType}
        />
      </div>
      {watch("reportType")?.value === "Attendence" && (
        <div className="grid gap-2 grid-cols-2">
          <AuthInputFiled
            name="timeRange"
            control={control}
            type="calender"
            asSingle={false}
            placeholder="Report Type"
            label="Select Date Range *"
            readOnly={false}
            maxLimit={15}
            useRange={true}
            errors={errors}
            error={errors.timeRange}
          />
        </div>
      )}

      {watch("reportType")?.value === "tds" && (
        <div className="grid gap-2 grid-cols-2">
          <AuthInputFiled
            name="financialYear"
            control={control}
            type="select"
            // icon={Work}
            placeholder="Ex : 2024-2025"
            label="Select year *"
            readOnly={false}
            maxLimit={15}
            options={tdsYearOptions}
            errors={errors}
            error={errors.financialYear}
          />
        </div>
      )}

      {watch("reportType")?.value === "salary" && (
        <div className="grid gap-2 grid-cols-2">
          <AuthInputFiled
            name="start"
            control={control}
            type="month"
            // icon={Work}
            placeholder="Ex : January-2022"
            label="Select Start Month *"
            readOnly={false}
            maxLimit={15}
            // options={ReportYearsOptions}
            errors={errors}
            error={errors.start}
          />
          <AuthInputFiled
            name="end"
            control={control}
            type="month"
            min={startValue}
            disabled={!startValue}
            readOnly={!startValue}
            // icon={Work}
            placeholder="Ex : March-2022"
            label="Select End Month *"
            maxLimit={15}
            // options={ReportYearsOptions}
            errors={errors}
            error={errors.end}
          />
        </div>
      )}
      <div className="grid gap-2 grid-cols-2">
        {/* <AuthInputFiled
          name="department"
          control={control}
          type="select"
          icon={Work}
          placeholder="ex: Department1"
          label="Select Department "
          readOnly={false}
          maxLimit={15}
          options={reportTypeOptions}
          errors={errors}
          error={errors.department}
        /> */}
        {watch("reportType")?.value !== "tds" && (
          <AuthInputFiled
            name="manager"
            control={control}
            type="select"
            // icon={Work}
            placeholder="ex: Manager1"
            label="Select Manager "
            readOnly={false}
            maxLimit={15}
            options={Manageroptions}
            isClearable={true}
            errors={errors}
            error={errors.manager}
          />
        )}
      </div>

      <button
        className={` flex group justify-center w-max gap-2 items-center rounded-sm h-[30px] px-4 py-4 text-md font-semibold text-white bg-green-500 hover:bg-green-500 focus-visible:outline-green-500 mt-4`}
      >
        <SiMicrosoftexcel /> Generate Report
      </button>
    </form>
  );
};

export default ReportForm;

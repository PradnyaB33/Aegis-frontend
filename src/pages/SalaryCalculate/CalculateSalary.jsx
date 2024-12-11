import { CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";
import dayjs from "dayjs";
import html2pdf from "html2pdf.js";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import HeadingOneLineInfo from "../../../src/components/HeadingOneLineInfo/HeadingOneLineInfo";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import useAdvanceSalaryQuery from "../../hooks/AdvanceSalaryHook/useAdvanceSalaryQuery";
import useCalculateSalaryQuery from "../../hooks/CalculateSalaryHook/useCalculateSalaryQuery";
import useGetPfEsicSetup from "../../hooks/Salary/useGetPfEsicSetup";
function CalculateSalary() {
  // state
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const token = cookies["aegis"];
  const { userId, organisationId } = useParams();
  const currentDate = dayjs();
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [numDaysInMonth, setNumDaysInMonth] = useState(0);
  const [employeeSummary, setEmployeeSummary] = useState([]);
  const [paidLeaveDays, setPaidLeaveDays] = useState(0);
  const [unPaidLeaveDays, setUnPaidLeaveDays] = useState(0);
  const [remotePunchingCount, setRemotePunchingCount] = useState(0);
  const [publicHolidays, setPublicHoliDays] = useState([]);
  const [activeButton, setActiveButton] = useState("submit");

  const { availableEmployee, empLoanAplicationInfo, remotePunchAllowance } =
    useCalculateSalaryQuery({ userId, organisationId, remotePunchingCount });

  const formattedDate = selectedDate.format("MMM-YY");

  // handle the date
  const handleDateChange = (event) => {
    setSelectedDate(dayjs(event.target.value));
  };

  // Correctly calculate the number of days in the selected month
  const calculateDaysInMonth = (date) => {
    return date.daysInMonth();
  };

  useEffect(() => {
    setNumDaysInMonth(calculateDaysInMonth(selectedDate));
  }, [selectedDate]);

  // Fetch leave of employee in specific month
  const month = selectedDate.$M + 1;
  const year = selectedDate.$y;
  useEffect(() => {
    const fetchDataAndFilter = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/employee/leaves/${year}/${month}/${userId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setEmployeeSummary(response.data);
      } catch (error) {
        console.error(error);
        // handleAlert(
        //   true,
        //   "error",
        //   "Failed to fetch Employee Attendance Summary"
        // );
      }
    };
    fetchDataAndFilter();
    // eslint-disable-next-line
  }, [month, year]);
  useEffect(() => {
    setPaidLeaveDays(employeeSummary?.paidLeaveDays || 0);
    setUnPaidLeaveDays(employeeSummary?.unpaidLeaveDays || 0);
  }, [employeeSummary, month, year]);

  useEffect(() => {
    setNumDaysInMonth(selectedDate.daysInMonth());
  }, [selectedDate]);
  console.log("employee summary", employeeSummary);

  // to get holiday in the organization
  const fetchHoliday = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/holiday/get/${organisationId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setPublicHoliDays(response.data.holidays);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch Holiday");
    }
  };
  useEffect(() => {
    fetchHoliday();
    // eslint-disable-next-line
  }, []);

  // count the public holidays count
  const countPublicHolidaysInCurrentMonth = () => {
    const selectedMonth = selectedDate.format("M");
    const selectedYear = selectedDate.format("YYYY");

    const holidaysInCurrentMonth = publicHolidays.filter((holiday) => {
      const holidayDate = dayjs(holiday.date);
      return (
        holidayDate.month() + 1 === parseInt(selectedMonth) &&
        holidayDate.year() === parseInt(selectedYear)
      );
    });

    return holidaysInCurrentMonth.length;
  };
  let publicHolidaysCount = countPublicHolidaysInCurrentMonth();

  // to get shifts of employee based on month
  const selectedMonths = selectedDate.format("M");
  const selectedYears = selectedDate.format("YYYY");
  const { data: getShifts } = useQuery(
    ["shiftAllowance", userId, selectedMonths, selectedYears],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get/shifts/${userId}`,
        {
          headers: {
            Authorization: token,
          },
          params: {
            month: parseInt(selectedMonths),
            year: parseInt(selectedYears),
          },
        }
      );
      return response.data.shiftRequests;
    }
  );
  console.log("getShifts", getShifts);

  // to get shift count of employee
  const countShifts = (shifts) => {
    const shiftCount = {};
    shifts.forEach((shift) => {
      const title = shift?.title;
      if (shiftCount[title]) {
        shiftCount[title]++;
      } else {
        shiftCount[title] = 1;
      }
    });
    return shiftCount;
  };
  const shiftCounts = useMemo(
    () => (getShifts ? countShifts(getShifts) : {}),
    [getShifts]
  );
  console.log("shiftCounts", shiftCounts);

  // get the amount of shift in the organization
  const { data: shiftAllowanceAmount } = useQuery(
    ["shift-allowance-amount"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/shifts/${organisationId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response.data.shifts;
    }
  );
  const shiftAllowances = useMemo(() => {
    if (shiftAllowanceAmount) {
      return shiftAllowanceAmount?.reduce((acc, shift) => {
        acc[shift.shiftName.toLowerCase()] = shift.allowance;
        return acc;
      }, {});
    }
    return {};
  }, [shiftAllowanceAmount]);

  const [shiftTotalAllowance, setShiftTotalAllowance] = useState(0);
  useEffect(() => {
    let total = 0;
    for (const [shiftTitle, count] of Object.entries(shiftCounts)) {
      const shiftAllowance = shiftAllowances[shiftTitle.toLowerCase()];
      if (shiftAllowance) {
        total += count * shiftAllowance;
      }
    }
    setShiftTotalAllowance(total);
  }, [shiftCounts, shiftAllowances]);

  // to fetch the remote punching count of employee in a specific month
  const fetchRemotePunchingCount = async (userId, startDate, endDate) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/remote-punch-count/${userId}?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setRemotePunchingCount(response.data.remotePunchingCount || 0);
    } catch (error) {
      console.error(error);
    }
  };
  const startDate = selectedDate.startOf("month").format("YYYY-MM-DD");
  const endDate = selectedDate.endOf("month").format("YYYY-MM-DD");

  useEffect(() => {
    fetchRemotePunchingCount(userId, startDate, endDate);
    // eslint-disable-next-line
  }, [selectedDate, userId, startDate, endDate]);

  const { getTotalSalaryEmployee } = useAdvanceSalaryQuery(organisationId);

  const extradayShifts = Array.isArray(getShifts)
    ? getShifts.filter((shift) => shift.title === "Extra Day")
    : [];

  const extradayCount = Array.isArray(extradayShifts)
    ? extradayShifts.length
    : 0;

  // calculate the no fo days employee present
  // Extract the dynamic joining date from the employee data
  const joiningDate = new Date(availableEmployee?.joining_date);
  const calculateDaysEmployeePresent = (joiningDate) => {
    const selectedMonth = new Date(selectedDate).getMonth();
    const selectedYear = new Date(selectedDate).getFullYear();
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
    const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0);

    // Check if the joining date is within the selected month
    const isJoinedThisMonth =
      joiningDate >= firstDayOfMonth && joiningDate <= lastDayOfMonth;

    let daysPresent;
    if (isJoinedThisMonth) {
      daysPresent = lastDayOfMonth.getDate() - joiningDate.getDate() + 1;
    } else {
      // old one
      // daysPresent =  numDaysInMonth - unPaidLeaveDays;
      daysPresent = employeeSummary?.presentDays - unPaidLeaveDays;
    }

    return daysPresent;
  };

  let noOfDaysEmployeePresent = calculateDaysEmployeePresent(joiningDate);

  // Calculate the total payable days including extra days
  const totalAvailableDays =
    typeof noOfDaysEmployeePresent === "number" &&
    !isNaN(noOfDaysEmployeePresent) &&
    typeof extradayCount === "number" &&
    !isNaN(extradayCount)
      ? noOfDaysEmployeePresent + extradayCount
      : 0; // Default to 0 if any of the values are not valid numbers

  // Get Query for fetching overtime allowance in the organization
  const { data: overtime } = useQuery(
    ["overtime", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get/${organisationId}/overtime`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response.data.data;
    }
  );
  let otamount = overtime && overtime?.allowanceAmount;
  let otparameter = overtime && overtime?.allowanceParameter;
  console.log("otamount", otamount);
  console.log("otparameter", otparameter);

  // to get the overtime hour of employee in specific month from machine punching
  const sd = selectedDate.startOf("month").format("YYYY-MM-DD");
  const ed = selectedDate.endOf("month").format("YYYY-MM-DD");

  const { data: empOverTimeData } = useQuery(
    ["empOverTimeHour", sd, ed],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/getOvertimeHour/${organisationId}/${userId}`,
        {
          params: {
            startDate: sd,
            endDate: ed,
          },
          headers: {
            Authorization: token,
          },
        }
      );
      return response.data;
    }
  );
  // Destructure the employee overtime data
  const overtimeRecordCount = empOverTimeData?.overtimeRecordCount || 0;
  const totalOvertimeHours = empOverTimeData?.totalOvertimeHours || 0;

  console.log("overtimeRecordCount", overtimeRecordCount);
  console.log("totalOvertimeHours", totalOvertimeHours);

  // calculate overtime amount of employee in specific month
  // Initialize overtimeAllowance
  let totalOvertimeAllowance = 0;
  // Calculate the overtime allowance based on the parameter
  if (otparameter === "perDay") {
    // Calculate allowance per day (use the overtimeRecordCount as the number of overtime days)
    totalOvertimeAllowance = otamount * overtimeRecordCount;
  } else if (otparameter === "perHour") {
    // Calculate allowance per hour (use the totalOvertimeHours)
    totalOvertimeAllowance = otamount * totalOvertimeHours;
  }
  // Log the calculated overtime allowance
  console.log("Overtime Allowance:", totalOvertimeAllowance);

  // to get employee salary component data of employee
  const { data: salaryComponent, isFetching } = useQuery(
    ["salary-component", userId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get-salary-component/${userId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response.data.data;
    }
  );

  // calculate the salary component for income
  const [incomeValues, setIncomeValues] = useState([]);

  const {
    data: tdsData,
    isLoading,
    isFetching: tdsFetching,
  } = useQuery(["tds-data", selectedDate], async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/tds/getTDSDetails/${userId}/2024-2025`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return data;
  });

  useEffect(() => {
    const daysInMonth = calculateDaysInMonth(selectedDate);
    let updatedIncomeValues = [];

    // Calculate the salary component
    salaryComponent?.income?.forEach((item) => {
      const updatedValue = (item?.value / daysInMonth) * totalAvailableDays;
      if (item.name === "Basic") {
        console.log(
          "~ income:",
          item.value,
          daysInMonth,
          totalAvailableDays,
          updatedValue
        );
      }

      const existingIndex = updatedIncomeValues.findIndex(
        (ele) => ele.name === item.name
      );

      if (existingIndex !== -1) {
        updatedIncomeValues[existingIndex] = {
          name: item?.name,
          value: Math.round(updatedValue),
        };
      } else {
        updatedIncomeValues.push({
          name: item?.name,
          value: Math.round(updatedValue),
        });
      }
    });

    // Check if shiftTotalAllowance is greater than 0 and if the name "Shift Allowance" does not already exist
    if (shiftTotalAllowance > 0) {
      const existingIndex = updatedIncomeValues.findIndex(
        (ele) => ele.name === "Shift Allowance"
      );

      if (existingIndex === -1) {
        // If "Shift Allowance" does not exist, add it to the array
        updatedIncomeValues.push({
          name: "Shift Allowance",
          value: shiftTotalAllowance,
        });
      } else {
        // If "Shift Allowance" already exists, update its value
        updatedIncomeValues[existingIndex].value = shiftTotalAllowance;
      }
    }

    // Add Remote Punch Allowance if applicable
    if (remotePunchAllowance > 0) {
      const existingIndex = updatedIncomeValues.findIndex(
        (ele) => ele.name === "Remote Punch Allowance"
      );

      if (existingIndex === -1) {
        // If "Remote Punch Allowance" does not exist, add it to the array
        updatedIncomeValues.push({
          name: "Remote Punch Allowance",
          value: remotePunchAllowance,
        });
      } else {
        // If "Remote Punch Allowance" already exists, update its value
        updatedIncomeValues[existingIndex].value = remotePunchAllowance;
      }
    }

    // Add overtime Allowance if applicable
    if (totalOvertimeAllowance > 0) {
      const existingIndex = updatedIncomeValues.findIndex(
        (ele) => ele.name === "Overtime Allowance"
      );

      if (existingIndex === -1) {
        // If "Overtime Allowance" does not exist, add it to the array
        updatedIncomeValues.push({
          name: "Overtime Allowance",
          value: totalOvertimeAllowance,
        });
      } else {
        // If "Overtime Allowance" already exists, update its value
        updatedIncomeValues[existingIndex].value = remotePunchAllowance;
      }
    }
    // Update the incomeValues state with the new array
    setIncomeValues(updatedIncomeValues);

    // eslint-disable-next-line
  }, [
    selectedDate,
    salaryComponent,
    totalAvailableDays,
    shiftTotalAllowance,
    remotePunchAllowance,
    totalOvertimeAllowance,
    isLoading,
  ]);

  // get the PFsetup from organizaiton
  const { PfSetup } = useGetPfEsicSetup({
    organisationId,
  });

  // Initialize the state for set deduction value
  let pwd = availableEmployee?.pwd;

  // calculate the financial year
  const calculateFinancialYear = (date) => {
    const month = date?.month();
    const currentYear = date?.year();
    if (month < 3) {
      // January, February, March
      return `${currentYear - 1}-${currentYear}`;
    } else {
      return `${currentYear}-${currentYear + 1}`;
    }
  };
  const financialYear = calculateFinancialYear(dayjs(selectedDate));

  // to get the annual income tax
  const { data: annualIncomeTax } = useQuery(
    ["getIncomeTax", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/tds/getMyDeclaration/${financialYear}/${getTotalSalaryEmployee}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response.data.getTotalTaxableIncome;
    }
  );

  // calculate monthly income tax based on annual income tax
  const monthlyIncomeTax =
    typeof annualIncomeTax === "number" && annualIncomeTax > 0
      ? annualIncomeTax / 12
      : "0";
  console.log("monthlyIncomeTax :", monthlyIncomeTax);

  // get the loan deduction amount from loan application data of employee
  let loanDeduction = 0;
  if (Array.isArray(empLoanAplicationInfo)) {
    const currentDate = new Date();
    // Filter loan applications that are currently active
    const loanDeductionApplications = empLoanAplicationInfo?.filter(
      (application) => {
        const loanDisbursementDate = new Date(
          application?.loanDisbursementDate
        );
        const loanCompletionDate = new Date(application?.loanCompletedDate);
        return (
          loanDisbursementDate <= currentDate &&
          currentDate <= loanCompletionDate
        );
      }
    );
    // Calculate the total loan deduction for active loans
    loanDeduction = loanDeductionApplications.reduce((total, application) => {
      // Check if the current application is within the loan disbursement and completion dates
      const loanDisbursementDate = new Date(application.loanDisbursementDate);
      const loanCompletionDate = new Date(application.loanCompletedDate);
      if (
        loanDisbursementDate <= currentDate &&
        currentDate <= loanCompletionDate
      ) {
        return total + parseFloat(application.totalDeduction || 0);
      }
      return total;
    }, 0);
  }
  loanDeduction = isNaN(loanDeduction) ? 0 : Math.round(loanDeduction);

  // calculate the deduction value
  const [deductionValues, setDeductionValues] = useState([]);
  console.log("deductionValues", deductionValues);

  const [employerContribution, setEmployerContribution] = useState(0);
  useEffect(() => {
    let basic = 0;
    let da = 0;

    // Loop through income array to find Basic and DA components
    incomeValues?.forEach((item) => {
      if (item.name === "Basic") {
        basic = item.value;
      }
      if (item.name === "DA") {
        da = item.value;
      }
    });

    const combinedBasicDA = basic + da;
    const basicDA = combinedBasicDA < 15000 ? combinedBasicDA : 15000;
    const employeePF = (basicDA * PfSetup?.EPF) / 100;

    const totalGrossSalary = incomeValues?.reduce((a, c) => a + c.value, 0);
    console.log(`🚀 ~ checkOne`, pwd, totalGrossSalary);
    const empCtr = pwd
      ? totalGrossSalary < 25000
        ? 0
        : (totalGrossSalary * PfSetup?.ECP) / 100
      : totalGrossSalary <= 21000
      ? (totalGrossSalary * PfSetup?.ECP) / 100
      : 0;

    const emlCtr = pwd
      ? totalGrossSalary < 25000
        ? 0
        : (totalGrossSalary * PfSetup?.ECS) / 100
      : totalGrossSalary <= 21000
      ? (totalGrossSalary * PfSetup?.ECS) / 100
      : 0;

    // Safely reduce deductions, ensuring deduction array exists
    const updatedDeductions = salaryComponent?.deductions
      ? salaryComponent?.deductions?.reduce((acc, deduction) => {
          if (deduction.name === "PF") {
            acc.push({ ...deduction, value: employeePF });
          } else if (deduction.name === "ESIC") {
            if (empCtr > 0) {
              acc.push({ ...deduction, value: Math.round(empCtr) });
            }
          } else {
            acc.push(deduction);
          }
          return acc;
        }, [])
      : [];

    // Remove ESIC if empCtr is 0
    if (empCtr === 0) {
      const esicIndex = updatedDeductions.findIndex(
        (deduction) => deduction.name === "ESIC"
      );
      if (esicIndex !== -1) {
        updatedDeductions.splice(esicIndex, 1);
      }
    }

    if (tdsData?.regularTaxAmount > 0) {
      const taxAmount = tdsData?.regularTaxAmount + tdsData?.cess;
      const monthAmount = Math.round(taxAmount / 12);
      updatedDeductions.push({
        name: "TDS",
        value: monthAmount,
      });
    }

    // Process loan deductions if applicable
    const selectedDateObj = new Date(selectedDate);
    empLoanAplicationInfo?.forEach((loanInfo) => {
      const loanDisbursement = new Date(loanInfo?.loanDisbursementDate);
      const loanCompleted = new Date(loanInfo?.loanCompletedDate);

      if (
        loanDeduction > 0 &&
        selectedDateObj >= loanDisbursement &&
        selectedDateObj <= loanCompleted
      ) {
        const existingIndex = updatedDeductions?.findIndex(
          (ele) => ele.name === "Loan Deduction"
        );

        if (existingIndex !== -1) {
          // Update existing deduction
          updatedDeductions[existingIndex] = {
            name: "Loan Deduction",
            value: loanDeduction,
          };
        } else {
          // Push new loan deduction entry
          updatedDeductions.push({
            name: "Loan Deduction",
            value: loanDeduction,
          });
        }
      }
    });

    setDeductionValues(updatedDeductions);
    setEmployerContribution(emlCtr > 0 ? emlCtr : 0);

    // eslint-disable-next-line
  }, [
    salaryComponent,
    PfSetup,
    selectedDate,
    incomeValues,
    loanDeduction,
    empLoanAplicationInfo,
    tdsData,
  ]);

  // calculate the total income (totalGrossSalary) , total deduction , totalNetAalary
  const [salary, setSalary] = useState({
    totalIncome: 0,
    totalDeduction: 0,
    totalNetSalary: 0,
  });
  useEffect(() => {
    const income = incomeValues?.reduce((a, c) => a + c.value, 0);
    console.log(`🚀 ~ income:`, income, incomeValues);

    const deductions = deductionValues?.reduce((a, c) => a + c.value, 0);

    const total = income - deductions;

    setSalary({
      totalDeduction: Math.round(deductions),
      totalIncome: Math.round(income),
      totalNetSalary: Math.round(total),
    });

    // eslint-disable-next-line
  }, [deductionValues, incomeValues, tdsFetching]);

  // submit the data
  const saveSalaryDetail = async () => {
    try {
      const currentYear = dayjs().format("YYYY");
      const currentMonth = dayjs().format("MM");
      const selectedYear = selectedDate.format("YYYY");
      const selectedMonth = selectedDate.format("MM");
      const employeeJoiningYear = dayjs(availableEmployee?.joining_date).format(
        "YYYY"
      );
      const employeeJoiningMonth = dayjs(
        availableEmployee?.joining_date
      ).format("MM");
      const nextMonth =
        parseInt(currentMonth) === 12 ? 1 : parseInt(currentMonth);

      if (
        parseInt(selectedYear) > parseInt(currentYear) ||
        (parseInt(selectedYear) === parseInt(currentYear) &&
          parseInt(selectedMonth) > parseInt(nextMonth))
      ) {
        handleAlert(
          true,
          "error",
          "Cannot calculate salary for future months or years"
        );
        return;
      }
      if (
        parseInt(selectedYear) < parseInt(employeeJoiningYear) ||
        (parseInt(selectedYear) === parseInt(employeeJoiningYear) &&
          parseInt(selectedMonth) < parseInt(employeeJoiningMonth))
      ) {
        handleAlert(
          true,
          "error",
          "Cannot calculate salary for months before employee's joining date"
        );
        return;
      }
      const data = {
        employeeId: userId,
        income: incomeValues,
        deductions: deductionValues,
        totalGrossSalary: salary?.totalIncome,
        totalDeduction: salary?.totalDeduction,
        totalNetSalary: salary?.totalNetSalary,
        emlCtr: employerContribution,
        numDaysInMonth,
        formattedDate,
        publicHolidaysCount,
        paidLeaveDays,
        unPaidLeaveDays,
        totalAvailableDays,
        month: selectedDate.format("M"),
        year: selectedDate.format("YYYY"),
        organizationId: organisationId,
      };
      console.log("data", data);
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/employeeSalary/add-salary/${userId}/${organisationId}`,
        data,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.data.success) {
        handleAlert(
          true,
          "success",
          "Monthly Salary Detail added Successfully"
        );
      }
      // window.location.reload();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        handleAlert(
          true,
          "error",
          "Salary for this month and year already exists"
        );
      } else {
        console.error("Error adding salary details:", error);
        handleAlert(true, "error", "Failed to add salary details");
      }
    }
  };

  // download the pdf
  const exportPDF = async () => {
    const input = document.getElementById("App");
    console.log(`🚀 ~ input:`, input);
    const opt = {
      filename: "payslip.pdf",
      margin: [10, 10, 10, 10], // Set margins
      image: { type: "jpeg", quality: 0.98 }, // Set image type and quality
      html2canvas: { scale: 2 }, // Increase scale for better quality
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }, // Set PDF format and orientation
    };

    // Fetch image using axios with authorization headers
    const imageUrl = `${process.env.REACT_APP_API}/route/getImageFile?imageUrl=${availableEmployee?.organizationId?.logo_url}`;
    const response = await axios.get(imageUrl, {
      headers: {
        Authorization: token,
      },
      responseType: "blob", // Ensure the response is a Blob
    });
    const blob = response.data;
    const imageBlobUrl = URL.createObjectURL(blob);

    // Replace the image src with the Blob URL
    const imgElement = input.querySelector("img");
    if (imgElement) {
      imgElement.src = imageBlobUrl;
    }

    html2pdf().from(input).set(opt).save();
  };

  // submit the data of payslip
  const handleSubmitClick = () => {
    setActiveButton("submit");
    saveSalaryDetail();
  };

  // download the payslip
  const handleDownloadClick = () => {
    setActiveButton("download");
    exportPDF();
  };

  //Annual Salary

  // Calculate current month and financial year
  const currentMonth = dayjs().month() + 1; // Current month (1-12)
  const financialYearStartMonth = 4; // April is the start of the financial year

  // Calculate how many months from April to the current month
  const monthsFromAprilToCurrent =
    currentMonth >= financialYearStartMonth
      ? currentMonth - financialYearStartMonth + 1
      : 0; // If it's before April, we don't calculate yet

  console.log("Months from April to Current Month:", monthsFromAprilToCurrent);

  const minDate = dayjs(joiningDate).format("YYYY-MM");
  const maxDate = dayjs().subtract(1, "month").format("YYYY-MM");
  const defaultDate = dayjs().subtract(1, "month");

  return (
    <BoxComponent>
      <HeadingOneLineInfo
        heading={"Salary Calulation"}
        info={"Here you can see salary calculation"}
      />
      <div className="container mx-auto py-2">
        <input
          type="month"
          value={selectedDate.format("YYYY-MM")}
          onChange={handleDateChange}
          style={{ width: "500px" }}
          className="border border-gray-300 rounded-md p-2 mt-2"
          min={minDate}
          max={maxDate}
          defaultValue={defaultDate.format("YYYY-MM")}
        />
        <h4 className="text-lg font-bold text-gray-700 pb-2">
          Please select the month for calculate salary.
        </h4>
        {isFetching || isLoading || tdsFetching ? (
          <CircularProgress />
        ) : (
          <>
            <div id="App" className="px-3">
              <div className="flex items-center justify-between mb-6">
                <img
                  src={availableEmployee?.organizationId?.logo_url}
                  alt="Company Logo"
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                  }}
                />
                <div className="px-2 ">
                  <p className="text-lg font-semibold flex items-center">
                    <span className=" mr-1">Organisation Name :</span>
                    <span style={{ whiteSpace: "pre-wrap" }}>
                      {availableEmployee?.organizationId?.orgName || ""}
                    </span>
                  </p>
                  <p className="text-lg flex items-center">
                    <span className=" mr-1">Location :</span>
                    <span>
                      {" "}
                      {availableEmployee?.organizationId?.location?.address ||
                        ""}
                    </span>
                  </p>
                  <p className="text-lg flex items-center">
                    <span className="mr-1">Contact No :</span>
                    <span>
                      {availableEmployee?.organizationId?.contact_number || ""}
                    </span>
                  </p>
                  <p className="text-lg flex items-center">
                    <span className="mr-1">Email :</span>
                    <span>
                      {availableEmployee?.organizationId?.email || ""}
                    </span>
                  </p>
                </div>
              </div>

              <hr className="mb-6" />
              {/* table */}
              <div>
                <table className="w-full border border-collapse ">
                  {/* 1st table */}
                  <table className="w-full border border-collapse">
                    <thead style={{ textAlign: "left" }}>
                      <tr className="bg-blue-200">
                        <th className="px-2  py-2 border">Salary Slip</th>
                        <th className="border"></th>
                        <th className="px-2  py-2 border">Month</th>
                        <th className="px-2  py-2 border">{formattedDate}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-2  py-2 border">Employee Name:</td>
                        <td className="px-2  py-2 border">
                          {`${availableEmployee?.first_name} ${availableEmployee?.last_name}`}
                        </td>
                        <td className="px-2  py-2 border">Date Of Joining:</td>
                        <td className="px-2  py-2 border">
                          {availableEmployee?.joining_date
                            ? new Date(
                                availableEmployee?.joining_date
                              ).toLocaleDateString("en-GB")
                            : ""}
                        </td>
                      </tr>

                      <tr>
                        <td className="px-2  py-2 border">Designation:</td>
                        <td className="px-2  py-2 border">
                          {" "}
                          {(availableEmployee?.designation &&
                            availableEmployee?.designation.length > 0 &&
                            availableEmployee?.designation[0]
                              ?.designationName) ||
                            ""}
                        </td>
                        <td className="px-2  py-2 border">Unpaid Leaves:</td>
                        <td className="px-2  py-2 border">{unPaidLeaveDays}</td>
                      </tr>

                      <tr>
                        <td className="px-2  py-2 border">Department Name:</td>
                        <td className="px-2  py-2 border">
                          {" "}
                          {(availableEmployee?.deptname &&
                            availableEmployee?.deptname.length > 0 &&
                            availableEmployee?.deptname[0]?.departmentName) ||
                            ""}
                        </td>
                        <td className="px-2  py-2 border">
                          No Of Working Days Attended:
                        </td>
                        <td className="px-2  py-2 border">
                          {Math.round(totalAvailableDays)}
                        </td>
                      </tr>

                      <tr>
                        <td className="px-2  py-2 border">PAN No:</td>
                        <td className="px-2  py-2 border">
                          {availableEmployee?.pan_card_number}
                        </td>
                        <td className="px-2  py-2 border">Paid Leaves:</td>
                        <td className="px-2  py-2 border">{paidLeaveDays}</td>
                      </tr>

                      <tr>
                        <td className="px-2  py-2 border">Employee Id:</td>
                        <td className="px-2  py-2 border">
                          {availableEmployee?.empId}
                        </td>
                        <td className="px-2  py-2 border">Public Holidays:</td>
                        <td className="px-2  py-2 border">
                          {publicHolidaysCount}
                        </td>
                      </tr>

                      <tr>
                        <td className="px-2  py-2 border">Bank Account No:</td>
                        <td className="px-2  py-2 border">
                          {availableEmployee?.bank_account_no || ""}
                        </td>

                        <td className="px-2  py-2 border">
                          No Of Days in Month:
                        </td>
                        <td className="px-2  py-2 border">{numDaysInMonth}</td>
                      </tr>

                      <tr>
                        {/* <td className="px-2  py-2 border"></td>
                      <td className="px-2  py-2 border"></td> */}
                        {extradayCount > 0 && (
                          <>
                            <td className="px-2  py-2 border">
                              No Of Extra Days in Month:
                            </td>
                            <td className="px-2  py-2 border">
                              {extradayCount}
                            </td>
                          </>
                        )}
                      </tr>
                    </tbody>
                  </table>
                  {/* </div> */}

                  {/* </div> 
            {/* esko  niche lgadala */}

                  <div className="container mx-auto py-2 ">
                    <div className="flex flex-wrap gap-1 justify-between">
                      {/* Left Column: Monthly Salary Table */}
                      <div className="flex-1 min-w-[300px]">
                        <div>
                          <table className="w-full border border-collapse">
                            <thead>
                              <tr className="bg-blue-200 px-2 py-2 border text-center">
                                <th colSpan="4" className="px-2 py-2">
                                  {" "}
                                  Monthly Salary
                                </th>
                              </tr>
                              <tr className="" style={{ textAlign: "left" }}>
                                <th
                                  colSpan="2"
                                  className="px-2 py-2 border text-center"
                                >
                                  Income
                                </th>
                                {/* <th className="border"></th> */}
                                <th
                                  colSpan="2"
                                  className="px-2 py-2 border text-center"
                                >
                                  Deduction
                                </th>
                                {/* <th className="px-2 py-2 border"></th> */}
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="px-2 py-2 border">
                                  Particulars
                                </td>
                                <td className=" px-2 py-2 border">Amount</td>
                                <td className="px-2 py-2 border ">
                                  Particulars
                                </td>
                                <td className=" px-2  py-2 border">Amount</td>
                              </tr>
                              {Array.from({
                                length: Math.max(
                                  incomeValues?.length || 0,
                                  deductionValues?.length || 0
                                ),
                              }).map((_, index) => {
                                return (
                                  <tr key={index}>
                                    {/* Income column */}
                                    <td className="px-2 py-2 border">
                                      {incomeValues?.[index]?.name || ""}
                                    </td>
                                    <td className="px-2 py-2 border">
                                      {incomeValues?.[index]?.value || ""}
                                    </td>
                                    {/* Deduction column */}
                                    <td className="px-2 py-2 border">
                                      {deductionValues?.[index]?.name || ""}
                                    </td>
                                    <td className="px-2 py-2 border">
                                      {deductionValues?.[index]?.value
                                        ? Math.round(
                                            deductionValues[index].value
                                          )
                                        : ""}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Total Gross Salary and Deduction */}
                        <div>
                          <table className="w-full border border-collapse">
                            <thead>
                              <tr className="">
                                <th className="py-2 mx-2  border">
                                  Total Gross Salary:{" "}
                                  <span className="mx-2  ">
                                    {salary?.totalIncome || ""}
                                  </span>{" "}
                                </th>
                                {/* <th className="py-2 border">
                              {salary?.totalIncome || ""}
                            </th> */}
                                <th className="py-2 mx-2 border">
                                  Total Deduction:
                                  <span className="mx-2  ">
                                    {" "}
                                    {salary?.totalDeduction || ""}
                                  </span>
                                </th>
                                {/* <th className="py-2 border">
                              {salary?.totalDeduction || ""}
                            </th> */}
                              </tr>
                            </thead>
                            <tbody></tbody>
                          </table>
                        </div>

                        {/* Total Net Salary */}
                        <div>
                          <table className="w-full mt-10 border">
                            <thead>
                              <tr className="bg-blue-200">
                                <th className="px-2 py-2">Total Net Salary</th>
                                <th></th>
                                <th className="px-2 py-2">
                                  {salary?.totalNetSalary || ""}
                                </th>
                                <th className="px-2 py-2"></th>
                              </tr>
                            </thead>
                            <tbody></tbody>
                          </table>
                        </div>
                      </div>

                      {/* Right Column: Annual Salary Table */}
                      <div className="flex-1 min-w-[300px]">
                        {/* <h3 className="text-xl font-semibold mb-4  text-center">
                      Annual Salary
                    </h3> */}
                        <table className="w-full border border-collapse">
                          <thead>
                            <tr className="bg-blue-200 px-2 py-2 border text-center">
                              <th colSpan="4" className="px-2 py-2">
                                {" "}
                                Annual Salary
                              </th>
                            </tr>
                            <tr className="" style={{ textAlign: "left" }}>
                              <th
                                colSpan="2"
                                className="px-2 py-2 border text-center"
                              >
                                Income
                              </th>
                              {/* <th className="border"></th> */}
                              <th
                                colSpan="2"
                                className="px-2 py-2 border  text-center"
                              >
                                Deduction
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="px-2 py-2 border">Particulars</td>
                              <td className=" px-2 py-2 border">Amount</td>
                              <td className="px-2 py-2 border ">Particulars</td>
                              <td className=" px-2  py-2 border">Amount</td>
                            </tr>
                            {Array.from({
                              length: Math.max(
                                incomeValues?.length || 0,
                                deductionValues?.length || 0
                              ),
                            }).map((_, index) => {
                              return (
                                <tr key={index}>
                                  {/* Annual Income Column */}
                                  <td className="px-2 py-2 border">
                                    {incomeValues?.[index]?.name
                                      ? `${incomeValues[index].name}`
                                      : ""}
                                  </td>
                                  <td className="px-2 py-2 border">
                                    {incomeValues?.[index]?.value
                                      ? Math.round(
                                          incomeValues[index].value *
                                            monthsFromAprilToCurrent
                                        ) // Multiply by months passed
                                      : ""}
                                  </td>
                                  {/* Annual Deduction Column */}
                                  <td className="px-2 py-2 border">
                                    {deductionValues?.[index]?.name
                                      ? `${deductionValues[index].name} `
                                      : ""}
                                  </td>
                                  <td className="px-2 py-2 border">
                                    {deductionValues?.[index]?.value
                                      ? Math.round(
                                          deductionValues[index].value *
                                            monthsFromAprilToCurrent
                                        ) // Multiply by months passed
                                      : ""}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>

                        {/* Total Annual Salary and Deduction */}
                        <div>
                          <table className="w-full border border-collapse">
                            <thead>
                              <tr className="">
                                <th className="py-2 border">
                                  Total Gross Annual Salary:
                                </th>
                                <th className="py-2 border">
                                  {salary?.totalIncome
                                    ? Math.round(
                                        salary?.totalIncome *
                                          monthsFromAprilToCurrent
                                      ) // Multiply by months passed
                                    : ""}
                                </th>
                                <th className="py-2 border">
                                  Total Annual Deduction:
                                </th>
                                <th className="py-2 border">
                                  {salary?.totalDeduction
                                    ? Math.round(
                                        salary?.totalDeduction *
                                          monthsFromAprilToCurrent
                                      ) // Multiply by months passed
                                    : ""}
                                </th>
                              </tr>
                            </thead>
                            <tbody></tbody>
                          </table>
                        </div>

                        {/* Total Annual Net Salary */}
                        <div>
                          <table className="w-full mt-10 border">
                            <thead>
                              <tr className="bg-blue-200">
                                <th className="px-2 py-2">
                                  Total Annual Net Salary
                                </th>
                                <th></th>
                                <th className="px-2 py-2">
                                  {salary?.totalNetSalary
                                    ? Math.round(
                                        salary?.totalNetSalary *
                                          monthsFromAprilToCurrent
                                      ) // Multiply by months passed
                                    : ""}
                                </th>
                                <th className="px-2 py-2"></th>
                              </tr>
                            </thead>
                            <tbody></tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </table>
              </div>
            </div>

            {/* submit the salary */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                }}
              >
                <Button
                  variant={activeButton === "submit" ? "contained" : "outlined"}
                  onClick={handleSubmitClick}
                  color="primary"
                >
                  Submit
                </Button>
                <Button
                  variant={
                    activeButton === "download" ? "contained" : "outlined"
                  }
                  onClick={handleDownloadClick}
                  color="primary"
                >
                  Download PDF
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </BoxComponent>
  );
}

export default CalculateSalary;

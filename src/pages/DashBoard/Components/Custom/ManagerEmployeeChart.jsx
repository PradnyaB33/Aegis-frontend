import React, { useContext, useState } from "react";
import axios from "axios";
import { CategoryScale, Chart } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useMutation, useQuery } from "react-query";
import Select from "react-select";
import * as XLSX from "xlsx";
import { TestContext } from "../../../../State/Function/Main";
import { UseContext } from "../../../../State/UseState/UseContext";
import UserProfile from "../../../../hooks/UserData/useUser";

Chart.register(CategoryScale);

const customStyles = {
  control: (base) => ({
    ...base,
    border: "1px solid #ddd",
    boxShadow: "none",
    backgroundColor: "#f9f9f9",
    borderRadius: "4px",
    fontFamily: "'Roboto', sans-serif",
    zIndex: 10,
    minWidth: '120px',
  }),
  menu: (base) => ({
    ...base,
    width: "100%",
    fontFamily: "'Roboto', sans-serif",
    fontSize: 12,
  }),
  placeholder: (defaultStyles) => ({
    ...defaultStyles,
    color: "#555",
    fontFamily: "'Roboto', sans-serif",
    fontSize: 12,
    textAlign: 'center',
  }),
  singleValue: (base) => ({
    ...base,
    fontFamily: "'Roboto', sans-serif",
    fontSize: 12,
    textAlign: 'center',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#555",
  }),
  indicatorSeparator: (base) => ({
    ...base,
    display: 'none',
  }),
};

const ManagerEmployeeChart = ({ selectedyear, setSelectedYear }) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const user = UserProfile().getCurrentUser();

  const monthOptions = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const { handleAlert } = useContext(TestContext);
  const [selectMonth, setSelectMonth] = useState({
    label: monthOptions.find((item) => item.value === new Date().getMonth() + 1).label,
    value: new Date().getMonth() + 1,
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, index) => currentYear - index);
  const yearOptions = years.map((year) => ({
    value: year.toString(),
    label: year,
  }));

  const options = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    barThickness: 25,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#555",
          font: {
            family: "'Roboto', sans-serif",
            size: 10,
          },
        },
      },
      y: {
        suggestedMax: 31,
        ticks: {
          beginAtZero: true,
          stepSize: 5,
          min: 0,
          color: "#555",
          font: {
            family: "'Roboto', sans-serif",
            size: 10,
          },
        },
        grid: {
          display: true,
          color: "#e0e0e0",
        },
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  const getYearLeaves = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/leave/getManagerEmployeeAttendence/${selectedyear.value}/${selectMonth.value}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return data;
  };

  const { data: LeaveYearData, } = useQuery(
    ["leaveData", selectedyear, selectMonth],
    getYearLeaves
  );

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const data = {
    labels: LeaveYearData?.map((monthData) => monthData?.empName),
    datasets: [
      {
        label: "Available Days",
        data: LeaveYearData?.map((monthData) => monthData.availableDays),
        backgroundColor: "#00b0ff",
        borderWidth: 1,
      },
      {
        label: "Unpaid Leave Days",
        data: LeaveYearData?.map((monthData) => monthData.unpaidleaveDays),
        backgroundColor: "#f50057",
        borderWidth: 1,
      },
      {
        label: "Paid Leave Days",
        data: LeaveYearData?.map((monthData) => monthData.paidleaveDays),
        backgroundColor: "#4caf50",
        borderWidth: 1,
      },
    ],
  };

  const generateReport = () => {
    try {
      const employeeLeaveData = LeaveYearData?.map(({ _id, ...item }) => ({
        "Employee ID": `${item?.employeeId}`,
        "Employee Name": `${item?.empName}`,
        "Employee email": `${item?.email}`,
        "Available Days": `${item?.availableDays}`,
        "Paid Leave Days": `${item.paidleaveDays}`,
        "Unpaid Leave Days": `${item.unpaidleaveDays}`,
      }));

      let employeeInfo = [
        ["", "Manager Name", `${user?.first_name} ${user?.last_name}`],
        ["", "Month", monthNames[selectMonth.value - 1]],
        ["", "Year", LeaveYearData?.map((item) => `${item?.year}`)],
      ];

      const wb = XLSX.utils.book_new();
      const wsData = employeeLeaveData.map(Object.values);
      wsData.unshift(Object.keys(employeeLeaveData[0]));
      const padding = [["", "", "", ""]];
      const finalData = padding.concat(employeeInfo, padding, wsData);
      const ws = XLSX.utils.aoa_to_sheet(finalData);

      XLSX.utils.book_append_sheet(wb, ws, "Leave Data");
      XLSX.writeFile(wb, "LeaveData.xlsx");
    } catch (error) {
      handleAlert(
        true,
        "error",
        "There is an issue with the server, please try again later"
      );
    }
  };

  const mutation = useMutation(generateReport, {
    onSuccess: () => {
      handleAlert(true, "success", "Report Generated Successfully");
    },
    onError: () => {
      handleAlert(true, "error", "There is an issue with the server, please try again later");
    },
  });

  return (
    <div>
      <h1
        className="text-xl font-bold text-gray-800 mb-1"
      >
        Attendance Overview
      </h1>
      <div
        className="relative mb-6 h-[350px] bg-white p-4 rounded-lg shadow-md"
      >
        <div className="flex flex-col gap-2 ">
          <div className="flex-col sm:flex-row sm:justify-between items-start gap-2 mb-2">
            <div className=" flex gap-2 items-center">
              <button
                onClick={() => mutation.mutate()}
                disabled={mutation.isLoading}
                className={`flex items-center gap-1 px-2 py-2 text-sm rounded-md text-white bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 ${mutation.isLoading && "cursor-not-allowed bg-gray-400 text-gray-700"}`}
                aria-label="Generate Excel Report"
                whileHover={{ scale: 1.05 }}
              >
                Generate Report
              </button>
              <Select
                placeholder="Select year"
                onChange={(year) => setSelectedYear(year)}
                components={{ IndicatorSeparator: () => null }}
                styles={customStyles}
                value={selectedyear}
                options={yearOptions}
              />
              <Select
                placeholder="Select Month"
                onChange={(month) => setSelectMonth(month)}
                components={{ IndicatorSeparator: () => null }}
                styles={customStyles}
                value={selectMonth}
                options={monthOptions}
              />
            </div>
            <div className="h-[270px] relative w-full ">
              <Bar options={options} data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ManagerEmployeeChart;
















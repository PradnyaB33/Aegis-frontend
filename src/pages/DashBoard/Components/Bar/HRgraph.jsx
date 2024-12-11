import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { CategoryScale, Chart } from "chart.js";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useMutation, useQuery } from "react-query";
import Select from "react-select";
import * as XLSX from "xlsx";
import { TestContext } from "../../../../State/Function/Main";
import { UseContext } from "../../../../State/UseState/UseContext";
import BasicButton from "../../../../components/BasicButton";
import UserProfile from "../../../../hooks/UserData/useUser";
Chart.register(CategoryScale);

const HRgraph = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const [employeeData, setEmployeeData] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [selectedyear, setSelectedYear] = useState({
    value: new Date().getFullYear(),
    label: new Date().getFullYear(),
  });

  console.log(employeeData);

  // const customStyles = {
  //   control: (base) => ({
  //     ...base,
  //     border: "1px solid #ddd",
  //     boxShadow: "none",
  //     backgroundColor: "#f9f9f9",
  //     borderRadius: "8px",
  //     padding: "2px 8px",
  //     fontFamily: "'Roboto', sans-serif",
  //   }),
  //   menu: (base) => ({
  //     ...base,
  //     width: "max-content",
  //     minWidth: "100%",
  //     right: 0,
  //     fontFamily: "'Roboto', sans-serif",
  //   }),
  //   placeholder: (defaultStyles) => ({
  //     ...defaultStyles,
  //     color: "#555",
  //     fontFamily: "'Roboto', sans-serif",
  //   }),
  //   singleValue: (base) => ({
  //     ...base,
  //     fontFamily: "'Roboto', sans-serif",
  //   }),
  //   dropdownIndicator: (base) => ({
  //     ...base,
  //     color: "#555",
  //   }),
  // };

  // const option = {
  //   elements: {
  //     line: {
  //       tension: 0.5,
  //     },
  //   },
  //   scales: {
  //     x: {
  //       grid: {
  //         display: false,
  //       },
  //       ticks: {
  //         color: "#555",
  //         font: {
  //           family: "'Roboto', sans-serif",
  //           size: 10,
  //         },
  //       },
  //     },
  //     y: {
  //       grid: {
  //         display: true,
  //         color: "#e0e0e0",
  //       },
  //       ticks: {
  //         color: "#555",
  //         font: {
  //           family: "'Roboto', sans-serif",
  //           size: 10,
  //         },
  //       },
  //     },
  //   },
  //   maintainAspectRatio: false,
  //   responsive: true,
  // };

  const customStyles = {
    control: (base) => ({
      ...base,
      border: "1px solid #ddd",
      boxShadow: "none",
      backgroundColor: "#f9f9f9",
      borderRadius: "4px",
      // padding: "2px 4px",
      fontFamily: "'Roboto', sans-serif",
      zIndex: 10,
      // minHeight: '28px',
      // height: '28px',
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "auto",
    }),
    menu: (base) => ({
      ...base,
      width: "max-content",
      minWidth: "100%",
      right: 0,
      fontFamily: "'Roboto', sans-serif",
      fontSize: 12,
    }),
    placeholder: (defaultStyles) => ({
      ...defaultStyles,
      color: "#555",
      fontFamily: "'Roboto', sans-serif",
      fontSize: 12,
      textAlign: "center",
    }),
    singleValue: (base) => ({
      ...base,
      fontFamily: "'Roboto', sans-serif",
      fontSize: 12,
      textAlign: "center",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#555",
      // padding: 4, // Reduced padding
    }),
    indicatorSeparator: (base) => ({
      ...base,
      display: "none",
    }),
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, index) => currentYear - index);
  const yearOptions = years.map((year) => ({
    value: year.toString(),
    label: year,
  }));

  const getYearLeaves = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/leave/getYearLeaves/${user?._id}/${selectedyear.value}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    setEmployeeData(data?.getEmployeeLeaves?.summary?.map((item) => item));
    setEmployee(data?.getEmployeeLeaves[0]?.employeeId);
    const currentYear = new Date().getFullYear();
    const filterData = data?.sortedData?.filter(
      (item) => item.year === currentYear
    );
    return filterData;
  };

  const { data: LeaveYearData } = useQuery(
    ["leaveData", selectedyear],
    getYearLeaves
  );

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const allMonths = monthNames;

  const organizeDataByMonth = (data) => {
    const organizedData = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      year: null,
      availableDays: 0,
      unpaidleaveDays: 0,
      paidleaveDays: 0,
    }));

    data?.forEach((monthData) => {
      const monthIndex = monthData.month - 1;
      organizedData[monthIndex] = {
        month: monthData.month,
        year: monthData.year,
        availableDays: monthData.availableDays,
        unpaidleaveDays: monthData.unpaidleaveDays,
        paidleaveDays: monthData.paidleaveDays,
      };
    });

    return organizedData;
  };

  const EmployeeleaveData = organizeDataByMonth(LeaveYearData);
  const MonthArray = allMonths;
  const { handleAlert } = useContext(TestContext);

  const data = {
    labels: MonthArray,
    datasets: [
      {
        label: "Available Days",
        data: EmployeeleaveData.map((monthData) => monthData.availableDays),
        backgroundColor: "#00b0ff",
        borderWidth: 1,
      },
      {
        label: "Unpaid Leave Days",
        data: EmployeeleaveData.map((monthData) => monthData.unpaidleaveDays),
        backgroundColor: "#f50057",
        borderWidth: 1,
      },
      {
        label: "Paid Leave Days",
        data: EmployeeleaveData.map((monthData) => monthData.paidleaveDays),
        backgroundColor: "#4caf50",
        borderWidth: 1,
      },
    ],
  };

  const generateReport = () => {
    try {
      const withMonth = LeaveYearData?.map(({ _id, ...item }) => {
        const date = moment({ year: item.year, month: item.month - 1 });
        const daysInMonth = date.daysInMonth();
        return {
          Month: monthNames[item.month - 1],
          Year: item.year,
          "Days In Month": daysInMonth,
          "Available Days": item.availableDays,
          "Paid Days": item.paidleaveDays,
          "Unpaid Days": item.unpaidleaveDays,
        };
      });

      const employeeInfo = [
        ["", "Employee Id", `${employee?.empId}`],
        ["", "Name", `${employee?.first_name} ${employee?.last_name}`],
        ["", "Email", employee?.email],
        ["", "Pan Card", employee?.pan_card_number],
        ["", "Bank Account No", `${employee?.bank_account_no}`],
      ];

      const wb = XLSX.utils.book_new();
      const wsData = withMonth.map(Object.values);
      wsData.unshift(Object.keys(withMonth[0]));

      const padding = [
        ["", "", "", ""],
        ["", "", "", ""],
      ];
      const finalData = padding.concat(employeeInfo, padding, wsData);
      const ws = XLSX.utils.aoa_to_sheet(finalData);
      XLSX.utils.book_append_sheet(wb, ws, "Attendance Data");
      XLSX.writeFile(wb, "AttendanceData.xlsx");
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
      handleAlert(true, "success", "Attendance Report Generated Successfully");
    },
    onError: () => {
      handleAlert(
        true,
        "error",
        "There is an issue with the server, please try again later"
      );
    },
  });

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div>
      <h1 className="font-semibold text-[#67748E] mb-4 text-[20px]">
        Attendance Overview
      </h1>

      <div className="relative mb-6 border-[0.5px] border-[#E5E7EB] bg-white p-4 rounded-lg shadow-md">
        <div className="flex  my-3 justify-end items-center">
          <div className="flex gap-4">
            <BasicButton
              onClick={() => mutation.mutate()}
              title={"Generate Report"}
              color={"success"}
              size={"sm"}
            />
            <Select
              placeholder={"Select year"}
              onChange={(year) => {
                setSelectedYear(year);
              }}
              components={{
                IndicatorSeparator: () => null,
              }}
              styles={customStyles}
              value={selectedyear} // Add this line
              options={yearOptions}
            />
          </div>
        </div>

        <div className="  w-full h-[250px]">
          <Bar
            data={data}
            options={{
              interaction: {
                intersect: false,
                mode: "index",
              },
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "bottom",

                  labels: {
                    textAlign: "center",
                    font: {
                      size: 12,
                      color: "red",
                    },
                    usePointStyle: true, //for style circle
                    padding: 20,
                  },
                },
              },
              responsive: true,
              scales: {
                x: {
                  ticks: {
                    padding: 10,
                  },
                  border: {
                    display: false,
                  },
                  grid: {
                    display: false,
                    drawTicks: false,
                  },
                },
                y: {
                  max: 31,
                  ticks: {
                    padding: 10,
                    stepSize: 6,
                  },

                  beginAtZero: true,

                  border: {
                    display: false,
                  },
                },
              },
            }}
          />
        </div>

      </div>
    </div>
  );
};

export default HRgraph;

//Reffer this HrGraph.jsx component  change exact styling design Ui into Graphs representation . note:dont change or remove any code functionality

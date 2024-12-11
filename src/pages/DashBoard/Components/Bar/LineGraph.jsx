import { Skeleton } from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
} from "chart.js";
import React, { useContext, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useMutation } from "react-query";
import Select from "react-select";
import * as XLSX from "xlsx";
import { TestContext } from "../../../../State/Function/Main";
import UserProfile from "../../../../hooks/UserData/useUser";
import BasicButton from "../../../../components/BasicButton";

ChartJS.register(LineElement, CategoryScale, LinearScale);

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
    // minHeight: '20px',
    // height: '28px',
    minheight: "90%",
    // width:"100%",
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
    display: "none", // Hide the separator
  }),
};

const createGradient = (ctx) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, "#00e676");
  gradient.addColorStop(0.7, "#c8e6c9");
  gradient.addColorStop(1, "#e8f5e9");
  return gradient;
};

const organizeDataByMonth = (data) => {
  const organizedData = Array.from({ length: 12 }, (_, index) => ({
    month: index + 1,
    year: null,
    totalNetSalary: 0,
  }));

  data?.data?.forEach((monthData) => {
    const monthIndex = monthData.month - 1;
    organizedData[monthIndex] = {
      month: monthData.month,
      year: monthData.year,
      totalNetSalary: parseInt(monthData.totalNetSalary),
    };
  });

  return organizedData;
};

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const LineGraph = ({
  salarydata,
  setSelectedYear,
  selectedyear,
  employee = [],
  isLoading,
}) => {
  const { handleAlert } = useContext(TestContext);
  const role = UserProfile().useGetCurrentRole();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const generateReport = () => {
    try {
      const salaryDataWithoutId = salarydata?.data?.map(({ _id, ...item }) => ({
        ...item,
        month: monthNames[item.month - 1],
      }));

      let employeeInfo;
      if (role === "Employee") {
        employeeInfo = [
          ["", "Employee Id", `${employee?.empId}`],
          ["", "Name", `${employee?.first_name} ${employee?.last_name}`],
          ["", "Email", employee?.email],
          ["", "Pan Card", employee?.pan_card_number],
          ["", "Bank Account No", `${employee?.bank_account_no}`],
        ];
      } else if (role === "HR") {
        employeeInfo = [
          ["Organization Name", `${salarydata?.header?.orgName}`],
        ];
      }

      const wb = XLSX.utils.book_new();
      const wsData = salaryDataWithoutId.map(Object.values);
      wsData.unshift(Object.keys(salaryDataWithoutId[0]));

      const padding = [
        ["", "", "", ""],
        ["", "", "", ""],
      ];
      const finalData = padding.concat(employeeInfo, padding, wsData);

      const ws = XLSX.utils.aoa_to_sheet(finalData);
      XLSX.utils.book_append_sheet(wb, ws, "Salary Data");
      XLSX.writeFile(wb, "SalaryData.xlsx");
    } catch (error) {
      handleAlert(
        true,
        "error",
        "There is an issue with the server, please try again later"
      );
    }
  };

  const mutation = useMutation(generateReport, {
    onSuccess: () =>
      handleAlert(true, "success", "Report Generated Successfully"),
    onError: () =>
      handleAlert(
        true,
        "error",
        "There is an issue with the server, please try again later"
      ),
  });
  console.log(mutation);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, index) => currentYear - index);
  const yearOptions = years.map((year) => ({
    value: year.toString(),
    label: year,
  }));

  const EmployeeleaveData = organizeDataByMonth(salarydata);
  const MonthArray = monthNames;

  const data = {
    labels: MonthArray,
    datasets: [
      {
        label: "Salary Overview",
        data: EmployeeleaveData.map((item) => item.totalNetSalary),
        fill: true,
        backgroundColor: (ctx) => createGradient(ctx.chart.ctx),
        borderColor: "rgb(124,252,0)",
        borderCapStyle: "round",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "round",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 2,
        pointHitRadius: 4,
      },
    ],
  };

  const option = {
    interaction: {
      intersect: false,
      mode: "index",
    },

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
    elements: {
      line: {
        tension: 0.5,
      },
    },
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
        suggestedMin: 0,
        suggestedMax: 100000,
        ticks: {
          suggestedMin: 25000,
          padding: 10,
          stepSize: 25000,
        },
        beginAtZero: true,
        border: {
          display: false,
        },
      },
    },
    maintainAspectRatio: false,
    // responsive: true,
  };

  console.log(`🚀 ~ EmployeeleaveData:`, salarydata);
  return (
    <div>
      <h1 className="font-semibold text-[#67748E] mb-4 text-[20px]">
        Salary Overview
      </h1>

      <div className="relative mb-6 border-[0.5px] border-[#E5E7EB] bg-white p-4 rounded-lg shadow-md">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-4 rounded-lg shadow-md">
            <h1 className="text-md font-semibold text-gray-700 mb-2">
              <Skeleton variant="text" width={140} height={20} />
            </h1>
            <div className="w-full h-48">
              <Skeleton variant="rect" width="100%" height="100%" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 my-2 justify-end">
              <BasicButton
                onClick={() => generateReport()}
                title={"Generate Report"}
                color={"success"}
                size={"sm"}
                className="text-sm"
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
            <div className=" relative w-full h-[250px]">
              <Line data={data} options={option} />
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

export default LineGraph;

import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import {   Typography } from "@mui/material";
ChartJS.register(ArcElement, Tooltip, Legend);

const LoanManagementPieChart = ({ totalPaidAmount, totalPendingAmount }) => {
  // get the data that shown in the pie chart
  const data = {
    labels: ["Paid Amount", "Pending Amount"],
    datasets: [
      {
        data: [totalPaidAmount, totalPendingAmount],
        backgroundColor: ["#4169E1", "#FF6347"],
      },
    ],
  };

  const options = {
    responsive: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  return (
    
    <div  style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", width: "900px", height: "400px"  , marginLeft :"20%" ,paddingTop : "5%" }}>
    <Typography variant="h4" className="text-center  mb-6 mt-2">
      Loan Application
    </Typography>
    <p className="text-xs text-gray-600  text-center">
      Here you can see the status of loan amount.
    </p>
    <Pie data={data} options={options} className="w-full max-w-96" style={{ marginLeft: "35%"  , }} />
  </div>
  
  );
};

export default LoanManagementPieChart;
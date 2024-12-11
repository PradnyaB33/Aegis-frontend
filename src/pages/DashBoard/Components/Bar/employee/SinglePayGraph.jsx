import React from "react";
import { Bar } from "react-chartjs-2";

import { Card } from "@mui/material";
import { CategoryScale, Chart } from "chart.js";
Chart.register(CategoryScale);

const SinglePayGraph = () => {
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Septmber",
    "Octomber",
    "November",
    "December",
  ];

  const data = {
    labels: labels,
    datasets: [
      {
        fill: true,
        label: "Salary Overview",
        data: [
          15000, 14500, 15000, 12000, 11111, 10000, 10000, 7500, 6000, 15000,
          15000, 15000,
        ].map((ele) => {
          return ele;
        }),
        backgroundColor: "#69f0ae",
        borderColor: "#4caf50",
        borderWidth: 2,
      },
    ],
  };
  return (
    <>
      <Card elevation={3} className=" w-full bg-white rounded-md shadow-xl">
        <div className="p-4 py-4 flex justify-between items-center">
          <h1 className="text-xl">Salary Overview</h1>
        </div>
        <Bar className="p-4" data={data} />
      </Card>
    </>
  );
};
export default SinglePayGraph;

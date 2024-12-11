import React from "react";
import { Doughnut } from "react-chartjs-2";

const EmpGraph = ({ goalsData }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "right",
      },
    },
  };

  const data = {
    labels: ["Completed", "Pending", "In Progress", "Overdue"],
    datasets: [
      {
        label: "Goals Count",
        data: [
          goalsData?.Completed ?? 0,
          goalsData?.["Not Started"] ?? 0, // Adjusted line
          goalsData?.["In Progress"] ?? 0,
          goalsData?.Overdue ?? 0,
        ],
        backgroundColor: ["#2ECC40", "#808080", "#0074D9", "#EC6B56"],
      },
    ],
  };
  return (
    <div className="h-[250px]">
      <Doughnut
        options={options}
        data={data}
        style={{
          padding: "15px",
        }}
      />
    </div>
  );
};

export default EmpGraph;

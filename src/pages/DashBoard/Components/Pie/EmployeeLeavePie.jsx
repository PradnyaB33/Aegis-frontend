import { Skeleton } from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect, useContext } from "react";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import { useQuery } from "react-query";
import { UseContext } from "../../../../State/UseState/UseContext";
import { useParams } from "react-router-dom";
import useLeaveTable from "../../../../hooks/Leave/useLeaveTable";

const EmployeeLeaveDonut = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const param = useParams();
  const organisationId = param?.id;

  // Fetch the total leaves from the API using useQuery
  const { data: totalLeaves, isLoading } = useQuery(
    "totalLeaves",
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get-all-leave-count/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },
    {
      enabled: !!authToken, // Only fetch if authToken exists
    }
  );

  // Fetch the remaining leaves
  const RemainingLeaves = useLeaveTable();
  const { data: remainingLeaves, isLoading: isLoading2 } = RemainingLeaves;

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // Helper function to prepare the data for each leave type's donut chart based on remainingLeaves
  const getDonutData = (remainingLeave) => {
    const totalLeave = totalLeaves?.data?.find(
      (leave) => leave._id === remainingLeave._id
    );

    const totalCount = totalLeave?.count ?? 0;
    const remainingCount = remainingLeave?.count ?? 0;
    const takenCount = totalCount - remainingCount;

    return {
      labels: [],
      datasets: [
        {
          data: [remainingCount, Math.max(takenCount, 0)],
          backgroundColor: [remainingLeave.color, "#D3D3D3"],
        },
      ],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const dataset = context.dataset.data;
            const remainingCount = dataset[0];
            const takenCount = dataset[1];
            if (context.dataIndex === 0) {
              return `Balance: ${remainingCount}`;
            } else {
              return `Taken: ${takenCount}`;
            }
          },
        },
      },
    },
    cutout: "70%",
  };

  const renderSkeletons = (count) => {
    return Array(count)
      .fill(0)
      .map((_, index) => (
        <div
          key={index}
          className="relative w-full h-[180px] bg-white border-[0.5px] border-[#E5E7EB] rounded-lg shadow-sm flex flex-col items-center p-4"
        >
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="circular" width={120} height={120} />
          <Skeleton variant="text" width="50%" height={20} />
        </div>
      ));
  };

  return (
    <article className="mb-2 w-full h-max">
      <div className="flex flex-col">
        <h1 className=" font-semibold text-[#67748E] mb-4 text-[20px]">
          Leave Balance
        </h1>
        {isLoading || isLoading2 ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
            {renderSkeletons(3)} {/* Number of skeletons based on expected items */}
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
            {remainingLeaves?.leaveTypes?.map((remainingLeave) => {
              const remainingCount = remainingLeave?.count ?? 0;

              return (
                <div
                  key={remainingLeave._id}
                  className="relative w-full h-[180px] bg-white border-[0.5px] border-[#E5E7EB] rounded-lg shadow-sm flex flex-col items-center p-4"
                >
                  {/* Leave Name with 20px space below */}
                  <div className="text-center font-semibold text-[#67748E] ">
                    {remainingLeave.leaveName}
                  </div>
                  <div className="relative flex justify-center w-full h-full">
                    <Doughnut
                      data={getDonutData(remainingLeave)}
                      options={options}
                      className="w-[70%] h-[70%]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-sm  font-bold text-[#67748E]">
                        {remainingCount} balance
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
};

export default EmployeeLeaveDonut;

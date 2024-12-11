import React from "react";
import CardLoader from "../../components/card-loader";
import MainTrainingCard from "../../components/training-card";
import useGetUpcomingTrainings from "./use-query";

const Modal1 = () => {
  const { data, isLoading } = useGetUpcomingTrainings();
  if (isLoading)
    return (
      <div className="flex flex-col gap-4 ">
        <h2 className="text-2xl font-bold">Upcoming Trainings</h2>
        {[1, 2, 3].map((item) => (
          <CardLoader key={item} />
        ))}
      </div>
    );
  return (
    <div className="flex flex-col gap-4 ">
      <h2 className="text-2xl font-bold">Upcoming Trainings</h2>
      {data?.data?.map((item) => (
        <MainTrainingCard isUpComing={true} key={item.id} doc={item} />
      ))}
    </div>
  );
};

export default Modal1;

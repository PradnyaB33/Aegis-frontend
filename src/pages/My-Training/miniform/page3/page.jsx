import React from "react";
import CardLoader from "../../components/card-loader";
import MainTrainingCard from "../../components/training-card";
import useGetOverdueTrainings from "./use-query-page3";

const Modal3 = () => {
  const { data, isLoading } = useGetOverdueTrainings();
  if (isLoading)
    return (
      <div className="flex flex-col gap-4 ">
        <h2 className="text-2xl font-bold">Overdue Trainings</h2>
        {[1, 2, 3].map((item) => (
          <CardLoader key={item} />
        ))}
      </div>
    );
  return (
    <div className="flex flex-col gap-4 ">
      <h2 className="text-2xl font-bold">Overdue Trainings</h2>
      {data?.data?.map((item) => (
        <MainTrainingCard key={item.id} doc={item} />
      ))}
    </div>
  );
};

export default Modal3;

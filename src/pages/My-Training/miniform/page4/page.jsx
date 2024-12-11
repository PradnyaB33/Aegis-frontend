import React from "react";
import CardLoader from "../../components/card-loader";
import TrainingCard3 from "./training-card";
import useGetCompletedTraining from "./use-query-page3";

const Modal4 = () => {
  const { data, isLoading } = useGetCompletedTraining();
  if (isLoading)
    return (
      <div className="flex flex-col gap-4 ">
        <h2 className="text-2xl font-bold">Completed Trainings</h2>
        {[1, 2, 3].map((item) => (
          <CardLoader key={item} />
        ))}
      </div>
    );
  return (
    <div className="flex flex-col gap-4 ">
      <h2 className="text-2xl font-bold">Completed Trainings</h2>
      {data?.data?.map((item) => (
        <TrainingCard3 key={item.id} doc={item} />
      ))}
    </div>
  );
};

export default Modal4;

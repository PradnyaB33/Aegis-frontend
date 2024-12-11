import React from "react";
import CardLoader from "../../components/card-loader";
import TrainingCard2 from "./training-card";
import useGetOngoingTrainings from "./use-query-page2";

const Modal2 = () => {
  const { data, isLoading } = useGetOngoingTrainings();
  if (isLoading)
    return (
      <div className="flex flex-col gap-4 ">
        <h2 className="text-2xl font-bold">Ongoing Trainings</h2>
        {[1, 2, 3].map((item) => (
          <CardLoader key={item} />
        ))}
      </div>
    );
  return (
    <div className="flex flex-col gap-4 ">
      <h2 className="text-2xl font-bold">Ongoing Trainings</h2>
      {data?.data?.map((item) => (
        <TrainingCard2 key={item.id} doc={item} />
      ))}
    </div>
  );
};

export default Modal2;

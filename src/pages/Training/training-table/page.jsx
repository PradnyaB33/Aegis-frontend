import React from "react";
import useTrainingHook from "../../../hooks/QueryHook/Training/hook";
import TableRow from "./components/TableRow";
import Bottom from "./components/bottom";
import TrainingTableLoading from "./components/loading-skeleton";

const TrainingTable = ({ mainData }) => {
  const { data, isLoading } = useTrainingHook();

  return (
    <>
      <div className="w-full bg-white text-left text-sm font-light flex flex-col gap-4">
        <h1 className="text-sm font-bold underline text-right">
          Total trainings created {data?.totalResults}
        </h1>
        <div className="flex flex-col gap-4">
          {isLoading && <TrainingTableLoading />}
          {data?.data?.map((doc) => (
            <TableRow
              logo={doc?.trainingLogo}
              name={doc?.trainingName}
              duration={doc?.trainingDuration}
              doc={doc}
            />
          ))}
        </div>
      </div>
      <Bottom />
    </>
  );
};

export default TrainingTable;

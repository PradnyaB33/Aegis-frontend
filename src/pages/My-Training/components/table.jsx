import { Button } from "@mui/material";
import React from "react";
import Select from "react-select";
import useSetupTraining from "../../../hooks/QueryHook/Setup/training";
import useGetDepartments from "../../Training/components/stepper/components/step2/step2-hook";
import TrainingCard from "./card";
import CardLoader from "./card-loader";
import useMyTrainingStore from "./my-training-zustand";

const EmployeeTable = ({ data, setPage, isLoading, totalResult, page }) => {
  const {
    trainingName,
    setTrainingName,
    setTrainingDepartment,
    setTrainingType,
  } = useMyTrainingStore();
  const { data: department } = useGetDepartments();
  const { data: trainingTypeData } = useSetupTraining();
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex gap-8 w-full justify-between">
        <input
          value={trainingName}
          placeholder={"Search on keyword"}
          className={`border-gray-300 bg-white outline-none px-2 border rounded-md w-[-webkit-fill-available]`}
          onChange={(e) => setTrainingName(e.target.value)}
        />
        <Select
          placeholder={"Department"}
          styles={{
            control: (styles) => ({
              ...styles,
              boxShadow: "none",
            }),
          }}
          isClearable={true}
          className={` bg-white w-full !outline-none px-2 !shadow-none !border-none !border-0`}
          components={{
            IndicatorSeparator: () => null,
          }}
          options={
            department?.data?.map((item) => ({
              value: item._id,
              label: item.departmentName,
            })) ?? []
          }
          onChange={(e) => setTrainingDepartment(e)}
        />
        <Select
          placeholder={"Training Type"}
          styles={{
            control: (styles) => ({
              ...styles,
              boxShadow: "none",
            }),
          }}
          className={` bg-white w-full !outline-none px-2 !shadow-none !border-none !border-0`}
          components={{
            IndicatorSeparator: () => null,
          }}
          isClearable={true}
          options={trainingTypeData?.data?.trainingType}
          onChange={(e) => setTrainingType(e)}
        />
      </div>
      {isLoading && [1, 2, 3].map((item) => <CardLoader key={item} />)}
      {data?.map((item) => (
        <TrainingCard key={item.id} doc={item} />
      ))}
      <div className="flex justify-between ">
        <Button
          onClick={() => {
            setPage((prev) => prev - 1);
          }}
          variant="contained"
          disabled={page === 1 || totalResult > page * 3}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setPage((prev) => prev + 1);
          }}
          disabled={totalResult <= data?.length ?? false}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default EmployeeTable;

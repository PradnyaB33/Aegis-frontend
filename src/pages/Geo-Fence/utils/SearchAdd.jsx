import { Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import useGeoMutation from "../Mutation/useGeoCard";
import SmallInputForm from "../utils/SmallInputForm";
import SearchTableComponent from "./SearchAndAdd/SearchTableComponent";

const SearchAdd = ({ onClose, circleId }) => {
  const { handleSubmit, register, setValue, watch } = useForm();
  const { removeEmployeeToCircleMutate } = useGeoMutation();

  const onSubmit = (data) => {
    const selected = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== false) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const selectedId = Object.keys(selected).filter(
      (key) => key !== "selectAll"
    );
    removeEmployeeToCircleMutate({ circleId, employeeId: selectedId, onClose });
  };

  const selectedEmployee = Object.keys(
    Object.entries(watch()).reduce((acc, [key, value]) => {
      if (value !== false) {
        acc[key] = value;
      }
      return acc;
    }, {})
  ).filter((key) => key !== "selectAll");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4 flex-col">
      <SmallInputForm circleId={circleId} />
      <div className="flex flex-col gap-4 max-h-[300px] overflow-auto h-auto">
        <SearchTableComponent
          register={register}
          setValue={setValue}
          watch={watch}
        />
      </div>
      <Button
        disabled={!(selectedEmployee?.length > 0)}
        type="submit"
        variant="contained"
      >
        Remove
      </Button>
    </form>
  );
};

export default SearchAdd;

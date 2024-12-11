// import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Button } from "@mui/material";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import useEmployeeListStore from "../Mutation/employeeListStore";
import useGeoMutation from "../Mutation/useGeoCard";
import SmallInputForm from "../utils/SmallInputForm";
import TableComponent from "../utils/TableComponent";

//get added employee in geofence area
const fetchAddedEmployee = async (circleId) => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API}/route/geo-fence/${circleId}/employee`
  );
  return data?.data;
};

const ViewDelete = ({ onClose, circleId }) => {
  const { handleSubmit, register, setValue, watch } = useForm();
  const { addEmployeeToCircleMutate } = useGeoMutation();

  const { incrementPage, decrementPage, employeeList, page } =
    useEmployeeListStore();

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
    addEmployeeToCircleMutate({ circleId, employeeId: selectedId, onClose });
  };
  // const selectedEmployee = Object.keys(
  //   Object.entries(watch()).reduce((acc, [key, value]) => {
  //     if (value !== false) {
  //       acc[key] = value;
  //     }
  //     return acc;
  //   }, {})
  // ).filter((key) => key !== "selectAll");

  //useQuery for get added employee in geofence area
  const { data: addedEmployee } = useQuery(
    ["geoFencingAddedEmployee", circleId],
    () => fetchAddedEmployee(circleId),
    {
      enabled: !!circleId,
    }
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex gap-4 flex-col overflow-scroll"
    >
      <SmallInputForm circleId={circleId} />
      <div className="flex flex-col gap-4 max-h-[300px] overflow-auto h-auto">
        <TableComponent
          register={register}
          setValue={setValue}
          watch={watch}
          addedEmployee={addedEmployee}
        />
      </div>
      <div className="flex flex-row-reverse gap-4">
        <Button
          type="button"
          onClick={incrementPage}
          disabled={employeeList?.length < 10}
          variant="outlined"
          className="!py-1 !w-[20px]"
        >
          Next
        </Button>
        <Button
          onClick={decrementPage}
          disabled={page <= 0}
          type="button"
          variant="outlined"
          className="!py-1 !w-[20px]"
        >
          Pre
        </Button>
      </div>
      <Button
        // disabled={!(selectedEmployee?.length > 0)}
        type="submit"
        variant="contained"
      >
        Save
      </Button>
    </form>
  );
};

export default ViewDelete;

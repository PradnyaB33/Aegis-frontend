import { Info } from "@mui/icons-material";
import { Skeleton } from "@mui/material";
import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import Setup from "../../SetUpOrganization/Setup";
import AddShiftModal from "./components/shift-add-model";
import ShiftRow from "./components/shift-row";
import useShiftQuery from "./hook/useShiftQuery";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BasicButton from "../../../components/BasicButton";
const Shifts = () => {
  const [open, setOpen] = React.useState(false);
  const { data, isLoading, deleteMutation, addMutate, editMutate } =
    useShiftQuery();

  return (
    <BoxComponent sx={{ p: 0 }}>
      <Setup>
        <div className="h-[90vh] overflow-y-auto scroll px-3">
          <div className="xs:block sm:block md:flex justify-between items-center ">
            <HeadingOneLineInfo
              className="!my-3"
              heading="Shifts"
              info=" Create multiple types of shifts applicable to all employees.
                        Ex: morning, afternoon."
            />
            <BasicButton title={"Add Shift"} onClick={() => setOpen(true)} />
          </div>

          {isLoading ? (
            <div className="space-y-2">
              <Skeleton
                variant="rounded"
                className="!w-full !h-[5vh]"
              />
              <Skeleton
                variant="rounded"
                className="!w-full !h-[5vh]"
              />
            </div>
          ) : data?.shifts?.length > 0 ? (
            <div className=" xs:mt-3 sm:mt-3 md:mt-0">
              <table className="min-w-full bg-white  text-left !text-sm font-light">
                <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                  <tr className="!font-semibold">
                    <th scope="col" className=" !text-left pl-8 py-3">
                      Sr. No
                    </th>
                    <th scope="col" className=" !text-left pl-8 py-3">
                      Shift Name
                    </th>
                    <th scope="col" className=" !text-left pl-8 py-3">
                      Working From
                    </th>
                    <th scope="col" className=" !text-left pl-8 py-3">
                      Shift Start Time
                    </th>
                    <th scope="col" className=" !text-left pl-8 py-3">
                      Shift End Time
                    </th>
                    <th scope="col" className=" !text-left pl-8 py-3">
                      Allowance
                    </th>
                    <th scope="col" className=" !text-left pl-8 py-3">
                      Week Days
                    </th>
                    <th scope="col" className=" !text-left pl-8 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.shifts &&
                    data?.shifts?.map((items, index) => (
                      <ShiftRow
                        key={index}
                        index={index}
                        items={items}
                        editMutate={editMutate}
                        deleteMutation={deleteMutation}
                      />
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
              <article className="flex items-center mb-1 text-red-500 gap-2">
                <Info className="text-2xl" />
                <h1 className="text-lg font-semibold">Add Shift</h1>
              </article>
              <p>No shifts found. Please add type of shift.</p>
            </section>
          )}



        </div>



      </Setup>


      <AddShiftModal
        addMutate={addMutate}
        open={open}
        handleClose={() => setOpen(false)}
      />
    </BoxComponent>
  );
};

export default Shifts;

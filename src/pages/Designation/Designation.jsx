import { Info } from "@mui/icons-material";
import React, { useState } from "react";
import Setup from "../SetUpOrganization/Setup";
import DesignationRow from "./components/desingation-row";
import AddDesignation from "./components/mini-form-add";
import useDesignation from "./hooks/useDesignation";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BasicButton from "../../components/BasicButton";

const Designation = () => {
  const [click, setClick] = useState(false);
  const {
    designation,
    addDesignationMutation,
    updateDesignationMutation,
    deleteDesignationMutation,
    isFetching,
  } = useDesignation();

  return (
    <BoxComponent sx={{ p: 0 }}>
      <Setup>
        <div className="h-[90vh] overflow-y-auto scroll px-3">
          <div className="xs:block sm:block md:flex justify-between items-center ">
            <HeadingOneLineInfo
              className="!my-3"
              heading="Designation"
              info="Add multiple designation to your organisation."
            />
            <BasicButton title="Add Designation" onClick={() => setClick(true)} />
          </div>
          {designation?.length > 0 ? (
            <div className=" xs:mt-3 sm:mt-3 md:mt-0">
              <table className="min-w-full bg-white  text-left !text-sm font-light">
                <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                  <tr className="!font-semibold">
                    <th scope="col" className="whitespace-nowrap !text-left pl-8 py-3">
                      Sr. No
                    </th>
                    <th scope="col" className="whitespace-nowrap !text-left pl-8 py-3">
                      Designation Name
                    </th>
                    <th scope="col" className="whitespace-nowrap !text-left pl-8 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!isFetching &&
                    designation?.map((data, id) => (
                      <DesignationRow
                        key={id}
                        {...{
                          data,
                          id,
                          deleteDesignationMutation,
                          updateDesignationMutation,
                        }}
                      />
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
              <article className="flex items-center mb-1 text-red-500 gap-2">
                <Info className="text-2xl" />
                <h1 className="text-lg font-semibold">Add Designation</h1>
              </article>
              <p>No designation found. Please add a designation.</p>
            </section>
          )}</div>
        <AddDesignation
          {...{
            open: click,
            handleClose: () => setClick(false),
            addDesignationMutation,
          }}
        />
      </Setup>
    </BoxComponent >
  );
};

export default Designation;

import { PlayCircle } from "@mui/icons-material";
import React from "react";
import useFunctions from "../hooks/useFunctions";

const CalculationComponent = ({ section, heading, amount, investments }) => {
  const { setIsOpenCalculation, isOpenCalculation } = useFunctions();
  const handleToggleSection = () => {
    setIsOpenCalculation(section);
  };
  return (
    <div className="  w-full">
      <header className="flex  py-3 px-4  gap-2 justify-between">
        <div className="flex gap-2 items-center">
          <PlayCircle
            onClick={handleToggleSection}
            className={`text-blue-500 ${
              isOpenCalculation.includes(section) ? "rotate-45" : "rotate-0"
            } cursor-pointer`}
          />
          <h1 className="text-lg font-bold text-gray-700 leading-none">
            {heading}
          </h1>
        </div>

        <h1 className="text-lg  font-bold text-gray-700 leading-none">
          ₹ {amount}
        </h1>
      </header>

      {isOpenCalculation.includes(section) && (
        <div className="overflow-auto  px-4">
          <table className="w-full table-auto  border border-collapse min-w-full bg-white  text-left  !text-sm font-light">
            <thead className="border  bg-gray-100  font-bold">
              <tr className="!font-semibold ">
                <th scope="col" className="!text-left px-2 w-max py-3 text-sm ">
                  Sr. No
                </th>
                <th scope="col" className="py-3 text-sm px-2 ">
                  Component
                </th>
                <th scope="col" className="py-3 text-sm px-2 ">
                  Declaration
                </th>
              </tr>
            </thead>
            <tbody>
              {investments?.filter((item) => {
                return item?.sectionname === section;
              }).length <= 0 ? (
                <tr className={`p-4 bg-white  !font-medium  w-max border-b `}>
                  <h1 className="p-4">No Data Found</h1>
                </tr>
              ) : (
                investments
                  ?.filter((item) => {
                    return item?.sectionname === section;
                  })
                  ?.map((inv, id) => {
                    return (
                      <tr
                        className={` bg-white  !font-medium  w-max border-b `}
                      >
                        <td className="!text-left py-3 px-2   w-[70px]  ">
                          {id + 1}
                        </td>
                        <td className="!text-left py-3 px-2    ">
                          {inv?.name}
                        </td>
                        <td className="!text-left py-3 px-2    ">
                          {inv?.amountAccepted}
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CalculationComponent;

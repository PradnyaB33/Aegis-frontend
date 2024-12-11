import { Skeleton } from "@mui/material";
import React from "react";

const SkeletonSalaryInput = () => {
  // Define an array of background colors for alternating rows
  const numberArray = [1, 2, 3, 4, 5];

  return (
    <>
      <table className="min-w-full bg-white px-4  text-left !text-sm font-light">
        <thead className="bg-gray-200  !font-medium ">
          <tr className="!font-semibold ">
            <th scope="col" className="!text-left px-6 py-3 ">
              Sr. No
            </th>
            <th className="py-3 ">Template Name</th>
            <th className="px-6 py-3 ">Template Description</th>
            <th className="px-6 py-3 ">Employment Type</th>
            <th className="px-6 py-3 ">Salary Structure</th>
            <th className="px-6 py-3 ">Actions</th>
          </tr>
        </thead>
        {numberArray.map((i) => (
          <tbody key={i}>
            <tr
              className={`${
                i % 2 === 0 ? "bg-gray-50" : "bg-white"
              } border-b dark:border-neutral-500`}
            >
              <td className="px-6 py-3 ">
                <Skeleton width={50} height={20} />
              </td>
              <td className="px-6 py-3 ">
                <Skeleton width={150} height={20} />
              </td>
              <td className="px-6 py-3 ">
                <Skeleton width={80} height={20} />
              </td>
              <td className="px-6 py-3 ">
                <Skeleton width={50} height={20} />
              </td>
              <td className="px-6 py-3 ">
                <Skeleton width={50} height={20} />
              </td>
              <td className="px-6 py-3 ">
                <Skeleton width={100} height={20} />
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    </>
  );
};

export default SkeletonSalaryInput;

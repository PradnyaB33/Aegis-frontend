import { Skeleton } from "@mui/material";
import React from "react";

const SkeletonForLeaveTypes = () => {
  // Define an array of background colors for alternating rows
  const numberArray = [1, 2, 3, 4, 5];

  return (
    <>
      {numberArray.map((i) => (
        <tr
          key={i}
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
      ))}
    </>
  );
};

export default SkeletonForLeaveTypes;

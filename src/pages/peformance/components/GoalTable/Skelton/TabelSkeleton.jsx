import Skeleton from "@mui/material/Skeleton";
import React from "react";

const TabelSkeleton = () => {
  return (
    <div className="overflow-auto">
      <table className="w-full table-auto border border-collapse min-w-full bg-white text-left !text-sm font-light">
        <thead className="border-b bg-gray-100 font-bold">
          <tr className="!font-semibold">
            <th scope="col" className="!text-left px-2 w-max py-3 text-sm">
              <Skeleton variant="text" width={60} />
            </th>
            {/* <th scope="col" className="py-3 text-sm px-2">
              <Skeleton variant="text" width={60} />
            </th> */}
            <th scope="col" className="py-3 text-sm px-2">
              <Skeleton variant="text" width={100} />
            </th>
            <th scope="col" className="py-3 text-sm px-2">
              <Skeleton variant="text" width={60} />
            </th>
            <th scope="col" className="py-3 text-sm ">
              <Skeleton variant="text" width={60} />
            </th>
            <th scope="col" className="py-3 text-sm ">
              <Skeleton variant="text" width={60} />
            </th>
            <th scope="col" className="py-3 text-sm ">
              <Skeleton variant="text" width={60} />
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(10)].map((_, id) => (
            <tr
              key={id}
              className="hover:bg-gray-50 !font-medium w-max border-b"
            >
              <td className="!text-left cursor-pointer py-4 px-2 text-sm w-[70px]">
                <Skeleton variant="text" width={60} />
              </td>
              {/* <td className="w-[30px] hover:bg-gray-50 !font-medium border-b">
                <Skeleton variant="circle" width={40} height={40} />
              </td> */}
              <td className="text-sm cursor-pointer truncate text-left px-2">
                <Skeleton variant="text" width={200} />
              </td>
              <td className="text-sm cursor-pointer text-left px-2">
                <div className="flex items-center gap-4">
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton variant="text" width={60} />
                </div>
              </td>
              <td className="cursor-pointer text-left !p-0 !w-[250px]">
                <Skeleton variant="text" width={60} />
              </td>
              <td className="cursor-pointer text-left text-sm w-[200px]">
                <Skeleton variant="text" width={60} />
              </td>
              <td className="cursor-pointer text-left text-sm">
                <Skeleton variant="text" width={60} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border-[.5px] border-gray-200 border-t-0 px-4 py-2 h-full items-center w-full justify-between">
        <div>
          <Skeleton variant="text" width={60} />
        </div>
        <Skeleton variant="text" width={60} />
      </div>
    </div>
  );
};

export default TabelSkeleton;

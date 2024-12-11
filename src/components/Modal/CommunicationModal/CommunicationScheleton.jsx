import Skeleton from "@mui/material/Skeleton";
import React from "react";

const CommunicationScheleton = () => {
  return (
    <>
      <table className="min-w-full bg-white  text-left !text-sm font-light">
        <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
          <tr className="!font-semibold ">
            <th scope="col" className="!text-left pl-8 py-3 ">
              Sr. No
            </th>
            <th scope="col" className="px-6 py-3">
              Communication Type
            </th>
            <th scope="col" className="px-6 py-3 ">
              From
            </th>
            <th scope="col" className=" px-9 py-3 ">
              To
            </th>
            <th scope="col" className=" px-9 py-3 ">
              CC
            </th>
            <th scope="col" className=" px-9 py-3 ">
              BCC
            </th>
            <th scope="col" className=" px-9 py-3 ">
              Subject
            </th>
            <th scope="col" className=" px-9 py-3 ">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {[1, 2].map((id) => (
            <tr className="!font-medium border-b" key={id}>
              <td className="!text-left pl-8 py-3 ">
                <Skeleton width={20} animation="wave" />
              </td>
              <td className="py-3">
                <Skeleton width={100} animation="wave" />
              </td>
              <td className="whitespace-nowrap px-6 py-2">
                <Skeleton variant="rounded" width={46} animation="wave" />
              </td>
              <td className="whitespace-nowrap px-6 py-2">
                <Skeleton variant="rounded" width={46} animation="wave" />
              </td>
              <td className="whitespace-nowrap px-6 py-2">
                <Skeleton variant="rounded" width={46} animation="wave" />
              </td>
              <td className="whitespace-nowrap px-6 py-2">
                <Skeleton variant="rounded" width={46} animation="wave" />
              </td>
              <td className="whitespace-nowrap px-6 py-2">
                <Skeleton variant="rounded" width={46} animation="wave" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default CommunicationScheleton;

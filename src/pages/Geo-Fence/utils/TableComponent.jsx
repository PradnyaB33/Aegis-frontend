import React, { useEffect } from "react";
import useEmployeeListStore from "../Mutation/employeeListStore";

const TableComponent = ({ register, setValue, watch, addedEmployee = [] }) => {
  const { employeeList } = useEmployeeListStore();
  const allSelected = watch("selectAll");

  useEffect(() => {
    employeeList.forEach((item) => {
      setValue(`${item._id}`, allSelected || addedEmployee.some(emp => emp._id === item._id));
    });
  }, [allSelected, employeeList, setValue, addedEmployee]);

  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    setValue("selectAll", checked);
    employeeList.forEach((item) => {
      setValue(`${item._id}`, checked);
    });
  };

  return (
    <table className="min-w-full bg-white text-left !text-sm font-light">
      <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
        <tr className="!font-semibold">
          <th scope="col" className="text-center py-3 w-1/12">
            <input
              type="checkbox"
              {...register("selectAll")}
              onChange={handleSelectAll}
              checked={allSelected}
            />
          </th>
          <th scope="col" className="py-3 w-2/12">
            First Name
          </th>
          <th scope="col" className="py-3 w-2/12">
            Last Name
          </th>
          <th scope="col" className="py-3 w-2/12">
            Email
          </th>
        </tr>
      </thead>
      <tbody>
        {employeeList?.map((item) => (
          <tr
            key={item._id}
            className="border-b border-gray-200 dark:border-neutral-700"
          >
            <td className="py-4 text-center">
              <input
                {...register(`${item._id}`)}
                type="checkbox"
                className="checkbox"
                value={item._id}
                checked={watch(`${item._id}`)}
              />
            </td>
            <td className="py-4">{item.first_name}</td>
            <td className="py-4">{item.last_name}</td>
            <td className="py-4">{item.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;

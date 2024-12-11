import React, { useState } from "react";
import { Search, Info } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import useDepartmentNotification from "../../hooks/QueryHook/notification/department-notification/hook";
import DepartmentApproval from "./DepartmentApproval";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";

const DepartmentNotification = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const { getDepartmnetData } = useDepartmentNotification();

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };
  const handleApprovalCompletion = () => {
    setSelectedEmployee(null);
  };

  let filteredEmployees = [];

  if (Array.isArray(getDepartmnetData)) {
    filteredEmployees = getDepartmnetData.filter(
      (creator) =>
        creator?.creator?.first_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        creator?.creator?.last_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  }

  return (
    <div>
      <section className="min-h-[90vh] flex">
        <article className="md:w-[25%] w-[200px] overflow-auto h-[90vh]">
          <div className="p-2 my-2 !py-2  ">
            <div className="space-y-2">
              <div
                className={`
                  flex  rounded-md items-center px-2 outline-none border-gray-200 border-[.5px]  bg-white py-1 md:py-[6px]`}
              >
                <Search className="text-gray-700 md:text-lg !text-[1em]" />
                <input
                  type={"text"}
                  placeholder={"Search Employee"}
                  className={`border-none bg-white w-full outline-none px-2`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          {filteredEmployees && filteredEmployees.length > 0 && (
            <div>
              {filteredEmployees?.map((employee) => (
                <div
                  className={`px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-gray-50`}
                  key={employee?.creator?._id}
                  onClick={() => handleEmployeeClick(employee)}
                >
                  <Avatar src={employee?.avatarSrc} />
                  <div>
                    <h1 className="text-[1.2rem]">
                      {employee?.creator?.first_name}{" "}
                      {employee?.creator?.last_name}
                    </h1>

                    <h1 className={`text-sm text-gray-500`}>
                      {employee?.creator?.email}
                    </h1>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
        <div className="w-[75%] min-h-[90vh] border-l-[.5px]  bg-gray-50">
          <div className="px-4 pt-2">
            <HeadingOneLineInfo
              heading={"Add Department Requests"}
              info={
                " Here you would be able to approve or reject the add department notifications"}
            /></div>
          {selectedEmployee ? (
            <DepartmentApproval
              employee={selectedEmployee}
              onApprovalCompletion={handleApprovalCompletion}
            />
          ) : (
            <div className="flex px-4 w-full items-center my-4">
              <h1 className="text-lg w-full text-gray-700 border bg-blue-200 p-4 rounded-md">
                <Info /> Select employee to see their requests
              </h1>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DepartmentNotification;

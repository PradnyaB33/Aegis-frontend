import React, { useState } from "react";
import { Search, RequestQuote } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import useRecordHook from "../../hooks/record-hook/record-hook";
import ViewEmployeeRecord from "./components/ViewEmployeeRecord";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BoxComponent from "../../components/BoxComponent/BoxComponent";

const DocManageToHr = () => {
  // to define the state, hook ,import other function if needed
  const { getRecordOfEmployee } = useRecordHook();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  console.log("getRecordOfEmployee", getRecordOfEmployee);

  // to filter the employee based on first nanae , last name
  const filteredEmployeesRecord =
    getRecordOfEmployee && Array.isArray(getRecordOfEmployee)
      ? getRecordOfEmployee.filter(
          (employee) =>
            employee.employeeId?.first_name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            employee.employeeId?.last_name
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        )
      : [];
  console.log("filter", filteredEmployeesRecord);

  // to define the function for get the employee those selected by user.
  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const employeeId = selectedEmployee && selectedEmployee?.employeeId?._id;
  console.log("empId", employeeId);

  return (
    <div className="w-full">
       <BoxComponent>
       <HeadingOneLineInfo heading={" Uploaded Record of Employee"}  />
      
      <section className="min-h-[90vh] flex">
        <article className="w-[20%] overflow-auto max-h-[90vh] h-full bg-white border-gray-200">
          <div className="p-6 !py-2">
            <div className="space-y-2">
              <div
                className={`flex rounded-md items-center px-2 outline-none border-gray-200 border-[.5px] bg-white py-1 md:py-[6px]`}
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
          {filteredEmployeesRecord.length > 0 && (
            <div>
              {filteredEmployeesRecord.map((employee) => (
                <div
                  className={`px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-gray-50`}
                  key={employee?.employeeId?._id}
                  onClick={() => handleEmployeeClick(employee)}
                >
                  <Avatar src={employee?.avatarSrc} />
                  <div>
                    <h1 className="text-[1.2rem]">
                      {employee?.employeeId?.first_name}{" "}
                      {employee?.employeeId?.last_name}
                    </h1>
                    <h1 className={`text-sm text-gray-500`}>
                      {employee.employeeId?.email}
                    </h1>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
        <div className="w-[80%]">
          {selectedEmployee ? (
            <ViewEmployeeRecord
              employee={selectedEmployee}
              employeeId={employeeId}
            />
          ) : (
            <div className="p-4 space-y-1 flex items-center gap-3">
              <Avatar className="text-white !bg-blue-500">
                <RequestQuote />
              </Avatar>
              <div>
                <h1 className=" text-xl">Uploaded Record of Employee</h1>
                <p className="text-sm">
                  {` Here you would be able to see uploaded record of employee`}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
      </BoxComponent>
    </div>
  );
};

export default DocManageToHr;

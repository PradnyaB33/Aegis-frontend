import { Calculate, Check, Settings, West } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import UserProfile from "../../hooks/UserData/useUser";
import RegimeModel from "./components/accountantDeclarations/components/RegimeModel";

const IncomeTax = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const { useGetCurrentRole, getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const role = useGetCurrentRole();

  const redirect = useNavigate();

  const handleClose = () => {
    setOpen(false);
  };

  const { organisationId } = useParams();
  const goBack = () => {
    // redirect(-1);
    if (role === "Super-Admin" || role === "Delegate-Super-Admin")
      return redirect(`/organisation/${organisationId}/dashboard/super-admin`);
    else if (role === "HR")
      return redirect(
        `/organisation/${user?.organizationId}/dashboard/HR-dashboard`
      );
    else if (role === "Delegate-Department-Head" || role === "Department-Head")
      return redirect(
        `/organisation/${user?.organizationId}/dashboard/DH-dashboard`
      );
    else if (role === "Accountant")
      return redirect(
        `/organisation/${user?.organizationId}/dashboard/employee-dashboard`
      );
    else if (role === "Manager")
      return redirect(`/organisation/${user?._id}/dashboard/manager-dashboard`);
    else if (role === "Employee")
      return redirect(
        `/organisation/${user?.organizationId}/dashboard/employee-dashboard`
      );
  };
  return (
    <>
      <section className=" min-h-[90vh]  h-auto  bg-gray-50 ">
        <header className="text-xl w-full pt-6 flex items-start gap-2 bg-white shadow-md   p-4">
          <IconButton onClick={goBack}>
            <West className=" !text-xl" />
          </IconButton>
          Income Tax
        </header>

        <div className="md:px-8 px-4 pt-6 space-y-4">
          <h1 className="pb-2 text-2xl ">Welcome to Income Tax Declaration</h1>

          <div className="bg-white border-[.5px] border-gray-200 p-4">
            <div className="mb-4 md:flex-row flex-col flex justify-between items-start md:items-center pr-2   w-full space-y-3">
              <h1 className="text-[1.2em]  text-gray-500">
                TDS Declarations and Others
              </h1>
              <button
                onClick={handleOpen}
                className="flex !p-0 h-max !m-0  gap-2 text-blue-500"
              >
                <Settings />
                Change regime settings
              </button>
            </div>

            <article className="flex flex-wrap gap-4 items-center">
              <Link
                to={`/organisation/${organisationId}/income-tax/calculation`}
                className="hover:scale-[1.02] transition-all"
              >
                <div className="flex-col w-[225px]  border-[.5px] border-gray-200 gap-3 flex items-center md:px-4 px-2 md:py-6 py-4 rounded-md shadow-sm">
                  <Avatar className="!bg-green-500">
                    <Calculate />
                  </Avatar>
                  <h1 className="text-lg">TDS calculation</h1>
                </div>
              </Link>

              <Link
                to={`/organisation/${organisationId}/income-tax/declarations`}
                className="hover:scale-[1.02] transition-all"
              >
                <div className="flex-col w-[225px]  border-[.5px] border-gray-200 gap-3 flex items-center md:px-4 px-2 md:py-6 py-4  rounded-sm shadow-sm">
                  <Avatar className="!bg-blue-500">
                    <Check />
                  </Avatar>
                  <h1 className="text-lg ">My declarations</h1>
                </div>
              </Link>
            </article>
          </div>

          {/* <div className="bg-white border-[.5px] border-gray-200 p-4">
            <div className="mb-4   w-full space-y-3">
              <h1 className="text-[1.2em] text-gray-500">TDS Requests</h1>
            </div>

            <article className="flex  gap-4 items-center">
              <Link
                to={
                  role === "Accountant"
                    ? `/notification/organisation/${organisationId}/income-tax`
                    : `/notification/organisation/${organisationId}/income-tax-details`
                }
                className="hover:scale-[1.02] transition-all"
              >
                <div className="flex-col w-[225px] bg-white border-[.5px] border-gray-200 gap-3 flex items-center px-4 py-6 rounded-sm shadow-sm">
                  <Avatar className="!bg-yellow-500">
                    <DoneAll />
                  </Avatar>
                  <h1 className="text-lg">Employee Declarations</h1>
                </div>
              </Link>
            </article>
          </div> */}
        </div>
        <RegimeModel handleClose={handleClose} open={open} />
      </section>
    </>
  );
};

export default IncomeTax;

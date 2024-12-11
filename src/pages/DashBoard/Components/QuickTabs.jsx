import { ListAlt, Room } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
const QuickTabs = () => {
  const { id } = useParams("");
  return (
    <>
      <h1 className=" font-semibold text-[#67748E] mb-4 text-[20px]">
        Quick Tabs
      </h1>
      <Link
        to={`/organisation/${id}/leave`}
        className="flex items-center border justify-around  bg-white p-2 rounded-sm"
      >
        <div className="space-y-1 grid  place-items-center ">
          <Avatar
            sx={{ bgcolor: "tomato" }}
            // src={hiearchyData?.getManager?.managerId?.user_logo_url}
          >
            <FaCalendarAlt color="white" />
          </Avatar>
          <h1 className="text-[#67748E] text-center  tracking-tighter font-bold">
            Attendance Calender
          </h1>
        </div>

        <Link
          to={`/organisation/${id}/view-payslip`}
          className="space-y-1 grid  place-items-center "
        >
          <Avatar
            className="!bg-lime-500"
            // src={hiearchyData?.getEmployee?.user_logo_url}
          >
            <ListAlt color="white" />
          </Avatar>
          <h1 className="text-[#67748E] text-center text-lg tracking-tighter font-bold">
            Payslip
          </h1>
        </Link>

        {/* {hiearchyData?.getReportee && ( */}
        <>
          <Link
            to={`/organisation/${id}/employee-remote-punching`}
            className="space-y-1 grid  place-items-center "
          >
            <Avatar className="!bg-violet-500">
              <Room color="white" />
            </Avatar>
            <h1 className="text-[#67748E] text-center  tracking-tighter font-bold">
              Remote Punching
            </h1>
          </Link>
        </>
        {/* )} */}
      </Link>
    </>
  );
};

export default QuickTabs;

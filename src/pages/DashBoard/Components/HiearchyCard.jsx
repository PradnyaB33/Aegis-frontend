import { KeyboardDoubleArrowRight } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import React from "react";
import useGetHiearchy from "../hooks/useGetHiearchy";

const HiearchyCard = () => {
  const { hiearchyData } = useGetHiearchy();
  return (
    <>
      <h1 className=" font-semibold text-[#67748E] mb-4 text-[20px]">
        Hierarchy
      </h1>
      <div className="flex items-center border justify-center gap-6 bg-white p-2 rounded-sm">
        {hiearchyData?.getManager && (
          <>
            <div className="space-y-1 grid  place-items-center ">
              <Avatar
                src={hiearchyData?.getManager?.managerId?.user_logo_url}
              />
              <h1 className="text-[#67748E] text-center  tracking-tighter font-bold">
                {hiearchyData?.getManager?.managerId?.first_name}{" "}
                {hiearchyData?.getManager?.managerId?.last_name}
              </h1>
            </div>
            <KeyboardDoubleArrowRight className="text-[#67748E] text-center text-lg tracking-tighter font-bold" />
          </>
        )}

        <div className="space-y-1 grid  place-items-center ">
          <Avatar src={hiearchyData?.getEmployee?.user_logo_url} />
          <h1 className="text-[#67748E] text-center text-lg tracking-tighter font-bold">
            {hiearchyData?.getEmployee?.first_name}{" "}
            {hiearchyData?.getEmployee?.last_name}
          </h1>
        </div>
        <KeyboardDoubleArrowRight className="text-[#67748E] text-center text-lg tracking-tighter font-bold" />

        {hiearchyData?.getReportee && (
          <>
            <div className="space-y-1 grid  place-items-center ">
              <Avatar src={hiearchyData?.getReportee?.user_logo_url} />
              <h1 className="text-[#67748E] text-center  tracking-tighter font-bold">
                {hiearchyData?.getReportee?.first_name}{" "}
                {hiearchyData?.getReportee?.last_name}
              </h1>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default HiearchyCard;

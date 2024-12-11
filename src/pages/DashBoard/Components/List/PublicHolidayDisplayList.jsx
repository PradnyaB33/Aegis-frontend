import { Info } from "@mui/icons-material";
import { Skeleton } from "@mui/material";
import Divider from "@mui/material/Divider";
import axios from "axios";
import { format } from "date-fns";
import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { UseContext } from "../../../../State/UseState/UseContext";
import BasicButton from "../../../../components/BasicButton";
import ReusableModal from "../../../../components/Modal/component";
import usePublicHoliday from "../../../SetUpOrganization/PublicHolidayPage/components/usePublicHoliday";

const PublicHolidayDisplayList = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const { id } = useParams();
  const GetUpcomingHoliday = async () => {
    const data = await axios.get(
      `${process.env.REACT_APP_API}/route/holiday/getUpcomingHoliday`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return data;
  };

  const { data: upcomingHoliday, isLoading } = useQuery(
    ["upcomingHolidays", authToken],
    GetUpcomingHoliday
  );

  const { data } = usePublicHoliday(id);

  const groupDataByMonth = (data) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const groupedData = data?.reduce((acc, item) => {
      const date = new Date(item?.date);
      const month = months[date.getMonth()]; // Get the month name

      // Find the month object in the accumulator
      let monthObj = acc?.find((m) => m.month === month);

      // If the month object doesn't exist, create it
      if (!monthObj) {
        monthObj = { month, data: [] };
        acc.push(monthObj);
      }

      // Add the item to the month object's data array
      monthObj.data.push(item);

      return acc;
    }, []);

    // Sort the grouped data by month
    groupedData?.sort(
      (a, b) => months.indexOf(a.month) - months.indexOf(b.month)
    );

    // Sort the items within each month by date
    groupedData?.forEach((monthObj) => {
      monthObj.data.sort((a, b) => new Date(a.date) - new Date(b.date));
    });

    return groupedData;
  };

  // Group the data by month
  const groupedData = groupDataByMonth(data);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center  mb-4">
        <h1
          className="font-semibold text-[#67748E]"
          style={{ fontSize: "20px" }}
        >
          Upcoming Public Holiday
        </h1>
        <BasicButton
          title={"View More"}
          onClick={() => setOpen(true)}
          variant={"text"}
        />
      </div>
      <article>
        {isLoading ? (
          // Skeleton Loader while data is loading
          <div className="w-full h-[180px] bg-white border-[0.5px] border-[#E5E7EB] rounded-lg shadow-sm p-4">
            {[...Array(3)].map((_, index) => (
              <div key={index}>
                <Skeleton variant="text" width="70%" height={30} />
                <Skeleton variant="text" width="50%" height={20} />
                {index < 2 && (
                  <Divider variant="fullWidth" orientation="horizontal" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-auto w-full h-[180px] bg-white border-[0.5px] border-[#E5E7EB] rounded-lg shadow-sm ">
            {upcomingHoliday?.data?.upcomingHolidays?.length <= 0 ? (
              <div className="px-5 py-2  ">
                <div className="space-x-2 items-center text-red-600  flex">
                  <Info className="text-xl text-red-600" />
                  <h1 className="text-lg font-bold">No Vacations</h1>
                </div>
              </div>
            ) : (
              upcomingHoliday?.data?.upcomingHolidays?.map((item, id) => (
                <div key={id}>
                  <div className="p-4 flex items-center justify-between">
                    <h1 className="text-lg">{item.name}</h1>
                    <p className="text-md">
                      {format(new Date(item.date), "PP")}
                    </p>
                  </div>
                  <Divider variant="fullWidth" orientation="horizontal" />
                </div>
              ))
            )}
          </div>
        )}
      </article>

      <ReusableModal
        heading={"Public Holidays"}
        open={open}
        onClose={() => setOpen(false)}
      >
        <div>
          {groupedData?.map((monthObj) => (
            <div key={monthObj.month}>
              <h2 className="font-semibold text-lg text-[#67748E] my-2">
                {monthObj.month}
              </h2>
              {/* <h2 className="font-semibold text-xl text-[#67748E] my-2">
                {monthObj.month}
              </h2> */}
              <div>
                {monthObj.data.map((item, index) => (
                  <div key={index}>
                    <div className="my-2 bg-gray-50 p-2 rounded-md border">
                      <h1 className="text-lg  tracking-tighter ">
                        {item.name}
                      </h1>
                      <p className="text-md">
                        {format(new Date(item.date), "PP")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* <Divider variant="fullWidth" orientation="horizontal" /> */}
            </div>
          ))}
        </div>
      </ReusableModal>
    </div>
  );
};

export default PublicHolidayDisplayList;

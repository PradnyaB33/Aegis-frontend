import { Info, West } from "@mui/icons-material";
import { Button, Chip, IconButton, Skeleton } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import useIncomeTax from "../../hooks/IncomeTax/useIncomeTax";
import useAuthToken from "../../hooks/Token/useAuth";
import UserProfile from "../../hooks/UserData/useUser";

const IncomeTaxNotification = () => {
  const queryClient = useQueryClient();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  // const role = useGetCurrentRole();
  // const redirect = useNavigate();
  const authToken = useAuthToken();
  const { financialYear } = useIncomeTax();

  const { data: empTDSData, isLoading: empDataLoading } = useQuery({
    queryKey: ["TDSNotifyupdate"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/tds/getTDSUpdateNoti/${user._id}/${financialYear}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        return res?.data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("TDSNotify");
    },
  });

  const navigate = useNavigate();
  const [skip, setSkip] = useState(0);
  // const [status, setStatus] = useState(0);
  // console.log(`🚀 ~ status:`, status);

  // console.log(`🚀 ~ empTDSData:`, empTDSData);

  console.log(`🚀 ~ empTDSData:`, empTDSData);

  return (
    <section className=" min-h-[90vh]  h-auto  bg-gray-50 ">
      <header className="text-xl w-full pt-6 pb-2  flex items-start gap-2 bg-white border-b   p-4">
        <div onClick={() => navigate(-1)}>
          <IconButton>
            <West className="!text-xl" />
          </IconButton>
        </div>
        TDS Notifications
      </header>

      <div className="p-4 space-y-2  ">
        {/* <Select
          isClearable
          className="w-[250px] pb-4 z-50"
          aria-errormessage=""
          placeholder={"Select status"}
          components={{
            IndicatorSeparator: () => null,
          }}
          options={[
            { label: "Approved", value: "Approved" },
            { label: "Reject", value: "Reject" },
            // { label: "Pending", value: "Pending" },
          ].map((month) => ({
            label: month?.label,
            value: month?.value,
          }))}
          onChange={(value) => {
            if (value === null) {
              return setStatus("");
            }
            setStatus(value.value);
          }}
        /> */}
        {empDataLoading ? (
          <div className="bg-white py-4 px-8 rounded-md shadow-sm space-y-2">
            <div>
              <Skeleton variant="text" className="text-xl" />
              <Skeleton variant="text" className="text-gray-500" />
            </div>
            <Skeleton variant="rectangular" height={24} width={80} />
          </div>
        ) : empTDSData?.data?.length <= 0 ? (
          <div className="flex px-4 w-full items-center my-4">
            <h1 className="text-lg w-full  text-gray-700 border bg-blue-200 p-4 rounded-md">
              <Info /> No notification found
            </h1>
          </div>
        ) : (
          <>
            {empTDSData?.data?.map((ele, id) => (
              <div
                key={id}
                className="bg-white py-4 px-8 rounded-md border space-y-2"
              >
                <div className="flex  items-end gap-5">
                  <h1 className="md:text-xl   font-bold text-[#67748E]  tracking-tight">
                    Declaration on {ele?.name.toLowerCase()} was{" "}
                    {ele?.status.toLowerCase()} with amount INR{" "}
                    {ele?.amountAccepted}
                  </h1>
                </div>
                {ele.message && <span>{ele.message}</span>}

                <div className="flex items-center justify-between gap-4">
                  <Chip
                    size="small"
                    label={ele.status}
                    className={`
              ${ele.status === "Approved" ? "!bg-green-600" : "!bg-red-600"
                      } !text-white`}
                  />
                </div>
              </div>
            ))}
          </>
        )}
        <div className="flex pt-4 justify-between">
          <Button
            variant="contained"
            disabled={skip >= 0 ? true : false}
            onClick={() => {
              setSkip((prev) => prev - 1);
            }}
          // type="button"
          >
            Previous
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setSkip((prev) => prev + 1);
            }}
          // type="button"
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
};

export default IncomeTaxNotification;

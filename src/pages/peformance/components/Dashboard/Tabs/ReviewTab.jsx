import { Avatar } from "@mui/material";
import DOMPurify from "dompurify";
import React from "react";
import usePerformanceApi from "../../../../../hooks/Performance/usePerformanceApi";

const ReviewTab = () => {
  const { dashboardData: empData } = usePerformanceApi();
  console.log(`🚀 ~ empData:`, empData);
  return (
    <section>
      <h1 className="text-lg text-[#67748E]  mb-2 font-bold">
        Employee 360 Ratings{" "}
      </h1>

      <article className="gap-3 grid">
        {empData?.Rating?.map((item, id) => (
          <div className=" p-2  rounded-sm  space-y-2">
            <div className="flex gap-2 ">
              <Avatar />
              <div>
                <h1 className="text-lg">
                  Test User rated employee one as {item?.rating}
                </h1>

                <div className="flex justify-between">
                  <p
                    className="text-black/70 text-sm"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(item?.comment),
                    }}
                  ></p>

                  {/* <p> {format(new Date(), "PP")}</p> */}
                </div>

                {/* <h1 className="text-black/90 text-xs">27 feb 2002</h1> */}
              </div>
            </div>
          </div>
        ))}
      </article>
    </section>
  );
};

export default ReviewTab;

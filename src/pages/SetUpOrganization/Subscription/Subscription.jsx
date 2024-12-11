import { Skeleton } from "@mui/material";
import moment from "moment";
import React from "react";
import { useParams } from "react-router-dom";
import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";
import Setup from "../Setup";
import SubscriptionCard from "./components/subscription-card";
import SubscriptionRow from "./components/subscriptionRow";

const Subscription = () => {
  const { organisationId } = useParams();
  const { data, isLoading } = useSubscriptionGet({ organisationId });

  return (
    <>
      <section className="bg-gray-50 min-h-screen w-full">
        <Setup>
          <article>
            <div className="p-[30px] border-b-[.1px] flex items-center justify-between gap-3 w-full border-gray-300">
              <div className="flex items-center  gap-3">
                <div className="rounded-full bg-brand/purple h-[30px] w-[30px] flex items-center justify-center"></div>
                <h1 className="!text-lg font-bold tracking-wide text-brand/neautrals">
                  Membership & Billing
                </h1>
              </div>
            </div>
            <div className="p-[30px] grid grid-cols-3">
              <div className=" col-span-2 grid grid-cols-2 gap-[24px]">
                {/* {data?.} */}
                <SubscriptionRow
                  leftText={"Status"}
                  rightText={data?.subscription?.status}
                  loading={isLoading}
                  chip={true}
                />
                <SubscriptionRow
                  loading={isLoading}
                  leftText={"Packages"}
                  rightText={`${data?.organisation?.packages?.length} Package active`}
                />
                <SubscriptionRow
                  loading={isLoading}
                  leftText={"Plan Details"}
                  rightText={"AEGIS PLAN"}
                />
                <SubscriptionRow
                  loading={isLoading}
                  leftText={"Allowed Employee Count"}
                  rightText={`${getValue(
                    data?.organisation?.packages,
                    data?.organisation?.packages
                  )} Employees`}
                />
                <SubscriptionRow
                  loading={isLoading}
                  leftText={"Billing Amount"}
                  rightText={`${data?.plan?.item?.amount / 100} ₹ / Employee`}
                />
                <SubscriptionRow
                  loading={isLoading}
                  leftText={"Billing Frequency"}
                  rightText={`${data?.plan?.period}`}
                />
                <SubscriptionRow
                  loading={isLoading}
                  leftText={"Payment Link"}
                  rightText={`${data?.subscription?.short_url}`}
                  isUrl={true}
                />
              </div>
              <div className="col-span-1 text-brand/primary-blue grid justify-center text-xl font-bold">
                <img
                  src="/subscription-mail.svg"
                  alt="Subscription"
                  className="m-auto h-[175px]"
                />

                <div>
                  Your Next billing date is after
                  <span className="text-brand/neautrals">
                    {" "}
                    {isLoading ? (
                      <Skeleton className="!inline-block" width={10} />
                    ) : (
                      moment
                        .duration(
                          moment
                            .unix(data?.subscription?.charge_at)
                            .diff(moment())
                        )
                        .days()
                    )}
                  </span>{" "}
                  days
                </div>
              </div>
            </div>
            <div className="p-[30px] flex flex-col gap-4">
              <h1 className="!text-lg font-bold tracking-wide text-brand/neautrals">
                Active Packages
              </h1>
              <div className="w-full flex flex-row flex-wrap gap-8">
                {data?.organisation?.packages.map((doc, i) => {
                  return (
                    <SubscriptionCard
                      key={i}
                      header={doc[0]}
                      description={`Allowed employee count : ${doc[1]}`}
                    />
                  );
                })}
                <SubscriptionCard
                  header={"Add Packages"}
                  description={"You can add packages here"}
                  button={true}
                />
              </div>
            </div>
          </article>
        </Setup>
      </section>
    </>
  );
};

export default Subscription;
const getValue = (array = [], parentArray = []) => {
  const index = array.findIndex(([key, other]) => key === "basicPackageCount");

  return parentArray[index][1];
};

import React from "react";
import useOrgList from "../../hooks/QueryHook/Orglist/hook";
import BillingCard from "./components/billing-card";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";

const Billing = () => {
  const { data, isLoading } = useOrgList();
  return (
    <BoxComponent>
      <HeadingOneLineInfo heading={"Billing"} />
      {!isLoading &&
        data?.organizations?.map((doc, i) => {
          return <BillingCard key={i} doc={doc} />;
        })}
    </BoxComponent>
  );
};

export default Billing;

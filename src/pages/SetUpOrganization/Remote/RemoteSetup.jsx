import { Skeleton } from "@mui/material";
import React from "react";
import { useParams } from "react-router";
import Setup from "../Setup";
import useSetupRemotePunching from "../../../hooks/QueryHook/Setup/remote-punching";
import MiniForm from "./components/mini-form";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

const RemoteSetup = () => {
  //get organisationId
  const { organisationId } = useParams();
  const { data, isLoading, mutate } = useSetupRemotePunching(organisationId);
  return (
    <BoxComponent sx={{ p: 0 }}>
      <Setup>
        <div className="h-[90vh] overflow-y-auto scroll px-3">
          <div className="xs:block sm:block md:flex justify-between items-center ">
            <HeadingOneLineInfo
              className="!my-3"
              heading="Remote Punching And Geo Fencing"
              info="Configure remote punching and geo fencing settings"
            /></div>
          {isLoading ? (
            <div className="p-5 flex flex-col gap-5">
              <Skeleton variant="rectangular" height={32} />
              <Skeleton variant="rectangular" height={32} />
            </div>
          ) : (
            data && <MiniForm data={data} mutate={mutate} />
          )}
        </div>
      </Setup>
    </BoxComponent>
  );
};

export default RemoteSetup;

import { Skeleton } from "@mui/material";
import React from "react";
import { useParams } from "react-router";
import Setup from "../Setup";
import useSetupTraining from "../../../hooks/QueryHook/Setup/training";
import MiniForm from "./components/mini-form";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

const Training = () => {
  const { organisationId } = useParams();

  const { data, isLoading, mutate, isFetching } =
    useSetupTraining(organisationId);

  return (
    <BoxComponent sx={{ p: 0 }}>
      <Setup>
        <div className="h-[90vh] overflow-y-auto scroll px-3">
          <div className="xs:block sm:block md:flex justify-between items-center ">
            <HeadingOneLineInfo
              className="!my-3"
              heading="Training"
            />
          </div>
          {isLoading || isFetching ? (
            <div className="p-5 flex flex-col gap-5">
              <Skeleton variant="rectangular" height={32} />
              <Skeleton variant="rectangular" height={32} />
            </div>
          ) : (
            // data?.data && (
            <MiniForm
              data={data?.data}
              mutate={mutate}
              organisationId={organisationId}
            />
            // )
          )}</div>
      </Setup>
    </BoxComponent>
  );
};

export default Training;

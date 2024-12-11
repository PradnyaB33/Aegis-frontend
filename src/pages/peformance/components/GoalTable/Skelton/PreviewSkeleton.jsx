import { Skeleton } from "@mui/material";
import React from "react";

const PreviewSkeleton = () => {
  return (
    <>
      <div className="flex justify-between py-4 items-center  px-4">
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="circular" width={40} height={40} />
      </div>

      <div className="space-y-4 pb-4 px-4">
        <div className="flex justify-between">
          <div className="flex w-full gap-2 items-center">
            <Skeleton variant="rounded" width={200} height={35} />
            <Skeleton variant="rounded" width={200} height={35} />
          </div>
        </div>

        <div>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="text" width="100%" height={40} />
        </div>
        <div>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="text" width="100%" height={40} />
        </div>
        <div>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="text" width="100%" height={40} />
        </div>
      </div>
    </>
  );
};

export default PreviewSkeleton;

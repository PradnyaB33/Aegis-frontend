import Skeleton from "@mui/material/Skeleton";
import React from "react";
const SkeletonLeave = () => {
  return (
    <section className="w-full bg-white flex gap-4 ">
      <Skeleton
        sx={{
          height: "75vh",
          width: "30%",
        }}
        variant="rectangular"
      />
      <Skeleton
        sx={{
          height: "75vh",
          width: "70%",
        }}
        variant="rect"
      />
    </section>
  );
};

export default SkeletonLeave;

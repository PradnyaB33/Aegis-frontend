import { Button } from "@mui/material";

import React from "react";
import useLocationStore from "../../hooks/Location/useLocation";

export default function TestNaresh() {
  const { startLocationTracking, stopLocationTracking, data, count, start } =
    useLocationStore();
  console.log("from hook");

  return (
    <>
      <div className="w-full h-full bg-slate-200">
        <div className="flex  items-center justify-center h-[92vh]">
          <div className=" shadow-md rounded-xl bg-[white] gap-4 p-10 flex flex-col w-[200px] items-center justify-center">
            <Button
              color="success"
              onClick={startLocationTracking}
              variant="contained"
              size="small"
              disabled={start}
            >
              Punch IN
            </Button>
            <Button
              size="small"
              color="error"
              onClick={stopLocationTracking}
              variant="contained"
              disabled={!start}
            >
              Punch OUT
            </Button>
            <div>{count}</div>
            <div>lattitude is {data?.latitude}</div>
            <div>longitude is{data?.longitude}</div>
          </div>
        </div>
      </div>
    </>
  );
}

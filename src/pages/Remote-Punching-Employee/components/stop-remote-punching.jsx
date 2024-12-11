import { Stop } from "@mui/icons-material";
import { Button, Dialog, DialogContent, Fab } from "@mui/material";
import React, { useEffect, useState } from "react";
import useStartPunch from "../../../hooks/QueryHook/Location/independant-use-query";
import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";

const StopRemotePunch = ({ setStart, geoFencing }) => {
  //state
  const [open, setOpen] = useState(false);

  const { refetch } = useStartPunch();

  const { id, setEndTime } = useSelfieStore();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const stopRemotePunching = () => {
    setStart(false);
    navigator.geolocation.clearWatch(id);
    setEndTime();
    // clear location after 5 seconds
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  };

  return (
    <>
      <Fab
        variant="extended"
        className="!absolute bottom-12 right-12 !bg-primary !text-white"
        onClick={() => setOpen(true)}
      >
        <Stop sx={{ mr: 1 }} className={`animate-pulse text-white`} />
        {geoFencing === "geoFencing" ? "Stop Geo Fencing" : "Stop Remote Punching"}
      </Fab>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <div className="w-full text-center text-red-500">
            <h1 className="font-semibold text-3xl">Confirm Action</h1>
          </div>
          <h1 className="text-lg mt-2">
            {geoFencing === "geoFencing" ? "Are you sure you want to stop geo access?" : "Are you sure you want to stop remote access?"}
          </h1>
          <div className="flex gap-4 mt-4">
            <Button
              onClick={stopRemotePunching}
              size="small"
              variant="contained"
            >
              Yes
            </Button>
            <Button
              onClick={() => setOpen(false)}
              variant="contained"
              color="error"
              size="small"
            >
              No
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StopRemotePunch;

import { PlayArrow } from "@mui/icons-material";
import { Button, Dialog, DialogContent, Fab } from "@mui/material";
import * as React from "react";
import { useState, useEffect } from "react";
import useLocationMutation from "../../../hooks/QueryHook/Location/mutation";
import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";
import StopRemotePunch from "../../Remote-Punching-Employee/components/stop-remote-punching";
import useGetGeoFencing from "../../Remote-Punching-Employee/useGetGeoFencing";

export default function SpeedDialEmployee() {
  //hooks
  const { start, setStart, setStartTime, setGeoFencingArea } = useSelfieStore();
  const { getUserImage } = useLocationMutation();
  const { employeeGeoArea } = useGetGeoFencing();

  //state
  const [open, setOpen] = useState(false);
  const [isInGeoFence, setIsInGeoFence] = useState(false);
  const geoFencing = "geoFencing";

  useEffect(() => {
    const checkGeoFence = () => {
      if (!employeeGeoArea || !employeeGeoArea?.area || !navigator?.geolocation) return;

      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const isWithinGeoFence = employeeGeoArea.area.some((area) => {
          const distance = calculateDistance(
            latitude,
            longitude,
            area.center.coordinates[0],
            area.center.coordinates[1]
          );
          return distance <= area.radius;
        });

        setIsInGeoFence(isWithinGeoFence);
      });
    };

    checkGeoFence();
  }, [employeeGeoArea]);

  // Function to calculate the distance between two points (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371e3; // Radius of the Earth in meters
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in meters
    return distance;
  };

  const handleOperate = () => {
    setOpen(false);
    getUserImage.mutate();
    setStartTime();
    setGeoFencingArea(true);
  };

  return (
    <>
      {!start ? (
        <Fab
          disabled={!isInGeoFence}
          onClick={() => setOpen(true)}
          color="primary"
          variant="extended"
          className="!absolute bottom-12 right-12 !text-white"
        >
          <PlayArrow sx={{ mr: 1 }} className={`animate-pulse text-white`} />
          Start
        </Fab>
      ) : (
        <StopRemotePunch {...{ setStart, geoFencing }} />
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <div className="w-full text-center text-red-500">
            <h1 className="font-semibold text-3xl">Confirm Action</h1>
          </div>
          <h1 className="text-lg mt-2">
            Are you sure you want to start geo access?
          </h1>
          <div className="flex gap-4 mt-4">
            <Button onClick={handleOperate} size="small" variant="contained">
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
}

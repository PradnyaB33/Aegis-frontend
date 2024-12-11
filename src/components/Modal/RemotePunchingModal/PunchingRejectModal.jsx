import { Button } from "@mui/material";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import useNotificationRemotePunching from "../../../hooks/QueryHook/Remote-Punch/components/mutation";

const calculateDistance = (coords) => {
  let totalDistance = 0;
  const R = 6371; // Earth’s radius in kilometers

  for (let i = 1; i < coords.length; i++) {
    const lat1 = coords[i - 1].lat;
    const lon1 = coords[i - 1].lng;
    const lat2 = coords[i].lat;
    const lon2 = coords[i].lng;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    totalDistance += d;
  }

  return totalDistance.toFixed(2); // rounding to 2 decimal places for simplicity
};

const PunchingRejectModal = ({ items, length }) => {
  const navigate = useNavigate();
  const { organisationId } = useParams();

  const { notifyAccountantMutation, RejectManagerMutation } =
    useNotificationRemotePunching();
  const distanceTraveled =
    items.punchData[0].data && items.punchData[0].data.length > 1
      ? calculateDistance(items.punchData[0].data)
      : 0;
  const handleViewRouteClick = () => {
    const id = items._id;
    navigate(`/organisation/${organisationId}/remote/info/${id}`);
  };

  return (
    <div className="w-full">
      <div className="w-full h-auto bg-white flex p-4 pl-8 pr-8 justify-between items-center shadow-md mt-3">
        <div className="flex items-center">
          <div className="mr-9">
            <h1>
              {items.punchData[0].image === "" ? (
                <h1 className="font-semibold">Missed Punch Request</h1>
              ) : (
                <h1 className="font-semibold">Punch Request</h1>
              )}
            </h1>
            <div className="h-[100px] w-[100px] rounded-full">
              {items.punchData[0].image === "" ? (
                <img
                  style={{ objectFit: "cover" }}
                  src={items.employeeId.user_logo_url}
                  alt=""
                  srcset=""
                />
              ) : (
                <div className="h-[100px] w-[100px] rounded-full">
                  <img
                    style={{ objectFit: "cover" }}
                    src={items.punchData[0].image}
                    alt=""
                    srcset=""
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <h1 className="font-semibold">
              {items.employeeId.first_name} {items.employeeId.last_name}
            </h1>
            <h1>
              Date:{" "}
              {items?.createdAt && (
                <>{new Date(items?.createdAt).toLocaleDateString()} </>
              )}
            </h1>
            <h1>
              Start Time : {new Date(items?.createdAt).toLocaleTimeString()}
            </h1>
            <h1>
              End Time:{" "}
              {items.punchData[0].data && items.punchData[0].data.length > 0
                ? new Date(items?.updatedAt).toLocaleTimeString()
                : "N/A"}
            </h1>
            <h1>Total Distance Traveled: {distanceTraveled} Km </h1>

            {items.punchData[0].image === "" ? (
              ""
            ) : (
              <h1>Punching Restarted: {items.punchData.length} times</h1>
            )}
          </div>
        </div>
        <div>
          <div>
            <Button
              variant="contained"
              size="small"
              onClick={handleViewRouteClick}
            >
              View Route
            </Button>
          </div>
          <div className="flex gap-3 mt-3">
            <Button
              onClick={() => notifyAccountantMutation.mutate(items._id)}
              variant="contained"
              size="small"
            >
              Accept
            </Button>
            <Button
              onClick={() => RejectManagerMutation.mutate(items._id)}
              variant="contained"
              color="error"
              size="small"
            >
              Reject
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PunchingRejectModal;

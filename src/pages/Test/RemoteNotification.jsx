import FingerprintIcon from "@mui/icons-material/Fingerprint";
import HomeRepairServiceOutlinedIcon from "@mui/icons-material/HomeRepairServiceOutlined";
import NotificationsIcon from "@mui/icons-material/Notifications";
import WorkOffIcon from "@mui/icons-material/WorkOff";
import { Button } from "@mui/material";
import React from "react";
const RemoteNotification = () => {
  return (
    <div className="w-full h-full flex p-10 justify-between">
      <div className="w-[25%] mt-4 h-min shadow-md text-lg">
        <div className="p-3 flex items-center gap-3 w-full">
          {" "}
          <span>
            <NotificationsIcon />
          </span>
          <h1>Notification</h1>
        </div>
        <div className="p-3 flex items-center gap-3 w-full">
          <span>
            <WorkOffIcon />
          </span>
          <h1>Leave Notification</h1>
        </div>
        <div className="p-3 flex items-center gap-3 w-full">
          <span>
            <FingerprintIcon />
          </span>
          <h1>Remote Punching</h1>
        </div>
        <div className="p-3 flex items-center gap-3 w-full">
          <span>
            <HomeRepairServiceOutlinedIcon />
          </span>
          <h1>Shift Management</h1>{" "}
        </div>
      </div>
      <div className="w-[70%] mt-4 h-[80vh] shadow-md bg-[#f2f9fe] p-3">
        <div className="w-full h-auto bg-white flex p-4 pl-8 pr-8 justify-between items-center">
          <div className="flex items-center">
            <div className="mr-9">
              <div className="bg-black h-[150px] w-[150px] rounded-full"></div>
            </div>
            <div>
              <h1>Employee Requested For Remote Punching</h1>
              <h1>Start Location: Pune Station</h1>
              <h1>Total Distance Traveled: 2km</h1>
              <h1>Punching Restarted: 4 times</h1>
            </div>
          </div>
          <div>
            <Button variant="contained" size="small">
              View Route
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoteNotification;

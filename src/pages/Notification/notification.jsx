// import { NotificationImportant } from "@mui/icons-material";
import Box from "@mui/material/Box";
// import dayjs from "dayjs";
import React from "react";
import LeaveRejectmodal from "../../components/Modal/LeaveModal/LeaveRejectmodal";
import PunchAcceptModal from "../../components/Modal/RemotePunchingModal/PunchAcceptModal";
import ShiftRejectModel from "../../components/Modal/ShiftRequestModal/ShiftRejectModel";
// import Error from "./Error";
// import Loader from "./Loader";
import useLeaveNotificationHook from "../../hooks/QueryHook/notification/leave-notification/hook";
import usePunchNotification from "../../hooks/QueryHook/notification/punch-notification/hook";
import useShiftNotification from "../../hooks/QueryHook/notification/shift-notificatoin/hook";

const Notification = () => {
  const { data } = useLeaveNotificationHook();
  const { data: data2 } = useShiftNotification();
  const { data: data3 } = usePunchNotification();

  return (
    <>
      <Box
        className="py-2"
        sx={{
          flexGrow: 1,
          p: 5,
        }}
      ></Box>

      <div className="flex flex-col gap-8 px-8">
        {data2?.map((items, idx) => {
          return <ShiftRejectModel key={idx} items={items} />;
        })}
        {data?.leaveRequests?.map((items, idx) => (
          <LeaveRejectmodal key={idx} items={items} />
        ))}
        {data3?.map((items, idx) => (
          <PunchAcceptModal
            items={items}
            length={items.punchData?.length}
            key={idx}
          />
        ))}
      </div>
    </>
  );
};

export default Notification;

import React from "react";
import useShiftNotification from "../../hooks/QueryHook/notification/shift-notificatoin/hook";
import ShiftAcceptModal from "./ShiftAcceptModal";

const ShiftNotification = () => {
  const { data } = useShiftNotification();
  console.log(data);
  return (
    <div>
      <ShiftAcceptModal data={data} />;
    </div>
  );
};

export default ShiftNotification;

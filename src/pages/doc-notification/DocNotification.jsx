import React from "react";
import DocRejectModal from "../../components/Modal/DocModal/DocRejectModal";
import useDocNotification from "../../hooks/QueryHook/notification/document-notification/hook";
const DocNotification = () => {
  const { data } = useDocNotification();
  console.log("myItems", data);
  return (
    <div className="">
      {data?.data?.doc.map((items, idx) => (
        <DocRejectModal key={idx} items={items} />
      ))}
    </div>
  );
};

export default DocNotification;

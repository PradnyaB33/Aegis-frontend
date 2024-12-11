import React from "react";
import Form16Card from "./Form16Card";
import useForm16NotificationHook from "../../../hooks/QueryHook/notification/Form16Notification/useForm16NotificationHook";

const InputForm = () => {
  const { Form16Notification } = useForm16NotificationHook();
  console.log("form16notification", Form16Notification);

  return (
    <div className="flex w-full flex-col gap-4">
      {Form16Notification && Form16Notification.length > 0 ? (
        Form16Notification.map((item, index) => (
          <Form16Card key={index} items={item} />
        ))
      ) : (
        <h1>Sorry, no request found</h1>
      )}
    </div>
  );
};

export default InputForm;

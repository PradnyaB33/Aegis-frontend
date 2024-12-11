import axios from "axios";
import React, { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { UseContext } from "../../State/UseState/UseContext";
import useHook from "./useHook";

const NotificationPageForm = () => {
  const { cookies } = useContext(UseContext);
  const { data, mutate } = useHook();

  console.log("data", data);

  const RejectRequest = (id) => {
    console.log(id);
  };
  return (
    <div className="pt-12">
      {data?.approvalRequest?.map((doc, i) => {
        return (
          <>
            <div>{doc.msg}</div>
            <div className="flex flex-row gap-6">
              <button onClick={() => mutate(doc)}>Accept</button>
              <button onClick={() => RejectRequest(doc)}>Reject</button>
            </div>
          </>
        );
      })}
    </div>
  );
};

export default NotificationPageForm;

import React from "react";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import Card from "./components/card";
import useNotification from "./components/useNotification";
import Select from "react-select";
import useGetUser from "../../hooks/Token/useUser";
import useOrgList from "../../hooks/QueryHook/Orglist/hook";
import useLeaveNotificationHook from "../../hooks/QueryHook/notification/leave-notification/hook";

const ParentNotification = () => {
  const { dummyData } = useNotification();
  const visibleData = dummyData.filter((item) => item.visible === true);

  //filter
  const { decodedToken } = useGetUser();
  const { data: orgData } = useOrgList();
  const { updateOrganizationId, organizationId } = useLeaveNotificationHook();
  return (
    <BoxComponent sx={{ p: "0 !important" }}>
      <div className="p-2 flex justify-end">
        {decodedToken?.user?.profile.includes("Super-Admin") && (
          <Select
            options={orgData?.organizations?.map((org) => ({
              value: org?._id,
              label: org?.orgName,
            }))}
            onChange={(e) => updateOrganizationId(e)}
            placeholder={"Select Organisations"}
            value={organizationId}
            className="!w-[300px]"
          />
        )}
      </div>
      <Card card={visibleData} />
    </BoxComponent>
  );
};

export default ParentNotification;

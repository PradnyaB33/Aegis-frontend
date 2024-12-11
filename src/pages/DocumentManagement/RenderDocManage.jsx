import { Container } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import UserProfile from "../../hooks/UserData/useUser";
import DocManageToHr from "./DocManageToHr";
import DocManage from "./DocManage";

const RenderDocManage = () => {
  // define the state, get function hook
  const { organisationId } = useParams();
  const { useGetCurrentRole, getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const role = useGetCurrentRole();

  // Determine which component to render based on the role
  const renderRecordComponent = () => {
    if (
      role === "Super-Admin" ||
      role === "Delegate-Super-Admin" ||
      role === "HR"
    ) {
      return <DocManageToHr organisationId={organisationId} />;
    } else if (role === "Employee") {
      return <DocManage organisationId={user.organizationId} />;
    }

    return null;
  };

  return (
    <Container maxWidth="xl" className="bg-gray-50 min-h-screen">
      {renderRecordComponent()}
    </Container>
  );
};

export default RenderDocManage;

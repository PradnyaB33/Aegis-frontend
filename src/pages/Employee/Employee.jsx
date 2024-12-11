import React from "react";
import { useParams } from "react-router-dom";
import EmployeeListToRole from "./EmployeeListToRole";

const Employee = () => {
  const { organisationId } = useParams();

  const renderEmployeeComponent = () => {
    return <EmployeeListToRole organisationId={organisationId} />;
  };

  return (
    renderEmployeeComponent()
  );
};

export default Employee;
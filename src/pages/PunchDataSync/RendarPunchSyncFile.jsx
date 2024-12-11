import React, { useState } from "react";
import { Container, Button, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import EmpInfoByDynimacally from "./EmpInfoByDynanimacally";
import EmpInfoPunchStatus from "./EmpInfoPunchStatus";
import Tooltip from "@mui/material/Tooltip";

const RenderPunchSyncFile = () => {
  // hook
  const { organisationId } = useParams();
  const [syncOption, setSyncOption] = useState("file");

  // Handler for changing sync option
  const handleSyncOptionChange = (option) => {
    setSyncOption(option);
  };

  return (
    <Container maxWidth="xl" className="bg-gray-50 min-h-screen">
      <Typography variant="h5" className="mb-4" style={{ padding: "10px 0" }}>
        Do you want to sync the data via:
      </Typography>
      <div className="mb-6" style={{ display: "flex", gap: "16px" }}>
        <Tooltip title="Upload a file to sync data">
          <Button
            variant={syncOption === "file" ? "contained" : "outlined"}
            onClick={() => handleSyncOptionChange("file")}
          >
            Sync via File
          </Button>
        </Tooltip>
        <Tooltip title="Display data dynamically">
          <Button
            variant={syncOption === "dynamic" ? "contained" : "outlined"}
            onClick={() => handleSyncOptionChange("dynamic")}
          >
            Live Display
          </Button>
        </Tooltip>
      </div>

      {syncOption === "file" ? (
        <EmpInfoPunchStatus organisationId={organisationId} />
      ) : (
        <EmpInfoByDynimacally organisationId={organisationId} />
      )}
    </Container>
  );
};

export default RenderPunchSyncFile;

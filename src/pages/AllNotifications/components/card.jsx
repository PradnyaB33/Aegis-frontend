import { Box, Tab, Tabs, Typography, Tooltip } from "@mui/material";
import React, { useState } from "react";
import UserProfile from "../../../hooks/UserData/useUser";

// TabPanel component for displaying content
const TabPanel = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const Card = ({ card = [] }) => {
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
  const [selectedTab, setSelectedTab] = useState(0);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="card tabs"
        className="border-b bg-white"
      >
        {card.map((item, index) => (
          <Tooltip key={index} title={item.tooltipName} arrow>
            <Tab
              label={
                <span style={{ display: "flex", alignItems: "center" }}>
                  {item.name}
                  <div
                    style={{
                      padding: "2px 8px",
                      backgroundColor: "#e5e7eb",
                      borderRadius: "50%",
                      marginLeft: "8px",
                      color: "black",
                    }}
                  >
                    {item.count}
                  </div>
                </span>
              }
              id={`simple-tab-${index}`}
              aria-controls={`simple-tabpanel-${index}`}
            />
          </Tooltip>
        ))}
      </Tabs>

      {card.map((item, index) => (
        <TabPanel value={selectedTab} index={index} key={index}>
          {role === "Employee" ? item?.empPage : item?.page}
        </TabPanel>
      ))}
    </div>
  );
};

export default Card;

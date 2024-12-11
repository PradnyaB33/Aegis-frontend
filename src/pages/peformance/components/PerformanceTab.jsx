import { West } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import * as React from "react";
import { Link } from "react-router-dom";
import GoalSettingTab from "../Tabs/GoalSettingTab";
import PerformanceDashboard from "../Tabs/PerformanceDashboard";
import ReviewTab from "../Tabs/ReviewTab";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function PerformanceTab() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <header className="text-xl w-full pt-6 bg-white border-b   p-4">
        <Link to={-1}>
          <West className="mx-4 !text-xl" />
        </Link>
        Performance Management
      </header>
      <Box
        sx={{
          width: "100%",
          p: 0,
        }}
      >
        <Box
          sx={{
            p: 0,
          }}
        >
          <Tabs
            value={value}
            variant="scrollable"
            inkBarStyle={{ background: "blue" }}
            onChange={handleChange}
            sx={{
              //   "& .MuiTabs-indicator": {
              //     display: "none",
              //   },
              "& .MuiTab-root.Mui-selected": {
                // color: "#1976d2",
                // backgroundColor: "#1976d2",
              },
            }}
            aria-label="basic tabs example"
            className="bg-white  space-x-4 !p-0 border-[.5px] border-gray-200"
          >
            <Tab
              className="!px-4"
              label="Performance Dashboard"
              {...a11yProps(0)}
              sx={{
                fontSize: "0.8rem", // Decrease the font size
                minWidth: "70px", // Decrease the width

                padding: "5px", // Decrease the padding
                "&.Mui-selected": {
                  color: "#fff !important",
                  height: "10px",
                  backgroundColor: "#1976d2", // Change the background color when selected
                },
              }}
            />
            <Tab
              className="!px-4"
              label="Goal Setting"
              {...a11yProps(1)}
              sx={{
                fontSize: "0.8rem", // Decrease the font size
                minWidth: "70px", // Decrease the width

                padding: "0px", // Decrease the padding
                "&.Mui-selected": {
                  color: "#1976d2",
                  backgroundColor: "#fff", // Change the background color when selected
                },
              }}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <PerformanceDashboard />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <GoalSettingTab />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <ReviewTab />
        </CustomTabPanel>
      </Box>
    </>
  );
}

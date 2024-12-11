import { West } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import * as React from "react";
import { Link, useParams } from "react-router-dom";
import Tab0 from "./Tab0";
import Tab1 from "./Tab1";
import Tab2 from "./Tab2";
import Tab3 from "./Tab3";
import Tab4 from "./Tab4/Tab4";

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

export default function TDSTab1() {
  const [value, setValue] = React.useState(0);

  const { organisationId } = useParams();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <header className="text-xl w-full pt-6 bg-white border-b   p-4">
        <Link to={`/organisation/${organisationId}/income-tax`}>
          <West className="mx-4 !text-xl" />
        </Link>
        TDS Declarations
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
              "& .MuiTabs-indicator": {
                display: "none",
              },
              "& .MuiTab-root.Mui-selected": {
                color: "white",
                backgroundColor: "#1976d2",
              },
            }}
            aria-label="basic tabs example"
            className="bg-white  space-x-4 !p-0 border-[.5px] border-gray-200"
          >
            <Tab className="!px-4" label="My Declarations" {...a11yProps(0)} />
            <Tab
              className="!px-4"
              label="Income From Salary"
              {...a11yProps(1)}
            />
            <Tab
              className="!px-4"
              label="Income From House Property"
              {...a11yProps(1)}
            />
            <Tab
              className="!px-4"
              label="Income from other sources"
              {...a11yProps(1)}
            />
            <Tab
              className="!px-4"
              label="Deduction under chapter VI A"
              {...a11yProps(1)}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Tab0 />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Tab1 />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <Tab2 />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <Tab3 />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={4}>
          <Tab4 />
        </CustomTabPanel>
      </Box>
    </>
  );
}

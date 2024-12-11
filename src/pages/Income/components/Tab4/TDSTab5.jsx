import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import * as React from "react";
import TDSTable4 from "../Table/Tab4Table/TDSTable4Tab1";
import TDSTable4Tab2 from "../Table/Tab4Table/TDSTable4Tab2";
import TDSTable4Tab3 from "../Table/Tab4Table/TDSTable4Tab3";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`second-tabpanel-${index}`}
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
    "aria-controls": `second-tabpanel-${index}`,
  };
}

export default function TDSTab5() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
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
          className="bg-white mt-4 space-x-4 !p-0 border-[.5px] border-gray-200"
        >
          <Tab
            className="!px-4"
            label="Section 80C 1.5 Lakh"
            {...a11yProps(0)}
          />
          <Tab
            className="!px-4"
            label="Section 80CCD NPS (Max. ₹ 50,000/-)"
            {...a11yProps(1)}
          />
          <Tab className="!px-4" label="Other Sections" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <TDSTable4 />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <TDSTable4Tab2 />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <TDSTable4Tab3 />
      </CustomTabPanel>
    </Box>
  );
}

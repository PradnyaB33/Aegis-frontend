import { West } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import * as React from "react";
import { Link, useParams } from "react-router-dom";
import Tab0 from "./components/Tab0";
import Tab1 from "./components/Tab1";

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

const TDSCalculation = () => {
  const [value, setValue] = React.useState(0);
  const { organisationId } = useParams();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <header className="text-xl w-full pt-6 border bg-white shadow-md   p-4">
        <Link to={`/organisation/${organisationId}/income-tax`}>
          <West className="mx-4 !text-xl" />
        </Link>
        TDS Calculation
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
            <Tab className="!px-4" label="Old Regime" {...a11yProps(0)} />
            <Tab className="!px-4" label="New Regime" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Tab0 />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Tab1 />
        </CustomTabPanel>
      </Box>
    </div>
  );
};

export default TDSCalculation;

import { Box } from "@mui/material";
import React from "react";
//import { useDrawer } from "../app-layout/components/Drawer";

const BoxComponent = ({ children, sx }) => {
  // const { open } = useDrawer();

  return (
    <Box
      sx={{
        // bgcolor: "#F9FAFC",
        // p: open ? "1% 2%" : "1% 2%",
        //  p: "1% 2%",
        //  height: "90vh",
        // overflowY: "auto",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default BoxComponent;

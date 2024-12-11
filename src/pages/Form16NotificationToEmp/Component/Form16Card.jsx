import { Grid, Box } from "@mui/material";
import React from "react";

const Form16Card = ({ items }) => {
  console.log("items", items);
  return (
    <Box
      className="py-2 space-y-5 h-max"
      sx={{
        flexGrow: 1,
      }}
    >
      <Grid
        container
        spacing={2}
        className="bg-white w-full"
        sx={{
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          borderRadius: "5px",
        }}
      >
        <Grid item className="gap-1 py-4 w-full h-max space-y-4">
          <Box className="flex md:flex-row items-center justify-center flex-col gap-8 md:gap-16">
            <div className="space-y-4 w-full flex flex-col items-center md:items-start justify-center">
              {items ? (
                <h1 className="text-xl px-4 md:!px-0 font-semibold">
                  Form-16 is uploaded for {items.year} year.
                </h1>
              ) : (
                <h1 className="text-xl px-4 md:!px-0 font-semibold">
                  Sorry, no request found.
                </h1>
              )}
            </div>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Form16Card;

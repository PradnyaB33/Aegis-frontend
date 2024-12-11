import { Grid, Box } from "@mui/material";
import React from "react";
import dayjs from "dayjs";
const AdvanceSalaryCard = ({ items }) => {
  const status =
    items && items !== null && items !== undefined ? items.status : "";
  const updatedAt =
    items && items !== null && items !== undefined
      ? dayjs(items.updatedAt).format("MMMM D, YYYY h:mm A")
      : "";

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
        <Grid item className="gap-1  py-4 w-full  h-max space-y-4">
          <Box className="flex flex-col md:flex-row items-center justify-between w-full gap-8 md:gap-16">
            {items ? (
              <>
                <h1 className="text-xl px-4 md:px-0 font-semibold order-1 md:order-1">
                  Advance salary is{" "}
                  {status === "Ongoing" ? "approved" : "rejected"}
                </h1>
                <p className="text-md px-4 md:px-0 order-2 md:order-2 mr-2">
                  {updatedAt}
                </p>
              </>
            ) : (
              <h1 className="text-xl px-4 md:px-0 font-semibold">
                Sorry, no request found.
              </h1>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdvanceSalaryCard;

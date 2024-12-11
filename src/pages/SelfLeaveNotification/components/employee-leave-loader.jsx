import { CalendarMonth } from "@mui/icons-material";
import { Badge, Box, Button, Grid, Skeleton } from "@mui/material";
import React from "react";

const LeaveRequestLoaderCard = () => {
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
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", // Add a box shadow on hover
          borderRadius: "5px",
        }}
      >
        <Grid item className="gap-1  py-4 w-full  h-max space-y-4">
          <Box className="flex md:flex-row items-center  justify-center flex-col gap-8  md:gap-16">
            <div className="w-max">
              <Badge
                className="!z-0"
                badgeContent={<Skeleton variant="text" width={40} />}
                color="info"
                variant="standard"
              >
                <Button
                  variant="contained"
                  size="large"
                  className="!rounded-full !bg-gray-100  !h-16 !w-16 group-hover:!text-white !text-black"
                  color="info"
                >
                  <CalendarMonth className="!text-4xl text-gr" />
                </Button>
              </Badge>
            </div>

            <div className="space-y-4 w-full flex flex-col items-center md:items-start justify-center">
              <h1 className="text-xl px-4 md:!px-0 font-semibold ">
                <Skeleton variant="text" width={200} />
              </h1>
            </div>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LeaveRequestLoaderCard;

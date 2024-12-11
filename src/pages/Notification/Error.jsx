import { CalendarMonth } from "@mui/icons-material";
import {
  Badge,
  Box,
  Button,
  Chip,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";

const Error = ({ error }) => {
  //   handleAlert(
  //     true,
  //     "error",
  //     error.response.data.message || "Server is under Maintainance"
  //   );
  return (
    <Box
      className="py-2 space-y-5 h-max"
      sx={{
        flexGrow: 1,
        p: 5,
      }}
    >
      {/* <Typography color={"red"}>{error}</Typography> */}
      <Grid
        container
        spacing={2}
        className="bg-white w-full"
        sx={{
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          borderRadius: "5px",
          marginBottom: 2,
          padding: 2,
          border: "1px solid red",
        }}
      >
        <Grid item className="gap-1  py-4 w-full  h-max space-y-4">
          <Box className="flex md:flex-row items-center  justify-center flex-col gap-8  md:gap-16">
            <div className="w-max">
              <Badge
                badgeContent={
                  <Skeleton variant="rectangular" height={20} width={40} />
                }
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
              <Typography variant="h6">
                <Skeleton height={20} width={200} />
              </Typography>

              <Chip
                label={<Skeleton height={20} width={100} />}
                size="small"
                sx={{ backgroundColor: "grey", color: "#ffffff" }}
              />

              <Box sx={{ mt: 3, mb: 3 }}>
                <Stack direction="row" spacing={3}>
                  <Button
                    color="primary"
                    variant="contained"
                    sx={{
                      fontStyle: "italic",
                      fontSize: "12px",
                      padding: "5px 30px",
                      textTransform: "capitalize",
                    }}
                  >
                    <Skeleton height={20} width={60} />
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      fontStyle: "italic",
                      fontSize: "12px",
                      padding: "5px 30px",
                      textTransform: "capitalize",
                      backgroundColor: "#BB1F11",
                    }}
                  >
                    <Skeleton height={20} width={60} />
                  </Button>
                </Stack>
              </Box>
            </div>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Error;

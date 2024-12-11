import { CalendarMonth } from "@mui/icons-material";
import { Badge, Box, Button, Grid } from "@mui/material";
import moment from "moment";
import React from "react";
import { format } from "date-fns";

const ShiftRequestCard = ({ items }) => {
  console.log("items", items);

  const isApprovedByManager = items?.status === "Approved";
  const isApprovedByAccountant = items?.accountantStatus === "Approved";
  const isPendingByManager = items?.status === "Pending";
  const isPendingByAccountant = items?.accountantStatus === "Pending";
  const isRejectedByManager = items?.status === "Rejected";
  const isRejectedByAccountant = items?.accountantStatus === "Rejected";

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
        <Grid item className="gap-1 py-4 w-full h-max space-y-4">
          <Box className="flex md:flex-row items-center justify-center flex-col gap-8 md:gap-16">
            <div className="w-max">
              <Badge
                className="!z-0"
                badgeContent={`${moment(items?.updatedAt).fromNow()}`}
                color="info"
                variant="standard"
                sx={{
                  "& .MuiBadge-badge": {
                    width: "max-content",
                  },
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  className="!rounded-full !bg-gray-100 !h-16 !w-16 group-hover:!text-white !text-black"
                  color="info"
                >
                  <CalendarMonth className="!text-4xl text-gr" />
                </Button>
              </Badge>
            </div>

            <div className="space-y-4 w-full flex flex-col items-center md:items-start justify-center">
              {/* Both pending */}
              {isPendingByManager && isPendingByAccountant && (
                <h1 className="text-xl px-4 md:!px-0 font-semibold ">
                  <span className="text-yellow-600">Pending </span>by both Manager and Accountant for {items?.title} on{" "}
                  {format(new Date(items?.start), "dd-MM-yyyy ")}.
                </h1>
              )}

              {/* Both approved */}
              {isApprovedByManager && isApprovedByAccountant && (
                <h1 className="text-xl px-4 md:!px-0 font-semibold ">
                  <span className="text-green-600">Approved </span> by both Manager and Accountant for {items?.title}  on{" "}
                  {format(new Date(items?.start), "dd-MM-yyyy ")}.
                </h1>
              )}

              {/* Manager approved but Accountant pending */}
              {isApprovedByManager && isPendingByAccountant && (
                <h1 className="text-xl px-4 md:!px-0 font-semibold">
                  <span className="text-yellow-600">Pending </span> by Accountant for {items?.title}  on{" "}
                  {format(new Date(items?.start), "dd-MM-yyyy ")}.
                </h1>
              )}

              {/* Accountant approved but Manager pending */}
              {/* {isPendingByManager && isApprovedByAccountant && (
                <h1 className="text-xl px-4 md:!px-0 font-semibold text-yellow-600">
                  Pending by Manager for {items?.title}, but Approved by Accountant.
                </h1>
              )} */}

              {/* Individual approvals */}
              {isApprovedByManager && !isApprovedByAccountant && (
                <h1 className="text-xl px-4 md:!px-0 font-semibold">
                  <span className="text-green-600">Approved </span>by Manager for {items?.title}  on{" "}
                  {format(new Date(items?.start), "dd-MM-yyyy ")}.
                </h1>
              )}

              {isApprovedByAccountant && !isApprovedByManager && (
                <h1 className="text-xl px-4 md:!px-0 font-semibold">
                  <span className="text-green-600">Approved </span>by Accountant for {items?.title}  on{" "}
                  {format(new Date(items?.start), "dd-MM-yyyy ")}.
                </h1>
              )}

              {/* Manager rejection with reason */}
              {isRejectedByManager && (
                <>
                  <h1 className="text-xl px-4 md:!px-0 font-semibold ">
                    <span className="text-red-600">Rejected </span>by Manager for {items?.title} on{" "}
                    {format(new Date(items?.start), "dd-MM-yyyy ")}.
                  </h1>
                  {items?.messageM && (
                    <h2 className="text-gray-600">
                      Manager Reason: {items?.messageM}
                    </h2>
                  )}
                </>
              )}

              {/* Accountant rejection with reason */}
              {isRejectedByAccountant && (
                <>
                  <h1 className="text-xl px-4 md:!px-0 font-semibold ">
                    <span className="text-red-600">Rejected </span>by Accountant for {items?.title} on{" "}
                    {format(new Date(items?.start), "dd-MM-yyyy ")}.
                  </h1>
                  {items?.messageA && (
                    <h2 className="text-gray-600">
                      Accountant Reason: {items?.messageA}
                    </h2>
                  )}
                </>
              )}


            </div>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ShiftRequestCard;


import { Box, CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
// import AdminCardSke from "../../Skeletons/AdminCardSke";
import AOS from "aos";
import "aos/dist/aos.css";

const SuperAdminCard = ({
  title,
  icon: Icon,
  data,
  // color,
  isLoading,
  className = "",
  cardSize, // New prop for card size
  DHcardSize,
}) => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const sizeClass = cardSize || DHcardSize;
  return (
    <div className={`border rounded-md h-28  ${className} ${sizeClass}`}>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Box sx={{ p: 2 }}>
            <Icon style={{ fontSize: "2em", color: "007EF2" }} />
            <h1 className="text-2xl px-1 text-gray-700   font-semibold  tracking-tight">
              {data}
            </h1>
            <p className="text-gray-500 px-1 tracking-tight ">{title}</p>
            {/* <Typography variant="h6">{data}</Typography>
            <Typography className="font-semibold  text-[#67748E]" variant="body1">{title}</Typography> */}
          </Box>

          {/* <div
            // whileHover={{ scale: 1.15, rotate: 10 }}
            className={`flex items-center justify-center ${color} rounded-full p-2 shadow-lg mb-2 absolute -top-8 ${sizeClass}`}
            style={{ width: "4rem", height: "4rem" }}
          >
            <Avatar
              className="text-white"
              sx={{
                bgcolor: "transparent",
                // width: 49,
                // height: 49,
                width: "2.5rem", //  icon size
                height: "2.5rem",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "none",
              }}
              variant="rounded"
            >
              <Icon style={{ fontSize: "2em" }} />
            </Avatar>
          </div> */}

          {/* <div className="text-center mt-12 space-y-1">
            <h1 className="text-xl font-bold text-gray-800 mb-0.5">{title}</h1>
            <h2 className="text-lg font-bold text-blue-800">{data}</h2>
          </div> */}
        </>
      )}
    </div>
  );
};

export default SuperAdminCard;

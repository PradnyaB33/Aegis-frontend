import React from "react";
import { IconButton } from "@mui/material";
import { motion } from "framer-motion";
import { FiDownload } from "react-icons/fi"; // Import an icon from react-icons
import { West } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const LiveSyncData = () => {
  // Define animation variants
  const navigate = useNavigate();
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    // <Container maxWidth="xl" className="bg-gray-50 min-h-screen">
    // <article className=" bg-white w-full h-max shadow-md rounded-sm border items-center">
    //   <div className=" mt-3">
    //     <IconButton onClick={() => navigate(-1)}>
    //       <West className="text-xl" />
    //     </IconButton>
    //   </div>
    <>
      <div className=" mt-3">
        <IconButton onClick={() => navigate(-1)}>
          <West className="text-xl" />
        </IconButton>
      </div>

      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <motion.div
          className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full flex flex-col items-center"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">
            LiveSync Records
          </h1>
          {/* <p className="text-gray-700 mb-6 text-center">
          Welcome to LiveSyncData! Our platform provides seamless access to important documents and files you need. With just a click, you can download essential resources and stay updated with the latest information. Explore our features and ensure you never miss out on critical updates.
        </p> */}
          <motion.a
            href="https://myraws3-bucket.s3.ap-south-1.amazonaws.com/machni_livesynch.rar"
            download
            className="flex items-center px-6 py-3 text-white bg-blue-600 rounded-md text-lg font-semibold transition-transform transform hover:scale-105 hover:bg-blue-700"
            whileHover={{ scale: 1.05 }} // Framer Motion scale effect on hover
            whileTap={{ scale: 0.95 }} // Framer Motion scale effect on click
          >
            <FiDownload className="mr-2" /> {/* Icon for download */}
            Download Now
          </motion.a>
        </motion.div>
      </div>
    </>
  );
};

export default LiveSyncData;

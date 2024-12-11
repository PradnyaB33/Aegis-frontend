import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { Box, Button, Modal } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";

// import AddIcon from "@mui/icons-material/Add";
// import axios from "axios";
import { UseContext } from "../../../State/UseState/UseContext";

import axios from "axios";
import Holidays from "date-holidays";

const LeavePublicholidayModal = ({ open, handleClose, id }) => {
  const holiday = new Holidays();
  // const getHolidays = holiday.getHolidays();

  const { cookies } = useContext(UseContext);

  // const createLeave = async () => {
  //   console.log(leaveTypes);
  //   try {
  //     const createLeave = await axios.post(
  //       `${process.env.REACT_APP_API}/route/leave-types/create/${id}`,
  //       { leaveTypes: leaveTypes },
  //       {
  //         headers: {
  //           Authorization: authToken,
  //         },
  //       }
  //     );

  //     handleClose();
  //     handleAlert(true, "success", createLeave.data.message);
  //   } catch (error) {
  //     console.log(error, "err");
  //     handleAlert(
  //       true,
  //       "error",
  //       error?.response?.data?.message || "Failed to sign in. Please try again."
  //     );
  //   }
  // };

  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    // Replace 'IN' with the appropriate country code if needed.
    axios
      .get(`https://api.api-ninjas.com/v1/holidays?country=in&year=2023`)
      .then((response) => {
        setHolidays(response.data);
        console.log(response, "res");
      })
      .catch((error) => {
        console.error("Error fetching holidays:", error);
      });
  }, []);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    p: 4,
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={style}
        className="border-none md:w-[40%] w-[40%] shadow-md outline-none rounded-md"
      >
        <header className="flex items-center mb-4 gap-2">
          <EventAvailableIcon className="h-4 w-4 text-gray-700 !text-[1.7rem]" />
          <h1
            id="modal-modal-title"
            className="text-xl font-semibold leading-relaxed "
          >
            Select Public holiday
          </h1>
        </header>
        <div className="flex gap-4 mt-4 justify-end">
          <Button
            size="small"
            onClick={handleClose}
            color="error"
            variant="contained"
          >
            cancal
          </Button>
          <Button
            // onClick={createLeave}
            size="small"
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default LeavePublicholidayModal;

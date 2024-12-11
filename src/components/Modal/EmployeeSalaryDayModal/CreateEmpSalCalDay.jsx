import { Box, Button, Modal, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
};

const CreateEmpSalCalDayModel = ({ handleClose, open, id }) => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();
  const [selectedDay, setSelectedDay] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  // Generate an array of options for salary calculation days
  const salaryCalculationDays = [
    { value: "first_day_of_next_month", label: "First day of next month" },
    { value: "second_day_of_next_month", label: "Second day of next month" },
    { value: "third_day_of_next_month", label: "Third day of next month" },
    { value: "fourth_day_of_next_month", label: "Fourth day of next month" },
    { value: "fifth_day_of_next_month", label: "Fifth day of next month" },
    { value: "sixth_day_of_next_month", label: "Sixth day of next month" },
    { value: "seventh_day_of_next_month", label: "Seventh day of next month" },
    { value: "eighth_day_of_next_month", label: "Eighth day of next month" },
    { value: "ninth_day_of_next_month", label: "Ninth day of next month" },
    { value: "tenth_day_of_next_month", label: "Tenth day of next month" },
    { value: "last_day_of_current_month", label: "Last day of current month" },
  ];

  // add the data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!selectedDay) return;
    try {
      const data = {
        selectedDay,
      };
      await AddEmployeeSalaryData.mutateAsync(data);
    } catch (error) {
      console.error(error);
      handleAlert(
        true,
        "error",
        `This day is already exist.`
      );
    }
  };
  const AddEmployeeSalaryData = useMutation(
    async (data) => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API}/route/employee-salary-cal-day/${id}`,
          data,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return response.data;
      } catch (error) {
        throw new Error(
          error.response.data.message ||
          "Failed to create salary computation day"
        );
      }
    },
    {
      onSuccess: () => {
        handleClose();
        setSelectedDay("");
        handleAlert(
          true,
          "success",
          "Salary computation day created successfully."
        );
        queryClient.invalidateQueries("empSalaryCalData");
        // window.location.reload();
      },
      onError: (error) => {
        console.error("Error:", error.message);
      },
    }
  );

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={style}
        className="border-none !z-10 !pt-0 !px-0 !w-[90%] lg:!w-[50%] md:!w-[60%] shadow-md outline-none rounded-md"
      >
        <div className="flex justify-between py-4 items-center  px-4">
          <h1 className="text-xl pl-2 font-semibold font-sans">
            Salary Computation Day
          </h1>
        </div>

        <div className="px-5 space-y-4 mt-4">
          <div className="space-y-2 ">
            <Autocomplete
              options={salaryCalculationDays}
              getOptionLabel={(option) => option.label}
              value={
                salaryCalculationDays.find(
                  (day) => day.value === selectedDay
                ) || null
              }
              onChange={(e, value) => setSelectedDay(value?.value || "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Salary Computation Day"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </div>

          {!selectedDay && formSubmitted && (
            <Typography variant="body2" color="error">
              Required.
            </Typography>
          )}

          <div className="flex gap-4 mt-4 mr-4  mb-4 justify-end ">
            <Button onClick={handleClose} color="error" variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Submit
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default CreateEmpSalCalDayModel;

import { zodResolver } from "@hookform/resolvers/zod";
import { Abc, AccessTime, Work } from "@mui/icons-material";
import { Box, Button, CircularProgress, Modal } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import axios from "axios";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import AuthInputFiled from "../../InputFileds/AuthInputFiled";

const ShiftModal = ({
  open,
  id,
  shiftId,
  setShiftId,
  setOpen,
  setEditModalOpen,
}) => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const [selectedDays, setSelectedDays] = useState([]);
  const authToken = cookies["aegis"];

  const ShiftSchema = z
    .object({
      startDateTime: z.string().min(1, "Start time is required"),
      endDateTime: z.string().min(1, "End time is required"),
      shiftName: z.string().min(1, "Shift name is required"),
      workingFrom: z.object(
        {
          label: z.string(),
          value: z.string(),
        },
        "Shift type is required"
      ),
    })
    .refine(
      (data) => {
        const startDate = new Date(`1970-01-01T${data.startDateTime}:00Z`);
        const endDate = new Date(`1970-01-01T${data.endDateTime}:00Z`);

        const diffInHours = Math.abs(endDate - startDate) / 1000 / 60 / 60;
        return diffInHours >= 9;
      },
      {
        message:
          "The difference between start time and end time must be at least 9 hours",
        path: ["endDateTime"], // specify the field that this error is associated with
      }
    );

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    setError: setFieldError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ShiftSchema),
    defaultValues: {
      startDateTime: dayjs(new Date()).format("HH:mm"),
      endDateTime: dayjs(new Date()).add(9, "hour").format("HH:mm"),
      shiftName: undefined,
    },
  });

  const handleClose = () => {
    setOpen(false);
    setShiftId(null);
    setEditModalOpen(false);
    reset({
      workingFrom: "", // Set fieldName1 to empty
      startDateTime: "", // Set fieldName2 to empty
      endDateTime: "", // Set fieldName2 to empty
      // Add more fields as necessary
    });
  };

  useEffect(() => {
    if (!id) {
      setFieldError("selectedDays", null);
    }
    //eslint-disable-next-line
  }, [id]);

  const { isLoading, isFetching } = useQuery(
    ["shift", shiftId],
    async () => {
      if (open && shiftId !== null) {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/getSingleshifts/${shiftId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return response.data;
      }
    },

    {
      onSuccess: (data) => {
        setValue("shiftName", data?.shifts?.shiftName);
        setValue("startTime", data?.shifts?.startTime);
        setValue("endTime", data?.shifts?.endTime);
        setValue("workingFrom", {
          label: data?.shifts?.workingFrom,
          value: data?.shifts?.workingFrom,
        });

        setSelectedDays(data?.shifts?.selectedDays);
      },
      enabled: open && shiftId !== null && shiftId !== undefined,
    }
  );

  const daysOfWeek = [
    { label: "Mon", value: "Monday" },
    { label: "Tue", value: "Tuesday" },
    { label: "Wed", value: "Wednesday" },
    { label: "Thur", value: "Thursday" },
    { label: "Fri", value: "Friday" },
    { label: "Sat", value: "Saturday" },
    { label: "Sun", value: "Sunday" },
  ];

  const queryClient = useQueryClient();

  const AddShift = useMutation(
    (data) =>
      axios.post(`${process.env.REACT_APP_API}/route/shifts/create`, data),
    {
      onSuccess: (data) => {
        if (!data.data.success) {
          handleAlert(true, "error", "Shift name already exists");
          return true;
        }
        queryClient.invalidateQueries({ queryKey: ["shifts"] });
        handleClose();
        handleAlert(true, "success", "Shift generated succesfully");
      },
      onError: (err) => {
        console.log(`🚀 ~ err:`, err?.response?.data?.error);
        handleAlert(true, "error", err?.response?.data?.error);
      },
    }
  );

  const EditShift = useMutation(
    (data) =>
      axios.patch(
        `${process.env.REACT_APP_API}/route/shifts/${shiftId}`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["shifts"] });
        handleClose();
        handleAlert(true, "success", "Shift updated succesfully");
      },
      onError: () => {
        handleAlert(
          true,
          "error",
          "An error occurred while creating a new shift"
        );
      },
    }
  );

  const onSubmit = async (data) => {
    try {
      if (selectedDays.length <= 0) {
        return false;
      }
      const requestData = {
        startTime: dayjs(`1970-01-01T${data.startDateTime}:00`).format("HH:mm"),
        endTime: dayjs(`1970-01-01T${data.endDateTime}:00`).format("HH:mm"),
        selectedDays,
        workingFrom: data.workingFrom.value,
        shiftName: data.shiftName,
        organizationId: id,
      };

      if (shiftId) {
        await EditShift.mutateAsync(requestData);
      } else {
        // Use the AddShift function from React Query
        await AddShift.mutateAsync(requestData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  let isSelected = (day) => {
    return selectedDays?.includes(day);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    p: 4,
  };

  const handleDaySelection = (event, newSelectedDays) => {
    setSelectedDays(newSelectedDays);
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
        className="border-none !z-10 !pt-0 !px-0 !w-[90%] lg:!w-[50%] md:!w-[60%] shadow-md outline-none rounded-md"
      >
        <div className="flex justify-between py-4 items-center  px-4">
          <h1 className="text-xl pl-2 font-semibold font-sans">
            {shiftId ? "Edit Shift" : "Add Shift"}
          </h1>
        </div>

        {isLoading || isFetching ? (
          <CircularProgress />
        ) : (
          <form
            onSubmit={handleSubmit((data) => {
              if (selectedDays?.length <= 0) {
                setFieldError("selectedDays", {
                  message: "Please select at least one day",
                });
              }
              if (selectedDays?.length > 1) {
                setFieldError("selectedDays", null);
              }
              onSubmit(data);
            })}
            className="px-5 space-y-4 mt-4"
          >
            <AuthInputFiled
              name="workingFrom"
              control={control}
              type="select"
              icon={Work}
              placeholder="Shift Type"
              label="Enter Shift Type *"
              readOnly={false}
              maxLimit={15}
              options={[
                {
                  label: "Remote",
                  value: "remote",
                },
                {
                  label: "Office",
                  value: "office",
                },
              ]}
              errors={errors}
              error={errors.workingFrom}
            />
            <AuthInputFiled
              name="shiftName"
              icon={Abc}
              control={control}
              type="text"
              placeholder="Shift"
              label="Enter Shift Name *"
              readOnly={false}
              maxLimit={15}
              errors={errors}
              error={errors.shiftName}
            />

            <div className="grid gap-2 grid-cols-2">
              <AuthInputFiled
                name="startDateTime"
                icon={AccessTime}
                control={control}
                type="time"
                placeholder="Start Time"
                label="Enter Start Time *"
                readOnly={false}
                maxLimit={15}
                errors={errors}
                error={errors.startDateTime}
              />
              <AuthInputFiled
                name="endDateTime"
                icon={AccessTime}
                control={control}
                type="time"
                placeholder="End Time"
                label="Enter End Time *"
                readOnly={false}
                maxLimit={15}
                errors={errors}
                error={errors.endDateTime}
              />
            </div>

            {/* <div className="space-y-2 ">
            <label className="text-md" htmlFor="demo-simple-select-label">
              Enter shift name
            </label>
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-name">
                Shift name
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-name"
                label="Shift type"
                value={shiftName}
                onChange={(e) => setShiftName(e.target.value)}
              />
            </FormControl>
          </div> */}

            {/* <div className="flex justify-between">
            <div className="space-y-2 w-[45%] ">
              <label className="text-md" htmlFor="demo-simple-select-label">
                Start time
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["TimePicker"]}>
                  <MobileTimePicker
                    className="w-full"
                    label=" Select Start Time of Shift"
                    value={startDateTime}
                    onChange={handleStartDateTimeChange}
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                      seconds: renderTimeViewClock,
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>

            <div className="space-y-2 w-[45%]">
              <label className="text-md" htmlFor="demo-simple-select-label">
                End time
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["TimePicker"]}>
                  <MobileTimePicker
                    label=" Select End Time of Shift"
                    value={endDateTime}
                    className="w-full"
                    onChange={handleEndDateTimeChange}
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                      seconds: renderTimeViewClock,
                    }}
                  />
                </DemoContainer>
                {validationError && (
                  <div className="text-red-500">
                    Minimum time difference of 9 hours required
                  </div>
                )}
              </LocalizationProvider>
            </div>
          </div> */}

            <div
              className="w-full"
              style={{ width: "100%", justifyContent: "center", gap: "2px" }}
            >
              <label
                className={`${errors.selectedDays && "text-red-500"
                  } font-semibold text-gray-500 text-md`}
                htmlFor="demo-simple-select-label"
              >
                Select Week Days
              </label>
              <ToggleButtonGroup
                value={selectedDays}
                onChange={handleDaySelection}
                aria-label="selectedDays"
                className="mt-2 w-max !space-x-5 "
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {daysOfWeek.map((day) => (
                  <ToggleButton
                    key={day.label}
                    value={day.value}
                    className="!rounded-full !border-[2px] !border-gray-200 !text-xs font-semibold"
                    style={{
                      width: "40px",
                      height: "40px",
                      padding: "2px",
                      backgroundColor: isSelected(day.value)
                        ? "#1976d2"
                        : "transparent",
                      color: isSelected(day.value) ? "white" : "black",
                    }}
                  >
                    {day.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              <div className="h-4 w-max !z-50   !mt-1">
                {errors.selectedDays && (
                  <p className="text-sm mb-4 relative !bg-white  text-red-500">
                    {errors.selectedDays.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-4  mt-4  justify-end">
              <Button onClick={handleClose} color="error" variant="outlined">
                Cancel
              </Button>
              {shiftId ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={EditShift.isLoading}
                >
                  {EditShift.isLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    "Apply"
                  )}
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={AddShift.isLoading}
                >
                  {AddShift.isLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    "submit"
                  )}
                </Button>
              )}
            </div>
          </form>
        )}
      </Box>
    </Modal>
  );
};

export default ShiftModal;

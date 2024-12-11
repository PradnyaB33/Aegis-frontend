import { Info } from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router";
import { UseContext } from "../../State/UseState/UseContext";
import Setup from "../SetUpOrganization/Setup";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BasicButton from "../../components/BasicButton";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const SkeletonRow = () => (
  <tr className="!font-medium border-b !space-y-3">
    <td className="!text-left !pl-9 !mr-5 w-1/12">
      <Skeleton variant="text" width={30} height={20} />
    </td>
    <td className="w-2/12 pt-2 pb-2">
      <div className="flex gap-1">
        <Skeleton
          variant="circle"
          width={50}
          height={50}
          style={{ borderRadius: "50%" }}
        />
        <Skeleton
          variant="circle"
          width={50}
          height={50}
          style={{ borderRadius: "50%" }}
        />
      </div>
    </td>
    <td className="px-6 w-2/12">
      <Skeleton variant="circle" width={30} height={30} />
    </td>
  </tr>
);

const WeekdaySelector = ({ selectedDays, handleDayToggle, getColor }) => {
  return (
    <Grid spacing={1} className="!flex !justify-around">
      {daysOfWeek.map((day, index) => (
        <Grid item key={day} xs={6} sm={4} md={3} lg={2}>
          <Chip
            label={day}
            onClick={() => handleDayToggle(day, index)}
            className="text-2xl"
            style={{
              backgroundColor: selectedDays.includes(day) ? "#0ea5e9" : "white",
              borderRadius: "50%",
              width: "55px",
              height: "55px",
              cursor: "pointer",
              color: selectedDays.includes(day) ? "white" : "black",
              fontWeight: "bold",
              border: "1px solid gray",
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
};

const WeekendHoliday = () => {
  const organizationId = useParams().organisationId;
  const [selectedDays, setSelectedDays] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const { setAppAlert } = useContext(UseContext);
  const [editItem, setEditItem] = useState(null);
  const [deleteModel, setDeleteModel] = useState(false);
  const [ID, setID] = useState("");
  const queryClient = useQueryClient();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleDayToggle = (day, index) => {
    const updatedDays = selectedDays.includes(day)
      ? selectedDays.filter((selected) => selected !== day)
      : [...selectedDays, day];

    setSelectedDays(updatedDays);
    console.log(`Toggled day: ${day} at index: ${index}`);
  };

  const getColor = (day) => {
    const index = daysOfWeek.indexOf(day);
    const hue = (index * 50) % 360;
    return `hsl(${hue}, 80%, 60%)`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!selectedDays.length) return;
    try {
      const daysArray = selectedDays.map((day) => ({ day }));

      if (editItem) {
        await axios.patch(
          `${process.env.REACT_APP_API}/route/weekend/update/${editItem._id}`,
          { days: daysArray }
        );

        console.log("Day updated successfully.");
        setAppAlert({
          alert: true,
          type: "success",
          msg: "Day updated successfully!",
        });
      } else {
        const existingWeekend = await axios.get(
          `${process.env.REACT_APP_API}/route/weekend/get/${organizationId}`
        );

        if (existingWeekend.data.days.length > 0) {
          handleOpenClose();
          throw new Error("Weekend already exists for this organization.");
        }

        console.log(daysArray);

        if (daysArray.length > 3) {
          throw new Error("Weekend cannot have more than 3 days");
        }

        await axios.post(`${process.env.REACT_APP_API}/route/weekend/create`, {
          days: daysArray,
          organizationId,
        });
        console.log("Successfully created");
        setAppAlert({
          alert: true,
          type: "success",
          msg: "Weekend created successfully.",
        });
      }

      handleOpenClose();
      setEditItem(null);
      setSelectedDays([]);

      queryClient.invalidateQueries("days");
    } catch (error) {
      console.error(error);
      setAppAlert({
        alert: true,
        type: "error",
        msg: error.message,
      });
    }
  };

  const handleDelete = async () => {
    try {
      console.log(ID);
      await axios.delete(
        `${process.env.REACT_APP_API}/route/weekend/delete/${ID}`
      );
      console.log("Successfully deleted");
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Weekend deleted successfully.",
      });
      handleOpenClose();
      queryClient.invalidateQueries("days");
    } catch (error) {
      console.error(error);
      setAppAlert({
        alert: true,
        type: "error",
        msg: error.message,
      });
      handleOpenClose();
    } finally {
      handleOpenClose();
    }
  };

  const handleOpenClose = () => {
    setOpenModel((prevstate) => !prevstate);
    setSelectedDays([]);
    setDeleteModel(false);
    setEditItem(null);
  };

  const fetchDays = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/weekend/get/${organizationId}`
      );
      return response.data.days || [];
    } catch (error) {
      console.error("Error fetching days:", error);
      throw error;
    }
  };

  const { data, isLoading } = useQuery("days", fetchDays);

  return (
    <BoxComponent sx={{ p: 0 }}>
      <Setup>
        <div className="h-[90vh] overflow-y-auto scroll px-3">
          <div className="xs:block sm:block md:flex justify-between items-center ">
            <HeadingOneLineInfo
              className="!my-3"
              heading="Weekly Off"
              info="Add weekly off for your employees in organisation. This day will be considered as paid day in salary calculation"
            />
            <BasicButton title="Add Days" onClick={handleOpenClose} />
          </div>
          {data && data.length > 0 ? (
            <div className=" xs:mt-3 sm:mt-3 md:mt-0">
              <table className="min-w-full bg-white  text-left !text-sm font-light">
                <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                  <tr className="!font-semibold">
                    <th scope="col" className="whitespace-nowrap !text-left pl-8 py-3">
                      Sr. No
                    </th>
                    <th scope="col" className="whitespace-nowrap !text-left pl-8 py-3">
                      Days
                    </th>
                    <th scope="col" className="whitespace-nowrap !text-left pl-8 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <>
                      <SkeletonRow />
                      <SkeletonRow />
                      <SkeletonRow />
                    </>
                  ) : (
                    data.map((item, idx) => (
                      <tr
                        className="!font-medium border-b"
                        key={idx}
                      >
                        <td className="whitespace-nowrap !text-left pl-8 ">
                          {idx + 1}
                        </td>
                        <td
                          style={{ marginRight: "1rem" }}
                          className="whitespace-nowrap pl-8"
                        >
                          <div className="flex gap-1">
                            {item.days.map((day, dayIdx) => (
                              <Chip
                                key={dayIdx}
                                label={day.day}
                                className="text-sm"
                                style={{
                                  backgroundColor: "#0ea5e9",
                                  borderRadius: "50%",
                                  width: "50px",
                                  height: "50px",
                                  cursor: "pointer",
                                  border: "1px solid gray",
                                  color: "white",
                                  fontSize: "12.5px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="whitespace-nowrap pl-8">
                          <IconButton
                            color="error"
                            aria-label="delete"
                            style={{ paddingTop: "0.8rem" }}
                            onClick={() => {
                              setID(item._id);
                              setDeleteModel(true);
                            }}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
              <article className="flex items-center mb-1 text-red-500 gap-2">
                <Info className="text-2xl" />
                <h1 className="text-lg font-semibold">Add Weekly Off</h1>
              </article>
              <p>No weekly offs found. Please add a weekly off.</p>
            </section>
          )}

        </div>




        <Dialog open={deleteModel} onClose={() => setDeleteModel(false)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <p>
              Please confirm your decision to delete this weekly off, as this
              action cannot be undone.
            </p>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteModel(false)}
              variant="outlined"
              color="primary"
              size="small"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleDelete}
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openModel} onClose={handleOpenClose} fullWidth>
          <DialogActions>
            <DialogContent>
              <h1 className="text-xl pl-2 font-semibold font-sans mb-4">
                Select Days
              </h1>
              <div className="mb-6">
                <WeekdaySelector
                  selectedDays={selectedDays}
                  handleDayToggle={handleDayToggle}
                  getColor={getColor}
                />
              </div>

              {!selectedDays.length && formSubmitted && (
                <Typography variant="body2" color="error">
                  Days are required.
                </Typography>
              )}
              <div className="flex gap-5 !pt-5  justify-end ">
                <Button
                  onClick={handleOpenClose}
                  color="error"
                  variant="outlined"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  color="primary"
                >
                  {editItem ? "Apply" : "Submit"}
                </Button>
              </div>
            </DialogContent>
          </DialogActions>
        </Dialog>

      </Setup>
    </BoxComponent >
  );
};

export default WeekendHoliday;

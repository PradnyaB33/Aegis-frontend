import { Info } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import axios from "axios";
import dayjs from "dayjs";
import React, { useContext, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { UseContext } from "../../../State/UseState/UseContext";
import ReusableModel from "../../../components/Modal/component";
import Setup from "../Setup";
import HolidayRow from "./components/holiday-row";
import MiniForm from "./components/miniform";
import usePublicHoliday from "./components/usePublicHoliday";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BasicButton from "../../../components/BasicButton";

const PublicHoliday = () => {
  const { setAppAlert } = useContext(UseContext);
  const [openModal, setOpenModal] = useState(false);
  const [actionModal, setActionModal] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [region, setRegion] = useState("");
  const [operation, setOperation] = useState("");
  const [selectedHolidayId, setSelectedHolidayId] = useState(null);
  const queryClient = useQueryClient();

  const orgId = useParams().organisationId;
  const { data, locations } = usePublicHoliday();
  console.log(`🚀 ~ locations:`, locations);

  const [inputdata, setInputData] = useState({
    name: "",
    date: dayjs(new Date()),
    type: "",
    region: "",
    organizationId: "",
  });

  console.log(`🚀 ~ file: PublicHoliday.jsx:77 ~ data:`, data);

  const handleClose = () => {
    setOpenModal(false);
    setActionModal(false);
    setOperation("");
    setSelectedHolidayId(null);
    setInputData({
      name: "",
      year: "",
      date: dayjs(),
      day: "",
      month: "",
      type: "",
      region: "",
      organizationId: "",
    });
  };
  const handleDateChange = (newDate) => {
    setInputData((prev) => ({
      ...prev,
      date: newDate.toISOString(),
    }));
  };

  const doTheOperation = async () => {
    const id = selectedHolidayId;

    if (operation === "edit") {
      const patchData = {
        name,
        type,
        region,
        date: inputdata.date,
        organizationId: orgId,
      };
      await axios
        .patch(
          `${process.env.REACT_APP_API}/route/holiday/update/${selectedHolidayId}`,
          patchData
        )
        .then((response) => {
          console.log("Holiday  updated successfully.");
          setOpenModal(false);
          setAppAlert({
            alert: true,
            type: "success",
            msg: "Holiday  updated successfully.",
          });
          queryClient.invalidateQueries("holidays");
        })
        .catch((error) => {
          console.error("Error updating holiday:", error);
        });
    } else if (operation === "delete") {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API}/route/holiday/delete/${id}`
        );
        console.log("Holiday deleted successfully.");
        setOpenModal(false);
        setAppAlert({
          alert: true,
          type: "success",
          msg: "Holiday deleted successfully.",
        });
        queryClient.invalidateQueries("holidays");
      } catch (error) {
        console.error("Error deleting holiday:", error);
        setAppAlert({
          alert: true,
          type: "error",
          msg: "Error deleting holiday!",
        });
      }
    } else {
      console.log("Nothing changed");
      setAppAlert({
        alert: true,
        type: "error",
        msg: "error occured!",
      });
    }

    handleClose();
  };

  return (
    <BoxComponent sx={{ p: 0 }}>
      <Setup>
        <div className="h-[90vh] overflow-y-auto scroll px-3">
          <div className="xs:block sm:block md:flex justify-between items-center ">
            <HeadingOneLineInfo
              className="!my-3"
              heading="Public Holidays"
              info="Add public holidays which will applicable to all employees.
                  Ex: Independence day."
            />
            <BasicButton title="Add Holiday" onClick={() => setOpenModal(true)} />
          </div>
          {data?.length > 0 ? (
            <div className=" xs:mt-3 sm:mt-3 md:mt-0">
              <table className="min-w-full bg-white  text-left !text-sm font-light">
                <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                  <tr className="!font-semibold">
                    <th scope="col" className="whitespace-nowrap !text-left pl-8 py-3">
                      Sr. No
                    </th>
                    <th scope="col" className="whitespace-nowrap !text-left pl-8 py-3">
                      Holiday Name
                    </th>
                    <th scope="col" className="whitespace-nowrap !text-left pl-8 py-3">
                      Date
                    </th>
                    <th scope="col" className="whitespace-nowrap !text-left pl-8 py-3">
                      Type
                    </th>
                    <th scope="col" className="whitespace-nowrap !text-left pl-8 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((data, id) => (
                    <HolidayRow {...{ data, id }} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
              <article className="flex items-center mb-1 text-red-500 gap-2">
                <Info className="!text-2xl" />
                <h1 className="text-lg font-semibold">Add Public Holidays</h1>
              </article>
              <p>No public holidays found. Please add the public holidays</p>
            </section>
          )}
        </div>
        <ReusableModel
          heading="Add Public Holiday"
          subHeading="Add a public holiday to your organisation"
          open={openModal}
          onClose={handleClose}
        >
          <MiniForm locations={locations} data={data} onClose={handleClose} />
        </ReusableModel>

        <Dialog fullWidth open={actionModal} onClose={handleClose}>
          <DialogContent>
            {operation === "edit" ? (
              <>
                <h1 className="text-xl pl-2 font-semibold font-sans">
                  Edit Holiday
                </h1>
                <div className="flex gap-3 flex-col mt-3">
                  <TextField
                    required
                    size="small"
                    className="w-full"
                    label="Holiday name"
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => {
                      if (e.target.value.length <= 35) {
                        setName(e.target.value);
                      }
                    }}
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]} required>
                      <DatePicker
                        label="Holiday date"
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            style: { marginBottom: "8px" },
                          },
                        }}
                        value={inputdata.date}
                        onChange={(newDate) => handleDateChange(newDate)}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                  <FormControl size="small" fullWidth>
                    <InputLabel id="holiday-type-label">
                      Holiday type
                    </InputLabel>
                    <Select
                      labelId="holiday-type-label"
                      id="demo-simple-select"
                      label="holiday type"
                      className="mb-[8px]"
                      value={type}
                      name="type"
                      onChange={(e) => setType(e.target.value)}
                    >
                      <MenuItem value="Optional">Optional</MenuItem>
                      <MenuItem value="Mandatory">Mandatory</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" fullWidth>
                    <InputLabel id="region-label">Region</InputLabel>
                    <Select
                      labelId="region-label"
                      id="demo-simple-select"
                      label="Region"
                      className="mb-[8px]"
                      onChange={(e) => setRegion(e.target.value)}
                      value={region}
                      name="region"
                    >
                      {locations?.length > 0 ? (
                        locations?.map((location, idx) => (
                          <MenuItem key={idx} value={location.shortName}>
                            {location.shortName}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value={""}>add location first</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </div>

                <div className="mt-5 flex gap-5 justify-end">
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={handleClose}
                  >
                    cancel
                  </Button>
                  <Button
                    onClick={doTheOperation}
                    color="primary"
                    variant="contained"
                  >
                    Apply
                  </Button>
                </div>
              </>
            ) : (
              <>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                  <p>
                    Please confirm your decision to delete this holiday, as
                    this action cannot be undone.
                  </p>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleClose}
                    variant="outlined"
                    color="primary"
                    size="small"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={doTheOperation}
                    color="error"
                  >
                    Delete
                  </Button>
                </DialogActions>
              </>
            )}
          </DialogContent>
        </Dialog>
      </Setup>
    </BoxComponent>
  );
};

export default PublicHoliday;

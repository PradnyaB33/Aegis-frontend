import CheckIcon from "@mui/icons-material/Check";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { format } from "date-fns";
import React, { useState } from "react";
import useNotificationRemotePunching from "../../hooks/QueryHook/Remote-Punch/components/mutation";
import useEmpConfirmation from "../../hooks/QueryHook/Remote-Punch/hook";
import MappedPunches from "./components/mapped-punches";

const EmployeeConfirmation = () => {
  const { data } = useEmpConfirmation();
  const { notifyManagerMutation } = useNotificationRemotePunching();
  const [Id, setId] = useState(null);
  const [punchObjectId, setPunchObjectId] = useState(null);
  return (
    <div className="w-full h-[100%] flex justify-between relative">
      <div className="z-50 p-6 flex flex-col mt-7 w-[30vw] bg-white gap-4">
        <div className="w-full flex flex-col bg-white h-full justify-between">
          <h1 className="text-slate-400 mb-1">Select Date For Application</h1>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">Select Date</InputLabel>
            <Select
              labelId="date-select-label"
              id="date-select"
              label="Select Date"
              onChange={(event) => {
                setId(event.target.value);
              }}
            >
              {data?.allPunchData?.length > 0 ? (
                data?.allPunchData?.map((doc, idx) => {
                  return (
                    <MenuItem key={idx} value={doc._id}>
                      {format(new Date(doc.createdAt), "dd-MM-yyyy")}
                    </MenuItem>
                  );
                })
              ) : (
                <MenuItem value="">No Data Found</MenuItem>
              )}
            </Select>
          </FormControl>
          <div>
            <p className=" z-[99999999]  mt-4 font-semibold  mb-3">
              Total Approximate Distance : Kilometers
            </p>
          </div>
          {Id !== null && (
            <MappedPunches {...{ Id, setPunchObjectId, punchObjectId }} />
          )}
          {Id ? (
            <div className=" mt-5 flex justify-end">
              <Button
                onClick={() => notifyManagerMutation.mutate(Id)}
                variant="contained"
                className=""
              >
                <CheckIcon />
                Apply for remote punching
              </Button>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeConfirmation;

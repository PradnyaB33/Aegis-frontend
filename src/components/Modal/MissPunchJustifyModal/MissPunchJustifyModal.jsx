import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
} from "@mui/material";
import React, { useContext } from "react";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import useMissedJustifyState from "./useMissedJustifyState";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Person } from "@mui/icons-material";
import AuthInputFiled from "../../InputFileds/AuthInputFiled";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MissPunchJustifyModal = ({
  handleClose,
  open,
  unavailableRecords,
  organisationId,
  data,
}) => {
  const navigate = useNavigate();
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const unavailableRecordId = unavailableRecords?._id;
  const { justify } = useMissedJustifyState();
  console.log("unavailable record", unavailableRecords);

  const MissPunchSchema = z.object({
    justify: z.string(),
  });

  const { control, formState, handleSubmit, reset } = useForm({
    defaultValues: {
      justify: justify,
    },
    resolver: zodResolver(MissPunchSchema),
  });

  const { errors } = formState;

  const queryClient = useQueryClient();

  const AddMissJustifyData = useMutation(
    (data) => {
      axios.put(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/update-punching-data/${unavailableRecordId}`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["missedJustifyData"] });
        handleClose();
        handleAlert(true, "success", "Request has been sent to manager.");
      },

      onError: () => {
        handleAlert(true, "error", "Something went wrong");
      },
    }
  );

  const onSubmit = async (data) => {
    const formattedData = {
      justify: data.justify,
    };
    console.log("formattedData", formattedData);
    AddMissJustifyData.mutate(formattedData);
    reset();
  };

  const handleRedirect = async (actionType) => {
    if (actionType === "leave") {
      navigate(`/organisation/${organisationId}/leave`);
    } else if (actionType === "shift") {
      navigate(`/shift-management`);
    }
  };

  return (
    <Dialog
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "800px!important",
          height: "100%",
          maxHeight: "40vh!important",
        },
      }}
      open={open}
      onClose={handleClose}
      className="w-full"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="flex w-full justify-between py-4 items-center  px-4">
        <h1 id="modal-modal-title" className="text-lg  font-semibold">
          Justify For Missed Data
        </h1>
        <IconButton onClick={handleClose}>
          <CloseIcon className="!text-[16px]" />
        </IconButton>
      </div>

      <DialogContent className="border-none  !pt-0 !px-0  shadow-md outline-none rounded-md">
        <div className="w-full">
          <Divider variant="fullWidth" orientation="horizontal" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className=" ml-2 mr-2 mt-2">
          <AuthInputFiled
            name="justify"
            icon={Person}
            control={control}
            type="text"
            placeholder="Forgot..."
            label="Enter your justification"
            errors={errors}
            error={errors.justify}
          />

          <DialogActions
            sx={{
              justifyContent: "center",
              gap: "10px",
            }}
          >
            {unavailableRecords &&
            unavailableRecords.status !== null &&
            unavailableRecords.status !== undefined &&
            (unavailableRecords.status === "Partial" ||
              unavailableRecords.status === "Unavailable") ? (
              <>
                <Button
                  type="button"
                  variant="outlined"
                  color="primary"
                  onClick={() => handleRedirect("leave")}
                >
                  Apply for Leave
                </Button>
              </>
            ) : null}

            {unavailableRecords &&
            unavailableRecords.status !== null &&
            unavailableRecords.status !== undefined &&
            unavailableRecords.status === "ExtraShift" ? (
              <>
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleRedirect("shift")}
                >
                  Apply for Shift
                </Button>
              </>
            ) : null}

            {unavailableRecords &&
            unavailableRecords.status !== null &&
            unavailableRecords.status !== undefined &&
            (unavailableRecords.status === "Partial" ||
              unavailableRecords.status === "Unavailable" ||
              unavailableRecords.status === "ExtraShift" ||
              unavailableRecords.status === "Overtime") ? (
              <>
                <Button type="submit" variant="contained" color="success">
                  Submit
                </Button>
                <Button onClick={handleClose} color="error" variant="outlined">
                  Cancel
                </Button>
              </>
            ) : null}
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MissPunchJustifyModal;

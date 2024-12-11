import { zodResolver } from "@hookform/resolvers/zod";
import { Email } from "@mui/icons-material";
import { Box, Button, Modal, Tooltip } from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import GroupIcon from "@mui/icons-material/Group";
import AuthInputFiled from "../../InputFileds/AuthInputFiled";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
};

const AddJobLevel = ({ handleClose, open, organisationId }) => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();
  const [error, setError] = useState();

  const JobLevelSchema = z.object({
    jobLevel: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    ),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      jobLevel: undefined,
    },
    resolver: zodResolver(JobLevelSchema),
  });

  const AddJobLevel = useMutation(
    (data) =>
      axios.post(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/add-job-level`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),

    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["job-level"] });
        handleClose();
        handleAlert(true, "success", "Job level added successfully");
        reset();
      },
      onError: () => {
        setError("An Error occurred while setup the add job level.");
      },
    }
  );

  const onSubmit = async (data) => {
    try {
      console.log("data", data);
      const jobLevelValue = data?.jobLevel?.map((item) => item.label);
      const formData = { jobLevel: jobLevelValue };
      console.log(formData);
      await AddJobLevel.mutateAsync(formData);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to add the communication");
      setError("Failed to add the loan type");
    }
  };
  console.log(error);
  return (
    <>
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
              Add Job Level
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-5 space-y-4 mt-4">
              <Tooltip title="Here you can manually add communication types">
                <div className="space-y-2 ">
                  <AuthInputFiled
                    name="jobLevel"
                    icon={GroupIcon}
                    control={control}
                    type="autocomplete"
                    placeholder="Job Level*"
                    label="Job Level*"
                    readOnly={false}
                    maxLimit={15}
                    errors={errors}
                    error={errors.jobLevel}
                  />
                </div>
              </Tooltip>

              <div className="flex gap-4 mt-4 justify-end">
                <Button onClick={handleClose} color="error" variant="outlined">
                  Cancel
                </Button>

                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default AddJobLevel;

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Modal } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import AuthInputFiled from "../../InputFileds/AuthInputFiled";
import { Email } from "@mui/icons-material";
import GroupIcon from "@mui/icons-material/Group";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
};

const EditJobLevel = ({
  handleClose,
  open,
  organisationId,
  jobLevelId,
}) => {
  const queryClient = useQueryClient();
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];

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

  const { data: getCommunicationById } = useQuery(
    ["emailCommunication", organisationId,  jobLevelId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/${organisationId}/${jobLevelId}/get-job-level`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );

  useEffect(() => {
    if (getCommunicationById) {
      setValue("email", getCommunicationById.email);
      const communicationValue = getCommunicationById.communication.map(
        (item) => ({
          label: item,
          value: item,
        })
      );
      setValue("communication", communicationValue);
    }
  }, [getCommunicationById, setValue]);

  const EditCommunication = useMutation(
    (data) =>
      axios.put(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/${editCommunicationId}/update-communication`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["emailCommunication"] });
        handleClose();
        handleAlert(true, "success", "Email updated successfully.");
      },
      onError: () => {
        setError("An Error occurred while updating email.");
      },
    }
  );

  const onSubmit = async (data) => {
    try {
      const communicationValue = data.communication.map((item) => item.label);
      const formData = { email: data.email, communication: communicationValue };
      await EditCommunication.mutateAsync(formData);
    } catch (error) {
      setError("An error occurred while updating email.");
    }
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
        <div className="flex justify-between py-4 items-center px-4">
          <h1 className="text-xl pl-2 font-semibold font-sans">Edit Email</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-5 space-y-4 mt-4">
            <div className="space-y-2">
              <AuthInputFiled
                name="email"
                icon={Email}
                control={control}
                type="text"
                placeholder="Email"
                label="Email *"
                errors={errors}
                error={errors.email}
              />
            </div>
            <div className="space-y-2">
              <AuthInputFiled
                name="communication"
                icon={GroupIcon}
                control={control}
                type="autocomplete"
                placeholder="Communication Type*"
                label="Communication Type*"
                readOnly={false}
                maxLimit={15}
                errors={errors}
                error={errors.communication}
                optionlist={communicationOptions ? communicationOptions : []}
              />
            </div>
            <div className="flex gap-4 mt-4 mr-4 mb-4 justify-end">
              <Button onClick={handleClose} color="error" variant="outlined">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Apply
              </Button>
            </div>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default EditJobLevel;

import { zodResolver } from "@hookform/resolvers/zod";
import { Add, ToggleOn, WorkOffOutlined } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  Stack,
} from "@mui/material";
import axios from "axios";
import randomColor from "randomcolor";
import React, { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import AuthInputFiled from "../../InputFileds/AuthInputFiled";
import ReusableModal from "../component";

const CreteLeaveTypeModal = ({ handleClose, open }) => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();
  const param = useParams();
  const leaveTypeSchema = z.object({
    leaveName: z
      .string()
      .min(3, { message: "Minimum 3 characters required" })
      .max(35, { message: "Maximum 35 characters allowed" }),
    count: z
      .string()
      .optional() // makes count optional
      .refine((doc) => !doc || (Number(doc) >= 0 && Number(doc) <= 365), {
        message: "Count must be between 0 and 365",
      }),
    color: z.string(),
    isActive: z.boolean(),
  });
  const form = useForm({
    defaultValues: {
      leaveName: undefined,
      color: randomColor(),
      isActive: true,
      count: undefined,
    },
    resolver: zodResolver(leaveTypeSchema),
  });

  const { handleSubmit, control, formState } = form;
  const { errors } = formState;

  const isFormClean = Object.keys(formState.dirtyFields).length === 0;

  const { mutate, isLoading } = useMutation(
    async (data) => {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/leave-types/${param.organisationId}`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },
    {
      onSuccess: (data) => {
        form.reset();
        handleAlert(true, "success", data.message);
        // Invalidate the query to refetch the data
        queryClient.invalidateQueries("leaveTypes");
        handleClose();
      },
      onError: (data) => {
        handleAlert(
          true,
          "error",
          data?.response?.data?.message ||
            "Failed to update leave type. Please try again."
        );
      },
    }
  );
  const onSubmit = async (data) => {
    try {
      mutate(data);
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };

  return (
    <ReusableModal heading={"Add leave type"} open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack className="w-[-webkit-fill-available]">
          <AuthInputFiled
            name="leaveName"
            icon={WorkOffOutlined}
            control={control}
            type="text"
            placeholder="eg. Sick leave"
            label="Leave Type Name *"
            errors={errors}
            error={errors.leaveName}
          />
          <AuthInputFiled
            name="count"
            icon={Add}
            control={control}
            type="number"
            placeholder="eg. 4"
            label="Enter Count *"
            errors={errors}
            error={errors.count}
          />
          <FormControl component="fieldset">
            <FormLabel
              component="legend"
              className="!font-semibold !text-gray-500 !text-md"
            >
              Color
            </FormLabel>
            <Controller
              name="color"
              control={control}
              render={({ field }) => {
                return (
                  <div
                    className="rounded-full overflow-hidden relative"
                    style={{
                      height: "40px",
                      width: "40px",
                    }}
                  >
                    <input
                      value={field.value}
                      required
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        height: "60px",
                        width: "60px",
                        padding: "0",
                        border: "none",
                      }}
                      type="color"
                      id="favcolor"
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </div>
                );
              }}
            />
          </FormControl>
          <AuthInputFiled
            name="isActive"
            icon={ToggleOn}
            control={control}
            type="checkbox"
            placeholder="eg. 4"
            label="Is Active *"
            errors={errors}
            error={errors.count}
          />
          <Button
            disabled={isFormClean || isLoading}
            type="submit"
            variant="contained"
          >
            <div className="w-6 h-6">
              {isLoading && <CircularProgress size={20} />}
            </div>
            Submit
          </Button>
        </Stack>
      </form>
    </ReusableModal>
  );
};

export default CreteLeaveTypeModal;

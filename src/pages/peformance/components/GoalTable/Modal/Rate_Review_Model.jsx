import { zodResolver } from "@hookform/resolvers/zod";
import { Close, Paid, PersonOutline, StarOutlined } from "@mui/icons-material";
import { Box, Button, IconButton, Modal } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { z } from "zod";
import { TestContext } from "../../../../../State/Function/Main";
import AuthInputFiled from "../../../../../components/InputFileds/AuthInputFiled";
import useAuthToken from "../../../../../hooks/Token/useAuth";

const Rate_Review_Model = ({ handleClose, open, options, id, performance }) => {
  const { handleAlert } = useContext(TestContext);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    overflow: "scroll",
    maxHeigh: "80vh",
    p: 4,
  };

  const authToken = useAuthToken();
  const zodSchema = z.object({
    review: z.string(),
    rating: z.object({ value: z.string(), label: z.string() }),
    assignee: z.string(),
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {},
    resolver: zodResolver(zodSchema),
  });

  useEffect(() => {
    setValue("assignee", `${id?.empId?.first_name} ${id?.empId?.last_name}`);
    if (id?.others[0]?.managerRating) {
      setValue("rating", {
        label: id?.others[0]?.managerRating,
        value: id?.others[0]?.managerRating,
      });
    }

    setValue("review", id?.others[0]?.managerFeedback);
    // eslint-disable-next-line
  }, [open, id]);

  const queryClient = useQueryClient();
  const giveRating = useMutation(
    async (data) => {
      await axios.put(
        `${process.env.REACT_APP_API}/route/performance/giveRating`,
        {
          ...data,
          empId: id.empId._id,
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
    },
    {
      onSuccess: () => {
        handleAlert(true, "success", "Performance setup created successfully");
        queryClient.invalidateQueries("orggoals");
        handleClose();
      },
    }
  );

  const onSubmit = async (data) => {
    const goals = {
      review: data.review,
      rating: data.rating.value,
    };

    giveRating.mutate(goals);
  };

  useQuery("employee", async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/employee/getEmployeeUnderManager`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return data;
  });

  const ratingOptions = performance?.ratings?.map((rate) => ({
    value: rate,
    label: rate,
  }));

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
            <h1 id="modal-modal-title" className="text-xl pl-2">
              Review & Rating Form
            </h1>
            <IconButton onClick={handleClose}>
              <Close className="!text-[16px]" />
            </IconButton>
          </div>

          {/* {isFetching ? (
            <CircularProgress />
          ) : ( */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-6 max-h-[80vh] overflow-auto "
          >
            <AuthInputFiled
              name="assignee"
              icon={PersonOutline}
              readOnly={true}
              control={control}
              type="text"
              isMulti={false}
              placeholder="Assignee name"
              label="Select assignee name"
              errors={errors}
              error={errors.assignee}
            />

            <AuthInputFiled
              name="rating"
              icon={StarOutlined}
              control={control}
              type="select"
              options={ratingOptions}
              placeholder="rate"
              label="Add rating"
              errors={errors}
              error={errors.rating}
            />

            <AuthInputFiled
              name="review"
              icon={Paid}
              control={control}
              type="texteditor"
              placeholder="100"
              label="Enter review"
              errors={errors}
              error={errors.review}
            />

            <div className="flex gap-4  mt-4 mr-4 justify-end">
              <Button
                type="button"
                onClick={handleClose}
                color="error"
                variant="outlined"
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
            </div>
          </form>
          {/* )} */}
        </Box>
      </Modal>
    </>
  );
};

export default Rate_Review_Model;

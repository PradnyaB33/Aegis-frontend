import { zodResolver } from "@hookform/resolvers/zod";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import BasicButton from "../../../components/BasicButton";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useAuthToken from "../../../hooks/Token/useAuth";
import Setup from "../../SetUpOrganization/Setup";

const ExtraDay = () => {
  const authToken = useAuthToken();
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();

  const formSchema = z.object({
    extraDay: z.boolean(),
  });

  const { control, formState, handleSubmit, setValue } = useForm({
    defaultValues: {
      extraDay: false,
    },
    resolver: zodResolver(formSchema),
  });

  const { errors } = formState;

  const onSubmit = async (data) => {
    console.log("extra day", data);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/add/extra-day`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      console.log("response", response);

      if (response && response.data && response.data.success) {
        handleAlert(true, "success", "Extra day is added successfully");
      }

      queryClient.invalidateQueries("extra-day");
    } catch (error) {
      console.log("Error occurred due to add extra day", error.message);
    }
  };

  const { isLoading } = useQuery(
    "extra-day",
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get/extra-day`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data;
    },
    {
      onSuccess: (data) => {
        if (data && data.extraDay) {
          setValue("extraDay", data.extraDay.extraDay);
        }
      },
    }
  );

  return (
    <BoxComponent sx={{ p: 0 }}>
      <Setup>
        <div className="h-[90vh] overflow-y-auto scroll px-3">
          <div className="xs:block sm:block md:flex justify-between items-center ">
            <HeadingOneLineInfo
              className="!my-3"
              heading="Extra Day"
              info="This setup is used to add the extra day."
            />
          </div>
          {isLoading ? ( // Show loader when data is loading
            <div className="flex justify-center items-center">
              <CircularProgress /> {/* Loader icon */}
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} action="">
              <div className="flex justify-between gap-4">
                <div className="w-full mb-8">
                  <AuthInputFiled
                    name="extraDay"
                    control={control}
                    type="checkbox"
                    placeholder="Extra Day"
                    label="Extra Add"
                    errors={errors}
                    error={errors.extraDay}
                    descriptionText={
                      "Does this organisation allow extra day pay."
                    }
                  />
                </div>
              </div>
              <BasicButton type="submit" title="Submit" />
            </form>
          )}
        </div>
      </Setup>
    </BoxComponent>
  );
};

export default ExtraDay;

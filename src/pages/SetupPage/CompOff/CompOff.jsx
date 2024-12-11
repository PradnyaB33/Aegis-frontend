import { zodResolver } from "@hookform/resolvers/zod";
import { Business } from "@mui/icons-material";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useAuthToken from "../../../hooks/Token/useAuth";
import Setup from "../../SetUpOrganization/Setup";
import { TestContext } from "../../../State/Function/Main";


const CompOff = () => {
  const authToken = useAuthToken();
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();

  const formSchema = z.object({
    compOff: z.boolean(),
  });

  const { control, formState, handleSubmit, setValue } = useForm({
    defaultValues: {
      compOff: false,
    },
    resolver: zodResolver(formSchema),
  });

  const { errors } = formState;

  const onSubmit = async (data) => {
    console.log("comp off", data);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/add/compOff`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      console.log("response", response);

      if (response && response.data && response.data.success) {
        handleAlert(true, "success", "Comp Of leave is added successfully");
      }

      queryClient.invalidateQueries("comp-off");
    } catch (error) {
      console.log("Error occurred due to adding comp of leave", error.message);
    }
  };

  const { isLoading } = useQuery(
    "comp-off",
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get/comp-off`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data;
    },
    {
      onSuccess: (data) => {
        console.log("dddddd", data);

        if (data && data.compOff) {
          setValue("compOff", data.compOff.compOff);
        }
      },
    }
  );

  return (
    <div>
      <section className="bg-gray-50 overflow-hidden min-h-screen w-full">
        <Setup>
          <article className=" bg-white  w-full h-max shadow-md rounded-sm border items-center">
            <div className="p-4 border-b-[.5px] flex items-center justify-between gap-3 w-full border-gray-300">
              <div className="flex gap-3 ">
                <div className="mt-1">
                  <PaidOutlinedIcon />
                </div>
                <div>
                  <h1 className="!text-lg">Comp of leave</h1>
                  <p className="text-xs text-gray-600">
                    This setup is used to add the comp of leave.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-5">
              {isLoading ? ( // Show loader when data is loading
                <div className="flex justify-center items-center">
                  <CircularProgress /> {/* Loader icon */}
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} action="">
                  <div className="flex justify-between gap-4">
                    <div className="w-full mb-4">
                      <AuthInputFiled
                        name="compOff"
                        icon={Business}
                        control={control}
                        type="checkbox"
                        placeholder="Comp of leave"
                        label="compOff"
                        errors={errors}
                        error={errors.compOff}
                        descriptionText={
                          "Does this organisation allow comp of leave."
                        }
                      />
                    </div>
                  </div>
                  <div className="py-2 mt-6">
                    <Button
                      className="mt-4"
                      size="small"
                      type="submit"
                      variant="contained"
                    >
                      Submit
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </article>
        </Setup>
      </section>
    </div>
  );
};

export default CompOff;

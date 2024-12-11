import { zodResolver } from "@hookform/resolvers/zod";
import { Business } from "@mui/icons-material";
import { Checkbox, FormControlLabel } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { UseContext } from "../../../State/UseState/UseContext";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useAuthToken from "../../../hooks/Token/useAuth";
import Setup from "../../SetUpOrganization/Setup";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BasicButton from "../../../components/BasicButton";

const SetupShift = () => {
  const { organisationId: orgId } = useParams();
  const authToken = useAuthToken();
  const [showAmountField, setShowAmountField] = useState(false);
  const { setAppAlert } = useContext(UseContext);
  const queryClient = useQueryClient();

  const formSchema = z.object({
    amount: z.string().refine((val) => !isNaN(val), {
      message: "Amount must be a number",
    }),
    dualWorkflow: z.boolean(),
    extraAllowance: z
      .string()
      .optional()
      .refine((val) => val === undefined || !isNaN(Number(val)), {
        message: "Extra Allowance must be a number",
      }),
  });
  console.log("some code");

  const { control, formState, handleSubmit, setValue } = useForm({
    defaultValues: {
      amount: "0",
      dualWorkflow: false,
      extraAllowance: "",
    },
    resolver: zodResolver(formSchema),
  });

  const { errors } = formState;

  const onSubmit = async (data) => {
    console.log("shift allowance data", data);
    try {
      if (data.amount === "0") {
        const resp2 = await axios.post(
          `${process.env.REACT_APP_API}/route/shiftApply/postallowance/${orgId}`,
          {
            data: {
              ...data,
              amount: Number(data.amount),
              extraAllowance: data.extraAllowance
                ? Number(data.extraAllowance)
                : undefined,
            },
          },
          { headers: { Authorization: authToken } }
        );
        console.log(resp2);
      } else {
        const resp1 = await axios.post(
          `${process.env.REACT_APP_API}/route/shifts/setAllowance/${orgId}`,
          {
            data: {
              ...data,
              amount: Number(data.amount),
              extraAllowance: data.extraAllowance
                ? Number(data.extraAllowance)
                : undefined,
            },
          },
          { headers: { Authorization: authToken } }
        );

        console.log(resp1);
      }

      setAppAlert({
        alert: true,
        type: "success",
        msg: "Your request is successful",
      });
      queryClient.invalidateQueries("get-shift-allowance");
    } catch (error) {
      console.log("Operation not completed", error.message);
    }
  };

  const { data } = useQuery("get-shift-allowance", async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/shiftApply/getallowance/${orgId}`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data;
  });

  useEffect(() => {
    if (data?.existingAllowance) {
      setValue("dualWorkflow", data.existingAllowance.check);
    }
  }, [data, setValue]);

  return (
    <BoxComponent sx={{ p: 0 }}>
      <Setup>
        <div className="h-[90vh] overflow-y-auto scroll px-3">
          <div className="xs:block sm:block md:flex justify-between items-center ">
            <HeadingOneLineInfo
              className="!my-3"
              heading="Shift Allowance"
              info="This setup is used to add the amount for the shift allowance."
            /></div>
          <form onSubmit={handleSubmit(onSubmit)} action="">
            <div className="flex justify-between gap-4">
              <div className="w-full mb-8">
                <AuthInputFiled
                  name="dualWorkflow"
                  icon={Business}
                  control={control}
                  type="checkbox"
                  placeholder="Dual Workflow"
                  label="Dual Workflow"
                  errors={errors}
                  error={errors.dualWorkflow}
                  descriptionText={
                    "Enabling workflow ensures account approval after manager's approval otherwise added directly as allowance."
                  }
                />
              </div>
              <div className="w-full">
                <FormControlLabel
                  className="text-gray-700 font-body"
                  control={
                    <Checkbox
                      checked={showAmountField}
                      onChange={(e) => setShowAmountField(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Enable Allowance Amount"
                />
              </div>
            </div>
            <BasicButton type="submit" title="Submit" />
          </form></div>
      </Setup>
    </BoxComponent>
  );
};

export default SetupShift;

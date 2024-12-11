import { zodResolver } from "@hookform/resolvers/zod";
import { Title } from "@mui/icons-material";
import { Box, Button, Modal } from "@mui/material";
import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import MoneyIcon from "@mui/icons-material/Money";
import PercentIcon from "@mui/icons-material/Percent";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
};

const AddLoanTypeModal = ({ handleClose, open, organisationId }) => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();
  const [error, setError] = useState(null);

  const EmpLoanMgtSchema = z.object({
    loanName: z
      .string()
      .min(2)
      .max(35)
      .refine((value) => /^[A-Za-z\s]+$/.test(value), {
        message: "Loan name should only contain alphabetic characters",
      }),
    loanValue: z
      .string()
      .refine(
        (value) => {
          const floatValue = parseFloat(value);
          return (
            floatValue >= 0 &&
            floatValue <= 10000000 &&
            !Object.is(floatValue, -0)
          );
        },
        {
          message: "Loan value should be between 0 and 1 crore",
        }
      )
      .refine(
        (value) => {
          const floatValue = parseFloat(value);
          return floatValue >= 0;
        },
        {
          message: "Loan value should be a positive number",
        }
      ),
    maxLoanValue: z
      .string()
      .refine(
        (value) => {
          const floatValue = parseFloat(value);
          return (
            floatValue >= 0 &&
            floatValue <= 10000000 &&
            !Object.is(floatValue, -0)
          );
        },
        {
          message: "Maximum loan value should be between 0 and 1 crore",
        }
      )
      .refine(
        (value) => {
          const floatValue = parseFloat(value);
          return floatValue >= 0;
        },
        {
          message: "Maximum loan value should be a positive number",
        }
      ),
    rateOfInterest: z.string().refine(
      (value) => {
        const floatValue = parseFloat(value);
        return floatValue > 0 && floatValue < 100;
      },
      {
        message: "Rate of interest should be between 0 and 99%",
      }
    ),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      loanName: undefined,
      loanValue: undefined,
      maxLoanValue: undefined,
      rateOfInterest: undefined,
    },
    resolver: zodResolver(EmpLoanMgtSchema),
  });

  useEffect(() => {
    setError(null);
  }, [control]);

  const AddLoanType = useMutation(
    (data) =>
      axios.post(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/add-loan-type`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),

    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["loanType"] });
        handleClose();
        handleAlert(true, "success", "Loan Type added successfully");
        reset();
      },
      onError: () => {
        setError("An Error occurred while creating a loan type.");
      },
    }
  );

  //for  Get Query
  const { data: getEmployeeLoans } = useQuery(
    ["loanType", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-loan-type`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );

  console.log("emp loan", getEmployeeLoans);

  const onSubmit = async (data) => {
    try {
      console.log(data);

      if (parseFloat(data.loanValue) === parseFloat(data.maxLoanValue)) {
        setError("Min loan value and max loan value should not be the same.");
        return;
      }
      if (parseFloat(data.loanValue) >= parseFloat(data.maxLoanValue)) {
        setError("Min loan value should be less than max loan value.");
        return;
      }
      if (parseFloat(data.maxLoanValue) <= parseFloat(data.loanValue)) {
        setError("Max loan value should be greater than min loan value.");
        return;
      }

      // Check for uniqueness of loanName
      const existingLoanNames = getEmployeeLoans.map((data) => data.loanName);
      if (existingLoanNames.includes(data.loanName)) {
        setError("Loan name must be unique.");
        return;
      }

      await AddLoanType.mutateAsync(data);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("An error occurred while creating a loan type");
    }
  };

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
              Add Loan Type
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-5 space-y-4 mt-4">
              {error && <div className="text-red-500">{error}</div>}
              <div className="space-y-2 ">
                <AuthInputFiled
                  name="loanName"
                  icon={Title}
                  control={control}
                  type="text"
                  placeholder="Loan Name"
                  label="Loan Name *"
                  errors={errors}
                  error={errors.loanName}
                />
              </div>
              <div className="space-y-2 ">
                <AuthInputFiled
                  name="loanValue"
                  icon={MoneyIcon}
                  control={control}
                  type="number" 
                  placeholder="Minimum Loan Value"
                  label="Minimum Loan Value *"
                  errors={errors}
                  error={errors.loanValue}
                />
              </div>
              <div className="space-y-2 ">
                <AuthInputFiled
                  name="maxLoanValue"
                  icon={MoneyIcon}
                  control={control}
                  type="number"
                  placeholder="Maximum Loan Value"
                  label="Maximum Loan Value *"
                  errors={errors}
                  error={errors.maxLoanValue}
                />
              </div>
              <div className="space-y-2 ">
                <AuthInputFiled
                  name="rateOfInterest"
                  icon={PercentIcon}
                  control={control}
                  type="number"
                  placeholder="Rate Of Interest"
                  label="Rate Of Interest "
                  errors={errors}
                  error={errors.rateOfInterest}
                />
              </div>
              <div className="space-y-2 "></div>
              <div className="flex gap-4  mt-4  justify-end">
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

export default AddLoanTypeModal;

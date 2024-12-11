import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Close, Paid } from "@mui/icons-material";
import { Box, Button, IconButton, Modal } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { z } from "zod";
import { TestContext } from "../../../../../State/Function/Main";
import AuthInputFiled from "../../../../../components/InputFileds/AuthInputFiled";
import useIncomeTax from "../../../../../hooks/IncomeTax/useIncomeTax";
import useAuthToken from "../../../../../hooks/Token/useAuth";
import useGetSalaryByFY from "../../../../Income-Tax/hooks/queries/useGetSalaryByFY";
const TDSDeclarationModel = ({
  open,
  handleClose,
  investment,
  isReject,
  empId,
}) => {
  const authToken = useAuthToken();

  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();

  const { usersalary: empSalary } = useGetSalaryByFY(empId);

  const { financialYear } = useIncomeTax();
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    p: 4,
  };

  console.log(`🚀 ~ empSalary:`, empSalary);
  const zodSchema = z.object({
    declaration: z
      .string()
      .refine((value) => Number(value) <= Number(investment?.declaration), {
        message: "Value must be less than declaration",
      }),
    message: z.string().optional(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      declaration: undefined,
      message: undefined,
    },
    resolver: zodResolver(zodSchema),
  });

  // test
  useEffect(
    () => {
      setValue("declaration", investment?.declaration?.toString());
    },
    // eslint-disable-next-line
    [investment]
  );

  useEffect(
    () => {
      if (!open) {
        reset({
          message: undefined,
        });
      }
    },
    // eslint-disable-next-line
    [open]
  );

  const onSubmit = async (data) => {
    const requestData = {
      empId,
      usersalary: empSalary?.TotalInvestInvestment,
      requestData: {
        name: investment.name,
        sectionname: investment.sectionname,
        status: isReject ? "Reject" : "Approved",
        message: data.message,
        amountAccepted: isReject ? 0 : data.declaration,
      },
    };
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/route/tds/changeApprovals/${financialYear}`,
        { empId, ...requestData },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      handleAlert(
        true,
        "success",
        `${
          isReject
            ? "Declaration rejected successfully"
            : "Declaration approved successfully"
        } `
      );
      queryClient.invalidateQueries(["EmpData"]);
      queryClient.invalidateQueries(["AccoutantEmp"]);
      handleClose();
      // queryClient.invalidateQueries({ queryKey: ["incomeHouse"] });
    } catch (error) {
      console.log(error);
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
            <h1 id="modal-modal-title" className="text-xl pl-2">
              {isReject
                ? "Reject Investments Declaration"
                : "Approve Investments Declaration"}
            </h1>
            <IconButton onClick={handleClose}>
              <Close className="!text-[16px]" />
            </IconButton>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="px-6 ">
            <div className="space-y-1 mt-1 mb-5 min-w-11">
              <label className={`font-semibold text-gray-500 text-md`}>
                Declaration name
              </label>

              <div
                className="bg-gray-200 flex rounded-md items-center px-2    py-1 md:py-[6px]
              border-gray-200 border-[.5px]
              "
              >
                {investment?.name}
              </div>
            </div>
            {!isReject && (
              <AuthInputFiled
                name="declaration"
                icon={Paid}
                control={control}
                type="text"
                placeholder="100"
                label="Amount Approved"
                errors={errors}
                error={errors.declaration}
              />
            )}
            <AuthInputFiled
              name="message"
              icon={Category}
              control={control}
              type="textarea"
              placeholder="sec1"
              label="Add message"
              errors={errors}
              error={errors.message}
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
                {isReject ? "Reject Declaration" : "Approve Declaration"}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default TDSDeclarationModel;

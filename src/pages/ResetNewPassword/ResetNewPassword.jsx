import { zodResolver } from "@hookform/resolvers/zod";
import { Close } from "@mui/icons-material";
import { Box, IconButton, Modal } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { z } from "zod";
import { TestContext } from "../../State/Function/Main";
import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
import UserProfile from "../../hooks/UserData/useUser";
import ModalHeading from "../../components/HeadingOneLineInfo/ModalHeading";
import BasicButton from "../../components/BasicButton";

const ResetNewPassword = ({ open, handleClose }) => {
  const { handleAlert } = useContext(TestContext);
  // const { isLoading, token } = useVerifyUser();
  const user = UserProfile().getCurrentUser();
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const [password, setPassword] = useState(false);
  const [cpassword, setCPassword] = useState(false);
  const [prevPassword, setPrevPassword] = useState(false);

  const formSchema = z
    .object({
      password: z
        .string()
        .min(8)
        .refine((value) => passwordRegex.test(value), {
          message:
            "Password must contain at least one number, one special character, and be at least 8 characters long",
        }),
      prevPassword: z
        .string()
        .min(8)
        .refine((value) => passwordRegex.test(value), {
          message:
            "Password must contain at least one number, one special character, and be at least 8 characters long",
        }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password don't match",
      path: ["confirmPassword"],
    });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    reset();
    //eslint-disable-next-line
  }, [open]);

  const resetMutation = useMutation(
    (data) => {
      console.log(`🚀 ~ data:`, data);
      const res = axios.put(
        `${process.env.REACT_APP_API}/route/employee/reset`,
        {
          password: data.password,
          email: user?.email,
          prevPassword: data?.prevPassword,
        }
      );
      return res;
    },
    {
      onSuccess: async (response) => {
        console.log(`🚀 ~ response:`, response);
        handleAlert(true, "success", "Password changed successfully");
        handleClose();
      },
      onError: async (error) => {
        console.log(`🚀 ~ error:`, error);
        handleAlert(
          true,
          "error",
          error?.response?.data?.message ?? "Server Error please try again"
        );
      },
    }
  );

  const OnSubmit = (data) => {
    console.log(`🚀 ~ data:`, data);
    resetMutation.mutate(data);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    overflow: "auto",
    maxHeight: "80vh",
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
          sx={style}  >
          <div className="flex w-[500px] p-4 items-center flex-col gap-5 justify-center overflow-hidden bg-[white] ">
            <div className="w-full">
              <div className="flex items-center justify-between">
                <ModalHeading heading={"Reset Your Password"} info={"Reset password for your AEGIS account"} />
                <IconButton onClick={handleClose}>
                  <Close className=" !text-lg" />
                </IconButton>
              </div>

            </div>
            <form className="w-full" onSubmit={handleSubmit(OnSubmit)}>
              <AuthInputFiled
                name="prevPassword"
                visible={password}
                setVisible={setPassword}
                control={control}
                // icon={Work}
                type={"password"}
                placeholder="Ex: Test@123"
                label="Enter Previous Password *"
                readOnly={false}
                maxLimit={15}
                errors={errors}
                error={errors.prevPassword}
              />
              <AuthInputFiled
                name="password"
                visible={cpassword}
                setVisible={setCPassword}
                control={control}
                // icon={Work}
                type={"password"}
                placeholder="Ex: Test@123"
                label="Enter New Password *"
                readOnly={false}
                maxLimit={15}
                errors={errors}
                error={errors.password}
              />
              <AuthInputFiled
                name="confirmPassword"
                type={"password"}
                visible={prevPassword}
                setVisible={setPrevPassword}
                control={control}
                // icon={Work}
                placeholder="Ex: Test@123"
                label="Confirm New Password *"
                readOnly={false}
                maxLimit={15}
                errors={errors}
                error={errors.confirmPassword}
              />
              <div className="w-full"><BasicButton className="!w-[100%]" title={"Change Password"} type="submit" /></div>
            </form>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default ResetNewPassword;

import { zodResolver } from "@hookform/resolvers/zod";
import { CircularProgress, Divider } from "@mui/material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { TestContext } from "../../State/Function/Main";
import useVerifyUser from "../../hooks/QueryHook/Verification/hook";
import AuthInputFiled from "../InputFileds/AuthInputFiled";
import {
  Lock,
} from "@mui/icons-material";

const AnimationComponent = () => {
  // const svgContainerRef = useRef(null);
  const { handleAlert } = useContext(TestContext);
  const { isLoading, token } = useVerifyUser();
  const decodedToken = jwtDecode(token);
  console.log(`🚀 ~ decodedToken:`, decodedToken);
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleCPassword, setVisibleCPassword] = useState(false);
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const formSchema = z
    .object({
   
      password: z
        .string()
        .min(8)
        .refine((value) => passwordRegex.test(value), {
          message:
            "Your password must contain at least one number, one special character, one uppercase letter, and be at least 8 characters long",
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
    formState: { errors },
  } = useForm({
    defaultValues: {},
    resolver: zodResolver(formSchema),
  });

  const navigate = useNavigate();

  const resetMutation = useMutation(
    (data) => {
      console.log(`🚀 ~ data:`, data);
      const res = axios.put(
        `${process.env.REACT_APP_API}/route/employee/reset`,
        { password: data.password, email: decodedToken?.email }
      );
      return res;
    },
    {
      onSuccess: async (response) => {
        console.log(`🚀 ~ response:`, response);
        handleAlert(true, "success", "Password changed successfully");
        navigate("/sign-in");
      },
      onError: async (error) => {
        console.log(`🚀 ~ error:`, error);
        handleAlert(true, "error", "Something went wrong please try again");
      },
    }
  );

  const OnSubmit = (data) => {
    resetMutation.mutate(data);
  };

  return (
    <>
      {isLoading ? (
        <div className="h-[80vh] flex items-center justify-center">
          <CircularProgress />
        </div>
      ) : (
        <div className=" flex flex-col h-[70vh] justify-center  items-center gap-6">
          {/* <div className="flex items-center justify-center overflow-hidden bg-[white] p-10">
        <div
          ref={svgContainerRef}
          className="max-w-full max-h-full text-center bg-[white] h-[400px]"
        ></div>
      </div>
      <Typography variant="body1" color="initial">
        Authorized successfully You can{" "}
      </Typography>
      <Link to={"/sign-in"}>
        <Button variant="contained">Login Now</Button>
      </Link> */}
          <div className="flex w-[400px] items-center flex-col gap-5 justify-center overflow-hidden bg-[white] ">
            <div className="w-full">
              <h1 className="text-3xl text-gray-700   font-semibold  tracking-tight">
                Reset Your Password
              </h1>
              <p className="text-gray-500 tracking-tight ">
                Reset password for your AEGIS account{" "}
              </p>
            </div>
            <form className="w-full" onSubmit={handleSubmit(OnSubmit)}>
              {/* <AuthInputFiled
            name="prevPassword"
            control={control}
            // icon={Work}
            placeholder="Ex: Test@123"
            label="Enter Old Password *"
            readOnly={false}
            maxLimit={15}
            errors={errors}
            error={errors.prevPassword}
          /> */}
              <AuthInputFiled
                name="password"
                visible={visiblePassword}
                setVisible={setVisiblePassword}
                control={control}
                icon={Lock}
                type={"password"}
                placeholder="Ex: Test@123"
                label="Enter New Password *"
                readOnly={false}
                maxLimit={15}
                errors={errors}
                error={errors.prevPassword}
              />
              <AuthInputFiled
                name="confirmPassword"
                visible={visibleCPassword}
                setVisible={setVisibleCPassword}
                type={"password"}
                control={control}
                icon={Lock}
                placeholder="Ex: Test@123"
                label="Confirm New Password *"
                readOnly={false}
                maxLimit={15}
                errors={errors}
                error={errors.prevPassword}
              />

              <button
                type="submit"
                className="py-2 rounded-md border text-sm font-bold w-full bg-blue-500 text-white"
              >
                Change Password
              </button>

              <div className="w-full !my-4 ">
                <Divider orientation="horizontal" />
              </div>

              <button
                onClick={() => navigate("/sign-in")}
                className="py-2 rounded-md border text-sm font-bold w-full bg-gray-100 text-gray-700"
              >
                Go To Login Page
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AnimationComponent;

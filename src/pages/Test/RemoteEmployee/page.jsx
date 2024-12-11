import { CheckIcon } from "@heroicons/react/16/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Add, TodayOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import ReusableModal from "../../../components/Modal/component";
import MappedForm from "./components/MappedForm";
import MiniForm from "./components/MiniForm";
import RightSide from "./components/rightSide";

const RemoteEmployee = () => {
  const [openModal, setOpenModal] = useState(false);
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const formSchema = z.object({
    today: z.string(),
  });
  const { formState, control, watch, handleSubmit, reset } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      today: moment().format("yyyy-MM-DD"),
    },
  });
  const { errors } = formState;

  const applyMutation = useMutation(
    async (body) => {
      console.info(`🚀 ~ file: page.jsx:34 ~ body:`, body);

      const result = await axios.post(
        `${process.env.REACT_APP_API}/route/punch/miss-punch`,
        body,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      return result.data;
    },
    {
      onSuccess: (data) => {
        console.info(`🚀 ~ file: page.jsx:40 ~ data:`, data);
        setArray([]);
        handleAlert(
          true,
          "success",
          "Missed Punch Request Is Raised Successfully."
        );
        reset();
      },
      onError: (data) => {
        console.info(`🚀 ~ file: page.jsx:40 ~ data:`, data);
        handleAlert(true, "error", data.response.data.message);
      },
    }
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setcenter({
        lat: position?.coords?.latitude,
        lng: position?.coords?.longitude,
      });
    });
  }, []);
  const onSubmit = (optData) => {
    const body = {
      today: moment(optData?.today),
      arrayOfLocations: array,
    };
    applyMutation.mutate(body);
  };
  const [center, setcenter] = useState({ lat: 19.076, lng: 72.8777 });
  const [array, setArray] = useState([]);
  const [index1, setIndex] = useState(0);
  const { isLoaded } = useJsApiLoader({
    id: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  let tag = watch("today");
  useEffect(() => {
    setArray([]);
  }, [tag]);

  return (
    <div className="w-screen flex relative justify-center">
      <div className="z-50 p-6 flex flex-col mt-7 h-auto relative w-[400px] sm:text-base text-sm bg-white gap-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full h-full bg-white"
        >
          <AuthInputFiled
            name="today"
            icon={TodayOutlined}
            control={control}
            type="date"
            placeholder="Foundation Date"
            label="Select Date For Application *"
            errors={errors}
            error={errors.today}
          />
          <Button
            type="button"
            variant="contained"
            onClick={() => setOpenModal(true)}
            fullWidth
          >
            <Add />
          </Button>
          <div>
            <p className=" z-[99999999]  mt-4 font-semibold  mb-3">
              Total Approximate Distance : Kilometers
            </p>
          </div>

          {array.map((item, index) => (
            <MappedForm
              {...{
                item,
                index,
                setArray,
                setOpenModal,
                setIndex,
                today: watch("today"),
              }}
            />
          ))}
          <Button
            type="submit"
            disabled={array.length > 0 ? false : true}
            variant="contained"
            fullWidth
          >
            <span className="mr-3">
              <CheckIcon />
            </span>{" "}
            Apply for miss punch
          </Button>

          <div className="absolute bottom-0 w-full flex flex-col items-end gap-10"></div>
        </form>
      </div>

      <ReusableModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        heading={"Apply For Miss Punch"}
      >
        <MiniForm
          {...{
            setArray,
            setOpenModal,
            array,
            center,
            setcenter,
            today: watch("today"),
            index: index1,
          }}
        />
      </ReusableModal>

      {isLoaded && <RightSide {...{ center }} />}
    </div>
  );
};

export default RemoteEmployee;

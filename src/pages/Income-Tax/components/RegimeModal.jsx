import { CheckCircle, Person } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import ReusableModal from "../../../components/Modal/component";
import UserProfile from "../../../hooks/UserData/useUser";
import useChangeRegime from "../hooks/mutations/useChangeRegime";
import useGetTdsbyEmployee from "../hooks/queries/useGetTdsbyEmployee";
import useFunctions from "../hooks/useFunctions";

const RegimeModal = () => {
  const { openRegimeModal, setOpenRegimeModal, selected, setSelected } =
    useFunctions();

  const year = new Date().getFullYear();
  const nextYear = new Date().getFullYear() + 1;
  const annualYear = `${year}-${nextYear}`;
  const user = UserProfile().getCurrentUser();
  const { tdsForEmployee, isFetching } = useGetTdsbyEmployee(
    user._id,
    annualYear
  );

  useEffect(() => {
    const isChecked = ["New Regime", "Old Regime"];
    const index = isChecked.findIndex(
      (item) => item === tdsForEmployee?.regime
    );
    setSelected(index);
    // eslint-disable-next-line
  }, [openRegimeModal]);
  const { changeRegimeMutation } = useChangeRegime();
  const { handleSubmit, setValue } = useForm();
  const handleClose = () => {
    setOpenRegimeModal(false);
  };

  const handleRadioChange = (index, item) => {
    setSelected(index);
    setValue("regime", item);
  };

  const onSubmit = (data) => {
    changeRegimeMutation.mutate(data);
    handleClose();
  };

  return (
    <>
      <ReusableModal
        heading={"Change Regime Settings"}
        open={openRegimeModal}
        onClose={handleClose}
      >
        {isFetching ? (
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex-col gap-4  flex items-center"
          >
            {["New Regime", "Old Regime"].map((item, index) => (
              <label
                key={index}
                className={`inline-flex items-center space-x-2 cursor-pointer w-full border-[.5px] border-gray-300 p-4 py-3  rounded-lg ${
                  selected === index && "bg-blue-400 "
                }`}
              >
                <input
                  type="radio"
                  className="hidden"
                  checked={
                    selected === index || tdsForEmployee?.regime === item
                  }
                  onChange={() => handleRadioChange(index, item)}
                />
                <span
                  className={`text-gray-700 space-x-2 ${
                    selected === index && "text-white"
                  }`}
                >
                  {selected === index ? <CheckCircle /> : <Person />} {item}
                </span>
              </label>
            ))}
            <div className="w-full">
              <button
                type="submit"
                //   onClick={handleSubmit}
                className="bg-blue-500 my-4 text-white p-2 rounded-md"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </ReusableModal>
    </>
  );
};

export default RegimeModal;

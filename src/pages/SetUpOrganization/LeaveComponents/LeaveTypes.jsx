import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Settings } from "@mui/icons-material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import BasicButton from "../../../components/BasicButton";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import CreteLeaveTypeModal from "../../../components/Modal/LeaveTypeModal/create-leve-type-modal";
import ReusableModal from "../../../components/Modal/component";
import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";
import Setup from "../Setup";
import LeaveTypeEditBox from "./components/leave-type-layoutbox";
import SkeletonForLeaveTypes from "./components/skeleton-for-leavetype";

const LeaveTypes = ({ open, handleClose, id }) => {
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];
  const [confirmOpen, setConfirmOpen] = useState(false);
  const queryClient = useQueryClient();
  const params = useParams();
  const [openSettingsModal, setOpenSettingsModal] = useState(false);

  const { data: org } = useSubscriptionGet({
    organisationId: params.organisationId,
  });
  const { data, isLoading } = useQuery(
    "leaveTypes",
    async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/leave-types-details/get`,
        { organisationId: params.organisationId },
        config
      );
      return response.data.data;
    },
    {
      onSuccess: (newData) => {
        // Update the query cache with the new data
        queryClient.setQueryData("leaveTypes", newData);
      },
    }
  );

  const SettingsSchema = z.object({
    isCompOff: z.boolean(),
    isBiometric: z.boolean(),
    isHalfDay: z.boolean(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      isCompOff: org?.organisation?.isCompOff ?? false,
      isBiometric: org?.organisation?.isBiometric ?? false,
      isHalfDay: org?.organisation?.isHalfDay ?? false,
    },
  });

  const handleCreateLeave = () => {
    setConfirmOpen(true);
  };

  const handleCompOff = async (data) => {
    try {
      console.log("orgone", org?.organisation?.isCompOff);
      await axios.patch(
        `${process.env.REACT_APP_API}/route/organization/changeCompOff/${params.organisationId}`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      await queryClient.invalidateQueries("subscription");
      setOpenSettingsModal(false);
      handleAlert(true, "success", "Leave settings changed successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <BoxComponent sx={{ p: 0 }}>
      <Setup>
        <div className="h-[90vh] overflow-y-auto scroll px-3">
          <div className="xs:block sm:block md:flex justify-between items-center ">
            <HeadingOneLineInfo
              className="!my-3"
              heading="Leaves"
              info="Create multiple types of leaves which will applicable to all
              employees."
            />
            <div className="flex gap-4">
              <button
                className="text-[#1414fe] hover:underline-[#1414fe] bg-transparent border-none outline-none "
                onClick={() => setOpenSettingsModal(true)}
              >
                <Settings /> Settings
              </button>
              <BasicButton title="Add Leave" onClick={handleCreateLeave} />
            </div>
          </div>

          {data && data.length > 0 ? (
            <div className=" xs:mt-3 sm:mt-3 md:mt-0">
              <table className="min-w-full bg-white  text-left !text-sm font-light">
                <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                  <tr className="!font-semibold">
                    <th
                      scope="col"
                      className="whitespace-nowrap !text-left pl-8 py-3"
                    >
                      Sr. No
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap !text-left pl-8 py-3"
                    >
                      Leave Name
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap !text-left pl-8 py-3"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap !text-left pl-8 py-3"
                    >
                      Color
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap !text-left pl-8 py-3"
                    >
                      Count
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap !text-left pl-8 py-3"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <SkeletonForLeaveTypes />
                  ) : (
                    <>
                      {data &&
                        data.map((leaveType, index) => (
                          <LeaveTypeEditBox
                            key={index}
                            leaveType={leaveType}
                            index={index}
                          />
                        ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
              <article className="flex items-center mb-1 text-red-500 gap-2">
                <Info className="!text-2xl" />
                <h1 className="text-lg font-semibold">Add Leave </h1>
              </article>
              <p>No leave found. Please add types of leave</p>
            </section>
          )}
        </div>
      </Setup>
      <CreteLeaveTypeModal
        open={confirmOpen}
        handleClose={() => {
          setConfirmOpen(false);
        }}
      />
      <ReusableModal
        heading="Settings"
        open={openSettingsModal}
        onClose={() => setOpenSettingsModal(false)}
      >
        <form onSubmit={handleSubmit(handleCompOff)}>
          <AuthInputFiled
            name="isCompOff"
            control={control}
            type="checkbox"
            label="Comp Off"
            errors={errors}
          />
          <AuthInputFiled
            name="isBiometric"
            control={control}
            type="checkbox"
            label="Biometric Machine"
            errors={errors}
          />
          <AuthInputFiled
            name="isHalfDay"
            control={control}
            type="checkbox"
            label="Half Day Leaves"
            errors={errors}
          />
          <div className="flex justify-end gap-2">
            <BasicButton
              title="Cancel"
              color="error"
              variant="outlined"
              onClick={() => setOpenSettingsModal(false)}
              type="button"
            />
            <BasicButton title="Submit" type="submit" />
          </div>
        </form>
      </ReusableModal>
      {/* <ReusableModal
        heading={`${
          !org?.organisation?.isCompOff ? "Enable " : "Disable "
        } comp off leave`}
        open={openModal}
        onClose={onClose}
      >
        <div className="flex justify-end w-full gap-4">
          <BasicButton
            title="Cancel"
            onClick={onClose}
            variant="outlined"
            color={"danger"}
          />
          <BasicButton title="Submit" onClick={handleCompOff} />
        </div>
      </ReusableModal> */}
    </BoxComponent>
  );
};

export default LeaveTypes;

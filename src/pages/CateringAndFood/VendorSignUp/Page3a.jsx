import { zodResolver } from "@hookform/resolvers/zod";
import { ContactMail } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { React, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useEmpQuery from "../../../hooks/Employee-OnBoarding/useEmpQuery";
// import useEmpState from "../../../hooks/Employee-OnBoarding/useEmpState";
import useVendorState from "../../../hooks/Vendor-Onboarding/useVendorState";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
// import UploadDocumentModal from "../../DocumentManagement/components/UploadDocumentModal";
import Uploaddocument from "./Uploaddocument";

// import useOrgGeo from "../../Geo-Fence/useOrgGeo";

import useGetCurrentLocation from "../../../hooks/Location/useGetCurrentLocation";
import ReusableModal from "../../../components/Modal/component";
import Addlocation from "./Addlocation";
//  import useOrgGeo from "../../Geo-Fence/useOrgGeo";

// import { useState } from "react";

const Page3a = ({ isLastStep, nextStep, prevStep, isFirstStep }) => {
  // define state, hook and other if needed
  const organisationId = useParams("");
  const { AdditionalListCall } = useEmpQuery(organisationId);
  const { addtionalFields, addtionalLoading } = AdditionalListCall();
  const { setStep3Data, data, document } = useVendorState();
  const VendorSchema = z.object({}).catchall(z.any().optional());
  // State for validation
  const [isDocumentUploaded, setIsDocumentUploaded] = useState(false);
  const [isLocationAdded, setIsLocationAdded] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");


  console.log("document789", document);

  // define the useForm
  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      ...data,
    },
    resolver: zodResolver(VendorSchema),
  });

  const { createModalOpen, setCreateModalOpen } = useVendorState();

  // for upload the document
  //  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleCreateModalOpen = () => {
    setCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setCreateModalOpen(false);
  };

  const [open, setOpen] = useState(false);
  // const { data1 } = useOrgGeo();
  const { data: locationData } = useGetCurrentLocation();

  // to define the onSubmit function
  const onSubmit = (testData) => {
    if (!isDocumentUploaded || !isLocationAdded) {
      setWarningMessage("Please upload a document and add a location before proceeding.");
      return;
    }
    console.log("Test 3", testData);
    setStep3Data(testData);
    nextStep();
  };

  const { errors } = formState;
  if (addtionalLoading) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <CircularProgress />
      </div>
    );
  }
  return (
    <div className="w-full mt-4">
      <h1 className="text-2xl mb-4 font-bold">Additional Info</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex  flex-1 flex-col"
      >
        {/* <div className="grid grid-cols-2 w-full gap-3"> */}
        <div className="grid grid-cols-1  md:grid-cols-3 w-full gap-4">
          {addtionalFields?.inputField?.inputDetail?.map((input, id) => (
            <>
              {input.isActive && (
                <AuthInputFiled
                  name={input.label}
                  placeholder={input.label}
                  label={input.placeholder}
                  icon={ContactMail}
                  control={control}
                  type={input.inputType}
                  errors={errors}
                  error={errors.label}
                  className="text-sm"
                />
              )}
            </>
          ))}
        </div>


        <div className="flex flex-col items-center w-full space-y-4">
          <div className="w-full flex justify-center">
            <Button
              className="!font-semibold !bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center gap-2 transition duration-200 ease-in-out py-2 px-6 rounded-lg shadow-md w-64" // Set a fixed width
              variant="contained"
              onClick={() => {
                handleCreateModalOpen();
                setIsDocumentUploaded(true); // Simulate document upload
              }}
            >
              <Add />
              Upload Document *
            </Button>
          </div>

          <div className="w-full flex justify-center">
            <Button
              className="!font-semibold !bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center gap-2 transition duration-200 ease-in-out py-2 px-6 rounded-lg shadow-md w-64" // Set the same fixed width
              variant="contained"
              size="medium"
              onClick={() => {
                setOpen(true);
                setIsLocationAdded(true); // Simulate location addition

              }}
            >
              <Add />
              Add Location *
            </Button>
          </div>
        </div>

        {warningMessage && (
          <p className="text-red-500 text-center mt-4">{warningMessage}</p>
        )}



        <ReusableModal
          open={open}
          heading={"Add Vendor Location"}
          subHeading={"You can add vendor location using Map "}
          onClose={() => setOpen(false)}
        >
          <Addlocation onClose={() => setOpen(false)} data={locationData} />
        </ReusableModal>

        {/* for create */}
        <Uploaddocument
          handleClose={handleCreateModalClose}
          open={createModalOpen}
        />

        <div className="flex items-end w-full justify-between">
          <button
            type="button"
            onClick={() => {
              prevStep();
            }}
            className="!w-max flex group justify-center px-6  gap-2 items-center rounded-md py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
          >
            Prev
          </button>
          <button
            type="submit"
            disabled={isLastStep||!isDocumentUploaded || !isLocationAdded}
            className={`!w-max flex group justify-center px-6 gap-2 items-center rounded-md py-1 text-md font-semibold text-white ${
              isDocumentUploaded && isLocationAdded
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page3a;

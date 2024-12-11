import { zodResolver } from "@hookform/resolvers/zod";
import { Person } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  LinearProgress,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { FaCheckCircle } from "react-icons/fa";
import { LuUpload } from "react-icons/lu";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import * as z from "zod";
import BasicButton from "../../../components/BasicButton";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useAuthToken from "../../../hooks/Token/useAuth";

const schema = z.object({
  start: z.object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  }),
  end: z.object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  }),
  hours: z
    .string()
    .nonempty("Hours are required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Hours must be a number",
    })
    .refine((val) => Number(val) >= 1 && Number(val) <= 24, {
      message: "Hours must be between 1 and 24",
    }),
});

const MachinePunch = ({ open, handleClose }) => {
  const fileInputRef = useRef(null);
  const [file, setFile] = React.useState(null);
  const { organisationId } = useParams();
  const [uploadedFileName, setUploadedFileName] = React.useState(null);
  const authToken = useAuthToken();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      // Handle no file selected
      return;
    }

    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(fileExtension)) {
      // Handle invalid file type
      return;
    }

    setUploadedFileName(selectedFile.name);
    setFile(selectedFile);
  };

  console.error("err", errors);
  const onSubmit = async (data) => {
    if (!file) {
      // Handle case where no file is uploaded
      return;
    }

    const { start, end, hours } = data;
    const startDate = new Date(start.startDate);
    const endDate = new Date(end.startDate);

    setLoading(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const fileData = new Uint8Array(e.target.result);
      const workbook = XLSX.read(fileData, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      let jsonData = XLSX.utils.sheet_to_json(worksheet);
      jsonData = jsonData.slice(1);
      console.log("Excel Data:", jsonData);

      const chunkSize = 300;
      const chunks = [];

      for (let i = 0; i < jsonData.length; i += chunkSize) {
        const chunk = jsonData.slice(i, i + chunkSize);

        const transformedChunk = chunk
          .filter((item) => {
            const itemDate = new Date(item["__EMPTY_2"]);
            return itemDate >= startDate && itemDate <= endDate;
          })
          .map((item) => ({
            "Employee ID": item["Transaction"],
            "First Name": item["__EMPTY"],
            Department: item["__EMPTY_1"],
            Date: item["__EMPTY_2"],
            "Punch Time": item["__EMPTY_3"],
            "Punch State": item["__EMPTY_4"],
          }));

        chunks.push(transformedChunk);
      }

      console.log(`🚀 ~ chunks:`, chunks);

      try {
        for (let index = 0; index < chunks.length; index++) {
          const chunk = chunks[index];

          const apiEndpoint = `${process.env.REACT_APP_API}/route/organization/${organisationId}/add-punching-data`;
          const headers = {
            "Content-Type": "application/json",
            Authorization: authToken,
          };

          await axios.post(
            apiEndpoint,
            { start, end, hours, chunk },
            { headers }
          );
        }
        setSuccess(true);
      } catch (error) {
        console.error(`Error sending chunk to the backend:`, error);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDialogClose = () => {
    setFile(null);
    setUploadedFileName(null);
    setLoading(false);
    setSuccess(false);
    handleClose();
  };

  const handleFinalClose = () => {
    handleClose();
    setTimeout(() => {
      setFile(null);
      setUploadedFileName(null);
      setLoading(false);
      setSuccess(false);
    }, 300); // Delay to ensure modal closes first
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={!loading ? handleDialogClose : null} // Prevent closing when loading
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          {loading ? (
            <div className="flex flex-col w-full py-4 justify-center gap-2 items-center">
              <h1 className="text-gray-600 font-bold text-xl tracking-tighter ">
                Adding data, please wait until the process is done. Do not
                reload the page.
              </h1>
              <div className="w-full">
                <LinearProgress />
              </div>
            </div>
          ) : success ? (
            <div className="space-y-3 flex items-center flex-col justify-center">
              <FaCheckCircle className=" text-green-600 !text-5xl" />
              <h1 className=" tracking-tighter font-bold text-xl">
                Employee data loaded successfully!
              </h1>
              <BasicButton onClick={handleFinalClose} title="Close" />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <h1 className="text-[1.5rem] text-gray-700 font-semibold tracking-tight">
                Machine Punching
              </h1>
              <p className="text-gray-500 leading-tight tracking-tight">
                You can onboard employees efficiently by downloading the
                template, filling in the employee data, and uploading the
                completed Excel sheet below.
              </p>
              <br />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".xlsx, .xls, .csv"
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  marginBottom: "20px",
                  width: "100%",
                  boxSizing: "border-box",
                  display: "none", // Hide the file input
                }}
              />
              <div className={`space-y-1`}>
                <label className={`font-semibold text-gray-500 text-md`}>
                  Upload Excel file to generate employee
                </label>
                <div
                  onClick={() => fileInputRef.current.click()}
                  className={`outline-none cursor-pointer border-gray-200 border-[.5px]
                  flex rounded-md items-center justify-center px-2 gap-4 bg-white py-2`}
                >
                  <LuUpload className="text-xl text-gray-600" />
                  <h1 className="text-lg text-gray-600">
                    Click to upload the file
                  </h1>
                </div>
              </div>
              {uploadedFileName && (
                <>
                  <Typography className="text-center text-sm text-gray-600">
                    Uploaded File: {uploadedFileName}
                  </Typography>
                  <div className="grid grid-cols-2 gap-4 my-2">
                    <AuthInputFiled
                      name="start"
                      asSingle={true}
                      icon={Person}
                      control={control}
                      type="calender"
                      placeholder="start date"
                      label="Enter Start Date*"
                      errors={errors}
                      error={errors.start}
                    />
                    <AuthInputFiled
                      name="end"
                      icon={Person}
                      asSingle={true}
                      control={control}
                      type="calender"
                      placeholder="End date"
                      label="Enter End Date*"
                      errors={errors}
                      error={errors.end}
                    />
                  </div>

                  <AuthInputFiled
                    name="hours"
                    control={control}
                    type="text"
                    placeholder="hours"
                    label="Select hours Range*"
                    errors={errors}
                    error={errors.hours}
                  />
                </>
              )}
              <DialogActions>
                <BasicButton
                  onClick={handleDialogClose}
                  variant="outlined"
                  title="Cancel"
                />
                <BasicButton type="submit" title={"Submit"} color={"primary"} />
              </DialogActions>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MachinePunch;

import { Close } from "@mui/icons-material";
import { Box, IconButton, Modal } from "@mui/material";
import axios from "axios";
// import fs from "fs";
import {
  default as React,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Select from "react-select";
import * as XLSX from "xlsx";
import { TestContext } from "../../../State/Function/Main";
import useAuthToken from "../../../hooks/Token/useAuth";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
};

const ChallanModal = ({ handleClose, open, id }) => {
  const { handleAlert } = useContext(TestContext);
  const [challanData, SetChallanData] = useState({
    challan: "",
    year: "",
    month: "",
    fileType: "",
  });

  const isAllChecked = useMemo(() => {
    return (
      (challanData.challan === "PF" && !challanData.fileType) ||
      !challanData.challan ||
      !challanData.month ||
      !challanData.year
    );
  }, [
    challanData.challan,
    challanData.month,
    challanData.year,
    challanData.fileType,
  ]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    SetChallanData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const currentYear = new Date().getFullYear();
  const authToken = useAuthToken();
  const years = Array.from({ length: 5 }, (_, index) => currentYear - index);
  const monthOptions = [
    {
      value: 1,
      label: "January",
    },
    {
      value: 2,
      label: "February",
    },
    {
      value: 3,
      label: "March",
    },
    {
      value: 4,
      label: "April",
    },
    {
      value: 5,
      label: "May",
    },
    {
      value: 6,
      label: "June",
    },
    {
      value: 7,
      label: "July",
    },
    {
      value: 8,
      label: "August",
    },
    {
      value: 9,
      label: "September",
    },
    {
      value: 10,
      label: "October",
    },
    {
      value: 11,
      label: "November",
    },
    {
      value: 12,
      label: "December",
    },
  ];

  const yearOptions = years.map((year) => {
    return {
      value: year.toString(),
      label: year,
    };
  });

  useEffect(() => {
    if (!!open) {
      SetChallanData({
        challan: "",
        year: "",
        month: "",
        fileType: "",
      });
    }
  }, [open]);

  const generateFunction = () => {
    if (challanData.challan === "PF") {
      getPFChallan();
    }

    if (challanData.challan === "ESIC") {
      getESICChallan();
    }
  };

  const getESICChallan = async () => {
    try {
      const getResponse = await axios.get(
        `${process.env.REACT_APP_API}/route/employeeSalary/getESICChallan/${id}/${challanData?.year}/${challanData?.month}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      const headers = [
        "IP Number",
        "IP Name",
        "No of days work",
        "Total month wages",
        "IP Employee Contribution",
        "IP Employer Contribution",
        "Total Contribution",
        "Reason code",
        "Last Working Day",
      ];

      const employeeInfo = getResponse?.data?.map((item) => [
        item?.esicno,
        item?.name,
        item?.workingDays,
        item?.grossSalary,
        item?.epmCtr,
        item?.eplCtr,
        item?.epfEpsDIFFR,
        item?.reasonCode,
        item?.lastDay,
      ]);

      const ws = XLSX.utils.aoa_to_sheet([headers, ...employeeInfo]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, "EmployeeESIC.xlsx");
      handleAlert(true, "success", "ESIC Challan Generated Successfully");
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };
  const getPFChallan = async () => {
    try {
      const getResponse = await axios.get(
        `${process.env.REACT_APP_API}/route/employeeSalary/getPFChallan/${id}/${challanData?.year}/${challanData?.month}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      const headers = [
        "UAN NO",
        "MEMBER NAME",
        "GROSS WAGES",
        "EPF WAGES",
        "EPS WAGES",
        "EDLI WAGES",
        "EPF CONTRI REMITTED",
        "EPS CONTRI REMITTED",
        "EPF EPS DIFF REMITTED",
        "NCP DAYS",
        "REFUND OF ADVANCES",
      ];

      const employeeInfo = getResponse?.data?.map((item) => [
        item?.uanno,
        item?.name,
        item?.grossSalary,
        item?.epfWAGES,
        item?.epsWages,
        item?.edliWAGES,
        item?.epfCr,
        item?.epsCr,
        item?.epfEpsDIFFR,
        item?.ncpDays,
        item?.refundOnAdvanced,
      ]);

      if (challanData?.fileType === "csv" || challanData?.fileType === "both") {
        const ws = XLSX.utils.aoa_to_sheet([headers, ...employeeInfo]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "EmployeeInfo.xlsx");
      }

      //Text File format
      if (challanData?.fileType === "txt" || challanData?.fileType === "both") {
        console.log("hii there");
        const pfChallanText = getResponse?.data
          ?.map((item) =>
            [
              item?.uanno ?? "",
              item?.name ?? "",
              item?.grossSalary ?? "",
              item?.epfWAGES ?? "",
              item?.epsWages ?? "",
              item?.edliWAGES ?? "",
              Math.round(item?.epfCr) ?? "",
              Math.round(item?.epsCr) ?? "",
              Math.round(item?.epfEpsDIFFR) ?? "",
              item?.ncpDays ?? "",
              item?.refundOnAdvanced ?? "",
            ].join("#~#")
          )
          .join("\n");
        console.log(`🚀 ~ pfChallanText:`, pfChallanText);

        const element = document.createElement("a");
        const file = new Blob([pfChallanText], {
          type: "text/plain",
        });
        element.href = URL.createObjectURL(file);
        element.download = "PfChallan.txt";
        document.body.appendChild(element);
        element.click();

        // Clean up
        document.body.removeChild(element);
        URL.revokeObjectURL(element.href);
      }

      handleAlert(true, "success", "PF Challan Generated Successfully");
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={style}
        className="border-none !z-10 !py-0 !px-0 !w-[90%] md:!w-[700px] shadow-md outline-none rounded-md"
      >
        <div className="flex w-full justify-between py-4 items-center border-b  px-4">
          <h1 className="text-xl pl-2 font-semibold font-sans">
            Generate a Challan
          </h1>
          <IconButton onClick={handleClose}>
            <Close className="!h-5" />
          </IconButton>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="px-4 my-3 space-y-4 py-2"
        >
          <div className={`space-y-1 w-full`}>
            <label
              htmlFor={"challan"}
              className={`font-semibold text-gray-500 text-md`}
            >
              Select Challan
            </label>
            <div
              className={`flex rounded-md px-2 border-gray-200 border-[.5px] bg-white items-center`}
            >
              {/* <Person className="text-gray-700 text-sm" /> */}
              <Select
                aria-errormessage=""
                placeholder={"challan"}
                name="challan"
                styles={{
                  control: (styles) => ({
                    ...styles,
                    borderWidth: "0px",
                    boxShadow: "none",
                  }),
                }}
                className={` bg-white w-full !outline-none px-2 !shadow-none !border-none !border-0`}
                components={{
                  IndicatorSeparator: () => null,
                }}
                options={[
                  {
                    label: "PF Challan",
                    value: "PF",
                  },
                  {
                    label: "ESIC Challan",
                    value: "ESIC",
                  },
                ]}
                onChange={(value) =>
                  SetChallanData((prev) => ({ ...prev, challan: value.value }))
                }
              />
            </div>
          </div>

          <div className=" grid grid-cols-2 gap-4 mb-2 w-full">
            <div className={`space-y-1 w-full`}>
              <label
                htmlFor={"year"}
                className={`font-semibold text-gray-500 text-md`}
              >
                Select Year
              </label>
              <div className="flex rounded-md px-2 border-gray-200 border-[.5px] bg-white items-center">
                <Select
                  placeholder={"Select year"}
                  onChange={(value) =>
                    SetChallanData((prev) => ({ ...prev, year: value.value }))
                  }
                  options={yearOptions}
                  styles={{
                    control: (styles) => ({
                      ...styles,
                      borderWidth: "0px",
                      boxShadow: "none",
                    }),
                  }}
                  className={` bg-white w-full !outline-none px-2 !shadow-none !border-none !border-0`}
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                />
              </div>
            </div>
            <div className={`space-y-1 w-full`}>
              <label
                htmlFor={"month"}
                className={`font-semibold text-gray-500 text-md`}
              >
                Select Month
              </label>
              <div className="flex rounded-md px-2 border-gray-200 border-[.5px] bg-white items-center">
                <Select
                  placeholder={"Select Month"}
                  options={monthOptions}
                  styles={{
                    control: (styles) => ({
                      ...styles,
                      borderWidth: "0px",
                      boxShadow: "none",
                    }),
                  }}
                  onChange={(value) =>
                    SetChallanData((prev) => ({ ...prev, month: value.value }))
                  }
                  className={` bg-white w-full !outline-none px-2 !shadow-none !border-none !border-0`}
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Radio for selection of format */}
          {challanData.challan === "PF" && (
            <div className={`space-y-1 w-full`}>
              <fieldset>
                <label className={`font-semibold text-gray-500 text-md`}>
                  Select file type to generate
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="csv"
                    name="fileType"
                    onChange={handleOnChange}
                    value="csv"
                    className="text-blue-500"
                  />
                  <label htmlFor="csv" className="text-gray-700">
                    CSV
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="txt"
                    name="fileType"
                    onChange={handleOnChange}
                    value="txt"
                    className="text-blue-500"
                  />
                  <label htmlFor="txt" className="text-gray-700">
                    TXT
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="both"
                    name="fileType"
                    onChange={handleOnChange}
                    value="both"
                    className="text-blue-500"
                  />
                  <label htmlFor="both" className="text-gray-700">
                    Both
                  </label>
                </div>
              </fieldset>
            </div>
          )}

          {/* Buttons */}
          <div className="flex  w-full items-end pt-2 justify-end gap-3">
            <button
              onClick={handleClose}
              className="flex group justify-center w-max gap-2 items-center rounded-sm h-[30px] p-5 text-md font-bold text-[#67748E]"
            >
              Cancel
            </button>
            <button
              onClick={generateFunction}
              disabled={isAllChecked}
              className={`flex group justify-center w-max gap-2 items-center rounded-sm h-[30px] p-5 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500  focus-visible:outline-blue-500  ${
                isAllChecked && "!bg-gray-200 !text-gray-500"
              }`}
            >
              Generate Challan
            </button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default ChallanModal;

import { Button } from "@mui/material";
import axios from "axios";
import React, { useContext, useRef } from "react";
import { CSVLink } from "react-csv";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { UseContext } from "../../State/UseState/UseContext";
import useGetUser from "../../hooks/Token/useUser";

const EmpExcelOnboard = () => {
  const { authToken } = useGetUser();
  const fileInputRef = useRef(null);
  const { setAppAlert } = useContext(UseContext);

  const orgId = useParams().organisationId;
  console.log(orgId);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      worksheet["!cols"] = [
        { wch: 30 },
        { wch: 40 },
        { wch: 30 },
        { wch: 30 },
        { wch: 30 },
      ];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      const finalData = jsonData.map((data) => ({
        empId: data.empId,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        organizationId: orgId,
      }));

      console.log("Final Data", finalData);

      finalData.forEach(async (employee) => {
        try {
          await axios.post(
            `${process.env.REACT_APP_API}/route/employee/add555-employee`,
            employee,
            {
              headers: {
                Authorization: authToken,
              },
            }
          );
          console.log(`Employee ${employee.empId} posted successfully`);
          setAppAlert({
            alert: true,
            type: "success",
            msg: "Onboarding Process Completed",
          });
        } catch (error) {
          console.error(`Error posting employee ${employee.empId}:`, error);
          setAppAlert({
            alert: true,
            type: "error",
            msg: error.response.data.message,
          });
        }
      });
    };

    reader.readAsBinaryString(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const csvTemplateData = [
    { empId: "", first_name: "", last_name: "", email: "", password: "" },
  ];

  const csvHeaders = [
    { label: "empId", key: "empId" },
    { label: "first_name", key: "first_name" },
    { label: "last_name", key: "last_name" },
    { label: "email", key: "email" },
    { label: "password", key: "password" },
  ];

  return (
    <div className="w-full h-full">
      <div className="w-full h-[90vh] flex flex-col justify-center items-center mt-9">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".xlsx, .xls, .csv"
          style={{ display: "none" }}
        />
        <div className="flex flex-col gap-5 border-2 p-4">
          <Button onClick={handleButtonClick} variant="contained">
            Upload Excel File
          </Button>
          <div>
            <Button variant="contained" color="warning">
              <CSVLink
                data={csvTemplateData}
                headers={csvHeaders}
                filename="employee_onboard_template.csv"
                className="btn btn-secondary text-white"
                target="_blank"
              >
                Download CSV1 Template
              </CSVLink>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpExcelOnboard;

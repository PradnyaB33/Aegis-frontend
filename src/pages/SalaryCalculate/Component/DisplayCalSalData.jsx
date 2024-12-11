import { useParams } from "react-router-dom";
import { UseContext } from "../../../State/UseState/UseContext";
import useCalculateSalaryQuery from "../../../hooks/CalculateSalaryHook/useCalculateSalaryQuery";
import React, { useContext, } from "react";
const DisplayCalData = ({
  totalNetSalary,
  totalDeduction,
  totalGrossSalary,
  variableAllowance,
  travelAllowance,
  specialAllowance,
  loanDeduction,
  foodAllowance,
  esic,
  hraSalary,
  employee_pf,
  daSalary,
  deduction,
  basicSalary,
  numDaysInMonth,
  paidLeaveDays,
  noOfDaysEmployeePresent,
  unPaidLeaveDays,
  remotePunchingCount,
  salesAllowance,
}) => {
  const { cookies } = useContext(UseContext);
  const token = cookies["aegis"];
  const { userId, organisationId } = useParams();
  const {
    salaryInfo,
    availableEmployee,
    publicHolidaysCount,
    formattedDate,
    empLoanAplicationInfo,
    shiftTotalAllowance,
    remotePunchAllowance,
  } = useCalculateSalaryQuery({ userId, organisationId, remotePunchingCount });

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <img
          src={availableEmployee?.organizationId?.logo_url || ""}
          alt="Company Logo"
          className="w-20 h-20 rounded-full"
        />
        <div className="ml-4">
          <p className="text-lg font-semibold flex items-center">
            <span className="mr-1">Organisation Name :</span>
            <span style={{ whiteSpace: "pre-wrap" }}>
              {availableEmployee?.organizationId?.orgName || ""}
            </span>
          </p>
          <p className="text-lg flex items-center">
            <span className="mr-1">Location :</span>
            <span>
              {availableEmployee?.organizationId?.location?.address || ""}
            </span>
          </p>
          <p className="text-lg flex items-center">
            <span className="mr-1">Contact No :</span>
            <span>
              {availableEmployee?.organizationId?.contact_number || ""}
            </span>
          </p>
          <p className="text-lg flex items-center">
            <span className="mr-1">Email :</span>
            <span>{availableEmployee?.organizationId?.email || ""}</span>
          </p>
        </div>
      </div>

      <hr className="mb-6" />

      {/* 1st table */}
      <div>
        <table className="w-full border border-collapse">
          <thead>
            <tr className="bg-blue-200">
              <th className="px-4 py-2 border">Salary Slip</th>
              <th className="border"></th>
              <th className="px-4 py-2 border">Month</th>
              <th className="px-4 py-2 border">{formattedDate}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border">Employee Name:</td>
              <td className="px-4 py-2 border">
                {`${availableEmployee?.first_name} ${availableEmployee?.last_name}`}
              </td>
              <td className="px-4 py-2 border">Date Of Joining:</td>
              <td className="px-4 py-2 border">
                {availableEmployee?.joining_date
                  ? new Date(
                    availableEmployee?.joining_date
                  ).toLocaleDateString("en-GB")
                  : ""}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 border">Designation:</td>
              <td className="px-4 py-2 border">
                {(availableEmployee?.designation &&
                  availableEmployee?.designation.length > 0 &&
                  availableEmployee?.designation[0]?.designationName) ||
                  ""}
              </td>
              <td className="px-4 py-2 border">Unpaid Leaves:</td>
              <td className="px-4 py-2 border">{unPaidLeaveDays}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border">Department Name:</td>
              <td className="px-4 py-2 border">
                {(availableEmployee?.deptname &&
                  availableEmployee?.deptname.length > 0 &&
                  availableEmployee?.deptname[0]?.departmentName) ||
                  ""}
              </td>
              <td className="px-4 py-2 border">No Of Working Days Attended:</td>
              <td className="px-4 py-2 border">{noOfDaysEmployeePresent}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border">PAN No:</td>
              <td className="px-4 py-2 border">
                {availableEmployee?.pan_card_number}
              </td>
              <td className="px-4 py-2 border">Paid Leaves:</td>
              <td className="px-4 py-2 border">{paidLeaveDays}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border">Employee Id:</td>
              <td className="px-4 py-2 border">{availableEmployee?.empId}</td>
              <td className="px-4 py-2 border">Public Holidays:</td>
              <td className="px-4 py-2 border">{publicHolidaysCount}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border">Bank Account No:</td>
              <td className="px-4 py-2 border">
                {availableEmployee?.bank_account_no || ""}
              </td>
              <td className="px-4 py-2 border">No Of Days in Month:</td>
              <td className="px-4 py-2 border">{numDaysInMonth}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 2nd table */}
      <div>
        <table className="w-full border border-collapse">
          <thead>
            <tr className="bg-blue-200">
              <th className="px-4 py-2 border">Income</th>
              <th className="border"></th>
              <th className="px-4 py-2 border">Deduction</th>
              <th className="px-4 py-2 border"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border">Particulars</td>
              <td className="py-2 border">Amount</td>
              <td className="py-2 border">Particulars</td>
              <td className="py-2 border">Amount</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border">Basic :</td>
              <td className="px-4 py-2 border">{basicSalary}</td>
              <td className="py-2 border">Professional Tax:</td>
              <td className="py-2 border">{deduction}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border">DA :</td>
              <td className="px-4 py-2 border">{daSalary}</td>
              <td className="py-2 border">Employee PF:</td>
              <td className="py-2 border">{employee_pf}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border">HRA:</td>
              <td className="px-4 py-2 border">{hraSalary}</td>
              <td className="py-2 border">ESIC :</td>
              <td className="py-2 border">{esic}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border">Food Allowance:</td>
              <td className="px-4 py-2 border">{foodAllowance}</td>
              <td className="py-2 border">Loan Deduction</td>
              <td className="py-2 border">{loanDeduction ?? 0}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border">Sales Allowance:</td>
              <td className="px-4 py-2 border">{salesAllowance}</td>
              <td className="px-4 py-2 border"></td>
              <td className="px-4 py-2 border"></td>
            </tr>
            <tr>
              <td className="px-4 py-2 border">Special Allowance:</td>
              <td className="px-4 py-2 border">{specialAllowance}</td>
              <td className="px-4 py-2 border"></td>
              <td className="px-4 py-2 border"></td>
            </tr>
            <tr>
              <td className="px-4 py-2 border">Travel Allowance:</td>
              <td className="px-4 py-2 border">{travelAllowance}</td>
              <td className="px-4 py-2 border"></td>
              <td className="px-4 py-2 border"></td>
            </tr>
            <tr>
              <td className="px-4 py-2 border">Variable Pay Allowance:</td>
              <td className="px-4 py-2 border">{variableAllowance}</td>
              <td className="px-4 py-2 border"></td>
              <td className="px-4 py-2 border"></td>
            </tr>
            {shiftTotalAllowance > 0 && (
              <tr>
                <td className="px-4 py-2 border">Shift Allowance:</td>
                <td className="px-4 py-2 border">{shiftTotalAllowance}</td>
                <td className="px-4 py-2 border"></td>
                <td className="px-4 py-2 border"></td>
              </tr>
            )}
            {remotePunchAllowance > 0 && (
              <tr>
                <td className="px-4 py-2 border">Remote Punching Allowance:</td>
                <td className="px-4 py-2 border">
                  {remotePunchAllowance ?? 0}
                </td>
                <td className="px-4 py-2 border"></td>
                <td className="px-4 py-2 border"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* total gross salary and deduction */}
      <div>
        <table className="w-full border border-collapse">
          <thead className="border">
            <tr className="bg-blue-200 border">
              <th className="px-4 py-2 border">Total Gross Salary :</th>
              <th className="pl-24 py-2 border">{totalGrossSalary}</th>
              <th className="px-4 py-2 border">Total Deduction :</th>
              <th className="px-4 py-2 border">{totalDeduction}</th>
            </tr>
          </thead>
          <tbody className="border"></tbody>
        </table>
      </div>

      {/* total net salary */}
      <div>
        <table className="w-full mt-10 border ">
          <thead>
            <tr className="bg-blue-200">
              <th className="px-4 py-2">Total Net Salary</th>
              <th></th>
              <th className="px-4 py-2">{totalNetSalary}</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  );
};

export default DisplayCalData;

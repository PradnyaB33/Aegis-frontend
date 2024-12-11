import {
  Article,
  Cancel,
  CheckCircle,
  Close,
  DeleteOutlined,
  EditOutlined,
  Error,
  Pending,
} from "@mui/icons-material";
import { Button, CircularProgress, IconButton } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { TestContext } from "../../../State/Function/Main";
import useIncomeTax from "../../../hooks/IncomeTax/useIncomeTax";

const DeclarationTable = ({
  tableData,
  handleAmountChange,
  handleSaveClick,
  handleClose,
  handleEditClick,
  handleDeleteConfirmation,
  handleProofChange,
  handlePDF,
  editStatus,
  declarationData,
  // isLoading,
  salaryFetching,
}) => {
  const { handleAlert } = useContext(TestContext);

  const { setEditStatus, isLoading, setProofEmpty } = useIncomeTax();

  useEffect(() => {
    setEditStatus({});
    //eslint-disable-next-line
  }, [window.location.pathname]);

  return (
    <div>
      {(salaryFetching || isLoading) && (
        <div className="flex bg-black/30  fixed z-50 top-0 bottom-0 right-0 left-0 items-center justify-center w-full">
          <CircularProgress />
        </div>
      )}
      <div className="bg-white w-full overflow-x-auto">
        <table className=" table-auto border border-collapse min-w-full bg-white  text-left  !text-sm font-light">
          <thead className="border-b bg-gray-100 font-bold">
            <tr className="!font-semibold ">
              <th
                scope="col"
                className="!text-left px-2 w-max py-3 leading-7 text-[16px] border"
              >
                Sr. No
              </th>
              <th
                scope="col"
                className="py-3 leading-7 text-[16px] px-2 border"
              >
                Declaration Name
              </th>

              <th
                scope="col"
                className="py-3 leading-7 text-[16px] px-2 border"
              >
                Declaration
              </th>
              <th
                scope="col"
                className="py-3 leading-7 text-[16px] px-2 border"
              >
                Approved Amount
              </th>
              <th
                scope="col"
                className=" py-3 leading-7 text-[16px] px-2 border"
              >
                Proofs
              </th>
              <th
                scope="col"
                className=" py-3 leading-7 text-[16px] px-2 border"
              >
                Status
              </th>
              <th
                scope="col"
                className=" py-3 leading-7 text-[16px] px-2 border"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData?.map((item, itemIndex) => (
              <tr
                className={`!font-medium w-[70px] h-14 border-b 
                
                `}
                key={itemIndex}
              >
                <td className="!text-left  px-2 leading-7 text-[16px] w-[70px] border ">
                  {item.name === "Income taxable under the head Salaries"
                    ? ""
                    : itemIndex + 1}
                </td>
                <td className="leading-7 text-[16px] truncate text-left w-[500px] border px-2">
                  <p
                    className={`
                  ${
                    item.name === "Income taxable under the head Salaries" &&
                    "!font-bold text-lg"
                  } 
                 `}
                  >
                    {item.name}
                  </p>
                </td>

                <td className=" text-left !p-0 w-[200px] border ">
                  {editStatus[itemIndex] && editStatus[itemIndex] ? (
                    <div className="flex gap-2 h-14">
                      <h1 className="leading-7 text-[16px] bg-gray-300 border h-auto px-4  flex items-center ">
                        INR
                      </h1>
                      <input
                        type="number"
                        defaultValue={item.amount}
                        className="border-none w-[90px] h-auto outline-none  "
                        onChange={(e) => handleAmountChange(e, itemIndex)}
                      />
                    </div>
                  ) : (
                    <p
                      className={`
                        ${
                          item.name ===
                            "Income taxable under the head Salaries" &&
                          "!font-bold text-lg w-full"
                        } 
                        px-2 md:w-full w-max leading-7 text-[16px]`}
                    >
                      INR {item.amount}
                    </p>
                  )}
                </td>
                {item.name !== "Gross Salary" ? (
                  <td className=" text-left !p-0 w-[200px] border ">
                    <p
                      className={`
                        ${
                          item.name ===
                            "Income taxable under the head Salaries" &&
                          "!font-bold text-lg "
                        } 
                        px-2 leading-7 text-[16px]`}
                    >
                      INR {item.amountAccepted ? item.amountAccepted : 0}
                    </p>
                  </td>
                ) : (
                  <td className=" text-left !p-0 w-[200px] ">
                    <p
                      className={`
                        ${
                          item.name ===
                            "Income taxable under the head Salaries" &&
                          "!font-bold text-lg "
                        } 
                        px-2 leading-7 text-[16px]  md:w-full w-max`}
                    >
                      Auto Accepted
                    </p>
                  </td>
                )}
                <td className="text-left leading-7 text-[16px] !w-[200px]  border">
                  {item.name === "Gross salary" ? (
                    ""
                  ) : editStatus[itemIndex] && editStatus[itemIndex] ? (
                    <>
                      {declarationData?.proof ? (
                        <div className="px-2 flex gap-2 items-center h-max w-max">
                          <div
                            onClick={() =>
                              handlePDF(
                                URL.createObjectURL(declarationData?.proof)
                              )
                            }
                            className="px-2 flex gap-2 items-center h-max w-max"
                          >
                            <Article className="text-blue-500 " />
                            <h1 className="truncate w-[125px]">
                              {declarationData?.proof?.name}
                            </h1>
                          </div>
                          <Close
                            onClick={() => setProofEmpty(itemIndex)}
                            className="!text-sm text-gray-700 cursor-pointer"
                          />
                        </div>
                      ) : (
                        <div className="px-2  md:w-full w-max">
                          <label className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 text-sm rounded cursor-pointer">
                            Upload File
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) =>
                                handleProofChange(e, itemIndex, handleAlert)
                              }
                            />
                          </label>
                        </div>
                      )}
                    </>
                  ) : item.proof ? (
                    typeof item.proof === "string" ? (
                      <div
                        onClick={() => handlePDF(item.proof)}
                        className="px-2 flex gap-2 items-center h-max w-max  cursor-pointer"
                      >
                        <Article className="text-blue-500" />
                        <h1>View Proof </h1>
                      </div>
                    ) : (
                      <div className="px-2 flex gap-2 items-center h-max w-max">
                        <div
                          onClick={() =>
                            handlePDF(
                              URL.createObjectURL(declarationData.proof)
                            )
                          }
                          className="px-2 flex gap-2 items-center h-max w-max"
                        >
                          <Article className="text-blue-500" />
                          <h1>{item.proof.name}</h1>
                        </div>
                      </div>
                    )
                  ) : (
                    <p className="px-2  md:w-full w-max">No proof found</p>
                  )}
                </td>

                <td className=" text-left  leading-7 text-[16px] w-[200px]  border px-2">
                  {item.name === "Income taxable under the head Salaries" ? (
                    ""
                  ) : item.status === "Pending" ? (
                    <div className="flex items-center  md:w-full w-max  gap-2">
                      <Pending className="text-yellow-400 " />
                      {item.status}
                    </div>
                  ) : item.status === "Auto" || item.status === "Approved" ? (
                    <div className="flex items-center  md:w-full w-max  gap-2">
                      <CheckCircle className="text-green-400 " />
                      {item.status}
                    </div>
                  ) : item.status === "Reject" ? (
                    <div className="flex items-center  md:w-full w-max  gap-2">
                      <Cancel className="text-red-400 " />
                      {item.status}
                    </div>
                  ) : (
                    <div className="flex items-center  md:w-full w-max gap-2">
                      <Error className="text-gray-400 " />
                      <p>{item.status}</p>
                    </div>
                  )}
                </td>
                <td className="whitespace-nowrap px-2  w-[220px]">
                  {item.name ===
                    "Less : Deduction on Family Pension Income Sec. 57(IIA)" ||
                  item.name === "Income taxable under the head Salaries" ||
                  item.status === "Auto" ||
                  item.status === "Approved" ? (
                    ""
                  ) : editStatus[itemIndex] && editStatus[itemIndex] ? (
                    <div className="space-x-2">
                      <Button
                        color="primary"
                        aria-label="save"
                        size="small"
                        onClick={() => handleSaveClick(itemIndex)}
                      >
                        Submit
                      </Button>
                      <Button
                        color="error"
                        aria-label="save"
                        size="small"
                        onClick={() => handleClose(itemIndex)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <IconButton
                        color="primary"
                        aria-label="edit"
                        onClick={() => handleEditClick(itemIndex)}
                      >
                        <EditOutlined />
                      </IconButton>
                      <IconButton
                        color="error"
                        aria-label="delete"
                        onClick={() => handleDeleteConfirmation(itemIndex)}
                      >
                        <DeleteOutlined />
                      </IconButton>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeclarationTable;

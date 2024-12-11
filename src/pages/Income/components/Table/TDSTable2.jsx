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
import axios from "axios";
import React, { useContext, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { TestContext } from "../../../../State/Function/Main";
import useIncomeAPI from "../../../../hooks/IncomeTax/useIncomeAPI";
import useTDS from "../../../../hooks/IncomeTax/useTDS";
import useAuthToken from "../../../../hooks/Token/useAuth";
import UserProfile from "../../../../hooks/UserData/useUser";
import ProofModel from "../ProofModel";

const TDSTable2 = () => {
  const authToken = useAuthToken();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const queryClient = useQueryClient();
  const { setDeclared } = useTDS();
  const [pdf, setPdf] = useState(null);
  const handlePDF = (id) => {
    setPdf(id);
  };

  const handleClosePDF = () => {
    setPdf(null);
  };
  const { handleAlert } = useContext(TestContext);

  const [tableData, setTableData] = useState([
    {
      "(A) Self Occupied Property (Loss)": [
        {
          name: "Interest on loan / borrowing taken for repairs, renewal, or reconstruction",
          property1: 0,
          property2: 0,
          declaration: 0,
          proof: "",
          maxAmount: 200000,
          status: "Not Submitted",
        },
        {
          name: "Before 1/4/99",
          property1: 0,
          property2: 0,
          declaration: 0,
          maxAmount: 30000,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "After 1/4/99 & completed after 5 years from the end of FY of borrowing",
          maxAmount: 30000,
          property1: 0,
          property2: 0,
          declaration: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "After 1/4/99 & completed within 5 years from the end of FY of borrowing",
          property1: 0,
          maxAmount: 200000,
          property2: 0,
          declaration: 0,
          proof: "",
          status: "Not Submitted",
        },
      ],
      maximumAllowable: 0,
    },
    {
      "(B) Let out property": [
        {
          name: "Rent of the property for the year",
          declaration: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "Less : Municipal taxes paid in the year",
          declaration: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "Less : Interest on housing loan",
          declaration: 0,
          proof: "",
          status: "Not Submitted",
        },
      ],

      secondData2: {
        netValue1: 0,
        standard1: 0,
        netHouseTotal1: 0,
      },
    },
    {
      "(C) Let out property": [
        {
          name: "Rent of the property for the year",
          declaration: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "Less : Municipal taxes paid in the year",
          declaration: 0,
          proof: "",
          status: "Not Submitted",
        },

        {
          name: "Less : Interest on housing loan",
          declaration: 0,
          proof: "",
          status: "Not Submitted",
        },
      ],
      secondData3: {
        netValue1: 0,
        standard1: 0,
        netHouseTotal1: 0,
      },
    },
  ]);

  const { usersalary } = useIncomeAPI(
    tableData,
    user,
    authToken,
    handleAlert,
    queryClient
  );
  console.log(`🚀 ~ usersalary:`, usersalary?.TotalInvestInvestment);

  const { isFetching } = useQuery({
    queryKey: ["incomeHouse"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/tds/getInvestment/House`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: (res) => {
      if (Array.isArray(res)) {
        // Extracting relevant data from the backend response
        const updatedTableData = tableData.map((section) => {
          const sectionName = Object.keys(section)[0];
          const matchingSection = res?.filter(
            (item) => item.subsectionname === sectionName
          );

          if (matchingSection) {
            section[sectionName].forEach((item) => {
              const matchingItem = matchingSection.find(
                (originalItem) => originalItem.name === item.name
              );

              if (matchingItem) {
                Object.assign(item, matchingItem);
              }
            });
          }

          return section;
        });

        const tableDataWithMaximumAllowable = updatedTableData?.map((data) => ({
          ...data,
          maximumAllowable: res?.firstSectionDeclarationSum,
          secondData2: {
            netValue1: res?.secondData2?.netValue,
            standard1: res?.secondData2?.deductedAmount,
            netHouseTotal1: res?.secondData2?.ActualDeductedValue,
          },
          secondData3: {
            netValue1: res?.secondData3?.netValue,
            standard1: res?.secondData3?.deductedAmount,
            netHouseTotal1: res?.secondData3?.ActualDeductedValue,
          },
        }));

        const declaredAmount = res.reduce((i, a) => {
          return (i += a.declaration);
        }, 0);

        const amountPending = res.reduce((i, a) => {
          if (a.status === "Pending") {
            return (i += a.declaration);
          }
          return i;
        }, 0);

        const amountReject = res.reduce((i, a) => {
          if (a.status === "Reject") {
            return (i += a.declaration);
          }
          return i;
        }, 0);

        const amountAccepted = res.reduce((i, a) => {
          return (i += a.amountAccepted);
        }, 0);

        let data = {
          declared: declaredAmount,
          pending: amountPending,
          accepted: amountAccepted,
          rejected: amountReject,
        };
        setDeclared(data);

        setTableData(tableDataWithMaximumAllowable);
        return tableData;
      }
    },
  });

  const [editStatus, setEditStatus] = useState({});
  const [declarationData, setDeclarationData] = useState({});

  const handleEditClick = (itemIndex, fieldIndex) => {
    const newData = [...tableData];
    setDeclarationData(
      newData[itemIndex][Object.keys(newData[itemIndex])[0]][fieldIndex]
    );
    setEditStatus({ ...editStatus, [itemIndex]: fieldIndex });
  };

  const handleAmountChange = (e, itemIndex, id) => {
    setDeclarationData((prev) => ({
      ...prev,
      declaration: e.target.value,
    }));
  };

  const handleProofChange = (e, itemIndex, id) => {
    // const newData = [...tableData];
    // newData[itemIndex][Object.keys(newData[itemIndex])[0]][id].proof =
    //   e.target.files[0];

    if (e.target.files[0]?.type !== "application/pdf") {
      handleAlert(true, "error", "Only PDF format allowed");
      return {};
    }
    if (e.target.files[0]?.size > 500 * 1024) {
      handleAlert(true, "error", "File size must be under 500kb");
      return {};
    }

    setDeclarationData((prev) => ({
      ...prev,
      proof: e.target.files[0],
    }));
    // setTableData(newData);
  };

  const handleProperty1 = (e, itemIndex, id) => {
    setDeclarationData((prev) => ({
      ...prev,
      property1: e.target.value,
    }));
    // setTableData(newData);
  };

  const handleProperty2 = (e, itemIndex, id) => {
    setDeclarationData((prev) => ({
      ...prev,
      property2: e.target.value,
    }));
    // setTableData(newData);
  };

  const handleDelete = async (index, id) => {
    const newData = [...tableData];
    const value = newData[index][Object.keys(newData[index])[0]][id];
    const requestData = {
      empId: user._id,
      financialYear: "2023-2024",
      usersalary: usersalary?.TotalInvestInvestment,
      requestData: {
        sectionname: "House",
        subsectionname: Object.keys(newData[index])[0],
        name: value.name,
        property1: value.property1,
        property2: value.property2,
        status: "Not Submitted",
        proof: "",
        declaration: 0,
        amountAccepted: 0,
      },
    };

    try {
      await axios.patch(
        `${process.env.REACT_APP_API}/route/tds/createInvestment`,
        requestData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      handleAlert(true, "success", `Declarations deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ["incomeHouse"] });
    } catch (error) {
      console.log(error);
    }
  };

  // const handleDownload = (pdf) => {
  //   // You can use any method to trigger the download, such as creating an invisible link and clicking it
  //   const link = document.createElement("a");
  //   link.href = pdf;
  //   link.download = "File1.pdf";
  //   link.click();
  // };
  const uploadProof = async (tdsfile) => {
    const data = await axios.get(
      `${process.env.REACT_APP_API}/route/s3createFile/TDS`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      }
    );

    await axios.put(data?.data?.url, tdsfile, {
      headers: {
        "Content-Type": tdsfile.type,
      },
    });

    return data?.data?.url?.split("?")[0];
  };

  const handleSaveClick = async (index, id) => {
    const newData = [...tableData];
    const value = declarationData;
    const tdsfile = value.proof;

    let uploadproof = "";

    if (tdsfile) {
      uploadproof = await uploadProof(tdsfile);
    }

    if (value.property1 <= 0 || value.property2 <= 0) {
      handleAlert(true, "error", "Amount cannot be zero");
      return {};
    }

    let requestData = {
      empId: user._id,
      financialYear: "2023-2024",
      usersalary: usersalary?.TotalInvestInvestment,
      requestData: {
        sectionname: "House",
        subsectionname: Object.keys(newData[index])[0],
        name: value.name,
        property1: value.property1,
        property2: value.property2,
        status: "Pending",
        declaration:
          Object.keys(newData[index])[0] !== "(A) Self Occupied Property (Loss)"
            ? value.declaration > value?.maxAmount
              ? value?.maxAmount
              : value.declaration
            : Number(value.property1) + Number(value.property2) >
              value?.maxAmount
            ? value?.maxAmount
            : Number(value.property1) + Number(value.property2),
        proof: "",
      },
    };

    if (uploadProof) {
      requestData = {
        empId: user._id,
        financialYear: "2023-2024",
        usersalary: usersalary?.TotalInvestInvestment,
        requestData: {
          sectionname: "House",
          subsectionname: Object.keys(newData[index])[0],
          name: value.name,
          property1: value.property1,
          property2: value.property2,
          status: "Pending",
          declaration:
            Object.keys(newData[index])[0] !==
            "(A) Self Occupied Property (Loss)"
              ? value.declaration > value?.maxAmount
                ? value?.maxAmount
                : value.declaration
              : Number(value.property1) + Number(value.property2) >
                value?.maxAmount
              ? value?.maxAmount
              : Number(value.property1) + Number(value.property2),
          proof: uploadproof,
        },
      };
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API}/route/tds/createInvestment`,
        requestData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      handleAlert(true, "success", `Declarations submitted successfully`);
      queryClient.invalidateQueries({ queryKey: ["incomeHouse"] });
    } catch (error) {
      console.log(error);
    }

    setEditStatus({
      ...editStatus,
      [index]: null,
    });
  };

  const handleClose = (index) => {
    setEditStatus({ [index]: null });
    setDeclarationData(null);
    console.log(declarationData);
  };

  return (
    <div>
      {isFetching ? (
        <div className="flex items-center justify-center w-full">
          <CircularProgress />
        </div>
      ) : (
        <div>
          {tableData.map((item, itemIndex) => (
            <div className="bg-white " key={itemIndex}>
              <div className="w-full overflow-x-auto">
                <div className="inline-block min-w-full  ">
                  <div className="overflow-x-auto">
                    <div className="p-4">
                      <h1 className="text-xl"> {Object.keys(item)[0]}</h1>
                    </div>

                    <table className="overflow-hidden table-auto border border-collapse min-w-full bg-white  text-left   !text-sm font-light">
                      <thead className="border-b bg-gray-100 font-bold">
                        <tr className="!font-semibold ">
                          <th
                            scope="col"
                            className="!text-left pl-8 py-3 border"
                          >
                            Sr. No
                          </th>
                          <th scope="col" className="py-3 border">
                            Deduction Name
                          </th>
                          {Object.keys(item)[0] ===
                            "(A) Self Occupied Property (Loss)" && (
                            <>
                              <th scope="col" className="px-2 py-3 border">
                                Property 1
                              </th>
                              <th scope="col" className="px-2 border *:py-3">
                                Property 2
                              </th>
                            </>
                          )}
                          <th scope="col" className="py-3 px-2 border">
                            Declaration
                          </th>
                          <th scope="col" className="py-3 border">
                            Proof submitted
                          </th>
                          <th scope="col" className="py-3 border">
                            Status
                          </th>
                          <th scope="col" className=" py-3 border">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {item[Object.keys(item)[0]].map((ele, id) => (
                          <tr className="!font-medium  h-14 border-b" key={id}>
                            <td className="leading-7 text-[16px] !text-left pl-8 border w-[100px]">
                              {id + 1}
                            </td>
                            <td className="leading-7 text-[16px] truncate text-left w-[500px] border px-2">
                              {ele.name}
                            </td>
                            {Object.keys(item)[0] ===
                              "(A) Self Occupied Property (Loss)" && (
                              <>
                                <td className=" text-left !p-0 w-[200px] border ">
                                  {editStatus[itemIndex] === id ? (
                                    <div className="flex gap-2 h-14">
                                      <h1 className="leading-7 text-[16px] bg-gray-300 border h-auto px-4  flex items-center ">
                                        INR
                                      </h1>
                                      <input
                                        type="number"
                                        className="border-none w-[90px] h-auto outline-none  "
                                        // value={ele.property1}
                                        defaultValue={ele.property1}
                                        min={0}
                                        onChange={(e) =>
                                          handleProperty1(e, itemIndex, id)
                                        }
                                      />
                                    </div>
                                  ) : (
                                    <p className={`px-2 leading-7 text-[16px]`}>
                                      {ele.property1 && "INR " + ele?.property1}
                                    </p>
                                  )}
                                </td>
                                <td className=" text-left !p-0 w-[200px] border ">
                                  {editStatus[itemIndex] === id ? (
                                    <div className="flex gap-2 h-14">
                                      <h1 className="leading-7 text-[16px] bg-gray-300 border h-auto px-4  flex items-center ">
                                        INR
                                      </h1>
                                      <input
                                        type="number"
                                        className="border-none w-[90px] h-auto outline-none  "
                                        // value={ele.property2}
                                        defaultValue={ele.property1}
                                        min={0}
                                        onChange={(e) =>
                                          handleProperty2(e, itemIndex, id)
                                        }
                                      />
                                    </div>
                                  ) : (
                                    <p className={`px-2 leading-7 text-[16px]`}>
                                      {ele.property2 && "INR " + ele.property2}
                                    </p>
                                  )}
                                </td>
                              </>
                            )}
                            <td className="leading-7 text-[16px] h-14 text-left  !p-0 w-[220px] border ">
                              {Object.keys(item)[0] !==
                                "(A) Self Occupied Property (Loss)" &&
                              editStatus[itemIndex] === id ? (
                                <div className="flex gap-2 h-14">
                                  <h1 className="leading-7 text-[16px] bg-gray-300 border h-auto px-4  flex items-center ">
                                    INR
                                  </h1>
                                  <input
                                    type="number"
                                    className="border-none w-[90px] h-auto outline-none  "
                                    defaultValue={ele.declaration}
                                    onChange={(e) =>
                                      handleAmountChange(e, itemIndex, id)
                                    }
                                  />
                                </div>
                              ) : (
                                <div className="px-2">
                                  INR {ele?.declaration}
                                </div>
                              )}
                            </td>
                            <td className="text-left h-14 px-2 leading-7 text-[16px] w-[200px]  border ">
                              {editStatus[itemIndex] === id ? (
                                <>
                                  {declarationData.proof ? (
                                    <div className="px-2 flex gap-2 items-center h-max w-max">
                                      <div
                                        onClick={() =>
                                          handlePDF(
                                            URL.createObjectURL(
                                              declarationData?.proof
                                            )
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
                                        onClick={() =>
                                          setDeclarationData((prev) => ({
                                            ...prev,
                                            proof: undefined,
                                          }))
                                        }
                                        className="!text-sm text-gray-700 cursor-pointer"
                                      />
                                    </div>
                                  ) : (
                                    <div className="px-2 w-[150px]">
                                      <label className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 text-sm rounded cursor-pointer">
                                        Upload File
                                        <input
                                          type="file"
                                          className="hidden"
                                          onChange={(e) =>
                                            handleProofChange(e, itemIndex, id)
                                          }
                                        />
                                      </label>
                                    </div>
                                  )}
                                </>
                              ) : ele.proof ? (
                                typeof ele.proof === "string" ? (
                                  <div
                                    onClick={() => handlePDF(ele.proof)}
                                    className="px-2 flex gap-2 items-center h-max w-max  cursor-pointer"
                                  >
                                    <Article className="text-blue-500" />
                                    <h1>View Proof</h1>
                                  </div>
                                ) : (
                                  <div
                                    onClick={() =>
                                      handlePDF(
                                        URL.createObjectURL(
                                          declarationData.proof
                                        )
                                      )
                                    }
                                    className="px-2 flex gap-2 items-center h-max w-max"
                                  >
                                    <Article className="text-blue-500" />
                                    <h1>{item?.proof?.name}</h1>
                                  </div>
                                )
                              ) : (
                                <p className="px-2  md:w-full w-max">
                                  No proof found
                                </p>
                              )}
                            </td>
                            <td className="text-left w-[200px] leading-7 text-[16px] border px-2">
                              {ele.status === "Pending" ? (
                                <div className="flex items-center  gap-2">
                                  <Pending className="text-yellow-400 " />
                                  {ele.status}
                                </div>
                              ) : ele.status === "Auto" ||
                                ele.status === "Approved" ? (
                                <div className="flex items-center  gap-2">
                                  <CheckCircle className="text-green-400 " />
                                  {ele.status}
                                </div>
                              ) : ele.status === "Reject" ? (
                                <div className="flex items-center  gap-2">
                                  <Cancel className="text-red-400 " />
                                  {ele.status}
                                </div>
                              ) : (
                                <div className="flex items-center  gap-2">
                                  <Error className="text-gray-400 " />
                                  <p>{ele.status}</p>
                                </div>
                              )}
                            </td>
                            <td className="whitespace-nowrap leading-7 text-[16px] px-2   w-[220px]">
                              {editStatus[itemIndex] === id ? (
                                <div className="space-x-2">
                                  <Button
                                    color="primary"
                                    aria-label="save"
                                    onClick={() =>
                                      handleSaveClick(itemIndex, id)
                                    }
                                  >
                                    Submit
                                  </Button>
                                  <Button
                                    color="error"
                                    aria-label="save"
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
                                    onClick={() =>
                                      handleEditClick(itemIndex, id)
                                    }
                                  >
                                    <EditOutlined />
                                  </IconButton>
                                  <IconButton
                                    color="error"
                                    aria-label="delete"
                                    onClick={() => {
                                      handleDelete(itemIndex, id);
                                    }}
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
              </div>
            </div>
          ))}
        </div>
      )}

      <ProofModel pdf={pdf} handleClosePDF={handleClosePDF} />
    </div>
  );
};

export default TDSTable2;

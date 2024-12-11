import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { TestContext } from "../../../../State/Function/Main";
import useGetEmployeeSalaryByFinaicalYear from "../../../../hooks/IncomeTax/useGetEmployeeSalaryByFinaicalYear";
import useIncomeAPI from "../../../../hooks/IncomeTax/useIncomeAPI";
import useIncomeTax from "../../../../hooks/IncomeTax/useIncomeTax";
import useTDS from "../../../../hooks/IncomeTax/useTDS";
import useAuthToken from "../../../../hooks/Token/useAuth";
import UserProfile from "../../../../hooks/UserData/useUser";
import DeclarationTable from "../DeclarationTable";
import DeleteModel from "../DeleteModel";
import ProofModel from "../ProofModel";

const TDSTable1 = () => {
  const authToken = useAuthToken();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);

  let data = [
    {
      name: "Gross salary",
      amount: 0,
      proof: "Auto",
      status: "Auto",
    },
    {
      name: "Exemption on gratuity",
      amount: 0,
      proof: "",
      amountAccepted: 0,
      status: "Not Submitted",
    },
    {
      name: "Exemption on leave encashment",

      amountAccepted: 0,
      amount: 0,
      proof: "",
      status: "Not Submitted",
    },
    {
      name: "Exemption on voluntary retirement",
      amount: 0,
      proof: "",
      status: "Not Submitted",

      amountAccepted: 0,
    },
    {
      name: "Daily allowance",
      amount: 0,
      proof: "",
      status: "Not Submitted",

      amountAccepted: 0,
    },
    {
      name: "Conveyance allowance",
      amount: 0,
      proof: "",
      status: "Not Submitted",

      amountAccepted: 0,
    },
    {
      name: "Transport allowance for a specially-abled person",
      amount: 0,
      proof: "",
      status: "Not Submitted",

      amountAccepted: 0,
    },
    {
      name: "Perquisites for official purposes",
      amount: 0,
      proof: "",
      status: "Not Submitted",

      amountAccepted: 0,
    },
    // {
    //   name: "Taxable salary",
    //   amount: 0,
    //   proof: "",
    //   status: "Not Submitted",

    //   amountAccepted: 0,
    // },
    // {
    //   name: "Less : Professional Tax",
    //   amount: 0,
    //   proof: "",
    //   status: "Not Submitted",

    //   amountAccepted: 0,
    // },
    // {
    //   name: "Income taxable under the head Salaries",
    //   amount: 0,
    //   proof: "",
    // status: "Not Submitted",

    //
    // amountAccepted: 0,
    // },
  ];

  const { setGrossTotal, setDeclared } = useTDS();
  const { usersalary: grossTotal } = useGetEmployeeSalaryByFinaicalYear();
  const {
    editStatus = {},
    handleEditClick,
    declarationData,
    handleAmountChange,
    handleProofChange,
    handleClose,
    setTableData,
    tableData,
    deleteConfirmation,
    handleDeleteConfirmation,
    pdf,
    handlePDF,
    handleCloseConfirmation,
    handleClosePDF,
  } = useIncomeTax();

  const queryKey = "Salary";
  const sectionname = "Salary";

  const {
    handleSaveClick,
    handleDelete,
    setDeclarationData,
    usersalary,
    // declarationData
  } = useIncomeAPI(
    data,
    user,
    authToken,
    handleAlert,
    queryClient,
    sectionname,
    queryKey
  );

  useEffect(() => {
    setTableData(data);
    // setGrossTotal(usersalary?.TotalInvestInvestment);
    // console.log(Number(grossTotal), "Gross Amount updated successfully");
    // eslint-disable-next-line
  }, [grossTotal]);

  const { isFetching: salaryFetching } = useQuery({
    queryKey: ["Salary", grossTotal],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/tds/getInvestment/Salary`,
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
        queryClient.invalidateQueries({ queryKey: ["finacialYearData"] });
        setGrossTotal(usersalary?.TotalInvestInvestment);
        const declaredAmount = res?.reduce((i, a) => {
          return (i += a.declaration);
        }, 0);

        const amountPending = res?.reduce((i, a) => {
          if (a.status === "Pending") {
            return (i += a.declaration);
          }
          return i;
        }, 0);

        const amountReject = res?.reduce((i, a) => {
          if (a.status === "Reject") {
            return (i += a.declaration);
          }
          return i;
        }, 0);

        const amountAccepted = res?.reduce((i, a) => {
          return (i += a.amountAccepted);
        }, 0);

        let data = {
          declared: declaredAmount,
          pending: amountPending,
          accepted: amountAccepted,
          rejected: amountReject,
        };
        setDeclared(data);
        const updatedTableData = tableData?.map((item) => {
          const matchingItem = res?.find(
            (investment) => investment.name === item.name
          );

          if (item.name === "Gross salary") {
            return {
              ...item,
              amount: isNaN(Number(grossTotal?.TotalInvestInvestment))
                ? 0
                : Number(grossTotal?.TotalInvestInvestment),
              amountAccepted: isNaN(Number(grossTotal?.TotalInvestInvestment))
                ? 0
                : Number(grossTotal?.TotalInvestInvestment),
              status: "Auto",
              proof: "",
            };
          }
          if (matchingItem) {
            return {
              ...item,
              amount: matchingItem.declaration,
              amountAccepted: matchingItem.amountAccepted,
              status: matchingItem.status,
              proof: matchingItem.proof,
            };
          } else {
            return item;
          }
        });

        setTableData(updatedTableData);
      }
    },
  });

  return (
    <div>
      <DeclarationTable
        tableData={tableData}
        // isLoading={salaryFetching}
        handleAmountChange={handleAmountChange}
        handleProofChange={handleProofChange}
        handleSaveClick={handleSaveClick}
        handleClose={handleClose}
        handleEditClick={handleEditClick}
        handleDeleteConfirmation={handleDeleteConfirmation}
        handlePDF={handlePDF}
        editStatus={editStatus}
        declarationData={declarationData}
        setDeclarationData={setDeclarationData}
        salaryFetching={salaryFetching}
      />
      <ProofModel pdf={pdf} handleClosePDF={handleClosePDF} />
      <DeleteModel
        deleteConfirmation={deleteConfirmation}
        handleCloseConfirmation={handleCloseConfirmation}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default TDSTable1;

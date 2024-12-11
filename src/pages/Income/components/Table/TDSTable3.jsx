import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { TestContext } from "../../../../State/Function/Main";
import useIncomeAPI from "../../../../hooks/IncomeTax/useIncomeAPI";
import useIncomeTax from "../../../../hooks/IncomeTax/useIncomeTax";
import useTDS from "../../../../hooks/IncomeTax/useTDS";
import useAuthToken from "../../../../hooks/Token/useAuth";
import UserProfile from "../../../../hooks/UserData/useUser";
import DeclarationTable from "../DeclarationTable";
import DeleteModel from "../DeleteModel";
import ProofModel from "../ProofModel";

const TDSTable3 = () => {
  const authToken = useAuthToken();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);

  const data = [
    {
      name: "Bank interest (SB account)",
      amount: 0,
      amountAccepted: 0,
      proof: "",
      status: "Not Submitted",
    },
    {
      name: "Bank interest (term deposit)",
      amount: 0,
      amountAccepted: 0,
      proof: "",
      status: "Not Submitted",
    },
    {
      name: "NSC interest for the year",
      amount: 0,
      amountAccepted: 0,
      proof: "",
      status: "Not Submitted",
    },
    {
      name: "Post office deposit",
      amount: 0,
      amountAccepted: 0,
      proof: "",
      status: "Not Submitted",
    },
    {
      name: "Dividend",
      amount: 0,
      amountAccepted: 0,
      proof: "",
      status: "Not Submitted",
    },
    {
      name: "Family pension",
      amount: 0,
      amountAccepted: 0,
      proof: "",
      status: "Not Submitted",
    },
    {
      name: "Less : Deduction on family pension income sec. 57(IIA)",
      amount: 0,
      amountAccepted: 0,
      proof: "",
      status: "Auto",
    },
    {
      name: "Less : Gifts up to Rs. 50,000/- dec. 56(2)",
      amount: 0,
      amountAccepted: 0,
      proof: "",
      status: "Not Submitted",
    },
  ];
  const { setDeclared } = useTDS();
  const {
    editStatus,
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
  const queryKey = "incomeOther";
  const sectionname = "Otherincome";

  const {
    handleSaveClick,
    handleDelete,
    setDeclarationData,
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
    // eslint-disable-next-line
  }, []);
  const { isFetching } = useQuery({
    queryKey: ["incomeOther"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/tds/getInvestment/Otherincome`,
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
        const updatedTableData = tableData.map((item) => {
          const matchingItem = res.find(
            (investment) => investment.name === item.name
          );

          if (matchingItem) {
            return {
              ...item,
              amount: matchingItem.declaration,
              status: matchingItem.status,
              proof: matchingItem.proof,
              amountAccepted: matchingItem.amountAccepted,
            };
          } else {
            return item;
          }
        });

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
        // setTotalHeads(res.totalAddition.toFixed(2));
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
        salaryFetching={isFetching}
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

export default TDSTable3;

import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { TestContext } from "../../../../../State/Function/Main";
import useIncomeAPI from "../../../../../hooks/IncomeTax/useIncomeAPI";
import useIncomeTax from "../../../../../hooks/IncomeTax/useIncomeTax";
import useTDS from "../../../../../hooks/IncomeTax/useTDS";
import useAuthToken from "../../../../../hooks/Token/useAuth";
import UserProfile from "../../../../../hooks/UserData/useUser";
import DeclarationTable from "../../DeclarationTable";
import DeleteModel from "../../DeleteModel";
import ProofModel from "../../ProofModel";

const TDSTable4Tab1 = () => {
  const authToken = useAuthToken();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);

  const data = [
    {
      section: "80 C",
      name: "Life insurance",
      amount: 0,
      proof: "",
      status: "Not Submitted",
      amountAccepted: 0,
    },
    // {
    //   section: "80 C",
    //   name: "Provident Fund",
    //   amount: 0,
    //   proof: "",
    //   status: "Auto",
    // },
    {
      section: "80 C",
      name: "Public provident fund",
      amount: 0,
      proof: "",
      status: "Not Submitted",
      amountAccepted: 0,
    },
    {
      section: "80 C",
      name: "NSC investment ",
      amount: 0,
      proof: "",
      status: "Not Submitted",
      amountAccepted: 0,
    },
    {
      section: "80 C",
      name: "Housing loan principal repayment",
      amount: 0,
      proof: "",
      status: "Not Submitted",
      amountAccepted: 0,
    },
    {
      section: "80 C",
      name: "Sukanya samriddhi account",
      amount: 0,
      proof: "",
      status: "Not Submitted",
      amountAccepted: 0,
    },
    {
      section: "80 C",
      name: "Tuition fees for 2 children",
      amount: 0,
      proof: "",
      status: "Not Submitted",
      amountAccepted: 0,
    },
    {
      section: "80 C",
      name: "Tax saving fixed deposit in bank (5 years)",
      amount: 0,
      proof: "",
      status: "Not Submitted",
      amountAccepted: 0,
    },
    {
      section: "80 C",
      name: "Tax saving bonds",
      amount: 0,
      proof: "",
      status: "Not Submitted",
      amountAccepted: 0,
    },
    {
      section: "80 C",
      name: "E.L.S.S (Tax saving mutual fund)",
      amount: 0,
      proof: "",
      status: "Not Submitted",
      amountAccepted: 0,
    },
    {
      section: "80 CCC",
      name: "Pension plan from insurance companies/mutual funds (u/s 80CCC)",
      amount: 0,
      proof: "",
      status: "Not Submitted",
      amountAccepted: 0,
    },
    {
      section: "80 CCD",
      name: "Contribution to NPS notified by the central government",
      amount: 0,
      proof: "",
      status: "Not Submitted",
      amountAccepted: 0,
    },
    {
      section: "80 CCH",
      name: "All contributions to agniveer corpus fund",
      amount: 0,
      proof: "",
      status: "Not Submitted",
      amountAccepted: 0,
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
  const queryKey = "sectionDeduction";
  const sectionname = "SectionDeduction";
  const subsectionname = "Section80";

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
    queryKey,
    subsectionname
  );

  useEffect(() => {
    setTableData(data);
    // eslint-disable-next-line
  }, []);

  const { isFetching } = useQuery({
    queryKey: ["sectionDeduction"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/tds/getInvestment/SectionDeduction`,
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

export default TDSTable4Tab1;

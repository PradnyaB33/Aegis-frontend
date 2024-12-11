import React, { useContext } from "react";
import LoanMgtCards from "./LoanMgtCard";
import axios from "axios";
import { UseContext } from "../../../State/UseState/UseContext";
import { useQuery, useQueryClient } from "react-query";

const InputForm = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();

  const { data: getApprovedRejectLoanDataByApprover } = useQuery(
    ["getApprovedRejectedData"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get-approved-reject-loan-to-employee`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getLoanEmployee"] });
      }
    }
  );

  return (
    <div className="flex w-full flex-col gap-4">
      {getApprovedRejectLoanDataByApprover &&
        getApprovedRejectLoanDataByApprover.length > 0 ? (
        getApprovedRejectLoanDataByApprover.map((item, index) => (
          <LoanMgtCards key={index} items={item} />
        ))
      ) : (
        <h1>Sorry, no request found</h1>
      )}
    </div>
  );
};

export default InputForm;

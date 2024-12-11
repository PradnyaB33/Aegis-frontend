import axios from "axios";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import useAuthToken from "../../../../hooks/Token/useAuth";
import { TestContext } from "../../../../State/Function/Main";
import useGetSalaryByFY from "../queries/useGetSalaryByFY";

const useChangeRegime = () => {
  const { getFinancialCurrentYear, usersalary } = useGetSalaryByFY();
  const { organisationId } = useParams();
  const authToken = useAuthToken();
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();
  const changeRegimeMutation = useMutation(
    (data) => {
      const { start, end } = getFinancialCurrentYear();
      axios.put(
        `${process.env.REACT_APP_API}/route/tds/changeRegime/${organisationId}/${start}-${end}`,
        {
          ...data,
          requestData: null,
          usersalary: usersalary?.TotalInvestInvestment,
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: "tdsDetails" });
        await queryClient.invalidateQueries({ queryKey: "getInvestments" });

        handleAlert(true, "success", `Regime changed successfully`);
      },
      onError: (error) => {
        console.log(error);
        handleAlert(true, "success", `There was an error please try later`);
      },
    }
  );

  return { changeRegimeMutation };
};

export default useChangeRegime;

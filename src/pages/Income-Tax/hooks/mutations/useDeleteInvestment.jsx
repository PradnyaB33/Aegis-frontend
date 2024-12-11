import axios from "axios";
import { useContext } from "react";
import { useQueryClient } from "react-query";
import useAuthToken from "../../../../hooks/Token/useAuth";
import UserProfile from "../../../../hooks/UserData/useUser";
import { TestContext } from "../../../../State/Function/Main";
import useGetSalaryByFY from "../queries/useGetSalaryByFY";
import useFunctions from "../useFunctions";

const useDeleteInvestment = (organizationId, userSalary) => {
  console.log(`organizationIds`, organizationId, userSalary);
  const { getFinancialCurrentYear } = useGetSalaryByFY();
  const user = UserProfile().getCurrentUser();
  const authToken = useAuthToken();
  const queryClient = useQueryClient();
  const { deleteConfirm, setDeleteConfirm } = useFunctions();
  const { handleAlert } = useContext(TestContext);
  const handleDelete = async () => {
    const { start, end } = getFinancialCurrentYear();
    const requestData = {
      empId: user._id,
      financialYear: `${start}-${end}`,
      organizationId: organizationId,
      userSalary: userSalary,
      requestData: {
        ...deleteConfirm,
        declaration: 0,
        amountAccepted: 0,
      },
    };

    try {
      await axios.patch(
        `${process.env.REACT_APP_API}/route/tds/deleteInvestment`,
        requestData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      queryClient.invalidateQueries({ queryKey: "tdsDetails" });
      queryClient.invalidateQueries({ queryKey: "getInvestments" });
      handleAlert(true, "success", `Declaration deleted successfully`);
      setDeleteConfirm(null);
    } catch (error) {
      console.log(error);
    }
  };

  return { handleDelete };
};

export default useDeleteInvestment;

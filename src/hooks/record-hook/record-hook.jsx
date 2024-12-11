import axios from "axios";
import { useQuery } from "react-query";
import { useContext } from "react";
import { UseContext } from "../../State/UseState/UseContext";

const useRecordHook = () => {
  // to define the state , hook , import other function if needed
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  //to get the data of employee who have uploaded document
  const { data: getRecordOfEmployee } = useQuery(
    ["getRecordOfEmployee"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get-document/to-approval-id`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );

  return {
    getRecordOfEmployee,
  };
};

export default useRecordHook;

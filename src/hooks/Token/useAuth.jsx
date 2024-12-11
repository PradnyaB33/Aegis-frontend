// useAuthToken.js
import { useContext } from "react";
import { UseContext } from "../../State/UseState/UseContext";

const useAuthToken = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  return authToken;
};

export default useAuthToken;


import axios from "axios";
import { useContext } from "react";
import { UseContext } from "../../State/UseState/UseContext";
import UserProfile from "../UserData/useUser";
import { useQuery } from "react-query";
import { useQueryClient } from 'react-query'; 

const useHook = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];  
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const userId = user._id;
  // eslint-disable-next-line no-unused-vars
  const queryClient = useQueryClient();

  const fetchUserInformation = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/employee/get/profile/${userId}`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data.employee; 
  };

  const { data: UserInformation, isLoading, isFetching } = useQuery(
    // ["emp-profile", userId],
    ["emp-profile"],
    fetchUserInformation,
    // {
    //   onSuccess: () => {
    //     
    //     // queryClient.invalidateQueries(["emp-profile"]);
    //   },
    // }
  );

  return {
    UserInformation,
    isLoading,
    isFetching,
  };
};

export default useHook;




//original one
// import axios from "axios";
// import { useContext } from "react";
// import { UseContext } from "../../State/UseState/UseContext";
// import UserProfile from "../UserData/useUser";
// import { useQuery } from "react-query";


// const useHook = () => {
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];  
//   const { getCurrentUser } = UserProfile();
//   const user = getCurrentUser();
//   const userId = user._id;



//   const  getUserInformation = async () => {
//     const response = await axios.get(
//       `${process.env.REACT_APP_API}/route/employee/get/profile/${userId}`,
//       {
//         headers: { Authorization: authToken },
//       }
//     );
//     return response.data.employee;
//   };
  

//   const {
//     data: UserInformation,
//     isLoading,
//     isFetching,
//   } = useQuery("additionalField", getUserInformation);

//   return {
//     UserInformation,
//     isLoading,
//     isFetching,
//   };
// };

// export default useHook;


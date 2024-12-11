// import axios from "axios";
// import { useContext } from "react";
// import { useQuery } from "react-query";
// import { useNavigate, useParams } from "react-router-dom";
// import Swal from "sweetalert2";
// import { TestContext } from "../../../State/Function/Main";

// const useVerifyUser = () => {
//   const param = useParams();
//   const { handleAlert } = useContext(TestContext);
//   const navigate = useNavigate();
//   const verifyEmailUrl = async () => {
//     const url = `${process.env.REACT_APP_API}/route/employee/verify/${param.token}`;
//     const { data } = await axios.get(url);
//     console.log(data);
//   };

//   const { data, isLoading } = useQuery(`verification`, verifyEmailUrl, {
//     onSuccess: (data) => {
//       // handleAlert(
//       //   true,
//       //   "success",
//       //   "You are verified successfully now you can proceed to login"
//       // );

//       Swal.fire({
//         title: "Success!",
//         text: "You are verified successfully now you can reset your password or proceed to login",
//         icon: "success",
//         confirmButtonText: "OK",
//       });
//       // navigate("/sign-in");
//     },
//     onError: (error) => {
//       navigate("/sign-in");
//       handleAlert(
//         true,
//         "error",
//         `${error?.response?.data?.message} please raise request again` ||
//           "Failed to sign in. Please try again."
//       );
//       // navigate("/sign-in");
//     },
//   });
//   return { data, isLoading, token: param?.token };
// };

// export default useVerifyUser;
import axios from "axios";
import { useContext } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { TestContext } from "../../../State/Function/Main";

const useVerifyUser = () => {
  const param = useParams();
  const { handleAlert } = useContext(TestContext);
  const navigate = useNavigate();

  // Internal style for the confirm button
  const confirmButtonStyles = `
    .swal2-confirm.my-confirm-button-class {
      background-color: #1414fe; 
      color: white; 
      font-weight: bold; 
      border: none; 
      padding: 5px ;
      border-radius: 4px; 
    }

  
  `;

  const verifyEmailUrl = async () => {
    const url = `${process.env.REACT_APP_API}/route/employee/verify/${param.token}`;
    const { data } = await axios.get(url);
    console.log(data);
  };

  const { data, isLoading } = useQuery(`verification`, verifyEmailUrl, {
    onSuccess: (data) => {
      // Inject styles into the document head
      const styleSheet = document.createElement("style");
      styleSheet.type = "text/css";
      styleSheet.innerText = confirmButtonStyles;
      document.head.appendChild(styleSheet);

      Swal.fire({
        title: "Success!",
        text: "You are verified successfully now you can reset your password or proceed to login",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "my-confirm-button-class",
        },
      });
    },
    onError: (error) => {
      navigate("/sign-in");
      handleAlert(
        true,
        "error",
        `${error?.response?.data?.message} please raise request again` ||
        "Failed to sign in. Please try again."
      );
    },
  });

  return { data, isLoading, token: param?.token };
};

export default useVerifyUser;

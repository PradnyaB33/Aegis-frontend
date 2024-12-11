import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import UserProfile from "../../hooks/UserData/useUser";

const ChangeRole = () => {
  const { getCurrentUser, useGetCurrentRole } = UserProfile();
  const queryClient = useQueryClient();
  const user = getCurrentUser();
  const roles = useGetCurrentRole();

  const redirect = useNavigate();
  const [selectedRole, setSelectedRole] = useState({
    label: roles,
    value: roles,
  });

  useEffect(() => {
    setSelectedRole({
      label: roles,
      value: roles,
    });

    // eslint-disable-next-line
  }, [window.location.pathname, roles]);

  const options = user?.profile
    ?.map((item) => {
      return {
        label: item,
        value: item,
      };
    })
    .filter((ele) => {
      return ele.label !== roles;
    });

  const handleRole = useMutation(
    (data) => {
      const res = axios.post(
        `${process.env.REACT_APP_API}/route/employee/changerole`,
        data
      );
      return res;
    },

    {
      onSuccess: async (response) => {
        Cookies.set("role", response?.data?.roleToken);
        if (response?.data?.role === "Super-Admin") {
          redirect("/");
        } else if (response?.data?.role === "HR") {
          redirect(
            `/organisation/${user.organizationId}/dashboard/HR-dashboard`
          );
        } else if (response?.data?.role === "Manager") {
          redirect(
            `/organisation/${user.organizationId}/dashboard/manager-dashboard`
          );
        } else if (response?.data?.role === "Employee") {
          redirect(
            `/organisation/${user.organizationId}/dashboard/employee-dashboard`
          );
        } else if (response?.data?.role === "Department-Head") {
          redirect(
            `/organisation/${user.organizationId}/dashboard/DH-dashboard`
          );
        } else {
          redirect(
            `/organisation/${user.organizationId}/dashboard/employee-dashboard`
          );
        }
        queryClient.invalidateQueries({ queryKey: ["role"] });
        window.location.reload();
      },

      onError: (error) => {
        console.error(error);
      },
    }
  );
  return (
    <div className="space-y-1 w-full p-4 ">
      <label
        htmlFor={"role"}
        className={` font-semibold text-gray-500 text-md`}
      >
        Select Profile
      </label>

      <div
        className={`${"bg-[ghostwhite]"} flex rounded-md px-2 border-gray-200 border-[.5px] bg-white items-center`}
      >
        {/* <Icon className="text-gray-700" /> */}
        <Select
          aria-errormessage=""
          placeholder={"Choose Role"}
          styles={{
            control: (styles) => ({
              ...styles,
              borderWidth: "0px",
              boxShadow: "none",
            }),
          }}
          value={selectedRole}
          className={`${"bg-[ghostwhite]"} bg-white w-full !outline-none px-2 !shadow-none !border-none !border-0`}
          options={options}
          onChange={(value) => {
            handleRole.mutate({ role: value.value, email: user?.email });
          }}
        />
      </div>
    </div>
  );
};

export default ChangeRole;


// for only Teacher Role

// import axios from "axios";
// import Cookies from "js-cookie";
// import React, { useEffect, useState } from "react";
// import { useMutation, useQueryClient } from "react-query";
// import { useNavigate } from "react-router-dom";
// import Select from "react-select";
// import UserProfile from "../../hooks/UserData/useUser";

// const ChangeRole = () => {
//   const { getCurrentUser, useGetCurrentRole } = UserProfile();
//   const queryClient = useQueryClient();
//   const user = getCurrentUser();
//   const roles = useGetCurrentRole();

//   const redirect = useNavigate();
//   const [selectedRole, setSelectedRole] = useState({
//     label: roles,
//     value: roles,
//   });

//   useEffect(() => {
//     setSelectedRole({
//       label: roles,
//       value: roles,
//     });

//     // eslint-disable-next-line
//   }, [window.location.pathname, roles]);

//   const options = user?.profile.includes("Teacher")
//     ? [
//         {
//           label: "Teacher",
//           value: "Teacher",
//         },
//       ]
//     :
//      user?.profile
//         ?.map((item) => {
//           return {
//             label: item,
//             value: item,
//           };
//         })
//         .filter((ele) => {
//           return ele.label !== roles;
//         });

//   const handleRole = useMutation(
//     (data) => {
//       const res = axios.post(
//         `${process.env.REACT_APP_API}/route/employee/changerole`,
//         data
//       );
//       return res;
//     },

//     {
//       onSuccess: async (response) => {
//         Cookies.set("role", response?.data?.roleToken);
//         if (response?.data?.role === "Super-Admin") {
//           redirect("/");
//         } 
//         else if (response?.data?.role === "Teacher") {
//           redirect(
//             `/organisation/${user.organizationId}/dashboard/employee-dashboard`
//           );
//         }else if (response?.data?.role === "HR") {
//           redirect(
//             `/organisation/${user.organizationId}/dashboard/HR-dashboard`
//           );
//         } else if (response?.data?.role === "Manager") {
//           redirect(
//             `/organisation/${user.organizationId}/dashboard/manager-dashboard`
//           );
//         } else if (response?.data?.role === "Employee") {
//           redirect(
//             `/organisation/${user.organizationId}/dashboard/employee-dashboard`
//           );
//         } else if (response?.data?.role === "Department-Head") {
//           redirect(
//             `/organisation/${user.organizationId}/dashboard/DH-dashboard`
//           );
//         } else {
//           redirect(
//             `/organisation/${user.organizationId}/dashboard/employee-dashboard`
//           );
//         }
//         queryClient.invalidateQueries({ queryKey: ["role"] });
//         window.location.reload();
//       },

//       onError: (error) => {
//         console.error(error);
//       },
//     }
//   );
//   return (
//     <div className="space-y-1 w-full p-4 ">
//       <label
//         htmlFor={"role"}
//         className={` font-semibold text-gray-500 text-md`}
//       >
//         Select Profile
//       </label>

//       <div
//         className={`${"bg-[ghostwhite]"} flex rounded-md px-2 border-gray-200 border-[.5px] bg-white items-center`}
//       >
//         {/* <Icon className="text-gray-700" /> */}
//         <Select
//           aria-errormessage=""
//           placeholder={"Choose Role"}
//           styles={{
//             control: (styles) => ({
//               ...styles,
//               borderWidth: "0px",
//               boxShadow: "none",
//             }),
//           }}
//           value={selectedRole}
//           className={`${"bg-[ghostwhite]"} bg-white w-full !outline-none px-2 !shadow-none !border-none !border-0`}
//           options={options}
//           onChange={(value) => {
//             handleRole.mutate({ role: value.value, email: user?.email });
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default ChangeRole;

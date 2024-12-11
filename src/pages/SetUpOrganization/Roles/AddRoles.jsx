// import { Checkbox, FormControlLabel, Skeleton } from "@mui/material";
// import axios from "axios";
// import React, { useContext, useEffect, useState } from "react";
// import { useMutation, useQuery, useQueryClient } from "react-query";
// import { useParams } from "react-router-dom";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import { TestContext } from "../../../State/Function/Main";
// import { UseContext } from "../../../State/UseState/UseContext";
// import Setup from "../Setup";
// import BasicButton from "../../../components/BasicButton";
// const AddRoles = () => {
//   const { organisationId } = useParams("");
//   const { cookies } = useContext(UseContext);
//   const { handleAlert } = useContext(TestContext);
//   const authToken = cookies["aegis"];
//   const queryClient = useQueryClient();

//   const fetchProfiles = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/profile/role/${organisationId}`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       throw new Error("Error fetching data");
//     }
//   };

//   const { data, isLoading } = useQuery("profiles", fetchProfiles);

//   const AddProfiles = useMutation(
//     (data) =>
//       axios.patch(
//         `${process.env.REACT_APP_API}/route/profile/role/${organisationId}`,
//         data,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       ),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries({ queryKey: ["profiles"] });
//         handleAlert(true, "success", "Roles created successfully.");
//       },
//       onError: () => {
//         handleAlert(true, "error", "Error from server");
//       },
//     }
//   );

//   const [roleState, setRoleState] = useState({});

//   useEffect(() => {
//     setRoleState(data?.roles);
//     // eslint-disable-next-line
//   }, [isLoading]);

//   const handleRoleChange = (role) => {
//     setRoleState((prevRoles) => ({
//       ...prevRoles,
//       [role]: {
//         ...prevRoles[role],
//         isActive: !prevRoles[role].isActive,
//       },
//     }));
//   };

//   const handleSubmit = async () => {
//     await AddProfiles.mutateAsync(roleState);
//   };

//   return (
//     <BoxComponent sx={{ p: 0 }}>
//       <Setup>
//         <div className="h-[90vh] overflow-y-auto scroll px-3">
//           <HeadingOneLineInfo
//             className="!my-3"
//             heading="Manage Roles"
//             info="Select multiple roles to able to manage your organisation."
//           />
//           {isLoading ? (
//             <div>
//               {[...Array(5)].map((_, index) => (
//                 <Skeleton key={index} variant="rectangular" height={20} className="my-2" />
//               ))}
//               <Skeleton variant="rectangular" height={20} width="100px" className="my-4" />
//             </div>
//           ) : (
//             <div>
//               {Object.entries(roleState ?? [])?.map(([role, obj], index) => (
//                 <div
//                   key={index}
//                   className="flex justify-between py-1"
//                 >
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={obj.isActive}
//                         onChange={() => handleRoleChange(role)}
//                       />
//                     }
//                     label={role}
//                   />
//                 </div>
//               ))}
//               <div className="py-2 w-full">
//                 <BasicButton title={"Submit"} onClick={handleSubmit} />
//               </div>
//             </div>
//           )}
//         </div>
//       </Setup>
//     </BoxComponent>
//   );
// };

// export default AddRoles;

import { Checkbox, FormControlLabel, Skeleton } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import Setup from "../Setup";
import BasicButton from "../../../components/BasicButton";
import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";

const AddRoles = () => {
  const { organisationId } = useParams("");
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();

  const { data: subscriptionData, isLoading: subscriptionLoading } = useSubscriptionGet({ organisationId });
  const isFullskapePlan = subscriptionData?.organisation?.packageInfo === "Fullskape Plan";

  const fetchProfiles = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/profile/role/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Error fetching data");
    }
  };

  const { data, isLoading: profilesLoading } = useQuery("profiles", fetchProfiles);

  const AddProfiles = useMutation(
    (data) =>
      axios.patch(
        `${process.env.REACT_APP_API}/route/profile/role/${organisationId}`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["profiles"] });
        handleAlert(true, "success", "Roles created successfully.");
      },
      onError: () => {
        handleAlert(true, "error", "Error from server");
      },
    }
  );

  const [roleState, setRoleState] = useState({});

  useEffect(() => {
    setRoleState(data?.roles);
    // eslint-disable-next-line
  }, [profilesLoading]);

  const handleRoleChange = (role) => {
    setRoleState((prevRoles) => ({
      ...prevRoles,
      [role]: {
        ...prevRoles[role],
        isActive: !prevRoles[role].isActive,
      },
    }));
  };

  const handleSubmit = async () => {
    await AddProfiles.mutateAsync(roleState);
  };

  const isLoading = profilesLoading || subscriptionLoading;

  return (
    <BoxComponent sx={{ p: 0 }}>
      <Setup>
        <div className="h-[90vh] overflow-y-auto scroll px-3">
          <HeadingOneLineInfo
            className="!my-3"
            heading="Manage Roles"
            info="Select multiple roles to able to manage your organisation."
          />
          {isLoading ? (
            <div>
              {[...Array(5)].map((_, index) => (
                <Skeleton key={index} variant="rectangular" height={20} className="my-2" />
              ))}
              <Skeleton variant="rectangular" height={20} width="100px" className="my-4" />
            </div>
          ) : (
            <div>
              {Object.entries(roleState ?? [])?.map(([role, obj], index) => {
                if (role === "Teacher" && !isFullskapePlan) return null; // Hide "Teacher" role if not Fullskape Plan
                return (
                  <div key={index} className="flex justify-between py-1">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={obj.isActive}
                          onChange={() => handleRoleChange(role)}
                        />
                      }
                      label={role}
                    />
                  </div>
                );
              })}
              <div className="py-2 w-full">
                <BasicButton title={"Submit"} onClick={handleSubmit} />
              </div>
            </div>
          )}
        </div>
      </Setup>
    </BoxComponent>
  );
};

export default AddRoles;

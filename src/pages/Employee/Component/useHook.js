// This file is not used
import axios from "axios";
import useAuthToken from "../../../hooks/Token/useAuth";
import { useMutation, useQuery } from "react-query";
import { useContext } from "react";
import { TestContext } from "../../../State/Function/Main";

const useHook = () => {

  const { handleAlert } = useContext(TestContext);
  const authToken = useAuthToken();
  const organisationId = "65a7b30a2dde15339e25db3e";

  //get designation
  const getDesignation = async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: authToken,
      },
    };
    let data = await axios.get(
      `${process.env.REACT_APP_API}/route/designation/create/${organisationId}`,
      config
    );
    return data.data;
  };
  const { data: getDesignationData } = useQuery({
    queryKey: ["designation"],
    queryFn: getDesignation,
  });

  //pull location
  const getLocation = async () => {
    const config = {
      headers: {
        "Content-type": "Application/json",
        Authorization: authToken,
      },
    };
    let data = await axios.get(
      `${process.env.REACT_APP_API}/route/location/getOrganizationLocations/${organisationId}`,
      config
    );
    return data.data;
  };

  const { data: getLocationData } = useQuery({
    queryKey: ["location"],
    queryFn: getLocation,
  });

  //pull emp type
  const getEmployementType = async () => {
    const config = {
      headers: {
        "Content-type": "Application/json",
        Authorization: authToken,
      },
    };
    let data = await axios.get(
      `${process.env.REACT_APP_API}/route/employment-types-organisation/${organisationId}`,
      config
    );
    return data.data;
  };

  const { data: getEmployementTypeData } = useQuery({
    queryKey: ["employementType"],
    queryFn: getEmployementType,
  });

  //   pull salary input
  const getSalaryInput = async () => {
    const config = {
      headers: {
        "Content-type": "Application/json",
        Authorization: authToken,
      },
    };
    let data = await axios.get(
      `${process.env.REACT_APP_API}/route/salary-template-org/${organisationId}`,
      config
    );
    return data.data;
  };

  const { data: getSalaryInputData } = useQuery({
    queryKey: ["salaryinput"],
    queryFn: getSalaryInput,
  });

  //   pull department
  const getDepartment = async () => {
    const config = {
      headers: {
        "Content-type": "Application/json",
        Authorization: authToken,
      },
    };
    let data = await axios.get(
      `${process.env.REACT_APP_API}/route/department/get/${organisationId}`,
      config
    );
    return data.data;
  };
  const { data: getDepartmentData } = useQuery({
    queryKey: ["department"],
    queryFn: getDepartment,
  });

  //   pull profile data
  const getProfile = async () => {
    const config = {
      headers: {
        "Content-type": "Application/json",
        Authorization: authToken,
      },
    };
    let data = await axios.get(
      `${process.env.REACT_APP_API}/route/profile/role/${organisationId}`,
      config
    );
    const getProfileData = Object.entries(data.data.roles ?? {})
      .filter(([role, obj]) => obj.isActive === true)
      .map(([role, obj]) => ({
        roleName: role,
        isApprover: obj.isApprover,
        isActive: obj.isActive,
      }));

    return getProfileData;
  };

  const { data: getProfileData } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  // pull input field
  const getInputField = async () => {
    const config = {
      headers: {
        "Content-type": "Application/json",
        Authorization: authToken,
      },
    };
    let data = await axios.get(
      `${process.env.REACT_APP_API}/route/inputfield/${organisationId}`,
      config
    );
    return data.data.inputField.inputDetail;
  };

  const { data: getInputFieldData } = useQuery({
    queryKey: ["inputfield"],
    queryFn: getInputField,
  });
  //get manager detail
  const getManagerDetail = async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: authToken,
      },
    };
    let data = await axios.get(
      `${process.env.REACT_APP_API}/route/employee/get-manager/${organisationId}`,
      config
    );
    return data.data.manager;
  };
  const { data: getManagerData } = useQuery({
    queryKey: ["manager"],
    queryFn: getManagerDetail,
  });

  // add employee data
  const addEmployee = async (user) => {
    try {
      console.log(user);

      const config = {
        headers: {
          "Content-type": "Application/json",
          Authorization: authToken,
        },
      };

      // Check if the selected profile exists
      const checkProfileResponse = await axios.post(
        `${process.env.REACT_APP_API}/route/employee/check-profile-exists/${organisationId}`,
        { profile: user.profile },
        config
      );

      if (
        checkProfileResponse.status === 200 &&
        checkProfileResponse.data.profileExists
      ) {
        const createProfileConfirmation = window.confirm(
          `${user.profile} profile already exists. Do you want to create it again?`
        );

        if (createProfileConfirmation) {
          // Proceed with profile creation
          const response = await axios.post(
            `${process.env.REACT_APP_API}/route/employee/add-employee`,
            user,
            config
          );

          if (response.data.success) {
            handleAlert(true, "error", "Invalid authorization");
          } else {
            handleAlert(true, "success", response.data.message);
          }
        } else {
          // User declined creating the profile again
          handleAlert(true, "info", "Profile creation canceled.");
        }
      } else {
        // Profile does not exist, proceed with creation
        const response = await axios.post(
          `${process.env.REACT_APP_API}/route/employee/add-employee`,
          user,
          config
        );

        if (response.status === 200) {
          // Display a message to the user indicating that a manager ID is required
          alert(
            "Manager ID is required for an employee profile. Please provide a valid manager ID."
          );
        } else if (response.data && response.data.success) {
          handleAlert(true, "error", "Invalid authorization");
        } else {
          handleAlert(true, "success", response.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      // Handle errors as needed
      handleAlert(
        true,
        "error",
        error.response ? error.response.data.message : error.message
      );
    }
  };
  const { mutate: addEmployeeMutate } = useMutation({
    mutationFn: addEmployee,
    onSuccess: async () => {},
    onError: async (data) => {
      console.log("error", data);
    },
  });

  return {
    getDesignationData,
    getLocationData,
    getEmployementTypeData,
    getSalaryInputData,
    getDepartmentData,
    getProfileData,
    getInputFieldData,
    getManagerData,
    addEmployeeMutate,
  };
};

export default useHook;

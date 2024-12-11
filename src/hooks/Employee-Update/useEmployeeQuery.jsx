import axios from "axios";
import { useQuery } from "react-query";
import useAuthToken from "../Token/useAuth";

const useEmployeeQuery = ( organisationId ) => {
  const authToken = useAuthToken();


  const getEmployeeDataApi = async (api) => {
    try {
      const response = await axios.get(`${api}`, {
        headers: {
          Authorization: authToken,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const DepartmentListCall = () => {
    const { data: DepartmentList } = useQuery({
      queryKey: ["department"],
      queryFn: () =>
        getEmployeeDataApi(
          `${process.env.REACT_APP_API}/route/department/get/${organisationId}`
        ),
    });

    return DepartmentList;
  };

  const ManagerListCall = () => {
    const { data: ManagerList } = useQuery({
      queryKey: ["managersList"],
      queryFn: () =>
        getEmployeeDataApi(
          `${process.env.REACT_APP_API}/route/employee/getAllManager/${organisationId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        ),
    });

    return ManagerList;
  };

  const EmpCodeCall = () => {
    const { data: empCode } = useQuery({
      queryKey: ["empCode"],
      queryFn: () =>
        getEmployeeDataApi(
          `${process.env.REACT_APP_API}/route/get/employee-code/${organisationId}`
        ),
    });

    return empCode;
  };

  const EmpRoleListCall = () => {
    const { data: empRolesList } = useQuery({
      queryKey: ["empRoleList"],
      queryFn: () =>
        getEmployeeDataApi(
          ` ${process.env.REACT_APP_API}/route/profile/role/${organisationId}`
        ),
    });

    return empRolesList;
  };

  const CostNumberCall = () => {
    const { data: costNumber } = useQuery({
      queryKey: ["costNumber"],
      queryFn: () =>
        getEmployeeDataApi(
          `${process.env.REACT_APP_API}/route/department/get/cost-center-id/${organisationId}`
        ),
    });

    return costNumber;
  };

  const ShiftCall = () => {
    const { data: shiftList } = useQuery({
      queryKey: ["shiftList"],
      queryFn: () =>
        getEmployeeDataApi(
          `${process.env.REACT_APP_API}/route/shifts/${organisationId}`
        ),
    });

    return shiftList;
  };

  const InputFieldCall = () => {
    const { data: inputFieldList } = useQuery({
      queryKey: ["inputFieldList"],
      queryFn: () =>
        getEmployeeDataApi(
          `${process.env.REACT_APP_API}/route/inputfield/${organisationId}`
        ),
    });

    return inputFieldList;
  };

  const LocationListCall = () => {
    const { data: locationList } = useQuery({
      queryKey: ["locationList"],
      queryFn: () =>
        getEmployeeDataApi(
          `${process.env.REACT_APP_API}/route/location/getOrganizationLocations/${organisationId}`
        ),
    });

    return locationList;
  };

  const EmpTypesCall = () => {
    const { data: empTypes } = useQuery({
      queryKey: ["EmpTypes"],
      queryFn: () =>
        getEmployeeDataApi(
          `${process.env.REACT_APP_API}/route/employment-types-organisation/${organisationId}`
        ),
    });

    return empTypes;
  };

  const SalaryTempCall = () => {
    const { data: SalaryTemp } = useQuery({
      queryKey: ["SalaryTemp"],
      queryFn: () =>
        getEmployeeDataApi(
          `${process.env.REACT_APP_API}/route/salary-template-org/${organisationId}`
        ),
    });
    return SalaryTemp;
  };

  const DesignationCall = () => {
    const { data: DesignationList } = useQuery({
      queryKey: ["desingnationList"],
      queryFn: () =>
        getEmployeeDataApi(
          `${process.env.REACT_APP_API}/route/designation/create/${organisationId}`
        ),
    });

    return DesignationList;
  };

  const AdditionalListCall = () => {
    const { data: addtionalFields, isLoading: addtionalLoading } = useQuery({
      queryKey: ["additionalFields"],
      queryFn: () =>
        getEmployeeDataApi(
          `${process.env.REACT_APP_API}/route/inputfield/${organisationId}`
        ),
    });
    return { addtionalFields, addtionalLoading };
  };

  return {
    DepartmentListCall,
    DesignationCall,
    SalaryTempCall,
    EmpTypesCall,
    InputFieldCall,
    ManagerListCall,
    ShiftCall,
    CostNumberCall,
    EmpRoleListCall,
    AdditionalListCall,
    LocationListCall,
    EmpCodeCall,
  };
};

export default useEmployeeQuery;

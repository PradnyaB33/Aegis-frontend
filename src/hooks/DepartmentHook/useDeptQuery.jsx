import axios from "axios";
import { useQuery } from "react-query";
import useAuthToken from "../Token/useAuth";

const useDeptQuery = ({ organisationId }) => {
  const authToken = useAuthToken();

  const getDepartmentDataApi = async (api) => {
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
  //  get department location
  const DepartmentLocaltionListCall = () => {
    const { data: DepartmentLocationList } = useQuery({
      queryKey: ["departmentLocationList"],
      queryFn: () =>
        getDepartmentDataApi(
          `${process.env.REACT_APP_API}/route/location/getOrganizationLocations/${organisationId}`
        ),
    });

    return DepartmentLocationList;
  };
  //   get department head
  const DepartmentHeadListCall = () => {
    const { data: DepartmentHeadList } = useQuery({
      queryKey: ["departmentHeadList"],
      queryFn: () =>
        getDepartmentDataApi(
          `${process.env.REACT_APP_API}/route/employee/get-department-head/${organisationId}`
        ),
    });

    return DepartmentHeadList;
  };
  //   get department head
  const DelegateDepartmentHeadListCall = () => {
    const { data: DelegateDepartmentHeadList } = useQuery({
      queryKey: ["delegateDepartmetnHeadList"],
      queryFn: () =>
        getDepartmentDataApi(
          `${process.env.REACT_APP_API}/route/employee/get-department-delegate-head/${organisationId}`
        ),
    });

    return DelegateDepartmentHeadList;
  };
  return {
    DepartmentLocaltionListCall,
    DepartmentHeadListCall,
    DelegateDepartmentHeadListCall,
  };
};

export default useDeptQuery;

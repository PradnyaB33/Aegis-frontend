import axios from "axios";
import { useQuery } from "react-query";
import useGetUser from "../../../hooks/Token/useUser";

const useGeoFencingCircle = () => {
    const { authToken, decodedToken } = useGetUser();

    const fetchEmployeeLocation = async () => {
        const response = await axios.get(
            `${process.env.REACT_APP_API}/route/geo-fence/get-employee-circle/${decodedToken?.user?._id}`,
            {
                headers: {
                    Authorization: authToken,
                },
            }
        );

        return response.data;
    };

    const {
        data: employeeGeoArea,
        isLoading,
        error,
    } = useQuery({
        queryKey: [`employee-geo-fence-area`, decodedToken?.user?._id],
        queryFn: fetchEmployeeLocation,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
            console.log("Employee geo area", data);
        },
    });
    return { employeeGeoArea, isLoading, error };
};

export default useGeoFencingCircle;

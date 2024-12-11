import axios from "axios";
import { useQuery } from "react-query";


const useGetStudents = (zoneId) => {
    const fetchAddedStudents = async () => {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/route/fullskape/zones/${zoneId}/students`
        );
        console.log("fetchAddedEmployee", data);
        
        return data?.data;
      };

      const {data: students} = useQuery(["getStudents"] ,fetchAddedStudents ) 

      return {students}
}

export default useGetStudents
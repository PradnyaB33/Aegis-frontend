import axios from "axios";
import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { TestContext } from "../../../../State/Function/Main";
import useGetUser from "../../../../hooks/Token/useUser";

const usePublicHoliday = (id) => {
  const { organisationId } = useParams();
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();
  const { authToken } = useGetUser();

  const AddPublicHoliday = async ({ data, onClose }) => {
    console.log(data);
    const response = await axios.post(
      `${process.env.REACT_APP_API}/route/holiday/create`,
      {
        ...data,
        organizationId: organisationId,
      }
    );
    return response.data;
  };

  const { mutate: addPublicHoliday } = useMutation(AddPublicHoliday, {
    onSuccess: async (data, { onClose }) => {
      console.log("Public Holiday Added");
      await queryClient.invalidateQueries(["getHoliday"]);
      onClose();
      handleAlert(true, "success", "Public Holiday Added Successfully");
    },
    onError: (error) => {
      console.error("Error adding public holiday", error);
      handleAlert(
        true,
        "error",
        error?.response?.data?.message || "Error adding public holiday"
      );
    },
  });
  const getHoliday = async () => {
    const orgId = id ? id : organisationId;
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/holiday/get/${orgId}`
    );
    return response.data.holidays;
  };

  const { data } = useQuery({
    queryKey: ["getHoliday", organisationId],
    queryFn: getHoliday,
    onError: (error) => {
      console.error("Error getting public holiday", error);
      // handleAlert(
      //   true,
      //   "error",
      //   error?.response?.data?.message || "Error getting public holiday"
      // );
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const getLocation = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/location/getOrganizationLocations/${organisationId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data.locationsData;
  };

  const { data: locations } = useQuery({
    queryKey: ["getLocations", organisationId],
    queryFn: getLocation,
    onError: (error) => {
      console.error("Error getting locations", error);
      // handleAlert(
      //   true,
      //   "error",
      //   error?.response?.data?.message || "Error getting locations"
      // );
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const editHoliday = async ({ selectedHolidayId, onClose, data }) => {
    const response = await axios.patch(
      `${process.env.REACT_APP_API}/route/holiday/update/${selectedHolidayId}`,
      data
    );
    return response.data;
  };

  const { mutate: editPublicHoliday } = useMutation(editHoliday, {
    onSuccess: async (data, { onClose }) => {
      console.log("Public Holiday Updated");
      onClose();
      await queryClient.invalidateQueries(["getHoliday"]);
    },
    onError: (error) => {
      console.error("Error updating public holiday", error);
      handleAlert(
        true,
        "error",
        error?.response?.data?.message || "Error updating public holiday"
      );
    },
  });

  const deleteHoliday = async ({ selectedHolidayId }) => {
    const response = await axios.delete(
      `${process.env.REACT_APP_API}/route/holiday/delete/${selectedHolidayId}`
    );
    return response.data;
  };

  const { mutate: deletePublicHoliday } = useMutation(deleteHoliday, {
    onSuccess: async (data) => {
      console.log("Public Holiday Deleted");
      await queryClient.invalidateQueries(["getHoliday"]);
    },
    onError: (error) => {
      console.error("Error deleting public holiday", error);
      handleAlert(
        true,
        "error",
        error?.response?.data?.message || "Error deleting public holiday"
      );
    },
  });
  return {
    addPublicHoliday,
    data,
    locations,
    editPublicHoliday,
    deletePublicHoliday,
  };
};

export default usePublicHoliday;

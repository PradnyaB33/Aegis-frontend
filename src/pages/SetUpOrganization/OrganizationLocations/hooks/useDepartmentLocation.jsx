import axios from "axios";
import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import useGetUser from "../../../../hooks/Token/useUser";
import { TestContext } from "../../../../State/Function/Main";

const useDepartmentLocation = () => {
  const { organisationId } = useParams();
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();

  const { authToken } = useGetUser();
  const getDepartmentLocation = async () => {
    console.log("orgnisationId", organisationId);
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/location/getOrganizationLocations/${organisationId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    console.log(
      `🚀 ~ file: useDepartmentLocation.jsx:18 ~ response:`,
      response
    );

    return response?.data?.locationsData;
  };

  const { data: locationList } = useQuery({
    queryKey: [`departmentLocation-${organisationId}`],
    queryFn: getDepartmentLocation,
    onError: (error) => {
      console.log("error", error);
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const addLocation = async ({ data, onClose }) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API}/route/location/addOrganizationLocations`,
      data,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };

  const { mutate: addLocationMutation } = useMutation({
    mutationFn: addLocation,
    onSuccess: async (data, { onClose }) => {
      await queryClient.invalidateQueries([
        `departmentLocation-${organisationId}`,
      ]);
      handleAlert(true, "success", "Location added successfully");
      onClose();
    },
    onError: (error) => {
      console.log("error", error);
      handleAlert(
        true,
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    },
  });

  const deleteLocation = async ({ locationId, onClose }) => {
    const response = await axios.delete(
      `${process.env.REACT_APP_API}/route/location/deleteOrganizationLocations/${locationId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };

  const { mutate: deleteLocationMutation } = useMutation({
    mutationFn: deleteLocation,
    onSuccess: async (data, { onClose }) => {
      console.log("Location deleted successfully", data);
      await queryClient.invalidateQueries([
        `departmentLocation-${organisationId}`,
      ]);
      onClose();
      handleAlert(true, "success", "Location deleted successfully");
    },
    onError: (error) => {
      console.log("error", error);
      handleAlert(
        true,
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    },
  });

  const updateLocation = async ({ data, onClose, locationId }) => {
    const response = await axios.put(
      `${process.env.REACT_APP_API}/route/location/updateOrganizationLocations/${locationId}`,
      data,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };

  const { mutate: updateLocationMutation } = useMutation({
    mutationFn: updateLocation,
    onSuccess: async (data, { onClose }) => {
      console.log("Location updated successfully", data);
      await queryClient.invalidateQueries([
        `departmentLocation-${organisationId}`,
      ]);
      handleAlert(true, "success", "Location updated successfully");
      onClose();
    },
    onError: (error) => {
      console.log("error", error);
      handleAlert(
        true,
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    },
  });

  return {
    locationList,
    addLocationMutation,
    deleteLocationMutation,
    updateLocationMutation,
  };
};

export default useDepartmentLocation;

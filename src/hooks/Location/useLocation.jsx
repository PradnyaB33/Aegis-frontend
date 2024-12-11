import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import useAuthToken from "../Token/useAuth";

const useLocationStore = () => {
  const [start, setStart] = useState(false);
  const [count, setCount] = useState(0);
  const authToken = useAuthToken();

  useEffect(() => {
    async function fetchData2() {
      await axios.get(`${process.env.REACT_APP_API}/route/punch/getPunch/1`, {
        headers: {
          Authorization: authToken,
        },
      });
    }
    fetchData2();
    // eslint-disable-next-line
  }, [authToken]);
  const fetchLocationData = async () => {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });
    });

    const { latitude, longitude, speed, accuracy } = position.coords;
    const payload = {
      locations: [
        {
          lat: latitude,
          lng: longitude,
          time: new Date(),
        },
      ],
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/punch/create/test`,
        payload,
        {
          headers: { Authorization: authToken },
        }
      );
      if (response.status === 200) {
        setCount((prevCount) => prevCount + 1);
      } else {
        console.error("Failed to post data to the backend");
      }
    } catch (error) {
      console.error("Error posting data to the backend", error);
    }

    return {
      latitude,
      longitude,
      speed,
      accuracy,
    };
  };

  const { data, refetch } = useQuery("locationData", fetchLocationData, {
    refetchInterval: 10000, // Cache is considered stale after 20 seconds
    refetchOnMount: true, // Disable automatic refetching on mount
    enabled: start,
  });

  const startLocationTracking = () => {
    refetch();
    setStart(true);
  };

  const postEndTime = async () => {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });
    });

    const { latitude, longitude } = position.coords;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/punch/getone`,
        { headers: { Authorization: authToken } }
      );

      const existingData = response.data.punch;
      console.log(existingData);
      const ID = existingData._id;

      // Check if the existing data already has an 'end' field
      if (!existingData.end) {
        // Create a copy of existingData to avoid mutations
        const updatedData = { ...existingData };

        // Set the 'end' field to the current date
        updatedData.end = new Date();

        // Append the new location to the existing locations array
        updatedData.locations.push({
          lat: latitude,
          lng: longitude,
          time: new Date(),
        });

        // Update the existing document with the modified data
        await axios.patch(
          `${process.env.REACT_APP_API}/route/punch/update/${ID}`,
          updatedData, // Send the updated copy
          {
            headers: { Authorization: authToken },
          }
        );

        setStart(false); // Stop location tracking after punching out
      } else {
        // If the 'end' field is already present, create a new document
        const payload = {
          start: new Date(), // Start a new punch in
          locations: [
            {
              lat: latitude,
              lng: longitude,
              time: new Date(),
            },
          ],
        };

        // Send a POST request to create a new punch document
        await axios.post(
          `${process.env.REACT_APP_API}/route/punch/create`,
          payload,
          {
            headers: { Authorization: authToken },
          }
        );

        // Handle response if needed

        setStart(false); // Stop location tracking after punching out
      }
    } catch (error) {
      console.error("Error updating punch data", error);
      setStart(false);
    }
  };

  const stopLocationTracking = async () => {
    setCount(0);
    await postEndTime();
  };

  return {
    start,
    data,
    count,
    startLocationTracking,
    stopLocationTracking,
  };
};

export default useLocationStore;

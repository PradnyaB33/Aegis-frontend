import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "react-query";
import { UseContext } from "../../../State/UseState/UseContext";
import { useJsApiLoader } from "@react-google-maps/api";
import MapComponent from "../../Remote-Punch-Info/Map-Container";

const ShowCompletetaskInMap = () => {
  const { punchObjectId } = useParams();
  const Id = punchObjectId;

  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { data } = useQuery(`remote-punching-${Id}-post`, async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/punch-entry/${Id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  });
  console.log("data", data);

  const { isLoaded } = useJsApiLoader({
    id: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  return (
    <div>
      {punchObjectId && <MapComponent {...{ isLoaded, punchObjectId }} />}
    </div>
  );
};

export default ShowCompletetaskInMap;

// const { Id } = useParams();
// console.log("assas", Id);

import { CircleF, GoogleMap, MarkerF, PolylineF } from "@react-google-maps/api";
import React from "react";
import useGetGeoFencing from "../../Remote-Punching-Employee/useGetGeoFencing";

const MapComponent = ({ isLoaded, data, locationArray }) => {
  const { employeeGeoArea } = useGetGeoFencing();

  return isLoaded ? (
    <GoogleMap
      key={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      mapContainerStyle={{
        width: "100%",
        height: "91.8vh",
      }}
      center={{ lat: data?.latitude, lng: data?.longitude }}
      zoom={18}
    >
      <MarkerF
        position={{ lat: data?.latitude, lng: data?.longitude }}
        label={"Start Position"}
      />
      {locationArray?.length > 0 && (
        <PolylineF
          path={locationArray}
          options={{ strokeColor: "#7a3eff", strokeWeight: 5 }}
        />
      )}
      {locationArray?.length > 0 && (
        <MarkerF
          position={{
            lat: locationArray[0]?.latitude,
            lng: locationArray[0]?.longitude,
          }}
          label={"Starting Position"}
        />
      )}
      {employeeGeoArea?.area?.map((area) => {
        return (
          <CircleF
            center={{
              lat: area?.center?.coordinates[0],
              lng: area?.center?.coordinates[1],
            }}
            radius={area?.radius}
            options={{
              strokeColor: "#0033ff",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#0033ff",
              fillOpacity: 0.35,
            }}
          />
        );
      })}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default MapComponent;

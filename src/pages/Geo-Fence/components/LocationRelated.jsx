// import { Button } from "@mui/material";
import {
  CircleF,
  DrawingManagerF,
  GoogleMap,
  MarkerF,
} from "@react-google-maps/api";
import React from "react";
import BasicButton from "../../../components/BasicButton";
import useGeoFencingMap from "./useGeoFencingMap";

const LocationRelated = ({ watch, data, onClose, circleId, circleData,zoneId,zoneData }) => {
  const {
    circleRef,
    circleComplete,
    mapRef,
    drawingRef,
    circle,
    addCircleMutate,
  } = useGeoFencingMap({
    watch,
    onClose,
  });

  return (
    <div className="h-full w-full flex flex-col items-center">
      <GoogleMap
        mapContainerClassName="h-[400px] w-full rounded-lg shadow-lg relative"
        center={data}
        options={{
          disableDefaultUI: true,
        }}
        onLoad={(map) => {
          mapRef.current = map;
        }}
        zoom={12}
      >
        {watch("location") !== undefined &&
          watch("location")?.position !== undefined && (
            <MarkerF position={watch("location")?.position} />
          )}
        {circle === null && (
          <DrawingManagerF
            drawingMode={null}
            onCircleComplete={circleComplete}
            options={{
              drawingControlOptions: {
                position: window.google.maps.ControlPosition.TOP_CENTER,
                drawingModes: ["circle"],
              },
              circleOptions: {
                fillColor: `#2198f3`,
                strokeColor: "#2196f3",
                fillOpacity: 0.5,
                strokeWeight: 2,
                clickable: true,
                editable: false,
                zIndex: 1,
                draggable: true,
              },
              drawingControl: true,
            }}
            onLoad={(drawingManager) => {
              drawingRef.current = drawingManager;
            }}
          />
        )}
        {
          zoneId ? (
            <CircleF
            center={{
              lat: zoneData?.center?.lat,
              lng: zoneData?.center?.lng,
            }}
            radius={zoneData?.radius}
            options={{
              strokeColor: "#ff5733",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#ff5733",
              fillOpacity: 0.35,
            }}
          />
          ) : (
null
          )
        }
        {circleId ? (
          <CircleF
            center={{
              lat: circleData?.center?.coordinates[0],
              lng: circleData?.center?.coordinates[1],
            }}
            radius={circleData?.radius}
            options={{
              strokeColor: "#0033ff",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#0033ff",
              fillOpacity: 0.35,
            }}
          />
        ) : (
          circle && (
            <CircleF
              center={circle?.center}
              radius={circle?.radius}
              options={{
                fillColor: `#2198f3`,
                strokeColor: "#2196f3",
                fillOpacity: 0.5,
                strokeWeight: 2,
                clickable: true,
                editable: false,
                zIndex: 1,
                draggable: true,
              }}
              onCenterChanged={(center) => {
                console.log(
                  "center",
                  circleRef.current?.center?.lat(),
                  circleRef.current?.center?.lng(),
                  circleRef.current?.radius
                );
                console.log(
                  "getCenter",
                  circle?.center?.center?.lat(),
                  circle?.center?.center?.lng()
                );
              }}
              onRadiusChanged={(radius) => {
                console.log("radius", radius);
              }}
              onLoad={(circle) => {
                circleRef.current = circle;
              }}
            />
          )
        )}
      </GoogleMap>
      { circleId  ? null : (
        <BasicButton
          className="mt-2"
          title="Add"
          onClick={addCircleMutate}
          disabled={circle?.center?.lat === undefined}
          variant="contained"
        />
      )}
    </div>
  );
};

export default LocationRelated;

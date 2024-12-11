import { CircleF, GoogleMap, PolylineF, OverlayView } from "@react-google-maps/api";
import React, { useState, useEffect } from "react";
import useGeoFencingCircle from "./useGeoFencingCircle";

const MapComponent = ({ isLoaded, data, locationArray }) => {
    const { employeeGeoArea } = useGeoFencingCircle();
    const [currentLocation, setCurrentLocation] = useState(null);

    useEffect(() => {
        let watchId;
        if (navigator.geolocation) {
            // Watch user's location
            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => console.error("Error fetching location:", error),
                {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 10000,
                }
            );
        }

        // Cleanup watcher when component unmounts
        return () => {
            if (watchId !== undefined) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, []);

    return isLoaded ? (
        <GoogleMap
            key={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            mapContainerStyle={{
                width: "100%",
                height: "91.8vh",
            }}
            center={currentLocation || { lat: data?.latitude, lng: data?.longitude }}
            zoom={18}
            options={{
                mapTypeControl: false,
                zoomControl: true,
                streetViewControl: false,
                fullscreenControl: false,
                clickableIcons: true,
                myLocationEnabled: true,
            }}
        >
            {/* Marker for the initial start position */}
            {/* <MarkerF
                position={{ lat: data?.latitude, lng: data?.longitude }}
                label={"Start Position"}
            /> */}

            {/* Polyline for location array path */}
            {locationArray?.length > 0 && (
                <PolylineF
                    path={locationArray}
                    options={{ strokeColor: "#7a3eff", strokeWeight: 5 }}
                />
            )}

            {/* Marker for the starting position in the path */}
            {/* {locationArray?.length > 0 && (
                <MarkerF
                    position={{
                        lat: locationArray[0]?.latitude,
                        lng: locationArray[0]?.longitude,
                    }}
                    label={"Starting Position"}
                />
            )} */}

            {/* Circles for geofencing areas */}
            {employeeGeoArea?.area?.map((area) => (
                <CircleF
                    key={`${area.center.coordinates[0]}-${area.center.coordinates[1]}`}
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
            ))}

            {/* Live location marker */}
            {currentLocation && (
                <OverlayView
                    position={currentLocation}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                    <div
                        style={{
                            width: "15px",
                            height: "15px",
                            backgroundColor: "#0000FF",
                            borderRadius: "50%",
                            boxShadow: "0 0 10px rgba(0, 0, 255, 0.5)",
                            transform: "translate(-50%, -50%)",
                        }}
                    ></div>
                </OverlayView>
            )}
        </GoogleMap>
    ) : (
        <></>
    );
};

export default MapComponent;

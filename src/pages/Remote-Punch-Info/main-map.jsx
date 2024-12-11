// import { GoogleMap, Marker, Polyline, CircleF, InfoWindow } from "@react-google-maps/api";
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const MainMap = ({ punchData, isLoaded, geofencingCircleData, taskData }) => {
//   const [waypoints, setWaypoints] = useState([]);
//   const [acceptedByLocations, setAcceptedByLocations] = useState([]);
//   const [selectedLocation, setSelectedLocation] = useState(null);

//   useEffect(() => {
//     if (punchData && punchData.data && punchData.data.length > 0) {
//       const newWaypoints = punchData.data.map((punch) => ({
//         lat: parseFloat(punch.lat),
//         lng: parseFloat(punch.lng),
//       }));
//       setWaypoints(newWaypoints);
//     } else {
//       setWaypoints([]);
//     }
//   }, [punchData]);

//   useEffect(() => {
//     if (taskData && taskData.length > 0) {
//       const locations = taskData.flatMap((task) =>
//         task.taskName.flatMap((taskName) =>
//           taskName.acceptedBy.map(async (entry) => {
//             const locationName = await getLocationName(entry.location.lat, entry.location.long);
//             return {
//               lat: entry.location.lat,
//               lng: entry.location.long,
//               comments: entry.comments,
//               locationName: locationName,
//             };
//           })
//         )
//       );

//       // Since locations is now an array of promises, we need to resolve them
//       Promise.all(locations).then((resolvedLocations) => {
//         setAcceptedByLocations(resolvedLocations);
//       });
//     } else {
//       setAcceptedByLocations([]);
//     }
//   }, [taskData]);

//   // Function to fetch the location name using Google Maps Geocoding API
//   const getLocationName = async (lat, lng) => {
//     try {
//       const response = await axios.get(
//         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
//       );
//       if (response.data.results.length > 0) {
//         return response.data.results[0].formatted_address;
//       } else {
//         return "Unknown location";
//       }
//     } catch (error) {
//       console.error("Error fetching location name:", error);
//       return "Unknown location";
//     }
//   };

//   // Custom InfoWindow component
//   const CustomInfoWindow = ({ location }) => (
//     <div style={{ width: "500px", maxHeight: "150px", overflowY: "auto", padding: "10px" }}>
//       <p><strong style={{ fontSize: "18px", fontWeight: "600px" }}>Comments:</strong> {location.comments}</p>
//       <p><strong style={{ fontSize: "18px", fontWeight: "600px" }}>Location:</strong> {location.locationName}</p>
//     </div>
//   );


//   return (
//     <GoogleMap
//       key={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
//       mapContainerStyle={{
//         width: "100%",
//         height: "91.8vh",
//       }}
//       center={{
//         lat: waypoints[0]?.lat,
//         lng: waypoints[0]?.lng,
//       }}
//       zoom={18}
//     >
//       {isLoaded && (
//         <>
//           {waypoints.length > 0 && (
//             <>
//               <Marker
//                 position={{
//                   lat: waypoints[0]?.lat,
//                   lng: waypoints[0]?.lng,
//                 }}
//                 label={"Source"}
//               />
//               {/* <Polyline
//                 path={waypoints}
//                 options={{ strokeColor: "#7a3eff", strokeWeight: 5 }}
//               /> */}
//               <Polyline
//                 path={waypoints}
//                 options={{
//                   strokeColor: "blue",
//                   strokeWeight: 4,
//                   // icons: [
//                   //   {
//                   //     // icon: {
//                   //     //   path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
//                   //     //   scale: 3,
//                   //     //   strokeColor: "#ff0000",
//                   //     // },
//                   //     offset: "100%",
//                   //     repeat: "50px",
//                   //   },
//                   // ],
//                 }}
//               />
//               <Marker
//                 position={{
//                   lat: waypoints[waypoints.length - 1]?.lat,
//                   lng: waypoints[waypoints.length - 1]?.lng,
//                 }}
//                 label={"End Position"}
//               />
//             </>
//           )}


//           {acceptedByLocations.map((location, index) => (
//             <Marker
//               key={index}
//               position={{
//                 lat: location?.lat,
//                 lng: location?.lng,
//               }}
//               icon={{
//                 url: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
//               }}
//               label={"Accepted"}
//               onMouseOver={() => setSelectedLocation(location)} // Show tooltip on hover
//             >
//               {/* InfoWindow appears only when the marker is hovered over */}
//               {selectedLocation && selectedLocation.lat === location.lat && selectedLocation.lng === location.lng && (
//                 <InfoWindow
//                   position={{
//                     lat: location?.lat,
//                     lng: location?.lng,
//                   }}
//                   onCloseClick={() => setSelectedLocation(null)}
//                 >
//                   <CustomInfoWindow location={location} />
//                 </InfoWindow>
//               )}
//             </Marker>
//           ))}
//           {/* Add CircleF component to show the geofencing circle */}
//           {geofencingCircleData && (
//             <CircleF
//               center={{
//                 lat: geofencingCircleData?.center?.coordinates[0],
//                 lng: geofencingCircleData?.center?.coordinates[1],
//               }}
//               radius={geofencingCircleData?.radius}
//               options={{
//                 strokeColor: "#0033ff",
//                 strokeOpacity: 0.8,
//                 strokeWeight: 2,
//                 fillColor: "#0033ff",
//                 fillOpacity: 0.35,
//               }}
//             />
//           )}
//         </>
//       )}
//     </GoogleMap>
//   );
// };

// export default MainMap;




import { GoogleMap, Marker, Polyline, CircleF, InfoWindow } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";
import axios from "axios";

const MainMap = ({ punchData, isLoaded, geofencingCircleData, taskData }) => {
  const [waypoints, setWaypoints] = useState([]);
  const [acceptedByLocations, setAcceptedByLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [totalDistance, setTotalDistance] = useState(0);

  useEffect(() => {
    if (punchData && punchData.data && punchData.data.length > 0) {
      const newWaypoints = punchData.data.map((punch) => ({
        lat: parseFloat(punch.lat),
        lng: parseFloat(punch.lng),
      }));
      setWaypoints(newWaypoints);
    } else {
      setWaypoints([]);
    }
  }, [punchData]);

  useEffect(() => {
    if (taskData && taskData.length > 0) {
      const locations = taskData.flatMap((task) =>
        task.taskName.flatMap((taskName) =>
          taskName.acceptedBy.map(async (entry) => {
            const locationName = await getLocationName(entry.location.lat, entry.location.long);
            return {
              lat: entry.location.lat,
              lng: entry.location.long,
              comments: entry.comments,
              locationName: locationName,
            };
          })
        )
      );

      // Since locations is now an array of promises, we need to resolve them
      Promise.all(locations).then((resolvedLocations) => {
        setAcceptedByLocations(resolvedLocations);
      });
    } else {
      setAcceptedByLocations([]);
    }
  }, [taskData]);

  // Function to fetch the location name using Google Maps Geocoding API
  const getLocationName = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
      );
      if (response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      } else {
        return "Unknown location";
      }
    } catch (error) {
      console.error("Error fetching location name:", error);
      return "Unknown location";
    }
  };

  // Function to calculate Haversine distance
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (angle) => (angle * Math.PI) / 180;

    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  // Calculate total Polyline distance
  useEffect(() => {
    if (waypoints.length > 1) {
      let distance = 0;

      for (let i = 0; i < waypoints.length - 1; i++) {
        distance += haversineDistance(
          waypoints[i].lat,
          waypoints[i].lng,
          waypoints[i + 1].lat,
          waypoints[i + 1].lng
        );
      }

      setTotalDistance(distance.toFixed(2));
    }
  }, [waypoints]);

  // Custom InfoWindow component
  const CustomInfoWindow = ({ location }) => (
    <div style={{ width: "500px", maxHeight: "150px", overflowY: "auto", padding: "10px" }}>
      <p><strong style={{ fontSize: "18px", fontWeight: "600px" }}>Comments:</strong> {location.comments}</p>
      <p><strong style={{ fontSize: "18px", fontWeight: "600px" }}>Location:</strong> {location.locationName}</p>
    </div>
  );

  return (
    <div>
      <div>Total Distance: {totalDistance} km</div>
      <GoogleMap
        key={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        mapContainerStyle={{
          width: "100%",
          height: "91.8vh",
        }}
        center={{
          lat: waypoints[0]?.lat,
          lng: waypoints[0]?.lng,
        }}
        zoom={18}
      >
        {isLoaded && (
          <>
            {waypoints.length > 0 && (
              <>
                <Marker
                  position={{
                    lat: waypoints[0]?.lat,
                    lng: waypoints[0]?.lng,
                  }}
                  label={"Source"}
                />
                <Polyline
                  path={waypoints}
                  options={{
                    strokeColor: "green",
                    strokeWeight: 4,
                  }}
                />
                <Marker
                  position={{
                    lat: waypoints[waypoints.length - 1]?.lat,
                    lng: waypoints[waypoints.length - 1]?.lng,
                  }}
                  label={"End Position"}
                />
              </>
            )}

            {acceptedByLocations.map((location, index) => (
              <Marker
                key={index}
                position={{
                  lat: location?.lat,
                  lng: location?.lng,
                }}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
                }}
                label={"Accepted"}
                onMouseOver={() => setSelectedLocation(location)}
              >
                {selectedLocation && selectedLocation.lat === location.lat && selectedLocation.lng === location.lng && (
                  <InfoWindow
                    position={{
                      lat: location?.lat,
                      lng: location?.lng,
                    }}
                    onCloseClick={() => setSelectedLocation(null)}
                  >
                    <CustomInfoWindow location={location} />
                  </InfoWindow>
                )}
              </Marker>
            ))}
            {geofencingCircleData && (
              <CircleF
                center={{
                  lat: geofencingCircleData?.center?.coordinates[0],
                  lng: geofencingCircleData?.center?.coordinates[1],
                }}
                radius={geofencingCircleData?.radius}
                options={{
                  strokeColor: "#0033ff",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: "#0033ff",
                  fillOpacity: 0.35,
                }}
              />
            )}
          </>
        )}
      </GoogleMap>
    </div>
  );
};

export default MainMap;

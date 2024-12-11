// import React, { useEffect, useState } from "react";
// import {
//   GoogleMap,
//   MarkerF,
//   PolylineF
// } from "@react-google-maps/api";
// import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";

// const MapComponent = ({ isLoaded, data, locationArray }) => {
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [directions, setDirections] = useState(null);
//   const [coveredPath, setCoveredPath] = useState([]);
//   const [totalDistance, setTotalDistance] = useState(0);
//   const { setDistance } = useSelfieStore();
  
//   console.log(totalDistance);
  
//   // Haversine formula
//   const calculateDistance = (point1, point2) => {
//     const toRadians = (degrees) => (degrees * Math.PI) / 180;
//     const R = 6371; // Earth's radius in km

//     const lat1 = toRadians(point1.lat);
//     const lon1 = toRadians(point1.lng);
//     const lat2 = toRadians(point2.lat);
//     const lon2 = toRadians(point2.lng);

//     const dLat = lat2 - lat1;
//     const dLon = lon2 - lon1;

//     const a =
//       Math.sin(dLat / 2) ** 2 +
//       Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     return R * c; // Distance in km
//   };

//   useEffect(() => {
//     const requestLocation = () => {
//       if (navigator.geolocation) {
//         navigator.geolocation.watchPosition(
//           (position) => {
//             const newLocation = {
//               latitude: position.coords.latitude,
//               longitude: position.coords.longitude,
//             };

//             if (
//               Number.isFinite(newLocation.latitude) &&
//               Number.isFinite(newLocation.longitude)
//             ) {
//               setCurrentLocation(newLocation);

//               setCoveredPath((prevPath) => {
//                 const updatedPath = [
//                   ...prevPath,
//                   { lat: newLocation.latitude, lng: newLocation.longitude },
//                 ];

//                 if (updatedPath.length > 1) {
//                   const lastPoint = updatedPath[updatedPath.length - 2];
//                   const newPoint = updatedPath[updatedPath.length - 1];
//                   const distance = calculateDistance(lastPoint, newPoint);
//                   setTotalDistance((prevDistance) => {
//                     const newTotalDistance = prevDistance + distance;
//                     // Update the Zustand store with the new total distance
//                     setDistance(newTotalDistance);  // Storing distance in the Zustand store
//                     return newTotalDistance;
//                   });
//                 }

//                 return updatedPath;
//               });
//             }
//           },
//           (error) => {
//             console.error("Error getting location", error);
//           },
//           { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
//         );
//       } else {
//         console.error("Geolocation not supported");
//       }
//     };

//     requestLocation();
//   }, [setDistance]);

//   useEffect(() => {
//     if (locationArray?.length > 1) {
//       const fetchDirections = async () => {
//         const waypoints = locationArray.slice(1, -1).map((loc) => ({
//           location: { lat: loc.latitude, lng: loc.longitude },
//           stopover: true,
//         }));

//         const origin = locationArray[0];
//         const destination = locationArray[locationArray.length - 1];

//         const directionsService = new window.google.maps.DirectionsService();

//         directionsService.route(
//           {
//             origin: { lat: origin.latitude, lng: origin.longitude },
//             destination: { lat: destination.latitude, lng: destination.longitude },
//             waypoints: waypoints,
//             travelMode: window.google.maps.TravelMode.DRIVING,
//           },
//           (result, status) => {
//             if (status === window.google.maps.DirectionsStatus.OK) {
//               setDirections(result);
//             } else {
//               console.error(`Error fetching directions ${status}`);
//             }
//           }
//         );
//       };

//       fetchDirections();
//     }
//   }, [locationArray]);

//   return isLoaded ? (
//     <GoogleMap
//       key={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
//       mapContainerStyle={{
//         width: "100%",
//         height: "91.8vh",
//       }}
//       center={
//         currentLocation
//           ? { lat: currentLocation.latitude, lng: currentLocation.longitude }
//           : { lat: data?.latitude, lng: data?.longitude }
//       }
//       zoom={18}
//       options={{
//         fullscreenControl: true,
//         mapTypeControl: true,
//         streetViewControl: true,
//       }}
//     >
//       {currentLocation &&
//         Number.isFinite(currentLocation.latitude) &&
//         Number.isFinite(currentLocation.longitude) && (
//           <MarkerF
//             position={{
//               lat: currentLocation.latitude,
//               lng: currentLocation.longitude,
//             }}
//             label={"Current Position"}
//           />
//         )}

//       {coveredPath.length > 1 && (
//         <PolylineF
//           path={coveredPath.filter(
//             (point) =>
//               Number.isFinite(point.lat) && Number.isFinite(point.lng)
//           )}
//           options={{ strokeColor: "#00FF00", strokeWeight: 5 }}
//         />
//       )}

//       {directions ? (
//         <PolylineF
//           path={directions.routes[0].overview_path.map((point) => ({
//             lat: point.lat(),
//             lng: point.lng(),
//           }))}
//           options={{ strokeColor: "#109be6", strokeWeight: 5 }}
//         />
//       ) : (
//         locationArray?.length > 0 && (
//           <PolylineF
//             path={locationArray.map((loc) => ({
//               lat: loc.latitude,
//               lng: loc.longitude,
//             }))}
//             options={{ strokeColor: "#109be6", strokeWeight: 5 }}
//           />
//         )
//       )}

//     </GoogleMap>
//   ) : (
//     <></>
//   );
// };

// export default MapComponent;





































import React, { useEffect, useState } from "react";
import { GoogleMap, MarkerF, PolylineF } from "@react-google-maps/api";
import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";

const MapComponent = ({ isLoaded, data, locationArray }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [coveredPath, setCoveredPath] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const { setDistance, start } = useSelfieStore(); // Get `start` state
console.log(locationArray,totalDistance);

  // Haversine formula
  const calculateDistance = (point1, point2) => {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const R = 6371; // Earth's radius in km

    const lat1 = toRadians(point1.lat);
    const lon1 = toRadians(point1.lng);
    const lat2 = toRadians(point2.lat);
    const lon2 = toRadians(point2.lng);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in km
  };

  useEffect(() => {
    const requestLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            const newLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };

            if (
              Number.isFinite(newLocation.latitude) &&
              Number.isFinite(newLocation.longitude)
            ) {
              setCurrentLocation(newLocation);

              setCoveredPath((prevPath) => {
                const updatedPath = [
                  ...prevPath,
                  { lat: newLocation.latitude, lng: newLocation.longitude },
                ];

                if (updatedPath.length > 1) {
                  const lastPoint = updatedPath[updatedPath.length - 2];
                  const newPoint = updatedPath[updatedPath.length - 1];
                  const distance = calculateDistance(lastPoint, newPoint);
                  setTotalDistance((prevDistance) => {
                    const newTotalDistance = prevDistance + distance;
                    setDistance(newTotalDistance); // Update Zustand store
                    return newTotalDistance;
                  });
                }

                return updatedPath;
              });
            }
          },
          (error) => {
            console.error("Error getting location", error);
          },
          { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
        );
      } else {
        console.error("Geolocation not supported");
      }
    };

    requestLocation();
  }, [setDistance]);

  return isLoaded ? (
    <GoogleMap
      key={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      mapContainerStyle={{
        width: "100%",
        height: "91.8vh",
      }}
      center={
        currentLocation
          ? { lat: currentLocation.latitude, lng: currentLocation.longitude }
          : { lat: data?.latitude, lng: data?.longitude }
      }
      zoom={18}
      options={{
        fullscreenControl: true,
        mapTypeControl: true,
        streetViewControl: true,
      }}
    >
      {currentLocation &&
        Number.isFinite(currentLocation.latitude) &&
        Number.isFinite(currentLocation.longitude) && (
          <MarkerF
            position={{
              lat: currentLocation.latitude,
              lng: currentLocation.longitude,
            }}
            label={"Current Position"}
          />
        )}

      {/* Render polyline only if remote punching has started */}
      {start && coveredPath.length > 1 && (
        <PolylineF
          path={coveredPath.filter(
            (point) =>
              Number.isFinite(point.lat) && Number.isFinite(point.lng)
          )}
          options={{ strokeColor: "#00FF00", strokeWeight: 5 }}
        />
      )}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default MapComponent;

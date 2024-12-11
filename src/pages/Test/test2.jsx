import "leaflet/dist/leaflet.css";
import React from "react";

const TrackingMap = () => {
  // const [map, setMap] = useState(null);
  // const [polyline, setPolyline] = useState(null);
  // const [path, setPath] = useState([
  //   { lat: 28.55108, lng: 77.26913 },
  //   { lat: 28.55106, lng: 77.26906 },
  //   { lat: 28.55105, lng: 77.26897 },
  //   { lat: 28.55101, lng: 77.26872 },
  //   { lat: 28.55099, lng: 77.26849 },
  //   { lat: 28.55097, lng: 77.26831 },
  //   { lat: 28.55093, lng: 77.26794 },
  //   { lat: 28.55089, lng: 77.2676 },
  //   { lat: 28.55123, lng: 77.26756 },
  //   { lat: 28.55145, lng: 77.26758 },
  //   { lat: 28.55168, lng: 77.26758 },
  //   { lat: 28.55175, lng: 77.26759 },
  //   { lat: 28.55177, lng: 77.26755 },
  //   { lat: 28.55179, lng: 77.26753 },
  // ]);

  // useEffect(() => {
  //   const mapInstance = L.map("map").setView(path[0], 14);

  //   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  //     attribution: "&copy; OpenStreetMap contributors",
  //   }).addTo(mapInstance);

  //   const polylineInstance = L.polyline(path, {
  //     color: "#FF0000",
  //     weight: 2,
  //   }).addTo(mapInstance);

  //   setMap(mapInstance);
  //   setPolyline(polylineInstance);

  //   // Cleanup on component unmount
  //   return () => {
  //     if (mapInstance) {
  //       mapInstance.remove();
  //     }
  //   };
  //   // eslint-disable-next-line
  // }, [path]);

  // Simulate tracking by updating the path
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setPath((prevPath) => [
  //       ...prevPath,
  //       {
  //         lat: prevPath[prevPath.length - 1].lat + 0.0001,
  //         lng: prevPath[prevPath.length - 1].lng + 0.0001,
  //       },
  //     ]);

  //     if (polyline) {
  //       const bounds = L.latLngBounds(path);
  //       map.fitBounds(bounds);
  //       polyline.setLatLngs(path);
  //     }
  //   }, 5000);

  //   return () => clearInterval(intervalId);
  // }, [path, polyline, map]);

  return <div id="map" style={{ height: "400px", width: "100%" }}></div>;
};

export default TrackingMap;

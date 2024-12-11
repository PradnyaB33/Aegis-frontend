import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

// Custom hook to manage intervals
function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default function Test() {
  const [watchId, setWatchId] = useState(null);
  let map, polyline, mappls; // Reference to the Google Map

  // Use useRef to store the latest location data without causing re-renders
  const latestLocationData = useRef({
    latitude: null,
    longitude: null,
    speed: null,
    accuracy: null,
  });

  const startWatching = () => {
    if ("geolocation" in navigator) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, speed, accuracy } = position.coords;

          // Update Google Map marker position
          if (map) {
            const currentPosition = new window.google.maps.LatLng(
              latitude,
              longitude
            );
            map.panTo(currentPosition);
          }

          // Update the latest location data
          latestLocationData.current = {
            latitude,
            longitude,
            speed,
            accuracy,
          };
        },
        (error) => {
          console.error(error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
      setWatchId(id);
    } else {
      console.error("Geolocation is not supported in this browser.");
    }
  };

  const stopWatching = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  const postDataToBackend = async () => {
    const { latitude, longitude, speed, accuracy } = latestLocationData.current;

    // Create the payload in the required format
    const payload = {
      start: new Date().toISOString(),
      locations: [
        {
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          time: new Date().toISOString(),
        },
      ],
      employeeId: "658bafedd4e82a4558961fa9", // Replace with the actual employee ID
    };

    try {
      // Make a POST request to the backend API using Axios
      const response = await axios.post(
        "http://localhost:4000/route/punch/create",
        payload
      );

      if (response.status === 200) {
        console.log("Data posted successfully");
      } else {
        console.error("Failed to post data to the backend");
      }
    } catch (error) {
      console.error("Error posting data to the backend", error);
    }
  };

  // Use the custom interval hook
  useInterval(() => {
    console.log("Posting data to the backend after 10 seconds");
    postDataToBackend();
  }, watchId ? 10000 : null);

  useEffect(() => {
    // Load Google Maps API script
    const script = document.createElement("script");
    script.src = `https://apis.mappls.com/advancedmaps/api/dfb06668ce660987cc7008f8175a6720/map_sdk?layer=vector&v=3.0&callback=initMap1`;
    script.async = true;
    script.onload = () => {
      mappls = window.mappls;
      initMap1();
    };
    document.head.appendChild(script);

    startWatching();

    return () => {
      stopWatching();
    };
    // eslint-disable-next-line
  }, []);

  function initMap1() {
    // Your map initialization logic
    map = new mappls.Map("map", {
      center: [28.544, 77.5454],
      zoomControl: true,
      location: true,
    });
    map.addListener("load", function () {
      var pts = [
        {
          lat: 28.55108,
          lng: 77.26913,
        },
        // ... (rest of your polyline points)
      ];
      polyline = new mappls.Polyline({
        map: map,
        paths: pts,
        strokeColor: "#333",
        strokeOpacity: 1.0,
        strokeWeight: 5,
        fitbounds: true,
        dasharray: [2, 2],
      });
    });
  }

  return (
    <div className="pt-32">
      <div>
        <strong>Latitude:</strong> {latestLocationData.current.latitude}
      </div>
      <div>
        <strong>Longitude:</strong> {latestLocationData.current.longitude}
      </div>
      <div>
        <strong>Speed:</strong> {latestLocationData.current.speed}
      </div>
      <div>
        <strong>Accuracy:</strong> {latestLocationData.current.accuracy}
      </div>
      <button onClick={startWatching}>Start Watching</button>
      <button onClick={stopWatching}>Stop Watching</button>

      <div id="map" style={{ height: "400px", width: "100%" }}></div>
    </div>
  );
}

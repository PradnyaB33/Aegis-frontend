import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import axios from "axios";
import React, { useEffect, useState } from "react";
import useGetUser from "../../hooks/Token/useUser";

const containerStyle = {
  width: "70%",
  height: "91.8vh",
  border: "2px solid gray",
};

const TestMap = () => {
  const [waypoints, setWaypoints] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const { authToken } = useGetUser();
  const [selectedDayLocation, setSelectedDayLocation] = useState();
  const [dates, setDates] = useState([]);
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [allEmp, setAllEmp] = useState([]);
  const [accepted1, setAccepted1] = useState(false);
  const [accepted2, setAccepted2] = useState(false);
  const [accepted3, setAccepted3] = useState(false);

  const fetchReportees = async () => {
    try {
      const resp = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/countofEmployees`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setAllEmp(resp.data.data[0].reporteeIds);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchReportees();
    // eslint-disable-next-line
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };

  const totalDistance = waypoints.reduce((total, waypoint, index) => {
    if (index < waypoints.length - 1) {
      const nextWaypoint = waypoints[index + 1];
      return (
        total +
        calculateDistance(
          waypoint.lat,
          waypoint.lng,
          nextWaypoint.lat,
          nextWaypoint.lng
        )
      );
    }
    return total;
  }, 0);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const smoothWaypoints = (waypoints, windowSize) => {
    return waypoints?.map((waypoint, index, array) => {
      const start = Math.max(0, index - windowSize + 1);
      const end = index + 1;
      const subset = array.slice(start, end);
      const smoothedLat =
        subset.reduce((sum, point) => sum + point.lat, 0) / subset.length;
      const smoothedLng =
        subset.reduce((sum, point) => sum + point.lng, 0) / subset.length;

      return {
        lat: smoothedLat,
        lng: smoothedLng,
      };
    });
  };

  const center = waypoints[0]
    ? {
        lat: parseFloat(waypoints[0]?.lat),
        lng: parseFloat(waypoints[0]?.lng),
      }
    : null;

  const destination =
    waypoints.length > 0
      ? {
          lat: waypoints[waypoints.length - 1]?.lat,
          lng: waypoints[waypoints.length - 1]?.lng,
        }
      : null;
  const handleChange = (event, type) => {
    if (type === "employee") {
      const employeeId = event.target.value;
      console.log(employeeId);
      setSelectedEmpId(employeeId);
      getEmp(employeeId);
    } else if (type === "date") {
      const date = event.target.value;
      console.log(date);
      setSelectedDate(date);
      getLocation(date);
    }
  };

  const getEmp = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/punch/getForEmp/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      setSelectedDayLocation(response?.data.punch.days);
      const formattedDates = response?.data.punch.days.map((data) => {
        const date = new Date(data.createdAt);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      });
      setDates(formattedDates);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getLocation = (id) => {
    const selectedPath = selectedDayLocation[id];
    console.log(selectedDayLocation);
    const newWaypoints = selectedPath.location.map((punch) => ({
      lat: parseFloat(punch?.lat),
      lng: parseFloat(punch?.lng),
    }));

    const smoothedWaypoints = smoothWaypoints(newWaypoints, 3);
    setWaypoints(smoothedWaypoints);
  };

  return (
    <div className="w-full flex justify-between">
      <div className=" z-50 p-10 flex flex-col mt-6 w-[30vw] bg-white gap-4 ">
        <div className="w-full bg-white">
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">
              Select Employee
            </InputLabel>
            <Select
              labelId="employee-select-label"
              id="employee-select"
              value={selectedEmpId}
              label="Select Employee"
              onChange={(event) => handleChange(event, "employee")}
            >
              {allEmp.length > 0 ? (
                allEmp.map((item, idx) => (
                  <MenuItem key={idx} value={item._id}>
                    {item.first_name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No Employee Found</MenuItem>
              )}
            </Select>
          </FormControl>
        </div>
        <div className="w-full bg-white">
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">Select Date</InputLabel>
            <Select
              labelId="date-select-label"
              id="date-select"
              value={selectedDate}
              label="Select Date"
              onChange={(event) => handleChange(event, "date")}
            >
              {dates.length > 0 ? (
                dates.map((date, idx) => (
                  <MenuItem key={idx} value={idx}>
                    {date}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No Data Found</MenuItem>
              )}
            </Select>
          </FormControl>
          <div>
            {waypoints?.length > 0 && (
              <p className=" z-[99999999]  mt-4 font-semibold">
                Total Distance Travelled : {totalDistance.toFixed(2)} Kilometers
              </p>
            )}
          </div>
          <div className="mt-4 w-[25vw] h-[30vh]">
            <div className="w-full shadow-md h-[130px] p-2">
              <div className="text-gray-400 font-semibold text-sm">
                05/03/2024
              </div>
              Employee1 has requested for remote punching from 09:30:45 AM to
              4:00:23 PM
              <div className="flex gap-3 mt-2">
                {accepted1 ? (
                  <Button color="success" size="small" variant="contained">
                    Approved
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => setAccepted1(true)}
                    >
                      Accept
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="w-full shadow-md h-[130px] p-2">
              <div className="text-gray-400 font-semibold text-sm">
                06/03/2024
              </div>
              Employee1 has requested for remote punching from 08:30:45 AM to
              10:10:01 AM
              <div className="flex gap-3 mt-2">
                {accepted2 ? (
                  <Button variant="contained" size="small" color="success">
                    Approved
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setAccepted2(true)}
                  >
                    Accept
                  </Button>
                )}
              </div>
            </div>
            <div className="w-full shadow-md h-[130px] p-2">
              <div className="text-gray-400 font-semibold text-sm">
                07/03/2024
              </div>
              Employee1 has requested for remote punching from 08:40:45 AM to
              1:10:01 PM
              <div className="flex gap-3 mt-2">
                {accepted3 ? (
                  <Button color="success" size="small" variant="contained">
                    Approved
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setAccepted3(true)}
                  >
                    Accept
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <GoogleMap
        googleMapsApiKey="AIzaSyDaA2q3L--j40-GgojdeFSJ4RywKGtFQ2k"
        mapContainerStyle={containerStyle}
        onLoad={() => console.log("Map loaded")}
        zoom={12}
        center={currentLocation}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {currentLocation && !waypoints?.length && (
          <Marker
            label={{ text: "current location" }}
            position={currentLocation}
          />
        )}

        {waypoints?.length > 0 && (
          <>
            <Marker
              label={{
                text: "Source",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
              position={center}
              icon={{
                url: "https://maps.gstatic.com/mapfiles/ms2/micons/blue.png",
                scaledSize: new window.google.maps.Size(40, 40),
                fillColor: "blue",
                fillOpacity: 1,
                strokeColor: "blue",
                strokeWeight: 2,
              }}
            />
            <Polyline
              path={waypoints}
              options={{ strokeColor: "#7a3eff", strokeWeight: 5 }}
            />
            <Marker
              label={{
                text: "Destination",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
              position={destination}
              icon={{
                url: "https://maps.gstatic.com/mapfiles/ms2/micons/red.png",
                scaledSize: new window.google.maps.Size(40, 40),
                fillColor: "red",
                fillOpacity: 1,
                strokeColor: "blue",
                strokeWeight: 2,
              }}
            />
          </>
        )}
      </GoogleMap>
    </div>
  );
};

export default TestMap;

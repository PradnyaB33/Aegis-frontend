import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useContext, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
  useMapEvents,
} from "react-leaflet";
import { useQuery } from "react-query";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";

const TrackingMap = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  function LocationMarker() {
    const [position, setPosition] = useState(null);
    const markerIcon = new L.Icon({
      iconUrl: "marker-icon-2x.png",
      iconSize: [35, 45],
    });
    const map = useMapEvents({
      click() {
        map.locate();
      },
      locationfound(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return position === null ? null : (
      <Marker icon={markerIcon} position={position}>
        <Tooltip direction="bottom" offset={[0, 20]} opacity={1} permanent>
          You Location is here
        </Tooltip>
      </Marker>
    );
  }
  const fetchPts = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/punch/getone`,
      {
        headers: { Authorization: authToken },
      }
    );

    return response.data;
  };
  const { data, isError } = useQuery("pts", fetchPts);
  if (isError) {
    handleAlert(true, "error", "error in getting the you location track");
  }

  return (
    <div>
      <MapContainer
        style={{
          height: "400px",
        }}
        center={{ lat: 18.0780808, lng: 74.0226549 }}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data?.punch && <Polyline positions={data?.punch} color="blue" />}
        <LocationMarker />
      </MapContainer>
    </div>
  );
};

export default TrackingMap;

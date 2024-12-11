import { GoogleMap, MarkerF } from "@react-google-maps/api";
import React from "react";

const RightSide = ({ center }) => {
  return (
    <div className="hidden md:contents">
      {" "}
      <GoogleMap
        key={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        mapContainerStyle={{
          width: "100%",
          height: "91.8vh",
        }}
        center={center}
        zoom={18}
      >
        <MarkerF position={center} />
      </GoogleMap>
    </div>
  );
};

export default RightSide;

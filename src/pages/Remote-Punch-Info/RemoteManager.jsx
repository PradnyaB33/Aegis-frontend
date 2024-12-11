import { useJsApiLoader } from "@react-google-maps/api";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import MappedPunches from "../Employee-Confirm/components/mapped-punches";
import MapComponent from "./Map-Container";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import { Grid } from "@mui/material";

const RemoteManager = () => {
  const { Id } = useParams();
  const [punchObjectId, setPunchObjectId] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  return (
    <BoxComponent>
      <Grid container sm={12} spacing={2}>
        <Grid item xs={12} sm={3}>
          <MappedPunches
            {...{
              Id,
              setPunchObjectId,
              className: "w-full",
              punchObjectId,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={9}>
          {punchObjectId &&
            <MapComponent {...{ isLoaded, punchObjectId }} />
          }
        </Grid>
      </Grid>
    </BoxComponent>
  );
};

export default RemoteManager;

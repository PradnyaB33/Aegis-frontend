
import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import React, { useState } from "react";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import ReusableModal from "../../components/Modal/component";
import useGetCurrentLocation from "../../hooks/Location/useGetCurrentLocation";
import AddGeoFencing from "./components/AddGeoFencing";
import GeoFencingCard from "./components/GeoFenceCard";
import useOrgGeo from "./useOrgGeo";
import FullskapeCard from "./Fullskape/FullskapeCard";
import AddFullskapeZone from "./Fullskape/AddFullskapeZone";
import useOrgFullskape from "./Fullskape/useOrgFullskape";
import useSubscriptionGet from "../../hooks/QueryHook/Subscription/hook";
import { useParams } from "react-router-dom";
const GeoFencing = () => {
  const [openGeoFencing, setOpenGeoFencing] = useState(false);
  const [openFullskape, setOpenFullskape] = useState(false);

  const { organisationId } = useParams("");

  const { data: geoData } = useOrgGeo(); // Geo-Fencing data
  const { data: fullskapeData } = useOrgFullskape(); // Fullskape data
  const { data: subscriptionData } = useSubscriptionGet({ organisationId });
  const isFullskapePlan = subscriptionData?.organisation?.packageInfo === "Fullskape Plan";

  const { data: locationData } = useGetCurrentLocation(); // Location data

  const hasFullskapeZone = fullskapeData?.zones?.length > 0; // Check if Fullskape data exists

  return (
    <>
      <BoxComponent>
        {/* Geo-Fencing Section */}
        <div className="flex justify-between items-center">
          <HeadingOneLineInfo
            heading={"Geo Fencing"}
            info={"You can activate geofencing for a specific zone"}
          />
          <Button
            className="!h-fit gap-2 !w-fit"
            variant="contained"
            size="medium"
            disabled={!geoData}
            onClick={() => setOpenGeoFencing(true)}
          >
            <Add /> Add
          </Button>
        </div>
        <div className="flex gap-4 overflow-auto py-4">
          {geoData?.area?.length > 0
            ? geoData.area.map((item) => <GeoFencingCard key={item._id} item={item} />)
            : "Sorry, but you have not enabled the geo-fencing checkbox from the setup page."}
        </div>
        <ReusableModal
          open={openGeoFencing}
          heading={"Add Geo Fencing"}
          subHeading={"Here you can activate geofencing for a specific zone"}
          onClose={() => setOpenGeoFencing(false)}
        >
          <AddGeoFencing onClose={() => setOpenGeoFencing(false)} data={locationData} />
        </ReusableModal>

        {/* Fullskape Section */}
        {isFullskapePlan && (
          <>
            <div className="flex justify-between items-center mt-8">
              <HeadingOneLineInfo
                heading={"Fullskape"}
                info={"You can activate Fullskape zones for additional control"}
              />
              <Button
                className="!h-fit gap-2 !w-fit"
                variant="contained"
                size="medium"
                disabled={hasFullskapeZone} // Disable the button if Fullskape data exists
                onClick={() => setOpenFullskape(true)}
              >
                <Add /> Add
              </Button>
            </div>
            <div className="flex gap-4 overflow-auto py-4">
              {hasFullskapeZone
                ? fullskapeData.zones.map((item) => (
                    <FullskapeCard key={item._id} item={item} />
                  ))
                : "No Fullskape zones have been added yet."}
            </div>
            <ReusableModal
              open={openFullskape}
              heading={"Add Fullskape"}
              subHeading={"Here you can activate Fullskape zones for additional control"}
              onClose={() => setOpenFullskape(false)}
            >
              <AddFullskapeZone onClose={() => setOpenFullskape(false)} data={locationData} />
            </ReusableModal>
          </>
        )}
      </BoxComponent>
    </>
  );
};

export default GeoFencing;

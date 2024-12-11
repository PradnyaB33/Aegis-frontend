import { MoreVert, MyLocation } from "@mui/icons-material";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import React from "react";
import ReusableModal from "../../../components/Modal/component";
import useGeoMutation from "../Mutation/useGeoCard";
import useGetRevGeo from "../useGetRevGeo";
import ViewDelete from "./ViewDelete";
import useGetCurrentLocation from "../../../hooks/Location/useGetCurrentLocation";
import AddGeoFencing from "./AddGeoFencing";

const GeoFenceCard = ({ item }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open1, setOpen1] = React.useState(false);
  const [view, setView] = React.useState(false);
  const [circleId, setCircleId] = React.useState(false);

  const { data: locationData } = useGetCurrentLocation();

  const { data } = useGetRevGeo({
    lat: item?.center?.coordinates[0],
    lng: item?.center?.coordinates[1],
  });

  const { mutate } = useGeoMutation();

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="flex flex-col justify-start items-center">
        <div className="flex p-4 justify-between gap-8 border-b w-full">
          <div className="flex gap-2 items-center">
            <MyLocation className="text-Brand-washed-blue/brand-washed-blue-10" />
            <abbr title={data ? data[0]?.formatted_address : "Loading..."}>
              <h4 className="text-xl underline text-black truncate w-48">
                {data ? data[0]?.formatted_address : "Loading..."}
              </h4>
            </abbr>
          </div>
          <IconButton onClick={handleClick}>
            <MoreVert />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              onClick={() => {
                setCircleId(item?._id)
                setView(true)
                handleClose();
              }}
            >
              View
            </MenuItem>
            <MenuItem
              onClick={() => {
                mutate({ id: item?._id });
                handleClose();
              }}
            >
              Delete
            </MenuItem>
          </Menu>
        </div>
        <div className="p-4 w-full flex flex-col gap-4">
          <div className="">
            <p className="text-xl w-full text-black">
              Employee Count: {item?.employee?.length || 0}
            </p>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={() => setOpen1(true)}
              variant="contained"
              size="small"
            >
              Manage Employee
            </Button>
          </div>
        </div>
        <ReusableModal
          open={open1}
          heading={"Add Or Remove Employees"}
          subHeading={`Here you can add or remove employees in geofencing zone`}
          onClose={() => setOpen1(false)}
        >
          <ViewDelete circleId={item?._id} onClose={() => setOpen1(false)} />
        </ReusableModal>
        <div>
          <ReusableModal
            open={view}
            heading={"View Geo Fencing"}
            subHeading={"You can activate geofencing for a specific zone"}
            onClose={() => setView(false)}
          >
            <AddGeoFencing onClose={() => setView(false)} data={locationData} circleId={circleId} />
          </ReusableModal></div>
      </div>
    </div>
  );
};

export default GeoFenceCard;

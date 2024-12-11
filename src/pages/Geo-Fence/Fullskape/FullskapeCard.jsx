// import { MoreVert, MyLocation } from "@mui/icons-material";
// import { Button, IconButton, Menu, MenuItem } from "@mui/material";
// import React from "react";
// import ReusableModal from "../../../components/Modal/component";
// import useGetRevGeo from "../useGetRevGeo";
// import useGetCurrentLocation from "../../../hooks/Location/useGetCurrentLocation";
// import AddGeoFencing from "../components/AddGeoFencing";
// import FullskapeViewDelete from "./FullskapeViewDelete";
// import useFullskapeMutation from "./useFullskapeCard";

// const FullskapeCard = ({ item }) => {
//     console.log("item",item);
    
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const [openManage, setOpenManage] = React.useState(false);
//   const [view, setView] = React.useState(false);
//   const [zoneId, setzoneId] = React.useState(false);

//   const { data: locationData } = useGetCurrentLocation();

//   const { data } = useGetRevGeo({
//     lat: item?.center?.lat,
//     lng: item?.center?.lng,
//   });
  

//   const { mutate } = useFullskapeMutation();

//   const open = Boolean(anchorEl);

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-lg">
//       <div className="flex flex-col justify-start items-center">
//         <div className="flex p-4 justify-between gap-8 border-b w-full">
//           <div className="flex gap-2 items-center">
//             <MyLocation className="text-Brand-washed-blue/brand-washed-blue-10" />
//             <abbr title={data ? data[0]?.formatted_address : "Loading..."}>
//               <h4 className="text-xl underline text-black truncate w-48">
//                 {data ? data[0]?.formatted_address : "Loading..."}
//               </h4>
//             </abbr>
//           </div>
//           <IconButton onClick={handleClick}>
//             <MoreVert />
//           </IconButton>
//           <Menu
//             id="basic-menu"
//             anchorEl={anchorEl}
//             open={open}
//             onClose={handleClose}
//             MenuListProps={{
//               "aria-labelledby": "basic-button",
//             }}
//           >
//             <MenuItem
//               onClick={() => {
//                 setzoneId(item?._id);
//                 setView(true);
//                 handleClose();
//               }}
//             >
//               View
//             </MenuItem>
//             <MenuItem
//               onClick={() => {
//                 mutate({ id: item?._id });
//                 handleClose();
//               }}
//             >
//               Delete
//             </MenuItem>
//           </Menu>
//         </div>
//         <div className="p-4 w-full flex flex-col gap-4">
//           <div className="">
//             <p className="text-xl w-full text-black">
//               Student Count: {item?.students?.length || 0}
//             </p>
//           </div>
//           <div className="flex justify-end">
//             <Button
//               onClick={() => setOpenManage(true)}
//               variant="contained"
//               size="small"
//             >
//               Manage Students
//             </Button>
//           </div>
//         </div>
//         <ReusableModal
//           open={openManage}
//           heading={"Add Or Remove Students"}
//           subHeading={`Here you can add or remove students in Fullskape zone`}
//           onClose={() => setOpenManage(false)}
//         >
//           <FullskapeViewDelete zoneId={item?._id} onClose={() => setOpenManage(false)} />
//         </ReusableModal>
//         <div>
//           <ReusableModal
//             open={view}
//             heading={"View Fullskape Zone"}
//             subHeading={"You can view details of this Fullskape zone"}
//             onClose={() => setView(false)}
//           >
//             <AddGeoFencing
//               onClose={() => setView(false)}
//               data={locationData}
//               zoneId={zoneId}
//             />
//           </ReusableModal>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FullskapeCard;

import React from "react";
import {
  MoreVert,
  MyLocation,
} from "@mui/icons-material";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import ReusableModal from "../../../components/Modal/component";
import useGetRevGeo from "../useGetRevGeo";
import useGetCurrentLocation from "../../../hooks/Location/useGetCurrentLocation";
import AddGeoFencing from "../components/AddGeoFencing";
import FullskapeViewDelete from "./FullskapeViewDelete";
import useFullskapeMutation from "./useFullskapeCard";
import FullskapeResuable from "./FullskapeResuable";

const FullskapeCard = ({ item }) => {
  console.log("item", item);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openManage, setOpenManage] = React.useState(false);
  const [view, setView] = React.useState(false);
  const [zoneId, setZoneId] = React.useState(false);

  const { data: locationData } = useGetCurrentLocation();

  const { data } = useGetRevGeo({
    lat: item?.center?.lat,
    lng: item?.center?.lng,
  });

  const {
    deleteFullskapeMutate, // Correct mutation reference
  } = useFullskapeMutation();

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
                setZoneId(item?._id);
                setView(true);
                handleClose();
              }}
            >
              View
            </MenuItem>
            <MenuItem
              onClick={() => {
                deleteFullskapeMutate({ zoneId: item?._id }); // Correct key usage
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
              Student Count: {item?.students?.length || 0}
            </p>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={() => setOpenManage(true)}
              variant="contained"
              size="small"
            >
              Manage Students
            </Button>
          </div>
        </div>
        <FullskapeResuable
          open={openManage}
          heading={"Add Or Remove Students"}
          subHeading={`Here you can add or remove students in Fullskape zone`}
          onClose={() => setOpenManage(false)}
           modalWidth="table"
        >
          <FullskapeViewDelete
            zoneId={item?._id}
            onClose={() => setOpenManage(false)}
          />
        </FullskapeResuable>
        <div>
          <ReusableModal
            open={view}
            heading={"View Fullskape Zone"}
            subHeading={"You can view details of this Fullskape zone"}
            onClose={() => setView(false)}
            modalWidth="lg"
          >
            <AddGeoFencing
              onClose={() => setView(false)}
              data={locationData}
              zoneId={zoneId}
            />
          </ReusableModal>
        </div>
      </div>
    </div>
  );
};

export default FullskapeCard;

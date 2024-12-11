/* eslint-disable no-unused-vars */
import { Menu } from "@mui/icons-material";
import { AppBar, IconButton, Toolbar } from "@mui/material";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import * as React from "react";
import { useLocation } from "react-router-dom";
import useSubscriptionGet from "../../hooks/QueryHook/Subscription/hook";
import useGetUser from "../../hooks/Token/useUser";
import UserProfile from "../../hooks/UserData/useUser";
import ChangeRole from "../InputFileds/ChangeRole";
import ProfileIcon from "../profieicon/profileIcon";
import NotificationIcon from "./components/NotificationIcon";
import TestNavItems from "./components/test-nav-items";

export default function SwipeableTemporaryDrawer() {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();
  const [orgId, setOrgId] = React.useState(null);
  const { decodedToken: decoded } = useGetUser();
  // Function to extract organization ID from pathname
  const getOrganizationIdFromPathname = (pathname) => {
    const parts = pathname.split("/");
    const orgIndex = parts.indexOf("organisation");
    let orgId;

    if (orgIndex !== -1 && parts.length > orgIndex + 1) {
      if (parts[orgIndex + 1] === null || undefined) {
        orgId = decoded?.user?.organizationId;
      } else {
        orgId = parts[orgIndex + 1];
      }
    } else {
      orgId = decoded?.user?.organizationId;
    }
    setOrgId(orgId);
  };

  const role = UserProfile().useGetCurrentRole();

  // Update organization ID when URL changes
  React.useEffect(() => {
    // const hasEmployeeOnboarding = pathname.includes("employee-onboarding");
    getOrganizationIdFromPathname(location.pathname);
    // eslint-disable-next-line
  }, [location.pathname, orgId]);

  const { data } = useSubscriptionGet({
    organisationId: orgId,
  });

  const list = (
    <Box
      sx={{ width: 250, height: 100 }}
      role="presentation"
      // onKeyDown={toggleDrawer}
    >
      <TestNavItems />
    </Box>
  );

  const paths = ["/sign-in", "/organizationList"];
  const isLocation = React.useMemo(() => {
    return paths.some((path) => {
      return location.pathname.includes(path) || location.pathname === "/";
    });
    // eslint-disable-next-line
  }, [location.pathname]);

  //resolved bug
  const pathsToHideOrgName = ["/add-organisation", "/organizationList"];

  return (
    <div
      className={`${
        location.pathname.includes("/sign-in") ||
        location.pathname.includes("/sign-up") ||
        location.pathname.includes("/terms-and-conditions") ||
        location.pathname.includes("/choose-role")
          ? "hidden"
          : "block"
      }`}
    >
      <AppBar position="fixed">
        <Toolbar className="flex justify-between items-center">
          <div className="flex items-center">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              sx={{ marginRight: 2 }}
            >
              <Menu />
            </IconButton>

            <div className="hidden sm:flex items-center">
              {/* temperoary */}

              {/* <img
              src="/Aegis_log.jpg"
              // src="/Aegis_logo_white.png"
                //  src="/Aegis_only_logo.png"
              alt="AEGIS"
              className="w-16 h-20 -mt-2 -top-2 object-cover"
              // className="w-[1.9rem] h-[2.0rem] -mt-2 -top-2 zobject-cover"
            /> */}

              {/* _________ */}
              {/* <img
                src="/A1.jpg"
                alt="AEGIS"
                className="w-[1.9rem] h-[2.0rem] -mt-2 -top-2 object-cover"
              />
              <img
                src="/A2.jpg"
                alt="AEGIS"
                className="w-[3.2rem] h-[2.0rem] -mt-2 ml-1 -top-2 object-cover text-white"
              /> */}
              {/* _________ */}

              {/* updated */}
              {/* <span className="bg-white border rounded-full border-gray-500 p-3 "> 
  
<img
                // src="/Aegis_only_logo.png"
                // white bg-image logo
                 src="/A1.jpg"
                alt="AEGIS"
                className="w-[1.9rem] h-[2.0rem] -mt-2 -top-2 object-cover  mix-blend-multiply"
              />

</span> */}

              <span className="inline-flex items-center justify-center w-13 h-13 bg-white border border-gray-500 rounded-full p-2">
                <img
                  src="/A1.jpg"
                  alt="AEGIS"
                  className="w-8 h-8 object-cover rounded-full mix-blend-multiply"
                />
              </span>

              <img
                src="/Aegis_logo_name.png"
                alt="AEGIS"
                className="w-[3.6rem] h-[2.3rem] -mt-2 ml-1 -top-2 object-cover text-white "
              />
            </div>
          </div>

          <div className="flex gap-2 items-center">
            {/* {data?.organisation?.orgName &&
            !isLocation &&
            data?.organisation?.orgName}
            {role && <NotificationIcon />} */}
            {/* //resolved bug */}
            {data?.organisation?.orgName &&
              !isLocation &&
              !pathsToHideOrgName.includes(location.pathname) &&
              data?.organisation?.orgName}
            {role && <NotificationIcon />}
            <ProfileIcon />
          </div>
        </Toolbar>
      </AppBar>

      <SwipeableDrawer
        PaperProps={{ style: { background: "white" } }}
        color="white"
        anchor="left"
        open={open}
      >
        <div className="py-2 px-10 border-b-[.5px] flex items-center gap-2 border-gray-300">
          <span className="inline-flex items-center justify-center w-13 h-13 bg-white border border-gray-500 rounded-full p-2">
            <img
              src="/A1.jpg"
              alt="AEGIS"
              className="w-8 h-8 object-cover rounded-full mix-blend-multiply"
            />
          </span>

          <img
            // src="/Aegis_logo_name.png"
            src="/A2.jpg"
            alt="AEGIS"
            className="w-[3.6rem] h-[2.1rem] -mt-1   object-cover text-white mix-blend-multiply"
          />
        </div>
        <ChangeRole />
        {list}
      </SwipeableDrawer>
    </div>
  );
}

import {
  Dashboard,
  EventAvailable,
  EventBusy,
  FilterAlt,
  FilterAltOff,
  Groups,
  LocationOn,
  NearMe,
  SupervisorAccount,
} from "@mui/icons-material";
import { IconButton, Popover } from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { useQueryClient } from "react-query";
import { useLocation, useParams } from "react-router-dom";
import Select from "react-select";
import useDashGlobal from "../../hooks/Dashboard/useDashGlobal";
import useDashboardFilter from "../../hooks/Dashboard/useDashboardFilter";
import useEmployee from "../../hooks/Dashboard/useEmployee";
import UserProfile from "../../hooks/UserData/useUser";
import LineGraph from "./Components/Bar/LineGraph";
import AttendenceBar from "./Components/Bar/SuperAdmin/AttendenceBar";
import SuperAdminCard from "./Components/Card/superadmin/SuperAdminCard";
import SkeletonFilterSection from "./Components/Skeletons/SkeletonFilterSection";
import useRemoteCount from "./hooks/useRemoteCount";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import { Grid } from "@mui/material"

const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    borderColor: "#d1d5db",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#4f46e5",
    },
    "&:focus": {
      borderColor: "#4f46e5",
    },
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "2px",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#4f46e5" : "#ffffff",
    color: state.isSelected ? "#ffffff" : "#000000",
    "&:hover": {
      backgroundColor: "#f3f4f6",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#9ca3af",
  }),
};

const DashboardHr = () => {
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const { organisationId } = useParams();
  const { employee } = useEmployee(organisationId, 1, "");
  const { setSelectedSalaryYear, selectedSalaryYear } = useDashGlobal();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // Custom hooks
  const {
    Managers,
    oraganizationLoading,
    // salaryGraphLoading,
    locationOptions,
    managerOptions,
    Departmentoptions,
    // customStyles,
    data,
    locations,
    location: loc,
    setLocations,
    manager,
    setManager,
    department,
    setDepartment,
    salaryData,
    absentEmployee,
    getAttendenceData,
  } = useDashboardFilter(user.organizationId);

  const { remoteEmployeeCount } = useRemoteCount(user.organizationId);
  useEffect(() => {
    if (location.pathname?.includes("/DH-dashboard")) {
      getAttendenceData();
    }
    AOS.init({ duration: 1000, once: true });
    // eslint-disable-next-line
  }, []);

  const cardSize = "w-full h-36"; // Adjusted card size for better responsiveness

  return (
    <>
      <BoxComponent>
        <HeadingOneLineInfo
          heading={location.pathname?.includes("/DH-dashboard")
            ? "Department Head Dashboard"
            : "HR Dashboard"}
          info={
            location.pathname?.includes("/DH-dashboard")
              ? "Manage and review department-specific metrics and reports for better insights"
              : "View and manage general HR metrics and reports"
          }
        />

        <Grid container spacing={4}>
          <Grid item xs={6} sm={4} md={3}>
            <SuperAdminCard
              icon={Groups}
              title={"Overall Employees"}
              data={employee?.totalEmployees}
              className="bg-[#CFF2FC]"
              cardSize={cardSize}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <SuperAdminCard
              icon={EventAvailable}
              data={
                !isNaN(employee?.totalEmployees)
                  ? employee?.totalEmployees - absentEmployee
                  : 0
              }
              className="bg-[#FFF2DC]"
              title={"Present Today"}
              cardSize={cardSize}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <SuperAdminCard
              icon={EventBusy}
              data={absentEmployee}
              className="bg-[#D8FAE7]"
              title={"Today's Leave"}
              cardSize={cardSize}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <SuperAdminCard
              icon={SupervisorAccount}
              data={Managers?.length}
              className="bg-[#FFF6C5]"
              title={"People's Manager"}
              cardSize={cardSize}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <SuperAdminCard
              icon={LocationOn}
              data={loc?.locationCount}
              className="bg-[#CFF2FC]"
              title={"Locations"}
              cardSize={cardSize}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <SuperAdminCard
              icon={NearMe}
              data={remoteEmployeeCount}
              className="bg-[#FFF2DC]"
              title={"Remote Employees"}
              cardSize={cardSize}
            />
          </Grid>
        </Grid>
        <div className=" w-full">
          {oraganizationLoading ? (
            <SkeletonFilterSection />
          ) : (
            <div className="mt-4 w-full bg-white border rounded-md">
              <div className="items-center justify-between flex gap-2 py-2">
                <div className="flex items-center gap-2">
                  <Dashboard className="!text-[#67748E]" />
                </div>
                <div className="w-[70%] md:hidden flex gap-6 items-center justify-end">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconButton onClick={handleClick}>
                      <FilterAlt />
                    </IconButton>
                  </motion.div>
                </div>

                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <div className="w-full flex-col h-auto pr-10 p-4 flex gap-4">
                    <motion.button
                      onClick={() => {
                        setLocations("");
                        setDepartment("");
                        setManager("");
                        queryClient.invalidateQueries(
                          "organization-attenedence"
                        );
                        queryClient.invalidateQueries("Org-Salary-overview");
                      }}
                      className="!w-max flex justify-center h-[35px] gap-2 items-center rounded-md px-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      data-aos="fade-up"
                    >
                      <FilterAltOff className="!text-[1.4em] text-white" />
                      Remove Filter
                    </motion.button>

                    <Select
                      placeholder={"Departments"}
                      onChange={(dept) => {
                        setDepartment(dept.value);
                        setLocations("");
                        setManager("");
                        queryClient.invalidateQueries("department-attenedence");
                      }}
                      styles={customSelectStyles}
                      value={
                        department
                          ? Departmentoptions?.find(
                            (option) => option.value === department
                          )
                          : ""
                      }
                      options={Departmentoptions}
                    />

                    <Select
                      placeholder={"Manager"}
                      components={{ IndicatorSeparator: () => null }}
                      onChange={(Managers) => {
                        setManager(Managers.value);
                        setDepartment("");
                        setLocations("");
                        queryClient.invalidateQueries("manager-attenedence");
                      }}
                      value={
                        manager
                          ? managerOptions.find((item) => item.name === manager)
                          : ""
                      }
                      styles={customSelectStyles}
                      options={managerOptions}
                    />

                    <Select
                      placeholder={"Location"}
                      components={{ IndicatorSeparator: () => null }}
                      onChange={(loc) => {
                        setLocations(loc.value);
                        setDepartment("");
                        setManager("");
                        queryClient.invalidateQueries("location-attenedence");
                      }}
                      value={
                        locations
                          ? locationOptions.find(
                            (item) => item.name === locations
                          )
                          : ""
                      }
                      styles={customSelectStyles}
                      options={locationOptions}
                    />
                  </div>
                </Popover>

                {location.pathname?.includes("/HR-dashboard") && (
                  <div className="w-[80%] hidden md:flex gap-6 items-center justify-end">
                    <motion.button
                      onClick={() => {
                        setLocations("");
                        setDepartment("");
                        setManager("");
                        queryClient.invalidateQueries(
                          "organization-attenedence"
                        );
                      }}
                      className="!w-max flex justify-center h-[35px] gap-2 items-center rounded-md px-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      data-aos="fade-up"
                    >
                      <FilterAltOff className="!text-[1.4em] text-white" />
                      Remove Filter
                    </motion.button>

                    <Select
                      placeholder={"Departments"}
                      onChange={(dept) => {
                        setDepartment(dept.value);
                        setLocations("");
                        setManager("");
                        queryClient.invalidateQueries("department-attenedence");
                      }}
                      styles={customSelectStyles}
                      value={
                        department
                          ? Departmentoptions?.find(
                            (option) => option.value === department
                          )
                          : ""
                      }
                      options={Departmentoptions}
                    />

                    <Select
                      placeholder={"Manager"}
                      components={{ IndicatorSeparator: () => null }}
                      onChange={(Managers) => {
                        setManager(Managers.value);
                        setDepartment("");
                        setLocations("");
                        queryClient.invalidateQueries("manager-attenedence");
                      }}
                      value={
                        manager
                          ? managerOptions.find((item) => item.name === manager)
                          : ""
                      }
                      styles={customSelectStyles}
                      options={managerOptions}
                    />

                    <Select
                      placeholder={"Location"}
                      components={{ IndicatorSeparator: () => null }}
                      onChange={(loc) => {
                        setLocations(loc.value);
                        setDepartment("");
                        setManager("");
                        queryClient.invalidateQueries("location-attenedence");
                      }}
                      value={
                        locations
                          ? locationOptions.find(
                            (item) => item.name === locations
                          )
                          : ""
                      }
                      styles={customSelectStyles}
                      options={locationOptions}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="w-full  md:gap-4 md:space-y-0 space-y-3 mt-4 flex md:flex-row flex-col items-center">
            <div className="w-[100%] md:w-[50%]">
              <LineGraph
                salarydata={salaryData}
                selectedyear={selectedSalaryYear}
                setSelectedYear={setSelectedSalaryYear}
              />
            </div>
            <div className="w-[100%] md:w-[50%]">
              <AttendenceBar
                isLoading={oraganizationLoading}
                attendenceData={data}
              />
            </div>
          </div>
        </div>

      </BoxComponent >
    </>
  );
};

export default DashboardHr;

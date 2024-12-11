import {
  Business,
  Category,
  ChevronRight,
  CurrencyRupee,
  Dashboard,
  Description,
  EditCalendarOutlined,
  Fingerprint,
  Groups,
  ListAlt,
  LocationOn,
  ModelTrainingOutlined,
  MonetizationOn,
  MonetizationOnOutlined,
  NotificationsActive,
  PanToolAlt,
  Payment,
  PeopleAlt,
  PersonAdd,
  PersonRemove,
  Settings,
  SupervisorAccount,
  TrendingUp,
  Group,
  // SearchIcon ,
  // BuildIcon ,
  // AssessmentIcon ,
  // SettingsIcon ,
  // AccountBoxIcon 

} from "@mui/icons-material";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
// import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import BuildIcon from '@mui/icons-material/Build';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SpeakerNotesOutlinedIcon from "@mui/icons-material/SpeakerNotesOutlined";
import HistoryIcon from "@mui/icons-material/History";
import FoodBankIcon from "@mui/icons-material/FoodBank";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ArticleIcon from "@mui/icons-material/Article";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CallMissedIcon from "@mui/icons-material/CallMissed";
import ChatIcon from "@mui/icons-material/Chat";
// import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
// import FoodBankIcon from "@mui/icons-material/FoodBank";
import HomeRepairServiceOutlinedIcon from "@mui/icons-material/HomeRepairServiceOutlined";
// import ListAltIcon from "@mui/icons-material/ListAlt";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import PunchClockIcon from "@mui/icons-material/PunchClock";
import ReceiptIcon from "@mui/icons-material/Receipt";
import WorkIcon from "@mui/icons-material/Work";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { IoListCircle } from "react-icons/io5";
import { SiMicrosoftexcel } from "react-icons/si";
import { useQuery, useQueryClient } from "react-query";
import { Link, useLocation } from "react-router-dom";
import { UseContext } from "../../../State/UseState/UseContext";
import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";
import useGetUser from "../../../hooks/Token/useUser";
import UserProfile from "../../../hooks/UserData/useUser";
import useGetCommunicationPermission from "../../../pages/EmployeeSurvey/useContext/Permission";
import useOrgGeo from "../../../pages/Geo-Fence/useOrgGeo";
import { useDrawer } from "./Drawer";
import TestAccordian from "./TestAccordian";
import { FaUserClock } from "react-icons/fa6";

const TestNavItems = () => {
  // to define the route and pass the dynamic organization id
  const [openIndex, setOpenIndex] = useState(null);
  const { pinned, setPinned } = useDrawer();
  const handleAccordianClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const [orgId, setOrgId] = useState(null);
  const { cookies } = useContext(UseContext);
  const token = cookies["aegis"];
  const location = useLocation();
  const [decodedToken, setDecodedToken] = useState("");
  const [emp, setEmp] = useState();
  const { decodedToken: decoded } = useGetUser();
  const { getCurrentUser, useGetCurrentRole } = UserProfile();
  const user = getCurrentUser();
  const empId = user?._id;
  // const isVendor =  resp?.data?.user?.isVendor === true;
  const isVendor = user?.isVendor === true;

  const role = useGetCurrentRole();
  const queryClient = useQueryClient();

  //_--------------------geofencing---------------
  //selected employee list for geofencing
  const { data: geofencingData } = useOrgGeo(orgId);

  //match currect user and selcted employee in list
  const isUserMatchInEmployeeList = geofencingData?.area?.some((area) =>
    area.employee.includes(empId)
  );

  //////////////////////////////////////////////////

  // Update organization ID when URL changes
  useEffect(() => {
    if ((role === "Super-Admin", "Delegate-Super-Admin")) {
      getOrganizationIdFromPathname(location.pathname);
    } else {
      setOrgId(user?.organizationId);
    }

    // eslint-disable-next-line
  }, [location.pathname]);

  useEffect(() => {
    (async () => {
      if (user?._id) {
        const resp = await axios.get(
          `${process.env.REACT_APP_API}/route/employee/get/profile/${user?._id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setEmp(resp?.data?.employee?.organizationId);
      }
    })();
    // eslint-disable-next-line
  }, []);
  const check = emp?.packageInfo === "Intermediate Plan";

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

  const { data } = useSubscriptionGet({
    organisationId: orgId,
  });
  console.log("data", data);

  //git communication employee survey permission
  const organisationId = data?.organisation?._id;
  const { data: survey } = useGetCommunicationPermission(organisationId);

  // Update organization ID when URL changes
  useEffect(() => {
    if ((role === "Super-Admin", "Delegate-Super-Admin")) {
      getOrganizationIdFromPathname(location.pathname);
    } else {
      setOrgId(user?.organizationId);
    }

    // eslint-disable-next-line
  }, [location.pathname]);

  const [isVisible, setisVisible] = useState(true);

  useEffect(() => {
    setisVisible(location.pathname.includes("/organisation"));
  }, [location.pathname, organisationId]);

  useEffect(() => {
    queryClient.invalidateQueries("survey-permission");
  }, [queryClient]);

  let navItems = useMemo(
    () => {
      if (data?.organisation?.packageInfo === "Essential Plan") {
        return {
          Home: {
            open: false,
            icon: <Category style={{ fontSize: "20px" }} />,
            isVisible: true,
            routes: [
              {
                key: "dashboard",
                isVisible: true,
                link:
                  role === "Manager"
                    ? `/organisation/${orgId}/dashboard/manager-dashboard`
                    : role === "HR"
                      ? `/organisation/${orgId}/dashboard/HR-dashboard`
                      : role === "Employee" || role === "Teacher"
                        ? `/organisation/${orgId}/dashboard/employee-dashboard`
                        : "/organizationList",
                icon: <Dashboard style={{ fontSize: "20px" }} />,
                text: "Dashboard",
              },
            ],
          },

          Attendance: {
            open: true,
            icon: <Category style={{ fontSize: "20px" }} />,
            isVisible:
              window.location.pathname?.includes("organisation") &&
              [
                "Super-Admin",
                "Delegate-Super-Admin",
                "Delegate-Super-Admin",
                "Department-Head",
                "Delegate-Department-Head",
                "Department-Admin",
                "Delegate-Department-Admin",
                "Accountant",
                "Delegate-Accountant",
                "HR",
                "Manager",
                "Employee",
                "Teacher",
              ]?.includes(role),
            routes: [
              {
                key: "attendance",
                isVisible: true,
                link: `/organisation/${orgId}/leave`,
                icon: <AccessTimeOutlinedIcon style={{ fontSize: "20px" }} />,
                text: "Manage Leaves",
              },
              {
                key: "shiftManagement",
                isVisible:
                  data?.organisation?.packageInfo !== "Essential Plan" &&
                  ["Employee"].includes(role),
                link: "/shift-management",
                icon: (
                  <HomeRepairServiceOutlinedIcon style={{ fontSize: "20px" }} />
                ),
                text: "Shift Management",
              },
              {
                key: "view emp attendance",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Manager",
                ].includes(role)
                  ? true
                  : false,
                link: `/organisation/${orgId}/ManagementCalender`,
                icon: <FaUserClock style={{ fontSize: "20px" }} />,
                text: "Employee Attendance",
              },
            ],
          },
          "Self Help": {
            open: true,
            icon: <Category style={{ fontSize: "20px" }} />,
            isVisible:
              window.location.pathname?.includes("organisation") &&
              [
                "Super-Admin",
                "Delegate-Super-Admin",
                "Delegate-Super-Admin",
                "Department-Head",
                "Delegate-Department-Head",
                "Department-Admin",
                "Delegate-Department-Admin",
                "Accountant",
                "Delegate-Accountant",
                "HR",
                "Manager",
                "Employee",

              ]?.includes(role),
            routes: [
              {
                key: "accountSettings",
                isVisible: true,
                link: `/employee-profile`,
                icon: <Settings style={{ fontSize: "20px" }} />,
                text: "Account Settings",
              },
              {
                key: "billing",
                isVisible: ["Super-Admin", "Delegate-Super-Admin"].includes(
                  role
                )
                  ? true
                  : false,
                link: `/billing`,
                icon: <CurrencyRupee style={{ fontSize: "20px" }} />,
                text: "Billing",
              },
              {
                key: "add-delegate-super-admin",
                isVisible: ["Super-Admin"].includes(role) ? true : false,
                link: `/organisation/${orgId}/add-delegate`,
                icon: <SupervisorAccount style={{ fontSize: "20px" }} />,
                text: "Add Delegate Super Admin",
              },
            ],
          },
          Payroll: {
            open: false,
            isVisible:
              window.location.pathname?.includes("organisation") &&
              [
                "Super-Admin",
                "Delegate-Super-Admin",
                "Delegate-Super-Admin",
                "Department-Head",
                "Delegate-Department-Head",
                "Department-Admin",
                "Delegate-Department-Admin",
                "Accountant",
                "Delegate-Accountant",
                "HR",
                "Manager",
                "Employee",
                "Teacher",
              ]?.includes(role),
            icon: <Payment style={{ fontSize: "20px" }} />,
            routes: [
              {
                key: "payslip",
                isVisible: true,
                link: `/organisation/${orgId}/view-payslip`,
                icon: <ListAlt style={{ fontSize: "20px" }} />,
                text: "Pay Slip",
              },

              {
                key: "createsalary",
                isVisible:
                  isVisible &&
                  [
                    "Super-Admin",
                    "Delegate-Super-Admin",
                    "HR",
                    "Accountant",
                    "Delegate-Super-Admin",
                  ].includes(role),
                link: `/organisation/${orgId}/salary-management`,
                icon: (
                  <AccountBalanceWalletOutlinedIcon
                    style={{ fontSize: "20px" }}
                  />
                ),
                text: "Salary Management",
              },
            ],
          },
          Employee: {
            open: false,
            icon: <PeopleAlt style={{ fontSize: "20px" }} />,
            isVisible:
              window.location.pathname?.includes("organisation") &&
              [
                "Super-Admin",
                "Delegate-Super-Admin",
                "Delegate-Super-Admin",
                "Department-Head",
                "Delegate-Department-Head",
                "Department-Admin",
                "Delegate-Department-Admin",
                "Accountant",
                "Delegate-Accountant",
                "HR",
                "Manager",
                "Employee",
                "Teacher",
              ]?.includes(role),
            routes: [
              {
                key: "onboarding",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Delegate-Super-Admin",
                ].includes(role),
                link: `/organisation/${orgId}/employee-onboarding`,
                icon: <PersonAdd style={{ fontSize: "20px" }} />,
                text: "Onboarding",
              },
              {
                key: "offboarding",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Delegate-Super-Admin",
                ].includes(role),
                link: `/organisation/${orgId}/employee-offboarding`,
                icon: <PersonRemove style={{ fontSize: "20px" }} />,
                text: "Offboarding",
              },
              {
                key: "employeeList",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "Delegate-Super-Admin",
                  "Department-Head",
                  "Delegate-Department-Head",
                  "Department-Admin",
                  "Delegate-Department-Admin",
                  "Accountant",
                  "Delegate-Accountant",
                  "HR",
                  "Manager",
                  "Employee",
                  "Teacher",
                ].includes(role),
                link: `/organisation/${orgId}/employee-list`,
                icon: <Groups style={{ fontSize: "20px" }} />,
                text: "Employee List",
              },
            ],
          },
          Organisation: {
            open: false,
            isVisible: ["Super-Admin", "Delegate-Super-Admin"].includes(role),
            icon: <MonetizationOn style={{ fontSize: "20px" }} />,
            routes: [
              {
                key: "addOrganisation",
                isVisible: ["Super-Admin", "Delegate-Super-Admin"].includes(
                  role
                ),
                link: "/add-organisation",
                icon: <BusinessOutlinedIcon style={{ fontSize: "20px" }} />,
                text: "Add Organisation",
              },

              {
                key: "organisationList",
                isVisible: ["Super-Admin", "Delegate-Super-Admin"].includes(
                  role
                ),
                link: "/organizationList",
                icon: <IoListCircle style={{ fontSize: "20px" }} />,
                text: "Organisation List",
              },
              {
                key: "organisationList",
                isVisible: ["Super-Admin", "Delegate-Super-Admin"].includes(
                  role
                ),
                link: `/organisation/${orgId}/organisation-hierarchy`,
                icon: <AccountTreeOutlinedIcon style={{ fontSize: "20px" }} />,
                text: "Organisation Hierarchy",
              },
            ],
          },
          Department: {
            open: false,
            isVisible:
              window.location.pathname.includes("organisation") &&
              [
                "Super-Admin",
                "Delegate-Super-Admin",
                "Delegate-Super-Admin",
                "HR",
                "Department-Head",
                "Delegate-Department-Head",
                "Department-Admin",
                "Delegate-Department-Admin",

              ].includes(role),
            // : false
            icon: <Business style={{ fontSize: "20px" }} />,
            routes: [
              {
                key: "addDepartment",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Department-Head",
                  "Delegate-Department-Head",
                  "Department-Admin",
                  "Delegate-Department-Admin",
                ].includes(role),
                link: `/organisation/${orgId}/add-department`,
                icon: (
                  <AddCircleOutlineOutlinedIcon style={{ fontSize: "20px" }} />
                ),
                text: "Add Department",
              },
              {
                key: "departmentList",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Department-Head",
                  "Delegate-Department-Head",
                  "Department-Admin",
                  "Delegate-Department-Admin",
                ].includes(role),
                link: `/organisation/${orgId}/department-list`,
                icon: <ListAltOutlinedIcon style={{ fontSize: "20px" }} />,
                text: "Manage Department",
              },
            ],
          },
        };
      } else {
        return {
          Home: {
            open: false,
            icon: <Category style={{ fontSize: "20px" }} />,
            isVisible: true,
            routes: [
              {
                key: "dashboard",
                isVisible: true,
                link:
                  role === "Manager"
                    ? `/organisation/${orgId}/dashboard/manager-dashboard`
                    : role === "HR"
                      ? `/organisation/${orgId}/dashboard/HR-dashboard`
                      : role === "Employee" || role === "Teacher"
                        ? `/organisation/${orgId}/dashboard/employee-dashboard`
                        : "/organizationList",
                icon: <Dashboard style={{ fontSize: "20px" }} />,
                text: "Dashboard",
              },
            ],
          },

          Attendance: {
            open: true,
            icon: <Category style={{ fontSize: "20px" }} />,
            isVisible: true,
            routes: [
              {
                key: "attendance",
                isVisible: role === "Employee" || role === "Teacher",
                link: `/organisation/${orgId}/leave`,
                icon: <FaCalendarAlt style={{ fontSize: "20px" }} />,
                text: "Attendance Calender",
              },
              {
                key: "shiftManagement",
                isVisible:
                  data?.organisation?.packageInfo !== "Essential Plan" &&
                  ["Employee", "Teacher"].includes(role),
                link: "/shift-management",
                icon: (
                  <HomeRepairServiceOutlinedIcon style={{ fontSize: "20px" }} />
                ),
                text: "Shift Management",
              },
              {
                key: "view emp attendance",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Manager",
                ].includes(role),
                link: `/organisation/${orgId}/ManagementCalender`,
                icon: <EditCalendarOutlined style={{ fontSize: "20px" }} />,
                text: "Manage Leaves",
              },
            ],
          },
          // "Self Help": {
          //   open: true,
          //   icon: <Category style={{ fontSize: "20px" }} />,
          //   isVisible: ["Super-Admin", "Delegate-Super-Admin"].includes(role)
          //     ? true
          //     : false,
          //   routes: [
          //     {
          //       key: "accountSettings",
          //       isVisible: true,
          //       link: `/employee-profile`,
          //       icon: <Settings style={{ fontSize: "20px" }} />,
          //       text: "Account Settings",
          //     },

          //   ],
          // },

          Report: {
            open: false,
            isVisible:
              data?.organisation?.packageInfo === "Intermediate Plan" &&
              window.location.pathname?.includes("organisation") &&
              [
                "Super-Admin",
                "Delegate-Super-Admin",
                "Accountant",
                "HR",
              ]?.includes(role),
            icon: <NotificationsActive style={{ fontSize: "20px" }} />,
            routes: [
              {
                key: "reportingMIS",
                isVisible: true,
                link: `/organisation/${orgId}/mis-report`,
                icon: <SiMicrosoftexcel style={{ fontSize: "20px" }} />,
                text: "Reporting MIS",
              },
            ],
          },

          Performance: {
            open: false,
            isVisible:
              data?.organisation?.packageInfo === "Intermediate Plan" &&
              window.location.pathname?.includes("organisation") &&
              [
                "Super-Admin",
                "Delegate-Super-Admin",
                "Delegate-Super-Admin",
                "Department-Head",
                "Delegate-Department-Head",
                "Department-Admin",
                "Delegate-Department-Admin",
                "Accountant",
                "Delegate-Accountant",
                "HR",
                "Manager",
                "Employee",

              ]?.includes(role),
            icon: <Payment style={{ fontSize: "20px" }} />,
            routes: [
              {
                key: "performance",
                isVisible: true,
                link: `/organisation/${orgId}/performance`,
                icon: <ListAlt style={{ fontSize: "20px" }} />,
                text: "Performance",
              },
            ],
          },
          Payroll: {
            open: false,
            isVisible: true,
            icon: <Payment style={{ fontSize: "20px" }} />,
            routes: [
              {
                key: "payslip",
                isVisible: role === "Employee" || role === "Teacher",
                link: `/organisation/${orgId}/view-payslip`,
                icon: <ListAlt style={{ fontSize: "20px" }} />,
                text: "Pay Slip",
              },
              {
                key: "IncomeTax",
                isVisible: role === "Employee" || role === "Teacher",
                link: `/organisation/${orgId}/income-tax-section`,
                icon: <TrendingUp style={{ fontSize: "20px" }} />,
                text: "Income Tax",
              },
              {
                key: "Employee TDS Details",
                isVisible:
                  window.location.pathname?.includes("organisation") &&
                  [
                    "Super-Admin",
                    "Delegate-Super-Admin",
                    "Accountant",
                    "Delegate-Accountant",
                    "HR",
                  ]?.includes(role),
                link: `/organisation/${orgId}/employee/income-tax-section`,
                icon: <TrendingUp style={{ fontSize: "20px" }} />,
                text: "Employee TDS Details",
              },
              {
                key: "form-16",
                isVisible: true,
                link: `/organisation/${orgId}/form-16`,
                icon: <Description style={{ fontSize: "20px" }} />,
                text: "Form-16",
              },

              {
                key: "createsalary",
                isVisible:
                  isVisible &&
                  [
                    "Super-Admin",
                    "Delegate-Super-Admin",
                    "HR",
                    "Accountant",
                    "Delegate-Super-Admin",
                  ].includes(role),
                link: `/organisation/${orgId}/salary-management`,
                icon: (
                  <AccountBalanceWalletOutlinedIcon
                    style={{ fontSize: "20px" }}
                  />
                ),
                text: "Salary Management",
              },
              {
                key: "loanmanagement",
                isVisible: true,
                link: `/organisation/${orgId}/add-loan`,
                icon: <FaMoneyCheckDollar style={{ fontSize: "20px" }} />,
                text: "Loan Management",
              },
              {
                key: "advanceSalary",
                isVisible: true,
                link: `/organisation/${orgId}/advance-salary`,
                icon: <MonetizationOnOutlined style={{ fontSize: "20px" }} />,
                text: "Advance Salary",
              },
            ],
          },
          Employee: {
            open: false,
            icon: <PeopleAlt style={{ fontSize: "20px" }} />,
            isVisible:
              window.location.pathname?.includes("organisation") &&
              [
                "Super-Admin",
                "Delegate-Super-Admin",
                "Delegate-Super-Admin",
                "Department-Head",
                "Delegate-Department-Head",
                "Department-Admin",
                "Delegate-Department-Admin",
                "Accountant",
                "Delegate-Accountant",
                "HR",
                "Manager",
                "Employee",
                "Teacher",
              ]?.includes(role),
            routes: [
              {
                key: "onboarding",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Delegate-Super-Admin",
                ].includes(role),
                link: `/organisation/${orgId}/employee-onboarding`,
                icon: <PersonAdd style={{ fontSize: "20px" }} />,
                text: "Onboarding",
              },
              {
                key: "offboarding",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Delegate-Super-Admin",
                ].includes(role),
                link: `/organisation/${orgId}/employee-offboarding`,
                icon: <PersonRemove style={{ fontSize: "20px" }} />,
                text: "Offboarding",
              },
              {
                key: "employeeList",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "Delegate-Super-Admin",
                  "Department-Head",
                  "Delegate-Department-Head",
                  "Department-Admin",
                  "Delegate-Department-Admin",
                  "Accountant",
                  "Delegate-Accountant",
                  "HR",
                  "Manager",
                  "Employee",
                  "Teacher",
                ].includes(role),
                link: `/organisation/${orgId}/employee-list`,
                icon: <Groups style={{ fontSize: "20px" }} />,
                text: "Employee List",
              },
            ],
          },
          "Machine Punching": {
            open: false,
            icon: <PeopleAlt style={{ fontSize: "20px" }} />,
            isVisible:
              window.location.pathname?.includes("organisation") &&
              [
                "Super-Admin",
                "Delegate-Super-Admin",
                "HR",
                "Employee",
              ]?.includes(role),
            routes: [
              {
                key: "punchingMachine",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Delegate-Super Admin",
                ].includes(role),
                link: `/organisation/${orgId}/emo-info-punch-status`,
                icon: <PunchClockIcon style={{ fontSize: "20px" }} />,
                text: "Punch Sync ",
              },

              {
                key: "viewAttendance",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Delegate-Super Admin",
                ].includes(role),
                link: `/organisation/${orgId}/view-attendance-biomatric`,
                icon: <AccessTimeIcon style={{ fontSize: "20px" }} />,
                text: "Time Track",
              },
              {
                key: "viewCalculate",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Delegate-Super Admin",
                ].includes(role),
                link: `/organisation/${orgId}/view-calculate-data`,
                icon: <CalendarMonthIcon style={{ fontSize: "20px" }} />,
                text: "Calendar View",
              },
              {
                key: "misspunchInOutRecord",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Delegate-Super Admin",
                ].includes(role),
                link: `/organisation/${orgId}/missed-punch-in-out`,
                icon: <CallMissedIcon style={{ fontSize: "20px" }} />,
                text: "Missed Punch ",
              },

              {
                key: "missjustify",
                isVisible: ["Employee"].includes(role),
                link: `/organisation/${orgId}/missed-justify`,
                icon: <ReceiptIcon style={{ fontSize: "20px" }} />,
                text: "Missed Justify",
              },
            ],
          },
          Department: {
            open: false,
            isVisible:
              window.location.pathname.includes("organisation") &&
              [
                "Super-Admin",
                "Delegate-Super-Admin",
                "Delegate-Super-Admin",
                "HR",
                "Department-Head",
                "Delegate-Department-Head",
                "Department-Admin",
                "Delegate-Department-Admin",
              ].includes(role),
            // : false
            icon: <Business style={{ fontSize: "20px" }} />,
            routes: [
              {
                key: "addDepartment",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Department-Head",
                  "Delegate-Department-Head",
                  "Department-Admin",
                  "Delegate-Department-Admin",
                ].includes(role),
                link: `/organisation/${orgId}/add-department`,
                icon: (
                  <AddCircleOutlineOutlinedIcon style={{ fontSize: "20px" }} />
                ),
                text: "Add Department",
              },

              {
                key: "departmentList",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Department-Head",
                  "Delegate-Department-Head",
                  "Department-Admin",
                  "Delegate-Department-Admin",
                ].includes(role),
                link: `/organisation/${orgId}/department-list`,
                icon: <ListAltOutlinedIcon style={{ fontSize: "20px" }} />,
                text: "Manage Department",
              },
            ],
          },
          Recruitment: {
            open: false,
            icon: <PeopleAlt style={{ fontSize: "20px" }} />,
            isVisible:
              [
                "Super-Admin",
                "Delegate-Super-Admin",
                "Department-Head",
                "Delegate-Department-Head",
                "Department-Admin",
                "Delegate-Department-Admin",
                "Accountant",
                "Delegate-Accountant",
                "HR",
                "Manager",
                "Employee",

              ].includes(role) &&
              data?.organisation?.packageInfo === "Enterprise Plan",
            routes: [
              {
                key: "openjobposition",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                ].includes(role),
                link: `organisation/${orgId}/manager-open-job-vacancy`,
                icon: <PersonRemove style={{ fontSize: "20px" }} />,
                text: "Manager job vancany",
              },
              {
                key: "createdJobPost",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                ].includes(role),
                link: `organisation/${orgId}/created-job-post`,
                icon: <PersonRemove style={{ fontSize: "20px" }} />,
                text: "Created Job Post",
              },
              {
                key: "MrOpenJobVacancyList",
                isVisible: [
                  "Manager",
                ].includes(role),
                link: `organisation/${orgId}/mr-open-job-vacancy-list`,
                icon: <WorkIcon style={{ fontSize: "20px" }} />,
                text: "Job vacancy",
              },
              {
                key: "openjobposition",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "Department-Head",
                  "Delegate-Department-Head",
                  "Department-Admin",
                  "Delegate-Department-Admin",
                  "Accountant",
                  "Delegate-Accountant",
                  "HR",
                  "Manager",
                  "Employee",
                ].includes(role),
                link: `organisation/${orgId}/open-job-position`,
                icon: <PersonRemove style={{ fontSize: "20px" }} />,
                text: "Open Job Role",
              },
              {
                key: "mySheduleInterview",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "Department-Head",
                  "Delegate-Department-Head",
                  "Department-Admin",
                  "Delegate-Department-Admin",
                  "Accountant",
                  "Delegate-Accountant",
                  "HR",
                  "Manager",
                  "Employee",
                ].includes(role),
                link: `organisation/${orgId}/interview-Shedule`,
                icon: <PersonRemove style={{ fontSize: "20px" }} />,
                text: "My Shedule Interview",
              },
              // {
              //   key: "MyOpenPosition",
              //   isVisible: [
              //     "Manager",
              //   ].includes(role),
              //   link: `organisation/${orgId}/my-open-job-vacancy`,
              //   icon: <WorkIcon style={{ fontSize: "20px" }} />,
              //   text: "My Open Position",
              // },
              // {
              //   key: "createjobposition",
              //   isVisible: [
              //     "Super-Admin",
              //     "Delegate-Super-Admin",
              //     "HR",
              //   ].includes(role),
              //   link: `organisation/${orgId}/create-job-position`,
              //   icon: <WorkIcon style={{ fontSize: "20px" }} />,
              //   text: "Create Job Position",
              // },
              // {
              //   key: "viewjobposition",
              //   isVisible: [
              //     "Super-Admin",
              //     "Delegate-Super-Admin",
              //     "HR",
              //     "Department-Head",
              //     "Delegate-Department-Head",
              //     "Manager",
              //   ].includes(role),
              //   link: `organisation/${orgId}/view-job-position`,
              //   icon: <PersonRemove style={{ fontSize: "20px" }} />,
              //   text: "View Job Position",
              // },
            ],
          },
          Communication: {
            open: false,
            isVisible:
              data?.organisation?.packageInfo === "Intermediate Plan" &&
              survey?.surveyPermission,
            icon: <Business style={{ fontSize: "20px" }} />,
            routes: [
              {
                key: "createCommunication",
                isVisible:
                  data?.organisation?.packageInfo === "Intermediate Plan" &&
                  survey?.surveyPermission,
                link: `/organisation/${orgId}/create-communication`,
                icon: <ChatIcon style={{ fontSize: "20px" }} />,
                text: "Broadcast",
              },
              {
                key: "EmployeeSurvey",
                isVisible:
                  data?.organisation?.packageInfo === "Intermediate Plan" &&
                  survey?.surveyPermission,
                link:
                  user?.profile.includes("Super-Admin") ||
                    user?.profile.includes("HR")
                    ? `/organisation/${orgId}/employee-survey`
                    : `/organisation/${orgId}/employee-survey/${empId}`,
                icon: <AssignmentIcon style={{ fontSize: "20px" }} />,
                text: "Employee Survey",
              },
            ],
          },
          Organisation: {
            open: false,
            isVisible: ["Super-Admin", "Delegate-Super-Admin"].includes(role),
            icon: <MonetizationOn style={{ fontSize: "20px" }} />,
            routes: [
              {
                key: "addOrganisation",
                isVisible: ["Super-Admin", "Delegate-Super-Admin"].includes(
                  role
                ),
                link: "/add-organisation",
                icon: <BusinessOutlinedIcon style={{ fontSize: "20px" }} />,
                text: "Add Organisation",
              },

              {
                key: "organisationList",
                isVisible: ["Super-Admin", "Delegate-Super-Admin"].includes(
                  role
                ),
                link: "/organizationList",
                icon: <IoListCircle style={{ fontSize: "20px" }} />,
                text: "Organisation List",
              },
              {
                key: "organisationList",
                isVisible: ["Super-Admin", "Delegate-Super-Admin"].includes(
                  role
                ),
                link: `/organisation/${orgId}/organisation-hierarchy`,
                icon: <AccountTreeOutlinedIcon style={{ fontSize: "20px" }} />,
                text: "Organisation Hierarchy",
              },
              {
                key: "billing",
                isVisible: ["Super-Admin", "Delegate-Super-Admin"].includes(
                  role
                )
                  ? true
                  : false,
                link: `/billing`,
                icon: <CurrencyRupee style={{ fontSize: "20px" }} />,
                text: "Billing",
              },
              {
                key: "add-delegate-super-admin",
                isVisible: ["Super-Admin"].includes(role) ? true : false,
                link: `/organisation/${orgId}/add-delegate`,
                icon: <SupervisorAccount style={{ fontSize: "20px" }} />,
                text: "Add Delegate Super Admin",
              },
            ],
          },
          "Remote Punch": {
            open: false,
            isVisible:
              ((["Employee"].includes(role) && !isUserMatchInEmployeeList) ||
                ([
                  "Super-Admin",
                  "Manager",
                  "Delegate-Super-Admin",
                  "HR",
                ].includes(role) &&
                  data?.organisation?.packageInfo === "Enterprise Plan")) &&
              (data?.organisation?.packageInfo === "Intermediate Plan" ||
                data?.organisation?.packageInfo === "Enterprise Plan"),
            icon: <MonetizationOn style={{ fontSize: "20px" }} />,
            routes: [
              {
                key: "addRemoteVisitTask",
                isVisible:
                  [
                    "Super-Admin",
                    "Manager",
                    "HR",
                    "Delegate-Super-Admin",
                  ].includes(role) &&
                  data?.organisation?.packageInfo === "Enterprise Plan",
                // &&
                // data?.organisation?.packages.includes("Remote Task")
                link: `/organisation/${orgId}/remote-punching-tasks`,
                icon: <AssignmentIcon style={{ fontSize: "20px" }} />,
                text: "Remote Visit tasks",
              },
              {
                key: "addPunch",
                isVisible:
                  ["Employee"].includes(role) && !isUserMatchInEmployeeList,
                link: `/organisation/${orgId}/employee-remote-punching`,
                icon: <Fingerprint style={{ fontSize: "20px" }} />,
                text: "Remote Punch-in-out",
              },
              {
                key: "missPunch",
                isVisible:
                  ["Employee"].includes(role) && !isUserMatchInEmployeeList,
                link: `/organisation/${orgId}/remotePunching`,
                icon: <PanToolAlt style={{ fontSize: "20px" }} />,
                text: "Apply Miss For Punch",
              },
            ],
          },

          //Skillmatrix
          "Skill Matrix": {
            open: false,
            isVisible:
              (["Employee"].includes(role) && !isUserMatchInEmployeeList) ||
              (["Super-Admin",
                "Delegate-Super-Admin",
                "HR",
                "Department-Head",
                "Delegate-Department-Head",
                "Manager",].includes(role) &&
                data?.organisation?.packageInfo === "Enterprise Plan"),
            icon: <MonetizationOn style={{ fontSize: "20px" }} />,
            routes: [
              // {
              //   key: "addSkillMatrix",
              //   isVisible:
              //     ["Super-Admin", "HR","Manager"].includes(role) &&
              //     data?.organisation?.packageInfo === "Enterprise Plan",
              //   // &&
              //   // data?.organisation?.packages.includes("Remote Task")
              //   link: `/organisation/${orgId}/skillMatrix/addSkill`,
              //   icon: <AddCircleIcon  style={{ fontSize: "20px" }} />,
              //   text: "Add Skill Matrix",
              // },
              {
                key: "myinsights",
                isVisible:
                  ["Employee"].includes(role) && !isUserMatchInEmployeeList,
                link: `/organisation/${orgId}/skillMatrix/insights`,
                icon: <SearchIcon style={{ fontSize: "20px" }} />,
                text: "My Insights",
              },
              {
                key: "MyTeaminsights",
                isVisible:
                  ["Super-Admin", "HR", "Manager"].includes(role) &&
                  data?.organisation?.packageInfo === "Enterprise Plan",
                link: `/organisation/${orgId}/skillMatrix/insights`,
                icon: <SearchIcon style={{ fontSize: "20px" }} />,
                text: "My Team Insights",
              },
              {
                key: "Orginsights",
                isVisible:
                  ["Super-Admin", "HR", "Manager"].includes(role) &&
                  data?.organisation?.packageInfo === "Enterprise Plan",
                link: `/organisation/${orgId}/skillMatrix/insights`,
                icon: <SearchIcon style={{ fontSize: "20px" }} />,
                text: "Organization Insights",
              },
              {
                key: "skillsLookup",
                isVisible:
                  ["Super-Admin", "HR", "Manager"].includes(role) &&
                  data?.organisation?.packageInfo === "Enterprise Plan",
                // &&
                // data?.organisation?.packages.includes("Skill Matrix"),
                link: `/organisation/${orgId}/skillMatrix/skills-lookup`,
                icon: <BuildIcon style={{ fontSize: "20px" }} />,
                text: "Skills Lookup",
              },
              {
                key: "reports",
                isVisible:
                  ["Super-Admin", "HR"].includes(role) &&
                  data?.organisation?.packageInfo === "Enterprise Plan",
                // &&
                // data?.organisation?.packages.includes("Skill Matrix"),
                link: `/organisation/${orgId}/skillMatrix/reports`,
                icon: <AssessmentIcon style={{ fontSize: "20px" }} />,
                text: "Reports",
              },
              {
                key: "setup",
                isVisible:
                  // ["Employee"].includes(role) && !isUserMatchInEmployeeList,
                  ["Super-Admin", "HR"].includes(role) &&
                  data?.organisation?.packageInfo === "Enterprise Plan",
                // &&
                // data?.organisation?.packages.includes("Skill Matrix"),
                link: `/organisation/${orgId}/skillMatrix/setup`,
                icon: <SettingsIcon style={{ fontSize: "20px" }} />,
                text: "Setup",
              },
              {
                key: "directory",
                isVisible:
                  ["Super-Admin", "HR"].includes(role) &&
                  data?.organisation?.packageInfo === "Enterprise Plan",
                // &&
                // data?.organisation?.packages.includes("Skill Matrix"),
                link: `/organisation/${orgId}/skillMatrix/directory`,
                icon: <AccountBoxIcon style={{ fontSize: "20px" }} />,
                text: "Directory",
              },
            ],
          },

          "Geo Fencing": {
            open: false,
            isVisible:
              (["Employee", "Teacher"].includes(role) && isUserMatchInEmployeeList) ||
              (["Manager", "Super-Admin", "Delegate-Super-Admin"].includes(
                role
              ) &&
                (data?.organisation?.packageInfo === "Intermediate Plan" ||
                  data?.organisation?.packageInfo === "Enterprise Plan" ||
                  data?.organisation?.packageInfo === "Fullskape Plan")),
            icon: <MonetizationOn style={{ fontSize: "20px" }} />,
            routes: [
              {
                key: "geoFencing",
                isVisible:
                  ["Employee", "Teacher"].includes(role) && isUserMatchInEmployeeList,
                link: `/organisation/${orgId}/geo-fencing`,
                icon: <LocationOn style={{ fontSize: "20px" }} />,
                text: "Geo Fencing",
              },
              {
                key: "geoFencing",
                isVisible: [
                  "Super-Admin",
                  "Manager",
                  "Delegate-Super-Admin",
                ].includes(role),
                link: `/organisation/${orgId}/remotePunching/geo-fencing`,
                icon: <LocationOn style={{ fontSize: "20px" }} />,
                text: "Add Geo Fencing",
              },
              
              {
                key: "geoFencing",
                isVisible: [
                  "Super-Admin",
                  "Teacher"].includes(role) && (data?.organisation?.packageInfo === "Fullskape Plan"),
                
                link: `/organisation/${orgId}/Attendance`,
                icon: <Group style={{ fontSize: "20px" }} />,
                text: "Attendance",
              },
            ],
          },

          "Catering And Food": {
            open: false,
            isVisible: data?.organisation?.packageInfo === "Enterprise Plan",
            icon: <MonetizationOn style={{ fontSize: "20px" }} />,
            routes: [
              {
                key: "onboarding",
                isVisible: ["Super-Admin", "HR"].includes(role),

                link: `/organisation/${orgId}/catering/onboarding`,
                icon: <ArticleIcon style={{ fontSize: "20px" }} />,
                text: "Vendor Onboard",
              },

              {
                key: "Food",
                isVisible: ["Employee"].includes(role),

                link: `/organisation/${orgId}/catering/onboarding/Food`,
                icon: <FoodBankIcon style={{ fontSize: "20px" }} />,
                text: "Food",
              },

              {
                key: "OrderHistory",
                isVisible: ["Employee"].includes(role),

                link: `/organisation/${orgId}/${empId}/orderhistory`,
                icon: <HistoryIcon className=" !text-[1.2em] text-[#67748E]" />,
                text: "Order History",
              },
            ],
          },

          Records: {
            open: false,
            isVisible: data?.organisation?.packageInfo === "Intermediate Plan",
            icon: <MonetizationOn style={{ fontSize: "20px" }} />,
            routes: [
              {
                key: "empDocs",
                isVisible: true,
                link: `/organisation/${orgId}/records`,
                icon: <ArticleIcon style={{ fontSize: "20px" }} />,
                text: "My Records",
              },


              {
                key: "orgDocs",
                isVisible: ["Employee"].includes(role),
                link: `/organisation/${orgId}/orgrecords/policies/emp`,
                icon: <DescriptionOutlinedIcon style={{ fontSize: "20px" }} />,
                text: "Policies and Procedures",
              },

              {
                key: "orgDocs",
                isVisible: ["HR", "Super-Admin"].includes(role),
                link: `/organisation/${orgId}/orgrecords/policies/hr`,
                icon: <DescriptionOutlinedIcon style={{ fontSize: "20px" }} />,
                text: "Policies and Procedures",
              },

              {
                key: "orgDocs",
                isVisible: ["HR", "Super-Admin"].includes(
                  role
                ),
                link: `/organisation/${orgId}/org/docs/auth/hr`,
                icon: <NoteAltOutlinedIcon style={{ fontSize: "20px" }} />,
                text: "Letter",
              },

              {
                key: "orgDocs",
                isVisible: ["Employee"].includes(
                  role
                ),
                link: `/organisation/${orgId}/org/docs/auth/emp`,
                icon: <NoteAltOutlinedIcon style={{ fontSize: "20px" }} />,
                text: "Letter",
              },


            ],
          },



          Training: {
            open: false,
            isVisible: data?.organisation?.packageInfo === "Intermediate Plan",
            icon: <MonetizationOn style={{ fontSize: "20px" }} />,
            routes: [
              {
                key: "myTraining",
                isVisible: ["Employee", "Manager", "Accountant"].includes(role),
                link: "/my-training",
                icon: <ArticleIcon style={{ fontSize: "20px" }} />,
                text: "My Trainings",
              },
              {
                key: "manageTraining",
                isVisible:
                  ["HR", "Super-Admin", "Delegate-Super-Admin"].includes(
                    role
                  ) && window.location.pathname?.includes("organisation"),
                link: `/organisation/${orgId}/manage-training`,
                icon: <ModelTrainingOutlined style={{ fontSize: "20px" }} />,
                text: "Manage Trainings",
              },
            ],
          },
        };
      }
    },
    // eslint-disable-next-line
    [
      isVisible,
      orgId,
      check,
      data?.organisation?.packageInfo,
      location.pathname,
      role,
      survey?.surveyPermission,
    ]
  );

  // Define the navigation items for vendors
  const vendorNavItems = useMemo(() => {
    return {
      Home: {
        open: false,
        icon: <Category style={{ fontSize: "20px" }} />,
        isVisible: true,
        routes: [
          {
            key: "vendor-dashboard",
            isVisible: true,
            link: `/organisation/${orgId}/vendor-dashboard`,
            icon: <Dashboard style={{ fontSize: "20px" }} />,
            text: "Vendor Dashboard",
          },
        ],
      },

      "Catering And Food": {
        open: true,
        // isVisible: data?.organisation?.packageInfo === "Enterprise Plan",
        icon: <Category style={{ fontSize: "20px" }} />,
        isVisible: true,
        routes: [
          {
            key: "manage-orders",
            isVisible: true,
            link: `/vendor/${orgId}/${empId}/add-menu`,
            // link: `/organisation/${orgId}/vendor-orders`,
            icon: <AddCircleOutlineIcon style={{ fontSize: "20px" }} />,
            text: "Add Menu",
          },

          {
            key: "Menu-list",
            isVisible: true,
            link: `/vendor/${orgId}/${empId}/list-menu`,
            // link: `/organisation/${orgId}/vendor-orders`,
            icon: <ListAltIcon className="!text-[1.2em] text-[#67748E]" />,
            text: "Menu List",
          },

          {
            key: "Add-Coupon",
            isVisible: true,
            link: `/vendor/${orgId}/${empId}/add-coupon`,
            // link: `/organisation/${orgId}/vendor-orders`,
            icon: (
              <AddCircleOutlineIcon className="!text-[1.2em] text-[#67748E]" />
            ),
            text: "Add Coupon",
          },

          {
            key: "Coupon-List",
            isVisible: true,
            link: `/vendor/${orgId}/${empId}/show-coupon`,
            // link: `/organisation/${orgId}/vendor-orders`,
            icon: (
              <SpeakerNotesOutlinedIcon className="!text-[1.2em] text-[#67748E]" />
            ),
            text: "Coupon List",
          },

          {
            key: "Order",
            isVisible: true,
            link: `/vendor/${orgId}/Order`,
            // link: `/organisation/${orgId}/vendor-orders`,

            icon: <DeliveryDiningIcon style={{ fontSize: "20px" }} />,
            text: "Order",
          },
        ],
      },
      // Other vendor-specific nav items...
    };
  }, [orgId, empId]);

  useEffect(() => {
    try {
      if (token) {
        const newToken = jwtDecode(token);

        setDecodedToken(newToken);
        if (decodedToken && decodedToken?.user?.profile) {
        }
      }
    } catch (error) {
      console.error("Failed to decode the token:", error);
    }
    // eslint-disable-next-line
  }, [token]);

  // Assuming response is accessible here

  const finalNavItems = isVendor ? vendorNavItems : navItems;
  //const roles = ["Home", "Attendance", "Self Help", "Payroll", "Employee", "Machine Punching", "Organisation", "Department", "Recruitment", "Communication", "Report", "Performance", "Department", "Recruitment", "Communication", "Organisation", "Records", "Training", "Remote Punch", "Geo Fencing", "Catering and food",]

  //fav item add
  const employeeId = user?._id;
  const authToken = cookies["aegis"];
  const [favoriteRoles, setFavoriteRoles] = useState([]);
  console.log("favoriteRoles", favoriteRoles);

  const currentRoute = useLocation().pathname;
  // Fetch favorite roles using GET API
  const fetchFavoriteRoles = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/get-fav-navigation-items/${employeeId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    setFavoriteRoles(response?.data?.favItems || []);
    return response?.data;
  };

  // Fetch favorite roles on mount
  useQuery("favoriteRoles", fetchFavoriteRoles, {
    enabled: !!employeeId,
  });
  const [dropdown, setDropdown] = useState(false);
  return (
    <>
      <div
        className="my-2 flex gap-3 justify-between px-4 text-sm items-center cursor-pointer"
        onClick={() => setDropdown((prev) => !prev)}
      >
        <h1 className="py-1 text-base tracking-tighter font-bold">
          Favorite Items
        </h1>
        <div className="flex items-center gap-2">
          <ChevronRight
            className={`text-gray-500 !h-5 transition-all ${dropdown ? "transform rotate-90" : "rotate-0"
              }`}
          />
        </div>
      </div>

      {dropdown &&
        favoriteRoles?.map((favItem, index) => (
          <div key={index}>
            <Link
              to={favItem?.link}
              className={`rounded-md flex items-center gap-1 py-2 text-gray-500
              ${currentRoute === favItem?.link
                  ? "!text-white !bg-[#1414fe]"
                  : ""
                }
              m-2 px-6 transition duration-200 hover:!text-white hover:!bg-[#1414fe]`}
            >
              <h1 className="tracking-tight font-bold text-sm">
                {favItem?.text}
              </h1>
            </Link>
          </div>
        ))}
      {Object.keys(finalNavItems)?.map((role, index) => {
        const { icon, routes, isVisible } = finalNavItems[role];
        return (
          <TestAccordian
            key={index}
            role={role}
            icon={icon}
            routes={routes}
            isVisible={isVisible}
            valueBoolean={openIndex === index}
            handleAccordianClick={() => handleAccordianClick(index)}
            pinned={pinned}
            setPinned={setPinned}
          />
        );
      })}
    </>
  );
};

export default TestNavItems;

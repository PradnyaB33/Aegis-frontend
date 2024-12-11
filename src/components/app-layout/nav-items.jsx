import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AddIcon from "@mui/icons-material/Add";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import CategoryIcon from "@mui/icons-material/Category";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ListAltIcon from "@mui/icons-material/ListAlt";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import MoneyIcon from "@mui/icons-material/Money";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SettingsIcon from "@mui/icons-material/Settings";
import WorkIcon from "@mui/icons-material/Work";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";

const NavItems = ({ toggleDrawer }) => {
  const [userRole, setUserRole] = useState(null);
  const { cookies } = useContext(UseContext);
  const token = cookies["aegis"];

  useEffect(() => {
    try {
      if (token) {
        const decodedToken = jwtDecode(token);
        if (decodedToken && decodedToken.user.profile) {
          setUserRole(decodedToken.user.profile);
        } else {
          setUserRole("guest");
        }
      }
    } catch (error) {
      console.error("Failed to decode the token:", error);
    }
  }, [token]);
  const decodedToken = token && jwtDecode(token);
  const id = decodedToken?.user?.organizationId;

  function formatRoles(userRole) {
    if (userRole.length === 1) {
      return userRole[0];
    } else if (userRole.length === 2) {
      return `${userRole[0]} and ${userRole[1]}`;
    } else {
      const otherRoles = userRole.slice(0, -1).join(", ");
      const lastRole = userRole[userRole.length - 1];
      return `${otherRoles}, and ${lastRole}`;
    }
  }

  return (
    <>
      {userRole &&
        (userRole.includes("employee") ||
          userRole.includes("Manager") ||
          userRole.includes("Department Admin") ||
          userRole.includes("Delagate Department Admin") ||
          userRole.includes("Department Head") ||
          userRole.includes("Delagate Department Head") ||
          userRole.includes("HR") ||
          userRole.includes("Super-Admin") ||
          userRole.includes("Accoutant") ||
          userRole.includes("Delegate Accoutant") ||
          userRole.includes("Delegate Super Admin") ? (
          <List>
            <ListItem components={"div"} onClick={(e) => e.stopPropagation()}>
              <Accordion
                expanded={true}
                className="w-full !shadow-none border-[#0093d6] "
                style={{ background: "rgb(14, 165, 233)" }}
              >
                <AccordionSummary
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography
                    style={{ fontSize: "15px" }}
                    className="text-white text-sm"
                  >
                    {formatRoles(userRole)}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ListItem disablePadding>
                    <Link
                      onClick={() => toggleDrawer()}
                      to="#"
                      className="w-full"
                    >
                      <ListItemButton className="!p-2 !rounded-lg w-full">
                        <ListItemIcon className="p-2 !min-w-[25px]">
                          <DashboardIcon className="text-white" />
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{
                            style: { fontSize: 13 },
                          }}
                          style={{ fontSize: "10px" }}
                          className="text-white text-sm"
                          primary={"Dashboard"}
                        />
                      </ListItemButton>
                    </Link>
                  </ListItem>

                  <ListItem disablePadding>
                    <Link
                      onClick={() => toggleDrawer()}
                      to="#"
                      className="w-full"
                    >
                      <ListItemButton className="!p-2 !rounded-lg w-full">
                        <ListItemIcon className="p-2 !min-w-[25px]">
                          <SettingsIcon className="text-white" />
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{
                            style: { fontSize: 13 },
                          }}
                          style={{ fontSize: "10px" }}
                          className="text-white text-sm"
                          primary={"Account Setting's"}
                        />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                </AccordionDetails>
              </Accordion>
            </ListItem>

            <ListItem onClick={(e) => e.stopPropagation()}>
              <Accordion
                expanded={true}
                className="w-full !shadow-none border-[#0093d6] "
                style={{ background: "rgb(14, 165, 233)" }}
              >
                <Accordion
                  className="w-full !shadow-none border-[#0093d6] "
                  style={{ background: "rgb(14, 165, 233)" }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon className="text-white" />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className="text-white">Payroll</Typography>
                  </AccordionSummary>
                  <ListItem disablePadding>
                    <Link
                      onClick={() => toggleDrawer()}
                      to="#"
                      className="w-full"
                    >
                      <ListItemButton className="!p-2 !rounded-lg w-full">
                        <ListItemIcon className="p-2 !min-w-[25px]">
                          <AccessTimeIcon className="text-white" />
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{
                            style: { fontSize: 13 },
                          }}
                          style={{ fontSize: "10px" }}
                          className="text-white text-sm"
                          primary={"Attendance & Leave Management"}
                        />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                  <ListItem disablePadding>
                    <Link
                      onClick={() => toggleDrawer()}
                      to="/leave"
                      className="w-full"
                    >
                      <ListItemButton className="!p-2 !rounded-lg w-full">
                        <ListItemIcon className="p-2 !min-w-[25px]">
                          <MoneyIcon className="text-white" />
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{
                            style: { fontSize: 13 },
                          }}
                          style={{ fontSize: "10px" }}
                          className="text-white text-sm"
                          primary={"Allowance"}
                        />
                      </ListItemButton>
                    </Link>
                    <Link
                      onClick={() => toggleDrawer()}
                      to="/leave"
                      className="w-full"
                    >
                      <ListItemButton className="!p-2 !rounded-lg w-full">
                        <ListItemIcon className="p-2 !min-w-[25px]">
                          <MoneyIcon className="text-white" />
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{
                            style: { fontSize: 13 },
                          }}
                          style={{ fontSize: "10px" }}
                          className="text-white text-sm"
                          primary={"Allowance"}
                        />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                  <ListItem disablePadding>
                    <Link
                      onClick={() => toggleDrawer()}
                      to="#"
                      className="w-full"
                    >
                      <ListItemButton className="!p-2 !rounded-lg w-full">
                        <ListItemIcon className="p-2 !min-w-[25px]">
                          <ReceiptIcon className="text-white" />
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{
                            style: { fontSize: 13 },
                          }}
                          style={{ fontSize: "10px" }}
                          className="text-white text-sm"
                          primary={"Payslip"}
                        />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                  <ListItem disablePadding>
                    <Link
                      onClick={() => toggleDrawer()}
                      to="#"
                      className="w-full"
                    >
                      <ListItemButton className="!p-2 !rounded-lg w-full">
                        <ListItemIcon className="p-2 !min-w-[25px]">
                          <AccountBalanceIcon className="text-white" />
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{
                            style: { fontSize: 13 },
                          }}
                          style={{ fontSize: "10px" }}
                          className="text-white text-sm"
                          primary={"Income Tax"}
                        />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                  <ListItem disablePadding>
                    <Link
                      onClick={() => toggleDrawer()}
                      to="#"
                      className="w-full"
                    >
                      <ListItemButton className="!p-2 !rounded-lg w-full">
                        <ListItemIcon className="p-2 !min-w-[25px]">
                          <DescriptionIcon className="text-white" />
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{
                            style: { fontSize: 13 },
                          }}
                          style={{ fontSize: "10px" }}
                          className="text-white text-sm"
                          primary={"Form-16"}
                        />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                  <ListItem disablePadding>
                    <Link
                      onClick={() => toggleDrawer()}
                      to="#"
                      className="w-full"
                    >
                      <ListItemButton className="!p-2 !rounded-lg w-full">
                        <ListItemIcon className="p-2 !min-w-[25px]">
                          <WorkIcon className="text-white" />
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{
                            style: { fontSize: 13 },
                          }}
                          style={{ fontSize: "10px" }}
                          className="text-white text-sm"
                          primary={"Shift Management"}
                        />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                </Accordion>
              </Accordion>
            </ListItem>

            <ListItem onClick={(e) => e.stopPropagation()}>
              <Accordion
                expanded={true}
                className="w-full !shadow-none border-[#0093d6] "
                style={{ background: "rgb(14, 165, 233)" }}
              >
                <Accordion
                  className="w-full !shadow-none border-[#0093d6] "
                  style={{ background: "rgb(14, 165, 233)" }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon className="text-white" />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className="text-white">Notification</Typography>
                  </AccordionSummary>
                  <ListItem disablePadding>
                    <Link
                      onClick={() => toggleDrawer()}
                      to="#"
                      className="w-full"
                    >
                      <ListItemButton className="!p-2 !rounded-lg w-full">
                        <ListItemIcon className="p-2 !min-w-[25px]">
                          <AddAlertIcon className="text-white" />
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{
                            style: { fontSize: 13 },
                          }}
                          style={{ fontSize: "10px" }}
                          className="text-white text-sm"
                          primary={"Create Notification"}
                        />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                  <ListItem disablePadding>
                    <Link
                      onClick={() => toggleDrawer()}
                      to="/notification"
                      className="w-full"
                    >
                      <ListItemButton className="!p-2 !rounded-lg w-full">
                        <ListItemIcon className="p-2 !min-w-[25px]">
                          <ListAltIcon className="text-white" />
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{
                            style: { fontSize: 13 },
                          }}
                          style={{ fontSize: "10px" }}
                          className="text-white text-sm"
                          primary={"List Notification"}
                        />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                </Accordion>
              </Accordion>
            </ListItem>
          </List>
        ) : null)}

      {userRole &&
        (userRole.includes("Department Admin") ||
          userRole.includes("Delagate Department Admin") ||
          userRole.includes("HR") ||
          userRole.includes("Super-Admin") ? (
          <List>
            <ListItem onClick={(e) => e.stopPropagation()}>
              <Accordion
                className="w-full !shadow-none border-[#0093d6] "
                style={{ background: "rgb(14, 165, 233)" }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon className="text-white" />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className="text-white">Employee</Typography>
                </AccordionSummary>
                <ListItem disablePadding>
                  <Link
                    onClick={() => toggleDrawer()}
                    to={`/organisation/${id}/add-employee`}
                    className="w-full"
                  >
                    <ListItemButton className="!p-2 !rounded-lg w-full">
                      <ListItemIcon className="p-2 !min-w-[25px]">
                        <PersonAddIcon className="text-white" />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{
                          style: { fontSize: 13 },
                        }}
                        style={{ fontSize: "10px" }}
                        className="text-white text-sm"
                        primary={"Onboarding"}
                      />
                    </ListItemButton>
                  </Link>
                </ListItem>
                <ListItem disablePadding>
                  <Link
                    onClick={() => toggleDrawer()}
                    to="#"
                    className="w-full"
                  >
                    <ListItemButton className="!p-2 !rounded-lg w-full">
                      <ListItemIcon className="p-2 !min-w-[25px]">
                        <EditIcon className="text-white" />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{
                          style: { fontSize: 13 },
                        }}
                        style={{ fontSize: "10px" }}
                        className="text-white text-sm"
                        primary={"Update Employee"}
                      />
                    </ListItemButton>
                  </Link>
                </ListItem>
                <ListItem disablePadding>
                  <Link
                    onClick={() => toggleDrawer()}
                    to="/del-employee"
                    className="w-full"
                  >
                    <ListItemButton className="!p-2 !rounded-lg w-full">
                      <ListItemIcon className="p-2 !min-w-[25px]">
                        <DeleteIcon className="text-white" />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{
                          style: { fontSize: 13 },
                        }}
                        style={{ fontSize: "10px" }}
                        className="text-white text-sm"
                        primary={"Offboarding"}
                      />
                    </ListItemButton>
                  </Link>
                </ListItem>
                <ListItem disablePadding>
                  <Link
                    onClick={() => toggleDrawer()}
                    to="#"
                    className="w-full"
                  >
                    <ListItemButton className="!p-2 !rounded-lg w-full">
                      <ListItemIcon className="p-2 !min-w-[25px]">
                        <ListAltIcon className="text-white" />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{
                          style: { fontSize: 13 },
                        }}
                        style={{ fontSize: "10px" }}
                        className="text-white text-sm"
                        primary={"Employee List"}
                      />
                    </ListItemButton>
                  </Link>
                </ListItem>
              </Accordion>
            </ListItem>
          </List>
        ) : null)}

      {userRole &&
        (userRole.includes("Department Head") ||
          userRole.includes("Delagate Department Head") ||
          userRole.includes("Super-Admin") ? (
          <List>
            <ListItem onClick={(e) => e.stopPropagation()}>
              <Accordion
                expanded={true}
                className="w-full !shadow-none border-[#0093d6] "
                style={{ background: "rgb(14, 165, 233)" }}
              >
                <Accordion
                  className="w-full !shadow-none border-[#0093d6] "
                  style={{ background: "rgb(14, 165, 233)" }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon className="text-white" />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className="text-white">Department</Typography>
                  </AccordionSummary>
                  <ListItem disablePadding>
                    <Link
                      onClick={() => toggleDrawer()}
                      to="/add-department"
                      className="w-full"
                    >
                      <ListItemButton className="!p-2 !rounded-lg w-full">
                        <ListItemIcon className="p-2 !min-w-[25px]">
                          <PersonAddIcon className="text-white" />
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{
                            style: { fontSize: 13 },
                          }}
                          style={{ fontSize: "10px" }}
                          className="text-white text-sm"
                          primary={"Add Department"}
                        />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                  {/* <ListItem disablePadding>
                    <Link
                      onClick={() => toggleDrawer()}
                      to="#"
                      className="w-full"
                    >
                      <ListItemButton className="!p-2 !rounded-lg w-full">
                        <ListItemIcon className="p-2 !min-w-[25px]">
                          <EditIcon className="text-white" />
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{
                            style: { fontSize: 13 },
                          }}
                          style={{ fontSize: "10px" }}
                          className="text-white text-sm"
                          primary={"Update Department"}
                        />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                  <ListItem disablePadding>
                    <Link
                      onClick={() => toggleDrawer()}
                      to="/del-department"
                      className="w-full"
                    >
                      <ListItemButton className="!p-2 !rounded-lg w-full">
                        <ListItemIcon className="p-2 !min-w-[25px]">
                          <DeleteIcon className="text-white" />
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{
                            style: { fontSize: 13 },
                          }}
                          style={{ fontSize: "10px" }}
                          className="text-white text-sm"
                          primary={"Delete Department"}
                        />
                      </ListItemButton>
                    </Link>
                  </ListItem> */}
                  <ListItem disablePadding>
                    <Link
                      onClick={() => toggleDrawer()}
                      to="/department-list"
                      className="w-full"
                    >
                      <ListItemButton className="!p-2 !rounded-lg w-full">
                        <ListItemIcon className="p-2 !min-w-[25px]">
                          <CategoryIcon className="text-white" />
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{
                            style: { fontSize: 13 },
                          }}
                          style={{ fontSize: "10px" }}
                          className="text-white text-sm"
                          primary={"Department List"}
                        />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                </Accordion>
              </Accordion>
            </ListItem>
          </List>
        ) : null)}

      {userRole &&
        (userRole.includes("Super-Admin") ? (
          <List>
            <ListItem onClick={(e) => e.stopPropagation()}>
              <Accordion
                expanded={true}
                className="w-full !shadow-none border-[#0093d6] "
                style={{ background: "rgb(14, 165, 233)" }}
              >
                <Accordion
                  className="w-full !shadow-none border-[#0093d6] "
                  style={{ background: "rgb(14, 165, 233)" }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon className="text-white" />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className="text-white">Organization</Typography>
                  </AccordionSummary>

                  <ListItem disablePadding>
                    <Link
                      onClick={() => toggleDrawer()}
                      to="/add-organisation"
                      className="w-full"
                    >
                      <ListItemButton className="!p-2 !rounded-lg w-full">
                        <ListItemIcon className="p-2 !min-w-[25px]">
                          <AddIcon className="text-white" />
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{
                            style: { fontSize: 13 },
                          }}
                          style={{ fontSize: "10px" }}
                          className="text-white text-sm"
                          primary={"Add Organisation"}
                        />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                  <ListItem disablePadding>
                    <Link
                      onClick={() => toggleDrawer()}
                      to="#"
                      className="w-full"
                    >
                      <ListItemButton className="!p-2 !rounded-lg w-full">
                        <ListItemIcon className="p-2 !min-w-[25px]">
                          <EditIcon className="text-white" />
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{
                            style: { fontSize: 13 },
                          }}
                          style={{ fontSize: "10px" }}
                          className="text-white text-sm"
                          primary={"Update Organization"}
                        />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                  <ListItem disablePadding>
                    <Link
                      onClick={() => toggleDrawer()}
                      to="#"
                      className="w-full"
                    >
                      <ListItemButton className="!p-2 !rounded-lg w-full">
                        <ListItemIcon className="p-2 !min-w-[25px]">
                          <DeleteIcon className="text-white" />
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{
                            style: { fontSize: 13 },
                          }}
                          style={{ fontSize: "10px" }}
                          className="text-white text-sm"
                          primary={"Delete Organisation"}
                        />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                  <ListItem disablePadding>
                    <Link
                      onClick={() => toggleDrawer()}
                      to="/organizationList"
                      className="w-full"
                    >
                      <ListItemButton className="!p-2 !rounded-lg w-full">
                        <ListItemIcon className="p-2 !min-w-[25px]">
                          <ListAltIcon className="text-white" />
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{
                            style: { fontSize: 13 },
                          }}
                          style={{ fontSize: "10px" }}
                          className="text-white text-sm"
                          primary={"Organization List"}
                        />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                </Accordion>
              </Accordion>
            </ListItem>
          </List>
        ) : null)}

      {userRole &&
        (userRole.includes("Department Admin") ||
          userRole.includes("Delagate Department Admin") ||
          userRole.includes("Department Head") ||
          userRole.includes("Delagate Department Head") ||
          userRole.includes("HR") ||
          userRole.includes("Delegate Hr") ||
          userRole.includes("Super-Admin") ? (
          <List sx={{ padding: "0px" }}>
            <ListItem onClick={(e) => e.stopPropagation()}>
              <ListItem disablePadding>
                <Link
                  onClick={() => toggleDrawer()}
                  to="/leave"
                  className="w-full"
                >
                  <ListItemButton className="!p-2 !rounded-lg w-full">
                    <ListItemIcon className="p-2 !min-w-[25px]">
                      <PeopleIcon className="text-white" />
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        style: { fontSize: 13 },
                      }}
                      style={{ fontSize: "10px" }}
                      className="text-white text-sm"
                      primary={"Leave Application"}
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            </ListItem>
          </List>
        ) : null)}

      {userRole &&
        (userRole.includes("HR") ||
          userRole.includes("Delegate Hr") ||
          userRole.includes("Accoutant") ||
          userRole.includes("Delegate Accoutant") ||
          userRole.includes("Super-Admin") ? (
          <List sx={{ padding: "0px" }}>
            <ListItem onClick={(e) => e.stopPropagation()}>
              <ListItem disablePadding>
                <Link onClick={() => toggleDrawer()} to="#" className="w-full">
                  <ListItemButton className="!p-2 !rounded-lg w-full">
                    <ListItemIcon className="p-2 !min-w-[25px]">
                      <MonetizationOnIcon className="text-white" />
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        style: { fontSize: 13 },
                      }}
                      style={{ fontSize: "10px" }}
                      className="text-white text-sm"
                      primary={"Salary"}
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            </ListItem>
          </List>
        ) : null)}

      {userRole &&
        (userRole.includes("Manager") ||
          userRole.includes("Department Head") ||
          userRole.includes("Delagate Department Head") ||
          userRole.includes("Super-Admin") ||
          userRole.includes("Delegate Super Admin") ? (
          <>
            <List sx={{ padding: "0px" }}>
              <ListItem onClick={(e) => e.stopPropagation()}>
                <ListItem disablePadding>
                  <Link
                    onClick={() => toggleDrawer()}
                    to="#"
                    className="w-full"
                  >
                    <ListItemButton className="!p-2 !rounded-lg w-full">
                      <ListItemIcon className="p-2 !min-w-[25px]">
                        <CheckCircleIcon className="text-white" />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{
                          style: { fontSize: 13 },
                        }}
                        style={{ fontSize: "10px" }}
                        className="text-white text-sm"
                        primary={"Approval"}
                      />
                    </ListItemButton>
                  </Link>
                </ListItem>
              </ListItem>
              <ListItem onClick={(e) => e.stopPropagation()}>
                <ListItem disablePadding>
                  <Link
                    onClick={() => toggleDrawer()}
                    to="#"
                    className="w-full"
                  >
                    <ListItemButton className="!p-2 !rounded-lg w-full">
                      <ListItemIcon className="p-2 !min-w-[25px]">
                        <PeopleIcon className="text-white" />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{
                          style: { fontSize: 13 },
                        }}
                        style={{ fontSize: "10px" }}
                        className="text-white text-sm"
                        primary={"Employee List"}
                      />
                    </ListItemButton>
                  </Link>
                </ListItem>
              </ListItem>
            </List>
          </>
        ) : null)}
    </>
  );
};

export default NavItems;

import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionSummary,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const NavAccordian = ({
  icon,
  routes,
  role,
  toggleDrawer,
  valueBoolean,
  isVisible,
}) => {
  const [open, setOpen] = useState(valueBoolean);

  return (
    <>
      <List className="my-4">
        <ListItem
          style={{
            padding: "2px",

            borderRadius: "8px",
            width: "100%",
          }}
          components={{ Root: "div" }}
          className={`block ${!isVisible && "hidden"} `}
          onClick={(e) => {
            e.stopPropagation();
            if (open === true) {
              setOpen(false);
            } else {
              setOpen(true);
            }
          }}
        >
          <Accordion
            expanded={open}
            className="w-full !bg-white !shadow-none  border-none !m-0"
            style={{ background: "rgb(14, 165, 233)" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore className="text-black" />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              className="flex items-center justify-center !m-0"
            >
              <ListItemIcon className="px-4 !text-black  py-2 !min-w-[25px]">
                {icon}
              </ListItemIcon>
              <Typography className="text-black flex items-center">
                {role}
              </Typography>
            </AccordionSummary>
            {routes.map((route) => (
              <ListItem
                style={{
                  padding: "8px",
                  borderRadius: "8px",
                  width: "100%",
                }}
                className={`${route.isVisible ? "block" : "hidden"}`}
                components={{ Root: "div" }}
                key={route.key}
              >
                <Link
                  onClick={() => toggleDrawer()}
                  to={route.link}
                  className="w-full"
                >
                  <ListItemButton
                    style={{
                      borderRadius: "8px",
                      width: "100%",
                    }}
                  >
                    <ListItemIcon className="px-3 py-1 !text-black !min-w-[25px]">
                      {route.icon}
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        style: { fontSize: 13 },
                      }}
                      style={{ fontSize: "10px" }}
                      className="text-black text-sm"
                      primary={route.text}
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </Accordion>
        </ListItem>
      </List>
    </>
  );
};

export default NavAccordian;

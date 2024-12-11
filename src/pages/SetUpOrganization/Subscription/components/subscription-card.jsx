import { MoreVert } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import React from "react";

export default function SubscriptionCard({ header, description, button }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="bg-brand-primary-blue/brand-primary-blue-1 flex flex-col justify-between p-4 gap-8 rounded-lg relative">
      <div className="flex justify-between items-center w-full gap-20">
        <div className="text-xl font-bold text-Brand-neutrals/brand-neutrals-4 hover:underline cursor-pointer">
          {transformString(header)}
        </div>
        {!button && (
          <IconButton onClick={handleClick}>
            <MoreVert className=" !text-xl" />
          </IconButton>
        )}
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem className="!bg-brand/wahsed-blue">Remove</MenuItem>
          <MenuItem className="!bg-brand/wahsed-blue">Update</MenuItem>
        </Menu>
      </div>
      <div className="text-md text-Brand-neutrals/brand-neutrals-3">
        {description}
      </div>
    </div>
  );
}
function transformString(inputString, excludedWords = []) {
  return inputString
    .split(/(?=[A-Z])/)
    .map((word) => {
      const formattedWord = word.charAt(0).toUpperCase() + word.slice(1);
      return excludedWords.includes(formattedWord) ? "" : formattedWord;
    })
    .join(" ")
    .trim();
}

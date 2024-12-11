import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import MoreVert from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Skeleton from "@mui/material/Skeleton";
import React from "react";
import { Link } from "react-router-dom";

const OrganizationCardSkeleton = () => {
  return (
    <div className="border-b-[3px] border-gray-300 block min-w-[21rem] rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-200">
      <div className="border-b-2 flex items-center justify-between border-[#0000002d] px-6 py-3 text-black">
        <Skeleton variant="circular" width={35} height={35} />
        <div>
          <MoreVert className="cursor-pointer" />
          <Menu anchorEl={null} open={false} onClose={() => {}}>
            <MenuItem>
              <Edit style={{ color: "green", marginRight: "10px" }} />
              <span>Update</span>
            </MenuItem>
            <MenuItem>
              <Delete style={{ color: "red", marginRight: "10px" }} />
              <span>Delete</span>
            </MenuItem>
          </Menu>
        </div>
      </div>

      <div className="p-6 pt-6 pb-4">
        <Skeleton variant="text" width={150} height={24} />
        <Skeleton variant="text" width={300} height={16} />
      </div>

      <div className="p-6 py-4 flex gap-4">
        <Link to="/organization/123/setup/add-roles">
          <Skeleton variant="rectangular" width={150} height={40} />
        </Link>

        <Link to="/organization/123/dashboard/main">
          <Skeleton variant="rectangular" width={250} height={40} />
        </Link>
      </div>
    </div>
  );
};

export default OrganizationCardSkeleton;

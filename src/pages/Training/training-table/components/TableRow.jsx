import { MoreVert } from "@mui/icons-material";
import { IconButton, Menu, MenuItem, Rating } from "@mui/material";
import DOMPurify from "dompurify";
import React from "react";
import useTrainingStore from "../../components/stepper/components/zustand-store";
import AssignTraining from "./assign-training";
import TrainingTableLoading from "./loading-skeleton";
import useTrainingDetailsMutation from "./mutation";

const TableRow = ({ logo, name, duration, doc }) => {
  const [newOpen, setNewOpen] = React.useState(false);
  const state = useTrainingStore();
  const { setOpen, setTrainingData } = state;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const { mutate, isLoading } = useTrainingDetailsMutation();
  const [assignTrainingOpen, setAssignTrainingOpen] = React.useState(false);
  if (isLoading) {
    return <TrainingTableLoading />;
  }
  const sanitizedDescription = DOMPurify.sanitize(doc?.trainingDescription);

  return (
    <div
      className={`bg-white
       border rounded-lg flex w-full justify-between`}
    >
      <div className="flex py-8 gap-8">
        <img
          src={logo.length > 0 ? logo : "https://via.placeholder.com/150"}
          alt="Training Logo"
          className="w-48 h-36 object-cover rounded-md shadow-lg border border-gray-200"
        />
        <div className="text-left">
          <div className="font-bold text-xl">{name}</div>
          <p dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
          3.5
          <Rating size="small" name="read-only" value={3.5} readOnly />
          {doc?.trainingLocation.map}
          <div className="">Duration &nbsp;{duration ?? "2 h"}</div>
        </div>
      </div>
      <div className="  text-center">
        <IconButton
          onClick={(e) => {
            setNewOpen(true);
            setAnchorEl(e?.currentTarget);
          }}
          aria-label="edit"
        >
          <MoreVert />
        </IconButton>
        <Menu
          open={newOpen}
          anchorEl={anchorEl}
          onClose={() => setNewOpen(false)}
          onClick={() => setNewOpen(false)}
        >
          <MenuItem
            onClick={() => {
              setNewOpen(false);
              setOpen(true);
              setTrainingData(doc);
            }}
          >
            Update
          </MenuItem>
          <MenuItem
            onClick={() => {
              mutate(doc._id);
              setNewOpen(false);
            }}
          >
            Delete
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAssignTrainingOpen(true);
            }}
          >
            Assign Training
          </MenuItem>
          <MenuItem onClick={() => setNewOpen(false)}>Check Status</MenuItem>
        </Menu>
        {assignTrainingOpen && (
          <AssignTraining
            open={assignTrainingOpen}
            setOpen={setAssignTrainingOpen}
            doc={doc}
          />
        )}
      </div>
    </div>
  );
};

export default TableRow;

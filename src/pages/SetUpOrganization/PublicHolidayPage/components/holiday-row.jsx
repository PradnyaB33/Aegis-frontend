import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { format } from "date-fns";
import React from "react";
import ReusableModel from "../../../../components/Modal/component";
import EditHolidayMiniForm from "./edit-mini-form";
import usePublicHoliday from "./usePublicHoliday";

const HolidayRow = ({ data, id }) => {
  const [open, setOpen] = React.useState(false);
  const { deletePublicHoliday } = usePublicHoliday();
  const [actionModal, setActionModal] = React.useState(false);
  return (
    <tr className="!font-medium border-b" key={id}>
      <td className="whitespace-nowrap !text-left pl-8 ">{id + 1}</td>
      <td className="whitespace-nowrap pl-8">{data.name}</td>
      <td className="whitespace-nowrap pl-8">
        {data && format(new Date(data?.date), "PP")}
      </td>
      <td className="whitespace-nowrap pl-8">{data.type}</td>
      <td className=" whitespace-nowrap pl-8">
        <IconButton
          color="primary"
          aria-label="edit"
          onClick={() => setOpen(true)}
        >
          <EditOutlined />
        </IconButton>
        <IconButton
          color="error"
          aria-label="delete"
          onClick={() => setActionModal(true)}
        >
          <DeleteOutline />
        </IconButton>
        <ReusableModel
          heading="Edit Holiday"
          subHeading="Edit a public holiday to your organization"
          open={open}
          onClose={() => setOpen(false)}
        >
          <EditHolidayMiniForm onClose={() => setOpen(false)} itemData={data} />
        </ReusableModel>
        <Dialog
          fullWidth
          open={actionModal}
          onClose={() => setActionModal(false)}
        >
          <DialogContent>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <p>
                Please confirm your decision to delete this holiday, as this
                action cannot be undone.
              </p>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setActionModal(false)}
                variant="outlined"
                color="primary"
                size="small"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() =>
                  deletePublicHoliday({ selectedHolidayId: data?._id })
                }
                color="error"
              >
                Delete
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </td>
    </tr>
  );
};

export default HolidayRow;

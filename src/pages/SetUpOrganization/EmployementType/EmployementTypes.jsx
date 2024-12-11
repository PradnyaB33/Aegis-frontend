import { Info } from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import EmpTypeModal from "../../../components/Modal/EmployeeTypesModal/EmpTypeModal";
import Setup from "../Setup";
import EmployeeTypeSkeleton from "../components/EmployeeTypeSkeleton";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BasicButton from "../../../components/BasicButton";

const EmployementTypes = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);
  const { organisationId } = useParams();

  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Modal states and function
  const [open, setOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [empTypeId, setempTypeId] = useState(null);

  // const handleClickOpen = (scrollType) => () => {
  //   setOpen(true);
  //   setScroll(scrollType);
  // };

  const handleOpen = (scrollType) => {
    setOpen(true);
    setempTypeId(null);
  };

  const handleClose = () => {
    setOpen(false);
    setempTypeId(null);
    setEditModalOpen(false);
  };

  // Get Query
  const { data: empList, isLoading } = useQuery(
    ["empTypes", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employment-types-organisation/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    }
  );

  // Delete Query
  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
  };

  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };

  const handleEditModalOpen = (empTypeId) => {
    setEditModalOpen(true);
    queryClient.invalidateQueries(["shift", empTypeId]);
    setempTypeId(empTypeId);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    handleCloseConfirmation();
  };

  const deleteMutation = useMutation(
    (id) =>
      axios.delete(
        `${process.env.REACT_APP_API}/route/employment-types/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        // Invalidate and refetch the data after successful deletion
        queryClient.invalidateQueries("empTypes");
        handleAlert(true, "success", "An Employment Type deleted succesfully");
      },
    }
  );

  return (
    <BoxComponent sx={{ p: 0 }}>
      <Setup>
        <div className="h-[90vh] overflow-y-auto scroll px-3">
          <div className="xs:block sm:block md:flex justify-between items-center ">
            <HeadingOneLineInfo
              className="!my-3"
              heading="Employment"
              info=" Add type of employment here, for ex: Full-time, Part-time."
            />
            <BasicButton title="Add Employment" onClick={() => handleOpen("paper")} />
          </div>
          {isLoading ? (
            <EmployeeTypeSkeleton />
          ) : empList?.empTypes?.length > 0 ? (
            <div className=" xs:mt-3 sm:mt-3 md:mt-0">
              <table className="min-w-full bg-white  text-left !text-sm font-light">
                <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                  <tr className="!font-semibold">
                    <th scope="col" className="whitespace-nowrap !text-left pl-8 py-3">
                      Sr. No
                    </th>
                    <th scope="col" className="whitespace-nowrap !text-left pl-8 py-3">
                      Employment Title
                    </th>
                    <th scope="col" className="whitespace-nowrap !text-left pl-8 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {empList?.empTypes?.map((emptype, id) => (
                    <tr className="!font-medium border-b" key={id}>
                      <td className="whitespace-nowrap !text-left pl-8 ">{id + 1}</td>
                      <td className="whitespace-nowrap pl-8">{emptype?.title}</td>
                      <td className="whitespace-nowrap pl-8">
                        <IconButton
                          color="primary"
                          aria-label="edit"
                          onClick={() => handleEditModalOpen(emptype._id)}
                        >
                          <EditOutlinedIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          aria-label="delete"
                          onClick={() =>
                            handleDeleteConfirmation(emptype._id)
                          }
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
              <article className="flex items-center mb-1 text-red-500 gap-2">
                <Info className="!text-2xl" />
                <h1 className="text-lg font-semibold">Add Employment</h1>
              </article>
              <p>No employment found. Please add types of employment.</p>
            </section>
          )}
        </div>
      </Setup>

      <EmpTypeModal id={organisationId} open={open} handleClose={handleClose} />
      <EmpTypeModal
        handleClose={handleClose}
        id={organisationId}
        open={editModalOpen}
        empTypeId={empTypeId}
      />

      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this employement type, as
            this action cannot be undone.
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseConfirmation}
            variant="outlined"
            color="primary"
            size="small"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleDelete(deleteConfirmation)}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </BoxComponent >
  );
};

export default EmployementTypes;

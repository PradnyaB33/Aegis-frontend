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
import CreateEmpCodeModel from "../../../components/Modal/EmpCodeModel/CreateEmpCodeModel";
import EditEmpCodeModel from "../../../components/Modal/EmpCodeModel/EditEmpCodeModel";
import Setup from "../Setup";
import EmployeeTypeSkeleton from "../components/EmployeeTypeSkeleton";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BasicButton from "../../../components/BasicButton";

const EmployeeCodeGenerator = () => {
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();
  const { organisationId } = useParams();
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [empCodeId, setEmpCodeId] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleCreateModalOpen = () => {
    setCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setCreateModalOpen(false);
  };

  const handleEditModalOpen = (empCode) => {
    setEditModalOpen(true);
    setEmpCodeId(empCode);
  };

  const handleEditModelClose = () => {
    setEmpCodeId(null);
    setEditModalOpen(false);
  };

  const getEmployeeCodeData = async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: authToken,
      },
    };

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get/employee-code/${organisationId}`,
        config
      );

      return response.data.getEmployeeCode;
    } catch (error) {
      // Handle errors if necessary
      console.error("Error fetching employee codes:", error);
      return [];
    }
  };

  const { data: employeeCodes, isLoading } = useQuery({
    queryKey: ["empCode"],
    queryFn: getEmployeeCodeData,
  });

  // Delete Query for deleting the employee code
  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
  };

  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    queryClient.setQueryData(["empCode"], (prevData) => {
      const updatedData = prevData.filter((empCode) => empCode._id !== id);
      return updatedData;
    });
    setDeleteConfirmation(null);
  };
  const deleteMutation = useMutation(
    (id) =>
      axios.delete(
        `${process.env.REACT_APP_API}/route/delete/employee-code/${organisationId}/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        // Invalidate and refetch the data after successful deletion
        queryClient.invalidateQueries("empCode");
        handleAlert(true, "success", "Employee code deleted succesfully.");
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
              heading="Employee Code"
              info="Generate the employee code."
            />
            <BasicButton title="Add Employee Code" onClick={handleCreateModalOpen} />
          </div>
          {isLoading ? (
            <EmployeeTypeSkeleton />
          ) : employeeCodes?.length > 0 ? (
            <div className=" xs:mt-3 sm:mt-3 md:mt-0">
              <table className="min-w-full bg-white  text-left !text-sm font-light">
                <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                  <tr className="!font-semibold">
                    <th scope="col" className="whitespace-nowrap !text-left pl-8 py-3">
                      Sr. No
                    </th>
                    <th scope="col" className="whitespace-nowrap !text-left pl-8 py-3">
                      Employee Code
                    </th>
                    <th scope="col" className="whitespace-nowrap !text-left pl-8 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employeeCodes?.map((empCode, id) => (
                    <tr className="!font-medium border-b" key={id}>
                      <td className="whitespace-nowrap !text-left pl-8 ">{id + 1}</td>
                      <td className="whitespace-nowrap pl-8">{empCode?.code}</td>
                      <td className="whitespace-nowrap pl-8">
                        <IconButton
                          color="primary"
                          aria-label="edit"
                          onClick={() => handleEditModalOpen(empCode?._id)}
                        >
                          <EditOutlinedIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          aria-label="delete"
                          onClick={() => handleDeleteConfirmation(empCode?._id)}
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
                <h1 className="text-lg font-semibold">Add Employee Code</h1>
              </article>
              <p>No employee code found. Please add the employee code.</p>
            </section>
          )}
        </div>

      </Setup>
      {/* this dialogue for delete the employee code */}
      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this employee code, as this
            action cannot be undone.
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
      {/* for create */}
      <CreateEmpCodeModel
        handleClose={handleCreateModalClose}
        open={createModalOpen}
        organisationId={organisationId}
      />
      {/* for update */}
      <EditEmpCodeModel
        handleClose={handleEditModelClose}
        organisationId={organisationId}
        open={editModalOpen}
        empCodeId={empCodeId}
      />

    </BoxComponent>
  );
};

export default EmployeeCodeGenerator;

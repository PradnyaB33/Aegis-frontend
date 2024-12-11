import { Warning } from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BasicButton from "../../components/BasicButton";

const DepartmentList = () => {
  // to define the state, import the funciton ,
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { organisationId } = useParams();
  const queryClient = useQueryClient();
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const navigate = useNavigate();

  // fetch department list
  const fetchDepartmentList = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/department/get/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.departments;
    } catch (error) {
      console.error(error);
    }
  };

  const { data: deptList, isLoading } = useQuery(
    "department",
    fetchDepartmentList
  );

  // for edit
  // to navigate to other component
  const handleEditClick = (deptId) => {
    navigate(`/organisation/${organisationId}/edit-department/${deptId}`);
  };

  // Delete Query for deleting Single Department
  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
  };

  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };
  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    //queryClient.invalidateQueries("department");
    setDeleteConfirmation(null);
  };

  const deleteMutation = useMutation(
    (id) =>
      axios.delete(
        `${process.env.REACT_APP_API}/route/department/delete/${organisationId}/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        // Invalidate and refetch the data after successful deletion

        handleAlert(true, "success", "Department deleted succesfully");
        queryClient.invalidateQueries("department");
      },
    }
  );

  const handleAddDepartment = () => {
    navigate(`/organisation/${organisationId}/add-department`);
  };

  return (
    <>
      <BoxComponent>
        <div className="flex justify-between items-center">
          <HeadingOneLineInfo heading={"Manage Department"} info={"Here you can manage department"} />

          <BasicButton title={"Add Department"} onClick={handleAddDepartment} />

        </div>
        {isLoading && (
          <div className="flex h-screen w-full items-center justify-center">
            <CircularProgress />
          </div>
        )}
        {!isLoading && deptList?.length === 0 ? (
          <div className="w-full h-full">
            <Typography variant="h5" className="text-center !mt-5 text-red-600">
              <Warning />{" "}
              <span className="!mt-3">
                {" "}
                No departments added, please add department first.
              </span>
            </Typography>
          </div>
        ) : (
          <div className="w-full m-auto h-full">
            <div>
              <table
                style={{ borderRadius: "20px" }}
                className="min-w-full bg-white text-left text-sm font-light  shadow-md"
              >
                <thead className="border-b bg-gray-300 font-medium dark:border-neutral-500">
                  <tr className="!font-medium">
                    <th scope="col" className="px-3 py-3 whitespace-nowrap">
                      Sr. No
                    </th>
                    <th scope="col" className="px-3 py-3 ">
                      Department Name
                    </th>
                    <th scope="col" className="px-3 py-3 ">
                      Department Head
                    </th>
                    <th scope="col" className="px-3 py-3 ">
                      Delegate Department Head
                    </th>
                    <th scope="col" className="px-3 py-3 ">
                      Department Location
                    </th>
                    <th scope="col" className="px-3 py-3 ">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deptList &&
                    deptList?.map((department, id) => (
                      <tr key={id} className="bg-white border-b">
                        <td className="py-3 pl-8">{id + 1}</td>
                        <td className="py-3 pl-8">
                          {department?.departmentName || ""}
                        </td>
                        <td className="py-3 pl-8">
                          {department?.departmentHeadName?.first_name || ""}
                        </td>
                        <td className="py-3 pl-8">
                          {department?.departmentHeadDelegateName?.first_name ||
                            ""}
                        </td>

                        <td className="py-3 pl-8">
                          {department?.departmentLocation
                            ? department?.departmentLocation?.city
                            : ""}
                        </td>
                        <td className="whitespace-nowrap px-6 py-1">
                          <IconButton
                            onClick={() => handleEditClick(department._id)}
                            color="primary"
                            aria-label="edit"
                          >
                            <EditOutlinedIcon />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              handleDeleteConfirmation(department?._id)
                            }
                            color="error"
                            aria-label="delete"
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* this dialogue for deleting single department*/}
        <Dialog
          open={deleteConfirmation !== null}
          onClose={handleCloseConfirmation}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <p>
              Please confirm your decision to delete this department, as this
              action cannot be retrived
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
      </BoxComponent>
    </>
  );
};

export default DepartmentList;

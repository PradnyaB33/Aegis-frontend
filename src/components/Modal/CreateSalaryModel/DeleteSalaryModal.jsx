import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";

const DeleteSalaryModal = ({ open, handleClose, empId }) => {
  // state
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();

  // to get employee salary component data of employee
  const {
    data: salaryComponent,
    isFetching,
    isError,
  } = useQuery(["salary-component", empId], async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/get-salary-component/${empId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data.data;
  });

  // for delete
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
  };

  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    handleCloseConfirmation();
  };

  const deleteMutation = useMutation(
    (id) =>
      axios.delete(
        `${process.env.REACT_APP_API}/route/delete-salary-component/${empId}/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("salary-component");
        handleAlert(true, "success", "Salary component deleted successfully");
      },
    }
  );

  return (
    <Dialog
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "900px!important",
          height: "70%",
          maxHeight: "85vh!important",
        },
      }}
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="flex w-full justify-between py-4 items-center px-4">
        <h1 id="modal-modal-title" className="text-lg pl-2 font-semibold">
          Delete Salary Component
        </h1>
        <IconButton onClick={handleClose}>
          <CloseIcon className="!text-[16px]" />
        </IconButton>
      </div>

      <DialogContent className="border-none !pt-0 !px-0 shadow-md outline-none rounded-md">
        <div className="w-full">
          <Divider variant="fullWidth" orientation="horizontal" />
        </div>

        <div className="px-5 space-y-4 mt-4">
          <div className="overflow-auto !p-0 bg-gray-200">
            <table className="min-w-full bg-white text-left !text-sm font-light">
              <thead className="border-b bg-gray-100 font-medium dark:border-neutral-500">
                <tr>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Salary Component
                  </th>
                  <th scope="col" className="py-3 pl-8">
                    Enter The Input
                  </th>
                  <th scope="col" className="py-3 pl-8">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isFetching ? (
                  <tr>
                    <td colSpan={3}>
                      <CircularProgress />
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={3}>Error fetching data</td>
                  </tr>
                ) : !salaryComponent ? (
                  <tr>
                    <td colSpan={3}>No data available</td>
                  </tr>
                ) : (
                  <>
                    <h1 className="text-lg p-4 font-semibold leading-3 tracking-tight">
                      Income
                    </h1>
                    {salaryComponent?.income?.map((item, id) => (
                      <tr key={id}>
                        <td className="!text-left pl-8 py-3">{item.name}</td>
                        <td>
                          <input
                            type="number"
                            value={item.value}
                            placeholder="Enter the input"
                            style={{
                              padding: "10px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                            }}
                            readOnly
                          />
                        </td>
                        <td>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleDeleteConfirmation(item._id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}

                    <h1 className="text-lg p-4 font-semibold leading-3 tracking-tight">
                      Deduction
                    </h1>
                    {salaryComponent?.deductions?.map((item, id) => (
                      <tr key={id}>
                        <td className="!text-left pl-8 py-3">{item.name}</td>
                        <td>
                          <input
                            type="number"
                            value={item.value}
                            placeholder="Enter the input"
                            style={{
                              padding: "10px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                            }}
                            readOnly
                          />
                        </td>
                        <td>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleDeleteConfirmation(item._id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
          <div className="w-full">
            <Divider variant="fullWidth" orientation="horizontal" />
          </div>

          <div>
            <div className="flex items-center justify-between py-3 px-4">
              <span className="font-semibold">Total Salary</span>
              <input
                type="number"
                value={salaryComponent?.totalSalary ?? 0}
                placeholder="Total Salary"
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: "#f9f9f9",
                  fontWeight: "bold",
                }}
                readOnly
              />
            </div>
          </div>

          <DialogActions>
            <Button onClick={handleClose} color="error" variant="outlined">
              Close
            </Button>
          </DialogActions>
        </div>

        {/* for delete */}
        <Dialog
          open={deleteConfirmation !== null}
          onClose={handleCloseConfirmation}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <p>
              Please confirm your decision to delete this salary component, as
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
      </DialogContent>
    </Dialog>
  );
};

export default DeleteSalaryModal;

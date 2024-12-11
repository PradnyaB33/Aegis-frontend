import React, { useContext, useState } from "react";
import { MoreVert, Info } from "@mui/icons-material";
import {
  Container,
  Menu,
  MenuItem,
  Box,
  Button,
  Grid,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate, useParams } from "react-router";
import { formatDistanceToNow } from "date-fns";
import useRecruitmentQuery from "../../hooks/RecruitmentHook/useRecruitmentQuery";
import axios from "axios";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import { useMutation, useQueryClient } from "react-query";
import MovingIcon from "@mui/icons-material/Moving";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";

const ViewJobPosition = () => {
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];
  const { organisationId } = useParams();
  const { getJobPosition } = useRecruitmentQuery(organisationId);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  console.log("job positon", getJobPosition);

  const [anchorEl, setAnchorEl] = useState(null);
  const [jobPositionId, setJobPositionId] = useState(null);

  const handleClick = (e, id) => {
    setAnchorEl(e.currentTarget);
    setJobPositionId(id);
  };
  const handleCloseIcon = () => {
    setAnchorEl(null);
  };

  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
  };
  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
    setAnchorEl(null);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    handleCloseConfirmation();
  };
  const deleteMutation = useMutation(
    (id) =>
      axios.delete(
        `${process.env.REACT_APP_API}/route/delete-job-position/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("job-position");
        handleAlert(true, "success", "Job position deleted successfully");
        handleCloseConfirmation();
      },
    }
  );

  const handleEditClick = () => {
    navigate(
      `/organisation/${organisationId}/edit-job-position/${jobPositionId}`
    );
  };

  return (
    <>
      <BoxComponent>
        <HeadingOneLineInfo heading="Jobs" info="You can modify the job position here." />
        <Container maxWidth="xl py-6 h-auto min-h-[70vh] bg-gray-50">
          <article className="gap-6 flex flex-wrap w-full h-max rounded-sm items-center">
            {getJobPosition && getJobPosition.length > 0 ? (
              getJobPosition.map((job) => (
                <Grid key={job?._id} item className="w-max">
                  <Box className="w-[300px] rounded-sm flex justify-between items-start bg-white border py-4">
                    <div className="flex-1">
                      <div className="px-4 py-1">
                        <Chip
                          color="primary"
                          label={
                            job?.status === "Approved"
                              ? "Published"
                              : "Not Published"
                          }
                          variant="outlined"
                          icon={<MovingIcon />}
                        ></Chip>
                      </div>
                      <h1 className="text-xl px-4 font-semibold">
                        {job?.position_name}
                      </h1>
                      <p className="px-4">{job?.organizationId?.orgName}</p>
                      <p className="px-4">
                        {job?.location_name?.city} ({job?.mode_of_working?.label})
                      </p>
                      <p className="px-4">
                        Posted on: {formatDistanceToNow(new Date(job.createdAt))}
                        ago
                      </p>
                    </div>
                    <div>
                      <MoreVert
                        className="cursor-pointer"
                        onClick={(e) => handleClick(e, job._id)}
                      />
                      <Menu
                        elevation={2}
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseIcon}
                      >
                        <div>
                          <Tooltip title="Edit job position">
                            <MenuItem onClick={handleEditClick}>
                              <EditIcon
                                color="primary"
                                aria-label="edit"
                                style={{
                                  color: "#2196f3",
                                  marginRight: "10px",
                                }}
                              />
                            </MenuItem>
                          </Tooltip>
                          <Tooltip title="Delete job position">
                            <MenuItem
                              onClick={() => handleDeleteConfirmation(job?._id)}
                            >
                              <DeleteOutlineIcon
                                color="primary"
                                aria-label="delete"
                                style={{
                                  color: "#f50057",
                                  marginRight: "10px",
                                }}
                              />
                            </MenuItem>
                          </Tooltip>
                        </div>
                      </Menu>
                    </div>
                  </Box>
                </Grid>
              ))
            ) : (
              <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
                <article className="flex items-center mb-1 text-red-500 gap-2">
                  <Info className="!text-2xl" />
                  <h1 className="text-lg font-semibold">Add Job Position</h1>
                </article>
                <p>No job position found. Please add job position.</p>
              </section>
            )}
          </article>
        </Container>

        <Dialog
          open={deleteConfirmation !== null}
          onClose={handleCloseConfirmation}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <p>
              Please confirm your decision to delete this job positon, as this
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
      </BoxComponent>
    </>
  );
};

export default ViewJobPosition;

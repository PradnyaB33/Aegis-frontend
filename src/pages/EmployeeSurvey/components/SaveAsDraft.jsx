import React, { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  Button,
  DialogActions,
  DialogContent,
  CircularProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import UserProfile from "../../../hooks/UserData/useUser";
import { UseContext } from "../../../State/UseState/UseContext";
import DOMPurify from "dompurify";
import { MoreVert } from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { format } from "date-fns";

const SaveAsDraft = () => {
  //hooks
  const navigate = useNavigate();
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();

  //get organisationId
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const param = useParams();
  const organisationId = param?.organisationId;

  //get authToken
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  //states
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentSurveyId, setCurrentSurveyId] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [draftSurvey, setDraftSurvey] = useState(false)

  //get draft survey
  const { data: surveys, isLoading, isError } = useQuery(
    ["draftSurveys", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-draft-survey`,
        {
          params: {
            creatorId: user?._id,
          },
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },
    {
      enabled: !!organisationId && !!authToken,
    }
  );

  const handleClick = (e, id) => {
    setAnchorEl(e.currentTarget);
    setCurrentSurveyId(id);
  };

  const handleCloseIcon = () => {
    setAnchorEl(null);
    setCurrentSurveyId(null);
  };

  const handleEditSurvey = (surveyId) => {
    navigate(`/organisation/${organisationId}/create-new-survey/${surveyId}`);
  };

  //delete draft survey
  const deleteMutation = useMutation(
    (surveyId) =>
      axios.delete(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/delete-draft-survey/${surveyId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("draftSurveys");
        handleAlert(true, "success", "Employee survey deleted successfully");
      },
      onError: () => {
        handleAlert(true, "error", "Failed to delete the survey");
      },
    }
  );

  const handleDeleteConfirmation = (surveyId) => {
    setDeleteConfirmation(surveyId);
  };

  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };

  const handleDelete = () => {
    deleteMutation.mutate(deleteConfirmation);
    handleCloseConfirmation();
  };

  const handleDraftSurvey = () => {
    setDraftSurvey(!draftSurvey)
  }

  return (
    <div>
      <div className="flex  justify-between  gap-3 w-full border-gray-300 my-2">
        <div className="flex justify-start ">
          <div className="mb-2 md:mb-0 md:mr-4">
            <p className="font-bold">Draft Surveys</p>
            <p className="text-sm text-gray-600">
              Here are surveys still in draft mode.
            </p></div>
        </div>
        <div className="flex justify-end">
          <AddCircleOutlineIcon style={{ width: "40px" }} onClick={handleDraftSurvey} />
          <Typography variant="p" className="">
            Count: {surveys?.length}
          </Typography>
        </div>
      </div>
      {draftSurvey ? (
        <>
          <div className="border-t-[.5px] border-gray-300">
            {/* <div className="flex justify-end gap-3 mb-3 md:mb-0 w-full md:w-auto">
              <TextField
                placeholder="Search"
                variant="outlined"
                size="small"
                sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 200 }}
              />
            </div> */}
          </div>
          {isLoading ? (
            <div className="flex justify-center p-4">
              <CircularProgress />
            </div>
          ) : isError ? (
            <div className="flex justify-center p-4 text-red-500">
              Error fetching data
            </div>
          ) : surveys && surveys.length > 0 ? (
            <div className="overflow-auto !p-0 border-[.5px] border-gray-200 mt-4">
              <table className="min-w-full bg-white text-left !text-sm font-light">
                <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                  <tr className="!font-semibold">
                    <th scope="col" className="!text-left pl-8 py-3">
                      Title
                    </th>
                    <th scope="col" className="!text-left pl-8 py-3">
                      Start Date
                    </th>
                    <th scope="col" className="!text-left pl-8 py-3">
                      End Date
                    </th>
                    <th scope="col" className="!text-left pl-8 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {surveys.map((survey) => (
                    <tr key={survey._id} className="!font-medium border-b ">
                      <td className="!text-left pl-8 py-3">
                        {DOMPurify.sanitize(survey.title, { USE_PROFILES: { html: false } })}
                      </td>
                      <td className="!text-left pl-8 py-3">
                        {survey && format(new Date(survey?.employeeSurveyStartingDate), "PP")}
                      </td>
                      <td className="!text-left pl-8 py-3">
                        {survey && format(new Date(survey?.employeeSurveyEndDate), "PP")}
                      </td>
                      <td className="!text-left pl-8 py-3">
                        <MoreVert
                          onClick={(e) => handleClick(e, survey._id)}
                          className="cursor-pointer"
                        />
                        <Menu
                          elevation={2}
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl && currentSurveyId === survey._id)}
                          onClose={handleCloseIcon}
                        >
                          <Tooltip title="Edit Survey">
                            <MenuItem onClick={() => handleEditSurvey(survey._id)}>
                              <EditIcon
                                color="primary"
                                aria-label="edit"
                                style={{
                                  color: "#2196f3",
                                  marginRight: "10px",
                                }}
                              />
                              Edit
                            </MenuItem>
                          </Tooltip>
                          <Tooltip title="Delete Survey">
                            <MenuItem onClick={() => handleDeleteConfirmation(survey._id)}>
                              <DeleteOutlineIcon
                                color="primary"
                                aria-label="delete"
                                style={{
                                  color: "#f50057",
                                  marginRight: "10px",
                                }}
                              />
                              Delete
                            </MenuItem>
                          </Tooltip>
                        </Menu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <section className="py-6  w-full">
              <p>No data available</p>
            </section>
          )}
        </>
      ) : null}

      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>Please confirm your decision to delete this survey, as this action cannot be undone.</p>
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
            onClick={handleDelete}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SaveAsDraft;

import { Add, Info, MoreVert } from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import DOMPurify from "dompurify";
import React, { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import CommunicationScheleton from "../../components/Modal/CommunicationModal/CommunicationScheleton";
import NewCommunication from "../../components/Modal/CommunicationModal/NewCommunicationModal";
import NewEditCommunication from "../../components/Modal/CommunicationModal/NewEditCommunicationModal";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";

const Communication = () => {
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];
  const { organisationId } = useParams();
  const queryClient = useQueryClient();
  //for  Get Query
  const { data: getEmailCommunication, isLoading } = useQuery(
    ["getEmailCommunication", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/getEmail-communication`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );
  console.log("getEmailCommunication", getEmailCommunication);

  // for morevert icon
  const [anchorEl, setAnchorEl] = useState(null);
  const [emailCommunicationId, setEmailCommunicationId] = useState(null);
  const handleClick = (e, id) => {
    setAnchorEl(e.currentTarget);
    setEmailCommunicationId(id);
  };
  const handleCloseIcon = () => {
    setAnchorEl(null);
    setEmailCommunicationId(null);
  };

  // for add
  const [openCommunciationModal, setOpenCommunicationModal] = useState(false);
  const handleOpenCommunicationModal = () => {
    setOpenCommunicationModal(true);
  };
  const handleCloseCommunicationModal = () => {
    setOpenCommunicationModal(false);
    setAnchorEl(null);
  };

  // for edit
  const [editCommunciationModal, setEditCommunicationModal] = useState(false);
  const [emailCommuncationData, setEmailCommunicationData] = useState(null);
  const handleOpenEditCommunicationModal = (communication) => {
    setEditCommunicationModal(true);
    setEmailCommunicationData(communication);
  };
  const handleCloseEditCommunicationModal = () => {
    setEditCommunicationModal(false);
    setAnchorEl(null);
  };

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
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/deleteEmailCommunication/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        // Invalidate and refetch the data after successful deletion
        queryClient.invalidateQueries("getEmailCommunication");
        handleAlert(
          true,
          "success",
          "Email communication deleted successfully"
        );
      },
    }
  );
  return (
    <>
      <BoxComponent>

        <HeadingOneLineInfo heading={"Broadcast"} info={"Here you can send email to employee."} />

        <Container maxWidth="xl" className="bg-gray-50 min-h-screen">
          <article className=" bg-white w-full h-max shadow-md rounded-sm border items-center">

            <div className="p-4 border-b-[.5px] flex justify-center gap-3 w-full border-gray-300">
              <Button
                className="!font-semibold !bg-sky-500 flex items-center gap-2"
                variant="contained"
                onClick={handleOpenCommunicationModal}
              >
                <Add />
                Compose
              </Button>
            </div>

            {isLoading ? (
              <CommunicationScheleton />
            ) : getEmailCommunication && getEmailCommunication?.length > 0 ? (
              <div className="overflow-auto !p-0  border-[.5px] border-gray-200">
                <table className="min-w-full bg-white  text-left !text-sm font-light">
                  <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                    <tr className="!font-semibold ">
                      <th scope="col" className="!text-left pl-8 py-3 ">
                        Sr. No
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Communication Type
                      </th>
                      <th scope="col" className="px-6 py-3 ">
                        From
                      </th>
                      <th scope="col" className=" px-9 py-3 ">
                        To
                      </th>
                      <th scope="col" className=" px-9 py-3 ">
                        CC
                      </th>
                      <th scope="col" className=" px-9 py-3 ">
                        BCC
                      </th>
                      <th scope="col" className=" px-9 py-3 ">
                        Subject
                      </th>
                      <th scope="col" className=" px-6 py-3 ">
                        Status
                      </th>
                      <th scope="col" className=" px-9 py-3 ">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(getEmailCommunication) &&
                      getEmailCommunication?.map((communciation, id) => (
                        <tr className="!font-medium border-b" key={id}>
                          <td className="!text-left pl-8 py-2 ">{id + 1}</td>
                          <td className="!text-left  pl-6 py-2 ">
                            {" "}
                            {communciation?.communication
                              ?.map((item) => item?.label)
                              .join(", ")}
                          </td>
                          <td className="!text-left pl-6 py-3">
                            {communciation?.from}
                          </td>
                          <td className="!text-left pl-9 py-3">
                            {communciation?.to
                              ?.map((item) => item.label)
                              .join(", ")}
                          </td>
                          <td className="!text-left pl-9 py-3">
                            {communciation?.cc
                              ?.map((item) => item.label)
                              .join(", ")}
                          </td>
                          <td className="!text-left pl-9 py-3">
                            {communciation?.bcc
                              ?.map((item) => item.label)
                              .join(", ")}
                          </td>
                          <td className="!text-left pl-9 py-3">
                            {getEmailCommunication?.map((communciation, id) => (
                              <div
                                key={id}
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(
                                    communciation.subject
                                  ),
                                }}
                              />
                            ))}
                          </td>
                          <td className="!text-left pl-8 py-3">
                            {communciation?.status}
                          </td>
                          <td className="!text-left pl-9 py-3">
                            <MoreVert
                              onClick={(e) => handleClick(e, communciation._id)}
                              className="cursor-pointer"
                            />
                            <Menu
                              elevation={2}
                              anchorEl={anchorEl}
                              key={id}
                              open={Boolean(anchorEl)}
                              onClose={handleCloseIcon}
                            >
                              <Tooltip title="Button for editing email communication">
                                <MenuItem
                                  onClick={() =>
                                    handleOpenEditCommunicationModal(
                                      communciation
                                    )
                                  }
                                >
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
                              <Tooltip title="Button for deleting email communication">
                                <MenuItem
                                  onClick={() =>
                                    handleDeleteConfirmation(communciation._id)
                                  }
                                >
                                  <DeleteOutlineIcon
                                    color="primary"
                                    aria-label="edit"
                                    style={{
                                      color: "#f50057",
                                      marginRight: "10px",
                                    }}
                                  />
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
              <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
                <article className="flex items-center mb-1 text-red-500 gap-2">
                  <Info className="!text-2xl" />
                  <h1 className="text-lg font-semibold">
                    Add Email Communication
                  </h1>
                </article>
                <p>
                  No email communication found. Please add the email
                  communication.
                </p>
              </section>
            )}
          </article>
        </Container>

        {/* for add */}
        <NewCommunication
          handleClose={handleCloseCommunicationModal}
          open={openCommunciationModal}
          organisationId={organisationId}
        />

        {/* for edit */}
        <NewEditCommunication
          handleClose={handleCloseEditCommunicationModal}
          open={editCommunciationModal}
          organisationId={organisationId}
          emailCommuncationData={emailCommuncationData}
          emailCommunicationId={emailCommunicationId}
        />

        {/* for delete */}
        <Dialog
          open={deleteConfirmation !== null}
          onClose={handleCloseConfirmation}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <p>
              Please confirm your decision to delete this email communication, as
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
      </BoxComponent>
    </>
  );
};

export default Communication;

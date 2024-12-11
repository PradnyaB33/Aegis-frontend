//todo
import { zodResolver } from "@hookform/resolvers/zod";
import { Add, EmailOutlined, Info } from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
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
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { UseContext } from "../../State/UseState/UseContext"; // Adjust the path based on your project structure
import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
import Setup from "../SetUpOrganization/Setup";

const EmailSetting = () => {
  const id = useParams().organisationId;
  const { setAppAlert } = useContext(UseContext);
  const [handleOpen, setHandleOpen] = useState(false);
  const [handleDeleteOpen, setHandleDeleteOpen] = useState(false);
  const [handleUpdateOpen, setHandleUpdateOpen] = useState(false);
  const [editEmailId, setEditEmailId] = useState(""); // Add state for the email to edit
  const queryClient = useQueryClient();

  const { data } = useQuery("emails", async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/email/get/${id}`
    );

    return response.data.emails;
  });

  const formSchema = z.object({
    email: z.string().email(),
  });

  const handleEdit = async (id) => {
    setEditEmailId(id);

    setHandleUpdateOpen(true);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/email/getone/${id}`
      );
      reset({ email: response?.data.email.email || "" });
    } catch (error) {
      console.log(error);
      console.log("An Error occurred while fetching email details");
    }
  };

  const { control, formState, handleSubmit, reset } = useForm({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(formSchema),
  });

  const { errors } = formState;

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/email/create`,
        { email: data.email, organizationId: id }
      );
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Email created successfully.",
      });
      console.log(response.data);
      setHandleOpen(false);
      reset();
      queryClient.invalidateQueries("emails");
    } catch (error) {
      console.error("Error creating email:", error);
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Error creating email. Please try again.",
      });
    }
  };

  const handleClose = () => {
    setHandleOpen(false);
    setHandleUpdateOpen(false);
    setHandleDeleteOpen(false);
    reset({ email: "" });
  };

  const handleDelete = async (id) => {
    setEditEmailId(id);
    setHandleDeleteOpen(true);
  };

  const handleDeleteConfirmation = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API}/route/email/delete/${editEmailId}`
      );
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Email deleted successfully.",
      });
      setHandleDeleteOpen(false);
      queryClient.invalidateQueries("emails");
    } catch (e) {
      console.log(e);
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Failed to delete email",
      });
    }
  };

  const handleUpdate = async (data) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API}/route/email/edit/${editEmailId}`,
        { email: data.email }
      );
      queryClient.invalidateQueries("emails");
      console.log("Updated successfully");
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Email updated successfully.",
      });

      setHandleUpdateOpen(false);
    } catch (error) {
      console.log(error);
      console.log("Error occurred");
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Failed to update email",
      });
    }
  };

  return (
    <>
      <section className="bg-gray-50 overflow-hidden min-h-screen w-full">
        <Setup>
          <article>
            <div className="p-4 border-b-[.5px] flex justify-between gap-3 w-full border-gray-300">
              <div className="flex  gap-3">
                <div className="mt-1">
                  <EmailOutlinedIcon />
                </div>
                <div>
                  <h1 className="!text-lg">Email</h1>
                  <p className="text-xs text-gray-600">.</p>
                </div>
              </div>
              <Button
                className="!font-semibold !bg-sky-500 flex items-center gap-2"
                variant="contained"
                onClick={() => setHandleOpen(true)}
              >
                <Add />
                Add Email
              </Button>
            </div>
            {data?.length > 0 ? (
              <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
                <table className="min-w-full bg-white text-left !text-sm font-light">
                  <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                    <tr className="!font-semibold">
                      <th scope="col" className="!text-left pl-8 py-3 w-1/12">
                        Sr. No
                      </th>
                      <th scope="col" className="py-3 w-8/12">
                        Email
                      </th>
                      <th colSpan="2" scope="col" className="px-6 py-3 w-2/12">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.map((data, idx) => (
                      <tr className="!font-medium border-b" key={idx}>
                        <td className="!text-left pl-9 py-4 w-1/12">
                          {idx + 1}
                        </td>
                        <td>{data.email}</td>
                        <td className="px-2">
                          <IconButton
                            color="primary"
                            aria-label="edit"
                            style={{ paddingTop: "0.8rem" }}
                            onClick={() => handleEdit(data._id)}
                          >
                            <EditOutlinedIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            aria-label="delete"
                            style={{ paddingTop: "0.8rem" }}
                            onClick={() => handleDelete(data._id)}
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
                  <Info className="text-2xl" />
                  <h1 className="text-lg font-semibold">Add Email</h1>
                </article>
                <p>No email found. Please add an email.</p>
              </section>
            )}
            <Dialog
              open={handleOpen}
              onClose={handleClose}
              maxWidth="sm"
              fullWidth
            >
              <h1 className="text-xl pl-2 font-semibold font-sans mt-6 ml-4">
                Add Email
              </h1>
              <DialogContent>
                <div className="flex items-center justify-between gap-5">
                  <AuthInputFiled
                    className="w-[40vw]"
                    name="email"
                    icon={EmailOutlined}
                    control={control}
                    type="email"
                    placeholder="Email"
                    label="Email *"
                    errors={errors}
                    wrapperMessage={
                      "Note this email is used for login credentails"
                    }
                  />
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    variant="contained"
                    color="primary"
                  >
                    Submit
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog
              open={handleUpdateOpen}
              onClose={handleClose}
              maxWidth="sm"
              fullWidth
            >
              <h1 className="text-xl pl-2 font-semibold font-sans mt-4 ml-4">
                Edit Email
              </h1>
              <DialogContent>
                <div className="flex flex-col my-2">
                  <AuthInputFiled
                    className="w-full"
                    name="email"
                    icon={EmailOutlined}
                    control={control}
                    type="email"
                    placeholder="Email"
                    label="Email *"
                    errors={errors}
                    wrapperMessage={
                      "Note this email is used for login credentails"
                    }
                  />
                  <div className="flex gap-5 justify-end">
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={handleClose}
                    >
                      cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit(handleUpdate)}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={handleDeleteOpen} onClose={handleClose}>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogContent>
                <p>
                  Please confirm your decision to delete this email, as this
                  action cannot be undone.
                </p>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  variant="outlined"
                  color="primary"
                  size="small"
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleDeleteConfirmation}
                  color="error"
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </article>
        </Setup>
      </section>
    </>
  );
};

export default EmailSetting;

import { zodResolver } from "@hookform/resolvers/zod";
import { ContactEmergency } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ChatIcon from "@mui/icons-material/Chat";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import { Box, Grid, IconButton, Skeleton, Tooltip } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { z } from "zod";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
import UserProfile from "../../hooks/UserData/useUser";
import useHook from "../../hooks/UserProfile/useHook";
import { getSignedUrl, uploadFile } from "../../services/api";
import ResetNewPassword from "../ResetNewPassword/ResetNewPassword";
import AddNewUserId from "../AddNewUserId/AddNewUserId";

const EmployeeProfile = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { getCurrentUser, useGetCurrentRole } = UserProfile();
  const user = getCurrentUser();
  const role = useGetCurrentRole();
  const userId = user._id;
  const queryClient = useQueryClient();
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState();
  const { UserInformation } = useHook();
  const [url, setUrl] = useState();
  const fileInputRef = useRef();
  const [file, setFile] = useState();
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };

  // Validation Schema for Profile Form
  const UserProfileSchema = z.object({
    additional_phone_number: z
      .string()
      .max(10, { message: "Phone Number must be 10 digits" })
      .refine((value) => value.length === 10, {
        message: "Phone Number must be exactly 10 digits",
      })
      .optional(),
    chat_id: z.string().optional(),
    status_message: z.string().optional(),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      additional_phone_number: "",
      chat_id: "",
      status_message: "",
    },
    resolver: zodResolver(UserProfileSchema),
  });

  // Fetch initial data when the component loads
  useEffect(() => {
    (async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/get/profile/${userId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log("Employee Profile", response?.data?.employee);

      setValue("chat_id", response?.data?.employee?.chat_id  || "");
      setValue(
        "additional_phone_number",
        String(response?.data?.employee?.additional_phone_number  || "")
      );
      setValue("status_message", response?.data?.employee?.status_message  || "");
    })();
  }, [userId, authToken, setValue]);

  // Handle image file change for profile image
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      handleAlert(true, "error", "Please select a valid image file.");
    }
  };

  // React Query Mutation to Update Profile Details (contact, status, chat_id)
  const updateProfileMutation = useMutation(
    async (data) => {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/employee/profile/add/${userId}`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        // Invalidate queries to refetch data after mutation
        queryClient.invalidateQueries({ queryKey: ["employeeProfile"] });
        queryClient.invalidateQueries({ queryKey: ["emp-profile"] });
        queryClient.invalidateQueries({ queryKey: ["additionalField"] });

        handleAlert(true, "success", "Profile updated successfully!");
        // reset();  // Reset form fields after success
      },
      onError: (error) => {
        handleAlert(true, "error", error.response?.data?.message || "Failed to update profile.");
      },
    }
  );

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      let imageUrl;
      if (file) {
        const signedUrlResponse = await getSignedUrl();
        const signedUrl = signedUrlResponse.url;
        imageUrl = await uploadFile(signedUrl, file);
      }

      const requestData = {
        ...data,
        user_logo_url: imageUrl?.Location.split("?")[0], // Only include image URL if it exists
      };
      await updateProfileMutation.mutateAsync(requestData); // Call React Query mutation
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Error updating profile details");
      setError("Error updating additional details");
    }
  };

  // Handle profile photo removal
  const deleteProfilePhotoMutation = useMutation(
    async () => {
      await axios.delete(
        `${process.env.REACT_APP_API}/route/employee/photo/${userId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
    },
    {
      onSuccess: () => {
        handleAlert(true, "success", "Profile photo deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["employeeProfile"] });
        queryClient.invalidateQueries({ queryKey: ["emp-profile"] });

        setUrl(null); // Clear image URL from local state
      },
      onError: (error) => {
        handleAlert(true, "error", error.response?.data?.message || "Failed to delete profile photo.");
      },
    }
  );

  // Handle delete profile photo click
  const handleDeleteProfilePhoto = () => {
    deleteProfilePhotoMutation.mutate(); // Call the delete mutation
  };

  return (
    <BoxComponent sx={{ height: "90vh" }}>
      <HeadingOneLineInfo heading="Profile" info="Manage your account here." />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <Grid item xs={12} sm={6} md={6} sx={{ mt: "20px", display: "flex" }}>
            <div>
              <div style={{ position: "relative", display: "inline-block" }}>
                {url || UserInformation?.user_logo_url ? (
                  <img
                    src={url || UserInformation?.user_logo_url}
                    alt="Profile"
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Skeleton variant="circular" width="120px" height="120px" />
                )}
                <input
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {UserInformation?.user_logo_url ? (
                  <Tooltip title="Edit Image">
                    <IconButton
                      style={{
                        position: "absolute",
                        bottom: "5px",
                        right: "5px",
                        borderRadius: "50%",
                        padding: "6px",
                        backgroundColor: "#1414fe",
                      }}
                      onClick={() => fileInputRef.current.click()}
                    >
                      <EditIcon color="primary" style={{ color: "white" }} />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Add Image">
                    <IconButton
                      style={{
                        position: "absolute",
                        bottom: "5px",
                        right: "5px",
                        borderRadius: "50%",
                        padding: "6px",
                        backgroundColor: "#1414fe",
                      }}
                      onClick={() => fileInputRef.current.click()}
                    >
                      <AddIcon color="primary" style={{ color: "white" }} />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
              {UserInformation?.user_logo_url && (
                <button
                  type="button"
                  className="flex justify-center bg-[#d21919] shadow-md pt-1 pb-1 pr-4 pl-4 rounded-md font-semibold mt-2 text-white"
                  onClick={handleDeleteProfilePhoto}
                >
                  Remove Image
                </button>
              )}
            </div>
            <Box sx={{ ml: "20px" }}>
              <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
                {`${user?.first_name} ${user?.last_name}`}
              </h1>
              <h1 className="text-lg">{user?.email}</h1>
              <h1 className="text-lg">{role}</h1>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={6} sx={{ display: "flex", justifyContent: { sm: "end", xs: "start" } }}>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex justify-center h-full bg-[#1414fe] shadow-md pt-1 pb-1 pr-4 pl-4 rounded-md font-semibold mt-2 text-white"
            >
              Reset Password
            </button>
            <button
              type="button"
              onClick={() => setOpen1(true)}
              className=" bg-white flex justify-center h-full pt-1 pb-1 pr-4 pl-4 rounded-md font-semibold mt-2 text-black border border-grey-500 border-solid ml-4"
            >
              Create User Id
            </button>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", mt: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <AuthInputFiled
              name="additional_phone_number"
              icon={ContactEmergency}
              control={control}
              type="text"
              placeholder="Contact"
              label="Contact"
              errors={errors}
              error={errors.additional_phone_number}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AuthInputFiled
              name="chat_id"
              icon={ChatIcon}
              control={control}
              type="text"
              placeholder="Chat Id"
              label="Chat Id"
              errors={errors}
              error={errors.chat_id}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AuthInputFiled
              name="status_message"
              icon={InfoIcon}
              control={control}
              type="text"
              placeholder="Status"
              label="Status"
              errors={errors}
              error={errors.status_message}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <button
              type="submit"
              className="flex justify-center h-full bg-[#1414fe] shadow-md pt-1 pb-1 pr-4 pl-4 rounded-md font-semibold  text-white"
            >
              Submit
            </button>
          </Grid>
        </Grid>
      </form>

      {/* Modals */}
      <ResetNewPassword open={open} handleClose={handleClose} />
      <AddNewUserId open={open1} handleClose={handleClose1} />
    </BoxComponent>
  );
};

export default EmployeeProfile;



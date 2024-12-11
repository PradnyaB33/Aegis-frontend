
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import AuthInputField from "../../../components/InputFileds/AuthInputFiled";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import { PulseLoader } from 'react-spinners'; // Import loader component

// Define Zod schema for form validation
const formSchema = z.object({
  name: z.string().min(1, "Item name is required."),
  cuisineType: z.string().min(1, "Cuisine type is required."),
  description: z.string().optional(),
  price: z.string().min(1, "Price must be a positive number."),
  category: z.string().min(1, "Category is required."),
  isVeg: z.string().optional(),
  available: z.string().optional(),
  preparationTime: z.string().optional(),
  image: z.instanceof(File).optional(),
});

const UpdateMenu = () => {
  const { itemId } = useParams();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const authToken = useAuthToken();
  const navigate = useNavigate();
  const orgId = user.organizationId;
  const empId = user._id;

  // Loading state to manage loader visibility
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      cuisineType: "",
      description: "",
      price: "",
      category: "",
      preparationTime: "",
      maxQuantity: "",
      available: false,
      isVeg: true,
      image: null,
    },
  });

  // Function to upload image to S3
  const uploadVendorDocument = async (file) => {
    const {
      data: { url },
    } = await axios.get(
      `${process.env.REACT_APP_API}/route/s3createFile/${user.vendorId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      }
    );

    await axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    return url.split("?")[0]; // Return URL without query parameters
  };

  useEffect(() => {
    // Fetch the current menu item details
    const fetchMenuItem = async () => {
      setLoading(true); // Start loading when fetching data
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/menu/item/${itemId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        if (response.data.success) {
          const item = response.data.data;
          reset({
            name: item.name,
            cuisineType: item.cuisineType,
            description: item.description,
            price: item.price,
            category: item.category,
            preparationTime: item.preparationTime,
            maxQuantity: item.maxQuantity,
            available: item.available,
            isVeg: item.isVeg,
            image: null,
          });
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed to fetch menu item");
        console.error(error);
      } finally {
        setLoading(false); // End loading after fetching data
      }
    };

    fetchMenuItem();
  }, [itemId, authToken, reset]);

  const onSubmit = async (data) => {
    setLoading(true); // Start loading during form submission

    setValue("isVeg", Boolean(data?.isVeg));

    if (data.image && data.image.size > 1 * 1024 * 1024) {
      alert("Image size must not exceed 1MB.");
      setLoading(false); // End loading if image size exceeds
      return;
    }

    let imageUrl = null;
    if (data.image) {
      try {
        imageUrl = await uploadVendorDocument(data.image);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
        setLoading(false); // End loading if image upload fails
        return;
      }
    }

    // Prepare the updated data payload
    const updatedData = {
      ...data,
      vendorid: user._id,
      maxQuantity: Number(data.maxQuantity), // Ensure this is a number
      image: imageUrl, // Use the URL returned from S3
    };

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/route/menu/update/${itemId}`,
        updatedData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      if (response.data.success) {
        toast.success("Menu item updated successfully");
        navigate(`/vendor/${orgId}/${empId}/list-menu`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to update menu item");
      console.error(error);
    } finally {
      setLoading(false); // End loading after submission attempt
    }
  };

  return (
    <BoxComponent>
      <HeadingOneLineInfo
        heading={"Update Menu Item"}
        info={"Update the details of your menu item here."}
      />
      <div className="p-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4 bg-white p-6 rounded-lg shadow-lg"
          noValidate
          autoComplete="off"
        >
          {/* Loader */}
          {loading && (
            <div className="flex justify-center items-center mb-4">
              <PulseLoader color="#3498db" size={10} />
            </div>
          )}

          {/* Form Fields */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <AuthInputField
                name="name"
                control={control}
                label="Item Name *"
                errors={errors}
                placeholder="e.g. Pizza"
              />
            </div>
            <div className="flex-1">
              <AuthInputField
                name="cuisineType"
                control={control}
                label="Cuisine Type *"
                errors={errors}
                placeholder="e.g. Italian"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <AuthInputField
                name="description"
                control={control}
                label="Description"
                errors={errors}
                placeholder="Describe the item..."
              />
            </div>
            <div className="flex-1">
              <AuthInputField
                name="price"
                control={control}
                label="Price *"
                type="number"
                errors={errors}
                placeholder="e.g. 10.99"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <AuthInputField
                name="category"
                control={control}
                label="Course Type *"
                errors={errors}
                placeholder="e.g. Main Course"
              />
            </div>
            <div className="flex-1">
              <AuthInputField
                name="preparationTime"
                control={control}
                label="Preparation Time *"
                errors={errors}
                placeholder="e.g. 30 minutes"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="block text-gray-700">Available *</div>
              <div className="flex space-x-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="true"
                    {...control.register("available")}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="false"
                    {...control.register("available")}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            <div className="flex-1">
              <div className="block text-gray-700">Veg/Non-Veg *</div>
              <div className="flex space-x-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="true"
                    {...control.register("isVeg")}
                    className="mr-2"
                  />
                  Veg
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="false"
                    {...control.register("isVeg")}
                    className="mr-2"
                  />
                  Non-Veg
                </label>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-gray-700">Upload Image *</label>
            <input
              type="file"
              accept="image/jpeg, image/png"
              onChange={(e) => {
                if (e.target.files.length > 0) {
                  const file = e.target.files[0];
                  setValue("image", file);
                }
              }}
              className="mt-1 border border-gray-300 rounded-md p-2 w-full"
            />
            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image.message}</p>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              disabled={!isDirty || loading} // Disable if loading
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </BoxComponent>
  );
};

export default UpdateMenu;

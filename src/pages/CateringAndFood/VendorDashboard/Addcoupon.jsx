
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthInputField from "../../../components/InputFileds/AuthInputFiled";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import UserProfile from "../../../hooks/UserData/useUser";
import useAuthToken from "../../../hooks/Token/useAuth";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import Button from "@mui/material/Button";

const AddCoupon = () => {
  const navigate = useNavigate();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const authToken = useAuthToken();
  const vendorId = user._id;

  const initialValues = {
    name: "",
    code: "",
    discountType: "percentage", // Default value
    discountValue: "",
    expirationDate: "",
    termsAndConditions: "",
    description: "",
  };

  const CouponSchema = z.object({
    name: z.string().min(1, { message: "Coupon name is required" }),
    code: z.string().min(1, { message: "Coupon code is required" }),
    discountType: z.object(
      {
        label: z.string(),
        value: z.string(),
      },
      "selected value"
    ),
    discountValue: z.string().min(1, { message: "Discount value is required" }),
    expirationDate: z.string().min(1, { message: "Expiration date is required" }),
    termsAndConditions: z.string().optional(),
    description: z.string().optional(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: initialValues,
    resolver: zodResolver(CouponSchema),
  });

  const onSubmit = async (data) => {
    const couponData = {
      ...data,
      vendorId,
      discountType: data?.discountType?.value,
    };

    try {
      await axios.post(`${process.env.REACT_APP_API}/route/coupon/add`, couponData, {
        headers: { Authorization: authToken },
      });
      toast.success("Coupon code added successfully");
      navigate(-1); // Navigate back after success
    } catch (error) {
      console.error("Error adding coupon:", error);
      toast.error("Failed to add coupon. Please try again.");
    }
  };

  return (
    <BoxComponent>
      <HeadingOneLineInfo heading={"Add Coupon"} info={"Create a coupon for your vendors here"} />
      <div className="p-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4 bg-white p-6 rounded-lg shadow-lg"
          noValidate
          autoComplete="off"
        >
          {/* Row with Two Input Fields */}
          <div className="flex space-x-4">
            <AuthInputField
              name="name"
              control={control}
              label="Coupon Name *"
              errors={errors}
              placeholder="e.g. Discount on Pizza"
              className="flex-1" // Take equal space
            />
            <AuthInputField
              name="code"
              control={control}
              label="Coupon Code *"
              errors={errors}
              placeholder="e.g. PIZZA2024"
              className="flex-1" // Take equal space
            />
          </div>

          {/* Row with Two Input Fields */}
          <div className="flex space-x-4">
            <AuthInputField
              name="discountValue"
              control={control}
              label="Discount Value *"
              type="number"
              errors={errors}
              placeholder="e.g. 10"
              className="flex-1" // Take equal space
            />
            <AuthInputField
              name="discountType"
              control={control}
              label="Discount Type *"
              type="select"
              options={[
                { label: "Percentage", value: "percentage" },
                { label: "Fixed Amount", value: "fixed" },
                { label: "Free Shipping", value: "free_shipping" },
              ]}
              errors={errors}
              className="flex-1" // Take equal space
            />
          </div>

          {/* Row with Two Input Fields */}
          <div className="flex space-x-4">
            <AuthInputField
              name="expirationDate"
              control={control}
              label="Expiration Date *"
              type="date"
              errors={errors}
              className="flex-1" // Take equal space
            />
            <AuthInputField
              name="termsAndConditions"
              control={control}
              label="Terms and Conditions"
              as="textarea"
              errors={errors}
              placeholder="Terms and conditions here..."
              rows={3}
              className="flex-1" // Take equal space
            />
          </div>

          {/* Row with Two Input Fields */}
          <div className="flex space-x-4">
            <AuthInputField
              name="description"
              control={control}
              label="Description"
              as="textarea"
              errors={errors}
              placeholder="Provide a description for the coupon"
              rows={3}
              className="flex-1" // Take equal space
            />
          </div>

          <div className="flex justify-end mt-4">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isDirty}
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </BoxComponent>
  );
};

export default AddCoupon;

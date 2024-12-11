import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import UserProfile from "../../../hooks/UserData/useUser";
import useAuthToken from "../../../hooks/Token/useAuth";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

const CouponManager = () => {
 
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const authToken = useAuthToken();
  const vendorId = user._id;
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    discountType: "",
    discountValue: "",
    expirationDate: "",
    termsAndConditions: "",
    description: "",
  });

  // Define fetchCoupons using useCallback to memoize the function
  const fetchCoupons = useCallback(async () => {
    if (!vendorId) return; // Prevent fetching if vendorId is not available
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/coupon/vendor/${vendorId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setCoupons(response.data.data);
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
    }
  }, [vendorId, authToken]); // Include vendorId and authToken in dependencies

  // Fetch coupons when vendorId changes
  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]); // Include fetchCoupons in dependency array

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API}/route/coupon/${id}`,
        { ...formData, vendorId },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      fetchCoupons();
      setSelectedCoupon(null);
    } catch (error) {
      console.error("Failed to update coupon:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API}/route/coupon/${id}`, {
        headers: {
          Authorization: authToken,
        },
      });
      fetchCoupons();
    } catch (error) {
      console.error("Failed to delete coupon:", error);
    }
  };

  const handleSelectCoupon = (coupon) => {
    setSelectedCoupon(coupon);
    setFormData({
      name: coupon.name,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      expirationDate: coupon.expirationDate.split("T")[0],
      termsAndConditions: coupon.termsAndConditions,
      description: coupon.description,
    });
  };

  const handleCancel = () => {
    setSelectedCoupon(null);
    setFormData({
      name: "",
      code: "",
      discountType: "",
      discountValue: "",
      expirationDate: "",
      termsAndConditions: "",
      description: "",
    });
  };

  return (
<BoxComponent>
<HeadingOneLineInfo heading={"Coupon Manager"}  info={"Manage your coupons for your vendor here."}/>



<div className="max-w-2xl mx-auto p-4">
  <h2 className="mt-6 text-xl font-semibold">Available Coupons</h2>
  <ul className="bg-white rounded-lg shadow-md mt-4 divide-y divide-gray-200">
    {coupons.map((coupon) => (
      <li
        key={coupon._id}
        className="flex justify-between items-center p-4 hover:bg-gray-100 transition duration-200"
      >
        <div className="flex flex-col">
          <span className="font-semibold text-lg text-gray-800">{coupon.name}</span>
          <span className="text-gray-500">{coupon.code}</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleSelectCoupon(coupon)}
            className="text-blue-600 hover:bg-blue-100 rounded-md px-2 py-1 transition duration-150"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(coupon._id)}
            className="text-red-600 hover:bg-red-100 rounded-md px-2 py-1 transition duration-150"
          >
            Delete
          </button>
        </div>
      </li>
    ))}
  </ul>
</div>

{selectedCoupon && (
  <div className="mt-6 bg-white rounded-lg shadow-md p-4">
    <h3 className="text-lg font-semibold mb-4">Edit Coupon</h3>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleUpdate(selectedCoupon._id);
      }}
    >
      <div className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Coupon Name"
          className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleInputChange}
          placeholder="Coupon Code"
          className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />
        <select
          name="discountType"
          value={formData.discountType}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        >
          <option value="">Select Discount Type</option>
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed Amount</option>
          <option value="free_shipping">Free Shipping</option>
        </select>
        <input
          type="number"
          name="discountValue"
          value={formData.discountValue}
          onChange={handleInputChange}
          placeholder="Discount Value"
          className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />
        <input
          type="date"
          name="expirationDate"
          value={formData.expirationDate}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />
        <textarea
          name="termsAndConditions"
          value={formData.termsAndConditions}
          onChange={handleInputChange}
          placeholder="Terms and Conditions"
          className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Description"
          className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>
      <div className="flex justify-center space-x-4 mt-6">
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        >
          Update Coupon
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
)}

</BoxComponent>
  );
};

export default CouponManager;

import React, { useEffect, useState } from "react";
import axios from "axios";
import UserProfile from "../../../hooks/UserData/useUser";
import useGetUser from "../../../hooks/Token/useUser";
import ReusableModal from "../../../components/Modal/component";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";

const OrderPage = () => {
  const user = UserProfile().getCurrentUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const { authToken } = useGetUser();
  const vendorId = user._id;

  const statusColors = {
    Pending: "text-gray-600",
    Accepted: "text-blue-600",
    "In Progress": "text-orange-600",
    Ready: "text-indigo-600",
    Delivered: "text-green-600",
    Cancelled: "text-red-600",
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/orders/vendor/${vendorId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        if (response.data.success) {
          setOrders(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [vendorId, authToken]);

  const fetchFeedback = async (orderId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/orders/${orderId}/feedback`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      if (response.data.success) {
        setSelectedFeedback(response.data.data);
        console.log("feedback", response.data.data);
        setModalOpen(true);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Failed to fetch feedback");
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API}/route/order/update-status/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (err) {
      setError("Failed to update order status");
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedFeedback(null);
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <BoxComponent>
      <HeadingOneLineInfo heading={"Your Orders"} info={"Manage your orders here"} />

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
            >
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {order.items[0]?.name}
                </h2>
                <p className="text-sm text-gray-600">
                  Total Amount:{" "}
                  <span className="font-bold">{order.totalPrice.toFixed(2)}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Quantity:{" "}
                  <span className="font-bold">{order.items[0]?.quantity}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Price: <span className="font-bold">{order.items[0]?.price}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Status:
                  <span className={`font-bold ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Placed At: {new Date(order.placedAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  Updated At: {new Date(order.updatedAt).toLocaleString()}
                </p>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  className="mt-2 w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Ready">Ready</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                {order.status === "Delivered" && (
                  <button
                    onClick={() => fetchFeedback(order._id)}
                    className="mt-4 w-full bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600"
                  >
                    View Feedback
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Reusable Modal for Feedback */}
        <ReusableModal
          open={modalOpen}
          onClose={handleCloseModal}
          heading="Order Feedback"
          subHeading={
            selectedFeedback ? `Feedback for Order ID: ${selectedFeedback.orderId}` : ""
          }
        >
          {selectedFeedback ? (
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">Feedback:</h3>
              <p className="text-gray-800">{selectedFeedback.review}</p>
              <div className="flex items-center mt-4">
                <span className="text-sm text-gray-600">Rating:</span>
                <div className="flex ml-2">
                  {Array.from({ length: selectedFeedback.rating }).map((_, index) => (
                    <svg
                      key={index}
                      className="w-5 h-5 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15.27L16.18 18l-1.64-7.03L20 8.24l-7.19-.61L10 1 7.19 7.63 0 8.24l5.46 2.73L3.82 18z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="p-4 text-center text-gray-500">No feedback available.</p>
          )}
        </ReusableModal>
      </div>
    </BoxComponent>
  );
};

export default OrderPage;



// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import ReusableModal from "../../../components/Modal/component";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import { PulseLoader } from "react-spinners";

// const OrderHistory = () => {
//   const { empId } = useParams();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [ratingModalOpen, setRatingModalOpen] = useState(false);
//   const [rating, setRating] = useState(0);
//   const [review, setReview] = useState("");
//   const invoiceRef = useRef();
//   const authToken = useAuthToken();

//   useEffect(() => {
//     const fetchOrders = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/orders/user/${empId}`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: authToken,
//             },
//           }
//         );
//         setOrders(response.data.data);
//         console.log("OrderHistory", response.data.data);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to fetch orders");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [empId, authToken]);

//   const handleOpenModal = (order) => {
//     setSelectedOrder(order);
//     setModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setModalOpen(false);
//     setSelectedOrder(null);
//   };

//   const handleOpenRatingModal = (order) => {
//     setSelectedOrder(order);
//     setRatingModalOpen(true);
//   };

//   const handleCloseRatingModal = () => {
//     setRatingModalOpen(false);
//     setSelectedOrder(null);
//     setRating(0);
//     setReview("");
//   };

//   const handleSubmitRating = async () => {
//     if (!rating || rating < 1 || rating > 5) {
//       alert("Rating must be between 1 and 5");
//       return;
//     }

//     try {
//       await axios.put(
//         `${process.env.REACT_APP_API}/route/orders/${selectedOrder._id}/rate`,
//         { rating, review },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: authToken,
//           },
//         }
//       );
//       alert("Order rated successfully!");
//       handleCloseRatingModal();
//     } catch (error) {
//       alert(
//         "Failed to rate order: " + error.response?.data?.message ||
//           error.message
//       );
//     }
//   };

//   const downloadPDF = async () => {
//     const element = invoiceRef.current;
//     const canvas = await html2canvas(element, { scale: 2 });
//     const data = canvas.toDataURL("image/png");

//     const pdf = new jsPDF("p", "mm", "a4");
//     const imgWidth = 210;
//     const pageHeight = pdf.internal.pageSize.height;
//     const imgHeight = (canvas.height * imgWidth) / canvas.width;
//     let heightLeft = imgHeight;

//     let position = 0;

//     pdf.addImage(data, "PNG", 0, position, imgWidth, imgHeight);
//     heightLeft -= pageHeight;

//     while (heightLeft >= 0) {
//       position = heightLeft - imgHeight;
//       pdf.addPage();
//       pdf.addImage(data, "PNG", 0, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;
//     }

//     pdf.save(`invoice_${selectedOrder?._id}.pdf`);
//   };

//   // Render stars based on the rating value
//   const renderStars = (currentRating) => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         <svg
//           key={i}
//           onClick={() => setRating(i)} // Update the rating on click
//           className={`w-8 h-8 cursor-pointer ${
//             i <= currentRating ? "text-yellow-500" : "text-gray-400"
//           }`}
//           fill="currentColor"
//           viewBox="0 0 20 20"
//         >
//           <path d="M10 15.27L16.18 18l-1.64-7.03L20 8.24l-7.19-.61L10 1 7.19 7.63 0 8.24l5.46 2.73L3.82 18z" />
//         </svg>
//       );
//     }
//     return stars;
//   };

//   if (loading) {
//     return  <div className="flex justify-center items-center py-8">
//     <PulseLoader color="#3498db" size={15} />
//   </div>
//   }

//   if (error) {
//     return <div className="text-red-500 text-center">{error}</div>;
//   }

//   return (
//     <BoxComponent>
//       <HeadingOneLineInfo heading={"Order History"} />
//       <div className="container mx-auto p-6">
//         {orders.length === 0 ? (
//           <div className="text-center text-lg">No orders found.</div>
//         ) : (
//           <div className="space-y-6">
//             {orders.map((order) => (
//               <div
//                 key={order._id}
//                 className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
//               >
//                 <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
//                 <p className="text-gray-700">
//                   Status:{" "}
//                   <span
//                     className={`font-bold ${
//                       order.status === "Delivered"
//                         ? "text-green-500"
//                         : "text-yellow-500"
//                     }`}
//                   >
//                     {order.status}
//                   </span>
//                 </p>
//                 <p className="text-gray-700">
//                   Total Price:{" "}
//                   <span className="font-bold">  ₹ {order.grandTotal.toFixed(2)}</span>
//                 </p>
//                 <h3 className="text-lg font-semibold mt-4">Items:</h3>
//                 <ul className="list-disc list-inside pl-5">
//                   {order.items.map((item) => (
//                     <li key={item._id} className="text-gray-600">
//                       {item.name} (x{item.quantity}) -{" "}
//                       <span className="font-bold">  ₹ {item.price.toFixed(2)}</span>
//                     </li>
//                   ))}
//                 </ul>
//                 <p className="text-gray-500 mt-2">
//                   Order placed on: {new Date(order.placedAt).toLocaleString()}
//                 </p>

//                 <p className="text-gray-500 mt-2">
//                   Order Status Updated on:{" "}
//                   {new Date(order.updatedAt).toLocaleString()}
//                 </p>
//                 <button
//                   onClick={() => handleOpenModal(order)}
//                   className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
//                 >
//                   View Invoice
//                 </button>
//                 <button
//                   onClick={() => handleOpenRatingModal(order)}
//                   className="mt-4 bg-gray-500 text-white px-4 py-2 rounded ml-4"
//                 >
//                   Rate Order
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}


//       <ReusableModal
//         open={modalOpen}
//         onClose={handleCloseModal}
//         heading="Order Details"
//         subHeading={`Order ID: ${selectedOrder?._id || "N/A"}`}
//       >
//         {selectedOrder && (
//           <div ref={invoiceRef} className="p-6 bg-white rounded-lg shadow-md">
//             <h1 className="text-2xl font-bold text-center mb-4">Invoice</h1>

//             <div className="mb-4">
//               <p className="font-semibold">
//                 Vendor Company Name:{" "}
//                 {selectedOrder.vendorId?.companyname || "N/A"}
//               </p>
//               <p className="font-semibold">
//                 Vendor Address: {selectedOrder.vendorId?.address || "N/A"}
//               </p>
//             </div>

//             <div className="mb-4 border-t border-gray-300 pt-4">
//               <h3 className="text-lg font-semibold mb-2">Items:</h3>
//               <div className="grid grid-cols-2 gap-2">
//                 {selectedOrder.items.map((item) => (
//                   <div
//                     key={item._id}
//                     className="flex justify-between p-2 border-b border-gray-200"
//                   >
//                     <span>
//                       {item.name} (x{item.quantity})
//                     </span>
//                     <span className="font-bold">
//                     ₹ {(item.price * item.quantity).toFixed(2)}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="mb-4">
//               <h3 className="text-lg font-semibold">Government Taxes:</h3>
//               <p className="text-gray-600">
//                 SGST:{" "}
//                 <span className="font-bold">
//                 ₹ {selectedOrder.sgst.toFixed(2) || "N/A"}
//                 </span>
//               </p>
//               <p className="text-gray-600">
//                 CGST:{" "}
//                 <span className="font-bold">
//                 ₹ {selectedOrder.cgst.toFixed(2) || "N/A"}
//                 </span>
//               </p>
//               <p className="text-gray-600">
//                 Total Taxes:{" "}
//                 <span className="font-bold">
                  
//                 ₹ {(selectedOrder.sgst + selectedOrder.cgst).toFixed(2) ||
//                     "N/A"}
//                 </span>
//               </p>
//             </div>

//             <p className="font-bold">
//                  Total Amount (including taxes):{" "}
//               <span className="text-green-600">
//               ₹  {selectedOrder.grandTotal.toFixed(2)}
//               </span>
//             </p>
//             <p>Order Placed on: {new Date(selectedOrder.placedAt).toLocaleString()}</p>

//             <button
//               onClick={downloadPDF}
//               className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
//             >
//               Download PDF
//             </button>
//           </div>
//         )}
//       </ReusableModal>




//         {/* Rating Modal */}
//         <ReusableModal
//           open={ratingModalOpen}
//           onClose={handleCloseRatingModal}
//           heading="Rate Your Order"
//           subHeading={`Order ID: ${selectedOrder?._id || "N/A"}`}
//         >
//           <div>
//             <p className="text-lg font-semibold">Please rate your order:</p>
//             <div className="flex space-x-1 mt-2">{renderStars(rating)}</div>
//             <textarea
//               value={review}
//               onChange={(e) => setReview(e.target.value)}
//               className="w-full mt-4 p-2 border border-gray-300 rounded-md"
//               placeholder="Write a review (optional)"
//             />
//             <div className="mt-4 flex justify-between">
//               <button
//                 onClick={handleSubmitRating}
//                 className="bg-blue-500 text-white px-4 py-2 rounded"
//               >
//                 Submit Rating
//               </button>
//               <button
//                 onClick={handleCloseRatingModal}
//                 className="bg-gray-500 text-white px-4 py-2 rounded"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </ReusableModal>
//       </div>
//     </BoxComponent>
//   );
// };

// export default OrderHistory;





import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ReusableModal from "../../../components/Modal/component";
import useAuthToken from "../../../hooks/Token/useAuth";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import { PulseLoader } from "react-spinners";

const OrderHistory = () => {
  const { empId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const invoiceRef = useRef();
  const authToken = useAuthToken();


  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/orders/user/${empId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
        }
      );
      setOrders(response.data.data);
      console.log("OrderHistory", response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [empId, authToken]);  // `useCallback` ensures the function is memoized
  
  useEffect(() => {
    fetchOrders();
  
    // Polling every 30 seconds to check for order status updates
    const interval = setInterval(() => {
      fetchOrders();
    }, 20000); // 30 seconds polling interval
  
    return () => clearInterval(interval);
  }, [fetchOrders]);  // Now the dependency array only needs `fetchOrders`
  
  useEffect(() => {
    // Check for status change in orders and show notifications
    orders.forEach((order) => {
      if (order.status === "Delivered" && !order.notified) {
        new Notification("Your order has been delivered!", {
          body: `Order ID: ${order._id} has been delivered.`,
          icon: "/icon.png", // Optional icon
        });

        // Mark this order as notified (or update it in your DB)
        order.notified = true;
        setOrders((prevOrders) => [...prevOrders]);
      }
    });
  }, [orders]);

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  const handleOpenRatingModal = (order) => {
    setSelectedOrder(order);
    setRatingModalOpen(true);
  };

  const handleCloseRatingModal = () => {
    setRatingModalOpen(false);
    setSelectedOrder(null);
    setRating(0);
    setReview("");
  };

  const handleSubmitRating = async () => {
    if (!rating || rating < 1 || rating > 5) {
      alert("Rating must be between 1 and 5");
      return;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_API}/route/orders/${selectedOrder._id}/rate`,
        { rating, review },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
        }
      );
      alert("Order rated successfully!");
      handleCloseRatingModal();
    } catch (error) {
      alert(
        "Failed to rate order: " + error.response?.data?.message ||
        error.message
      );
    }
  };

  const downloadPDF = async () => {
    const element = invoiceRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const pageHeight = pdf.internal.pageSize.height;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(data, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(data, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`invoice_${selectedOrder?._id}.pdf`);
  };

  const renderStars = (currentRating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          onClick={() => setRating(i)}
          className={`w-8 h-8 cursor-pointer ${
            i <= currentRating ? "text-yellow-500" : "text-gray-400"
          }`}

          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 15.27L16.18 18l-1.64-7.03L20 8.24l-7.19-.61L10 1 7.19 7.63 0 8.24l5.46 2.73L3.82 18z" />
        </svg>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <PulseLoader color="#3498db" size={15} />
      </div>
    );

  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <BoxComponent>
      <HeadingOneLineInfo heading={"Order History"} />
      <div className="container mx-auto p-6">
        {orders.length === 0 ? (
          <div className="text-center text-lg">No orders found.</div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
                <p className="text-gray-700">
                  Status:{" "}
                  <span
                    className={`font-bold ${order.status === "Delivered"
                      ? "text-green-500"
                      : "text-yellow-500"
                      }`}
                  >
                    {order.status}
                  </span>
                </p>
                <p className="text-gray-700">
                  Total Price:{" "}
                  <span className="font-bold"> ₹ {order.grandTotal.toFixed(2)}</span>
                </p>
                <h3 className="text-lg font-semibold mt-4">Items:</h3>
                <ul className="list-disc list-inside pl-5">
                  {order.items.map((item) => (
                    <li key={item._id} className="text-gray-600">
                      {item.name} (x{item.quantity}) -{" "}
                      <span className="font-bold"> ₹ {item.price.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-gray-500 mt-2">
                  Order placed on: {new Date(order.placedAt).toLocaleString()}
                </p>

                <p className="text-gray-500 mt-2">
                  Order Status Updated on:{" "}
                  {new Date(order.updatedAt).toLocaleString()}
                </p>
                <button
                  onClick={() => handleOpenModal(order)}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                  View Invoice
                </button>
                <button
                  onClick={() => handleOpenRatingModal(order)}
                  className="mt-4 bg-gray-500 text-white px-4 py-2 rounded ml-4"
                >
                  Rate Order
                </button>
              </div>
            ))}
          </div>
        )}

        <ReusableModal
          open={modalOpen}
          onClose={handleCloseModal}
          heading="Order Details"
          subHeading={`Order ID: ${selectedOrder?._id || "N/A"}`}
        >
          {selectedOrder && (
            <div ref={invoiceRef} className="p-6 bg-white rounded-lg shadow-md">
              <h1 className="text-2xl font-bold text-center mb-4">Invoice</h1>

              <div className="mb-4">
                <p className="font-semibold">
                  Vendor Company Name:{" "}
                  {selectedOrder.vendorId?.companyname || "N/A"}
                </p>
                <p className="font-semibold">
                  Vendor Address: {selectedOrder.vendorId?.address || "N/A"}
                </p>
              </div>

              <div className="mb-4 border-t border-gray-300 pt-4">
                <h3 className="text-lg font-semibold mb-2">Items:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between p-2 border-b border-gray-200"
                    >
                      <span>
                        {item.name} (x{item.quantity})
                      </span>
                      <span className="font-bold">
                        ₹ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold">Government Taxes:</h3>
                <p className="text-gray-600">
                  SGST:{" "}
                  <span className="font-bold">
                    ₹ {selectedOrder.sgst.toFixed(2) || "N/A"}
                  </span>
                </p>
                <p className="text-gray-600">
                  CGST:{" "}
                  <span className="font-bold">
                    ₹ {selectedOrder.cgst.toFixed(2) || "N/A"}
                  </span>
                </p>
                <p className="text-gray-600">
                  Total Taxes:{" "}
                  <span className="font-bold">
                    ₹ {(selectedOrder.sgst + selectedOrder.cgst).toFixed(2) ||
                      "N/A"}
                  </span>
                </p>
              </div>

              <p className="font-bold">
                Total Amount (including taxes):{" "}
                <span className="text-green-600">
                  ₹ {selectedOrder.grandTotal.toFixed(2)}
                </span>
              </p>
              <p>Order Placed on: {new Date(selectedOrder.placedAt).toLocaleString()}</p>


              <button
                onClick={downloadPDF}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
              >
                Download PDF
              </button>
            </div>
          )}
        </ReusableModal>

        {/* Rating Modal */}
        <ReusableModal
          open={ratingModalOpen}
          onClose={handleCloseRatingModal}
          heading="Rate Your Order"
          subHeading={`Order ID: ${selectedOrder?._id || "N/A"}`}
        >
          <div>
            <p className="text-lg font-semibold">Please rate your order:</p>
            <div className="flex space-x-1 mt-2">{renderStars(rating)}</div>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full mt-4 p-2 border border-gray-300 rounded-md"
              placeholder="Write a review (optional)"
            />
            <div className="mt-4 flex justify-between">
              <button
                onClick={handleSubmitRating}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Submit Rating
              </button>
              <button
                onClick={handleCloseRatingModal}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </ReusableModal>
      </div>
    </BoxComponent>
  );
};

export default OrderHistory;

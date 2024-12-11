
import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useCartStore from "./useCartStore";
import cartImage from "../../../assets/cart-png.png";
import UserProfile from "../../../hooks/UserData/useUser";
import axios from "axios";
import toast from "react-hot-toast";
import useAuthToken from "../../../hooks/Token/useAuth";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

const Detailcart = () => {
  const authToken = useAuthToken();
  const user = UserProfile().getCurrentUser();
  const { cart, increment, decrement, clearCart, removeFromCart } =
    useCartStore();
  const cartItems = Object.keys(cart).filter((item) => cart[item].count > 0);
  const { _id } = useParams();

  const totalPrice = cartItems.reduce((total, itemName) => {
    return total + cart[itemName].price * cart[itemName].count;
  }, 0);

  const [coupons, setCoupons] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

   // Define fetchCoupons using useCallback
   const fetchCoupons = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/coupon/vendor/${_id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setCoupons(response.data.data);
      console.log("cupendata", response.data.data);
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
      toast.error("Could not fetch coupons");
    }
  }, [_id, authToken]); // Include dependencies

  // Fetch coupons when the component mounts or when dependencies change
  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]); 

  const applyCoupon = (code) => {
    const coupon = coupons.find((c) => c.code === code);

    if (coupon) {
      if (coupon.discountType === "percentage") {
        // Calculate the discount based on the percentage
        const discountAmount = (totalPrice * coupon.discountValue) / 100;
        setDiscount(discountAmount);
      } else if (coupon.discountType === "fixed") {
        // Set the discount value directly for fixed discounts
        setDiscount(coupon.discountValue);
      }
      console.log(couponCode);
      setCouponCode(code);
      setError("");
    } else {
      setError("Invalid coupon code");
    }
  };

  const finalPrice = totalPrice - discount;
  const cgst = (finalPrice * 0.025).toFixed(2);
  const sgst = (finalPrice * 0.025).toFixed(2);

  // Calculate grand total
  const grandTotal = (
    parseFloat(finalPrice) +
    parseFloat(cgst) +
    parseFloat(sgst)
  ).toFixed(2);

  const placeOrder = async () => {
    const itemsToOrder = cartItems.map((itemName) => ({
      menuItemId: cart[itemName].id,
      name:cart[itemName].name,
      quantity: cart[itemName].count,
      price: cart[itemName].price,
    }));

    console.log("itemsToOrder",itemsToOrder );

    const orderData = {
      userId: user._id,
      vendorId: _id,
      items: itemsToOrder,
      totalPrice,
      cgst: parseFloat(cgst),
      sgst: parseFloat(sgst),
      discount,
      grandTotal: parseFloat(grandTotal),
    };
    console.log("orderData",orderData);
 

    const orderData1 = {
      amount: grandTotal * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt#${Date.now()}`, // Optional
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/payment`,
        orderData1,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
        }
      );
      const data = response.data;

      if (data.status === "created") {
        const options = {
          key: "rzp_test_iutxIgoA1jAkJy", // Your Razorpay key id
          amount: grandTotal * 100, // Convert to paise
          currency: "INR",
          name: "AEGIS HRMS",
          description: "Order Payment",
          image: "https://yourlogo.com/logo.png",
          order_id: data.id,
          handler: async function (response) {
            const paymentResponse = { ...response };

            const orderData2 = {
              userId: orderData.userId,
              vendorId: orderData.vendorId,
              items: orderData.items,
              totalPrice: orderData.totalPrice,
              cgst: orderData.cgst,
              sgst: orderData.sgst,
              discount: orderData.discount,
              grandTotal: orderData.grandTotal,
              razorpay_payment_id: response.razorpay_payment_id,
            };


            try {
              const verifyResponse = await axios.post(
                `${process.env.REACT_APP_API}/route/payment/verify`,
                paymentResponse,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken,
                  },
                }
              );
            
              const verifyData = verifyResponse.data;
            
              if (verifyData.success) {
                toast.success("Your payment was done successfully");
            
                try {
                  await axios.post(
                    `${process.env.REACT_APP_API}/route/orders`,
                    orderData2,
                    {
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: authToken,
                      },
                    }
                  );
                  clearCart();
                  toast.success("Your Order Placed successfully");
                } catch (error) {
                  console.error("Error placing order:", error);
                  toast.error("An error occurred while placing the order");
                }
            
              } else {
                console.log("Payment verification failed or order placed failed");
              }
            
            } catch (error) {
              console.error("Error verifying payment:", error);
              toast.error("An error occurred while verifying payment");
            }
            
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.contact,
          },
          notes: {
            address: "note value",
          },
          theme: {
            color: "#F37254",
          },
        };

        const razor = new window.Razorpay(options);
        razor.open();
      } else {
        setError(data.message || "Failed to place the order");
      }
    } catch (error) {
      setError("An error occurred while placing the order");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
        <img
          src={cartImage}
          alt="Empty Cart"
          className="w-48 h-48 mb-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        />
        <div className="text-center text-2xl font-semibold text-blue-600 mb-2">
          Your cart is empty
        </div>
        <p className="text-gray-600 mb-4">
          It looks like you haven't added anything to your cart yet.
        </p>
        <Link
          to={`/vendors/restaurantmenu/${_id}`}
          className="bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition duration-200"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <BoxComponent>
     <HeadingOneLineInfo heading={" Your Cart "}/>
    <div className="flex p-4 space-x-4 ">
      <div className="flex-1 bg-gray-100 rounded-lg p-4 shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Your Cart
        </h2>
        <div className="flex flex-col space-y-4 fle ">
          {cartItems.map((itemName) => {
            const { count, price, image,name } = cart[itemName];
            return (
              <div
                key={itemName}
                className="flex items-center bg-white p-4 rounded-lg shadow-md "
              >
                <img
                  src={image}
                  alt={itemName}
                  className="w-16 h-16 object-cover rounded mr-4"
                />

                <div className="flex w-full justify-between ">
                  <span className="text-lg font-semibold ">{name}</span>

                  <div className="flex items-center mx-4 ">
                    <button
                      onClick={() => decrement(itemName)}
                      className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition duration-200"
                    >
                      -
                    </button>
                    <span className="mx-2">{count}</span>
                    <button
                      onClick={() => increment(itemName)}
                      className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-700 transition duration-200"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-lg font-bold text-blue-500 ">
                    ₹{(price * count).toFixed(2)}
                  </span>

                  <button
                    className="text-red-500 hover:text-red-700 ml-4"
                    onClick={() => removeFromCart(itemName)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={clearCart}
            className="bg-red-600 text-white rounded-lg py-2 px-6 hover:bg-red-700 transition duration-200"
          >
            Empty Cart
          </button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 w-1/3">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Cart Totals
        </h2>

        <div className="flex justify-between mb-4">
          <span className="text-gray-700">Subtotal:</span>
          <span className="font-bold text-blue-500">
            ₹{totalPrice.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between mb-4">
          <span className="text-gray-700">CGST (2.5%):</span>
          <span className="font-bold text-blue-500">₹{cgst}</span>
        </div>

        <div className="flex justify-between mb-4">
          <span className="text-gray-700">SGST (2.5%):</span>
          <span className="font-bold text-blue-500">₹{sgst}</span>
        </div>

        {/* Available Coupons Section */}
        <div className="mb-4">
          <h3 className="font-bold text-gray-700">Available Coupons:</h3>
          <ul className="flex flex-wrap justify-evenly mb-4">
            {coupons.map((coupon) => (
              <li
                key={coupon.code}
                className="cursor-pointer hover:text-blue-600 hover:underline"
                onClick={() => applyCoupon(coupon.code)}
              >
                <span>{coupon.code}: </span>
                <span className="font-bold">
                  {coupon.discountValue}
                  {coupon.discountType === "percentage" ? "%" : "₹"} off
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Error Message */}
        {error && <div className="text-red-500 mb-2">{error}</div>}

        <div className="flex justify-between mb-4">
          <span className="text-gray-700">Discount:</span>
          <span className="font-bold text-blue-500">-{discount}</span>
        </div>

        <div className="flex justify-between mb-4">
          <span className="text-gray-700">Grand Total:</span>
          <span className="font-bold text-blue-500">₹{grandTotal}</span>
        </div>

        <div className="flex justify-center">
          <button
            onClick={placeOrder}
            className={`bg-green-600 text-white rounded-lg py-2 px-6 hover:bg-green-700 transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
    </BoxComponent>
  );
};

export default Detailcart;

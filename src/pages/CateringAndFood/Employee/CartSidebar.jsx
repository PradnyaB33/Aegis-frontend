
import React from "react";
import { Link, useParams } from "react-router-dom";
import useCartStore from "./useCartStore";

const CartSidebar = () => {
  const { cart, increment, decrement } = useCartStore();
  const { _id: employeeId } = useParams();

  // Get cart items based on their IDs
  const cartItems = Object.keys(cart).filter((itemId) => cart[itemId].count > 0);

  // Calculate total price
  const totalPrice = cartItems.reduce((total, itemId) => {
    return total + cart[itemId].price * cart[itemId].count;
  }, 0);

  // Hide sidebar if no items in the cart
  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 fixed right-0 top-16 h-auto w-1/4 max-h-[80vh] overflow-y-auto transition-transform transform duration-300 ease-in-out">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Your Cart</h2>
      <div className="border-b mb-4 pb-2 flex-grow">
        {cartItems.map((itemId) => {
          const { count, price, image,name } = cart[itemId];
          return (
            <div key={itemId} className="flex items-center justify-between mb-4">
              <img
                src={image}
                alt={itemId} // You might want to replace this with a more descriptive alt text
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1 mx-2">
                <div className="font-semibold">{name}</div> {/* Optionally display item name or description */}
                <div className="text-gray-500">Quantity: {count}</div>
              </div>
              <div className="text-lg font-bold text-blue-500">
                ₹{(price * count).toFixed(2)}
              </div>
              <div className="flex items-center ml-4">
                <button
                  onClick={() => decrement(itemId)}
                  className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition duration-200"
                >
                  -
                </button>
                <button
                  onClick={() => increment(itemId)}
                  className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-700 transition duration-200 ml-2"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="font-bold text-lg text-center mb-4">
        Total: ₹{totalPrice.toFixed(2)}
      </div>
      <Link
        to={`/vendors/restaurantmenu/${employeeId}/cart`}
        className="bg-green-600 text-white rounded-lg py-2 hover:bg-green-700 transition duration-200 w-full text-center block"
      >
        View Cart
      </Link>
    </div>
  );
};

export default CartSidebar;

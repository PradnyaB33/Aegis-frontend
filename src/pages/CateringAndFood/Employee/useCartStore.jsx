
import create from 'zustand';

const useCartStore = create((set) => ({
  cart: {},
  addToCart: (item) => set((state) => ({
    cart: {
      ...state.cart,
      [item._id]: { // Use item ID as the key
        count: (state.cart[item._id]?.count || 0) + 1,
        price: item.price,
        image: item.image,
        id: item._id,
        name: item.name, // Store the item name for display purposes
      },
    },
  })),
  increment: (itemId) => set((state) => ({
    cart: {
      ...state.cart,
      [itemId]: {
        ...state.cart[itemId],
        count: (state.cart[itemId]?.count || 0) + 1,
      },
    },
  })),
  decrement: (itemId) => set((state) => ({
    cart: {
      ...state.cart,
      [itemId]: {
        ...state.cart[itemId],
        count: Math.max((state.cart[itemId]?.count || 1) - 1, 0),
      },
    },
  })),
  clearCart: () => set({ cart: {} }), // Clear the cart
  removeFromCart: (itemId) => set((state) => {
    const newCart = { ...state.cart };
    delete newCart[itemId];
    return { cart: newCart };
  }), // Remove an item from the cart
}));

export default useCartStore;

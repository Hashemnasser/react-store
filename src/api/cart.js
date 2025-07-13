const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/cartItems`;

// Get all cart items for a specific user
export const getCartItems = async (userId) => {
  const res = await fetch(`${API_URL}?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch cart items");
  return await res.json();
};

// Add item to cart
export const addToCart = async (userId, productId, quantity = 1) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, productId, quantity }),
  });
  if (!res.ok) throw new Error("Failed to add item to cart");
  return await res.json();
};

// Remove item from cart
export const removeFromCart = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to remove item from cart");
  return true;
};

// Update quantity
export const updateCartItem = async (id, quantity) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error("Failed to update quantity");
  return await res.json();
};

export const clearCartFromServer = async (userId) => {
  try {
    const res = await fetch(`${API_URL}?userId=${userId}`);
    const items = await res.json();

    // حذف كل عنصر بشكل منفصل
    await Promise.all(
      items.map((item) => fetch(`${API_URL}/${item.id}`, { method: "DELETE" }))
    );
  } catch (error) {
    console.error("❌ Error clearing cart from server:", error.message);
  }
};

const BASE_URL = "http://localhost:5000/orders";

// 🟢 إنشاء طلب جديد
export const createOrder = async (orderData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) throw new Error("Failed to place order");
    return await res.json();
  } catch (error) {
    console.error("❌ createOrder error:", error.message);
    throw error;
  }
};

// 🟡 جلب كل الطلبات
export const fetchAllOrders = async () => {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch orders");
    return await res.json();
  } catch (error) {
    console.error("❌ fetchAllOrders error:", error.message);
    return [];
  }
};

// 🟡 جلب طلبات مستخدم معيّن
export const fetchUserOrders = async (userId) => {
  try {
    const res = await fetch(`${BASE_URL}?userId=${userId}`);
    if (!res.ok) throw new Error("Failed to fetch user orders");
    return await res.json();
  } catch (error) {
    console.error("❌ fetchUserOrders error:", error.message);
    return [];
  }
};

// 🔴 حذف طلب معيّن
export const deleteOrder = async (orderId) => {
  try {
    const res = await fetch(`${BASE_URL}/${orderId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete order");
    return true;
  } catch (error) {
    console.error("❌ deleteOrder error:", error.message);
    return false;
  }
};

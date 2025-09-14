const BASE_URL = "http://localhost:5000/wishList"; // تأكد من وجود هذا السطر بالأعلى

// ✅ جلب المفضلة
export const fetchWishList = async () => {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("failed to fetch wish list");
    return await res.json(); // ❗ كنت ناسي .json()
  } catch (error) {
    console.error("❌ error fetching wish list:", error.message);
    return [];
  }
};

// ✅ إضافة للمفضلة
export const addToWishListAPI = async (productId) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: productId }),
    });
    if (!res.ok) throw new Error("failed to add to wish list");
    return await res.json();
  } catch (error) {
    console.error("❌ error adding to wish list:", error.message);
    return null;
  }
};

// ✅ حذف من المفضلة
export const removeFromWishListAPI = async (productId) => {
  try {
    const res = await fetch(`${BASE_URL}/${productId}`, { method: "DELETE" }); // ❗ كنت ناسي await
    if (!res.ok) throw new Error("failed to remove from wish list");
    return true;
  } catch (error) {
    console.error("❌ error removing from wish list:", error.message);
    return null;
  }
};

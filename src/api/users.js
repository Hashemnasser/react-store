// api/users.js

const BASE_URL = "http://localhost:5000"; // 🔁 غيّره حسب السيرفر الحقيقي لاحقًا

/**
 * Fetch all users from the API
 * @returns {Promise<Array>} users
 */
export async function fetchUsers() {
  try {
    const res = await fetch(`${BASE_URL}/users`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const users = await res.json();
    return users;
  } catch (err) {
    console.error("❌ Error fetching users:", err.message);
    return []; // fallback to empty list
  }
}

// 🗑️ حذف مستخدم حسب ID
export const deleteUserById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    return true; // الحذف تم بنجاح
  } catch (error) {
    console.error("Error deleting user:", error);
    return false; // حدث خطأ أثناء الحذف
  }
};
export const updateUserById = async (id, updateData) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });
    if (!response.ok) throw new Error("Failed to update user");
    return await response.json();
  } catch (error) {
    console.error("updating is failed", error);
    return false;
  }
};

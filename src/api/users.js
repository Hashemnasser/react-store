// api/users.js

const BASE_URL = "http://localhost:5000"; // غيّر هذا العنوان حسب رابط الـ API الخاص بك

// جلب جميع المستخدمين
export async function getAllUsers() {
  try {
    const response = await fetch(`${BASE_URL}/users`);
    if (!response.ok) throw new Error("Failed to fetch users");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

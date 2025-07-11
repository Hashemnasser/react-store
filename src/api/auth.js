const BASE_URL = "http://localhost:5000/users";

// 🔐 تسجيل مستخدم جديد
export const signUp = async (user) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    // ❌ الخطأ هنا: res.ok تعني النجاح، وليس الفشل!
    if (!res.ok) throw new Error("Sign up failed");

    return await res.json();
  } catch (error) {
    console.error("❌ Error signing up:", error.message);
    return null;
  }
};

// ✅ تسجيل دخول
export const signIn = async (email, password) => {
  try {
    const res = await fetch(`${BASE_URL}?email=${email}&password=${password}`);

    // ⛔ نسيت await هنا!
    const data = await res.json();

    if (data.length === 0) throw new Error("Invalid credentials");

    return data[0]; // 🧠 إرجاع أول مستخدم مطابق
  } catch (error) {
    console.error("❌ Error signing in:", error.message);
    return null;
  }
};

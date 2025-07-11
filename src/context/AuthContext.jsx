import { createContext, useEffect, useState } from "react";

// ✅ إنشاء السياق
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // بيانات المستخدم
  const [loading, setLoading] = useState(true); // تحميل أولي

  // ✅ تحميل المستخدم من LocalStorage عند بدء التطبيق
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // ✅ تسجيل الدخول
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ✅ تسجيل الخروج
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };

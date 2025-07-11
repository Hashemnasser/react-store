import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { signIn } from "../api/auth";
import { useAuth } from "../context/useAuth";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // ✅ جلب معلومات الصفحة السابقة
  const { login, user } = useAuth(); // ✅ جلب حالة المستخدم

  // 🧠 إذا كان المستخدم مسجّل، لا داعي لعرض الصفحة
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const loggedUser = await signIn(email, password);
      if (!loggedUser) {
        setErrorMsg("Invalid email or password");
        return;
      }

      login(loggedUser);

      // ✅ إعادة التوجيه للصفحة المطلوبة (أو "/" كافتراضي)
      const redirectPath = location.state?.from?.pathname || "/";
      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error(error);
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Sign In</h2>

      {errorMsg && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded dark:text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded dark:text-black"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;

// src/pages/SignUp.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../api/auth";
import { useAuth } from "../context/useAuth";

const SignUp = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!userData.name || !userData.email || !userData.password) {
      setErrorMsg("All fields are required.");
      return;
    }

    try {
      const createdUser = await signUp(userData);
      if (!createdUser) {
        setErrorMsg("Failed to sign up. Please try again.");
        return;
      }

      login(createdUser); // تسجيل الدخول تلقائي بعد التسجيل
      navigate("/");
    } catch (error) {
      console.error(error);
      setErrorMsg("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>

      {errorMsg && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded dark:text-black"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded dark:text-black"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded dark:text-black"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import useWishList from "../context/useWishList";
import useCart from "../context/useCart";
import { fetchUserOrders } from "../api/orders";

const UserProfile = () => {
  const { user } = useAuth();
  const { wishList } = useWishList();
  const { cartItems } = useCart();

  const [name, setName] = useState(user?.name || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [ordersCount, setOrdersCount] = useState(0);

  // كلمات المرور للنموذج
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const orders = await fetchUserOrders(user?.id);
        setOrdersCount(orders.length);
      } catch (err) {
        console.error("❌ Error loading orders:", err.message);
      }
    };

    if (user?.id) loadOrders();
  }, [user?.id]);

  const renderAvatar = () => {
    if (avatarUrl)
      return (
        <img
          src={avatarUrl}
          alt="avatar"
          className="w-20 h-20 rounded-full object-cover"
        />
      );

    const initials = user?.name
      ? user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";

    return (
      <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
        {initials}
      </div>
    );
  };

  // تحديث بيانات المستخدم (الاسم والصورة)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await fetch(`http://localhost:5000/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, avatar: avatarUrl }),
      });

      if (!res.ok) throw new Error("Failed to update profile");
      setSuccessMsg("✅ Profile updated!");
    } catch (err) {
      setErrorMsg("❌ " + err.message);
    }
  };

  // تغيير كلمة المرور
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg("");

    if (newPassword !== confirmPassword) {
      setPasswordMsg("❌ New password and confirm password do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg("❌ Password should be at least 6 characters.");
      return;
    }

    try {
      // هنا يجب تعديل الرابط والطريقة حسب API الخاص بك
      const res = await fetch(
        `http://localhost:5000/users/${user.id}/change-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to change password");
      }

      setPasswordMsg("✅ Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordMsg("❌ " + err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 dark:text-white">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>

      {/* بيانات المستخدم */}
      <div className="flex items-center gap-4 mb-6">
        {renderAvatar()}
        <div>
          <p className="font-semibold text-lg">{user?.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {user?.email}
          </p>
        </div>
      </div>

      {/* إحصائيات */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="bg-blue-100 text-blue-800 dark:bg-blue-900 p-4 rounded-lg shadow">
          <p className="text-sm">Orders</p>
          <p className="text-2xl font-bold">{ordersCount}</p>
        </div>

        <div className="bg-green-100 text-green-800 dark:bg-green-900 p-4 rounded-lg shadow">
          <p className="text-sm">Wish List</p>
          <p className="text-2xl font-bold">{wishList.length}</p>
        </div>

        <div className="bg-purple-100 text-purple-800 dark:bg-purple-900 p-4 rounded-lg shadow">
          <p className="text-sm">Cart Items</p>
          <p className="text-2xl font-bold">
            {cartItems.reduce((total, item) => total + item.quantity, 0)}
          </p>
        </div>
      </div>

      {/* تعديل الملف الشخصي */}
      <form
        onSubmit={handleUpdateProfile}
        className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
        <div className="mb-4">
          <label className="block mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Avatar URL</label>
          <input
            type="text"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
          />
        </div>

        {successMsg && <p className="text-green-600 mb-3">{successMsg}</p>}
        {errorMsg && <p className="text-red-600 mb-3">{errorMsg}</p>}

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Save Changes
        </button>
      </form>

      {/* تغيير كلمة المرور */}
      <form
        onSubmit={handleChangePassword}
        className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>

        <div className="mb-4">
          <label className="block mb-1">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        {passwordMsg && (
          <p
            className={`mb-3 ${
              passwordMsg.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}>
            {passwordMsg}
          </p>
        )}

        <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default UserProfile;

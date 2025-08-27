// src/pages/AdminUsers.jsx
import { useEffect, useState } from "react";
import { fetchUsers, deleteUserById, updateUserById } from "@/api/users";
import toast from "react-hot-toast";

export default function AdminUsers() {
  // حالة تخزين المستخدمين
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  // جلب المستخدمين عند تحميل الصفحة
  useEffect(() => {
    loadUsers();
  }, []);

  // دالة جلب المستخدمين
  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // دالة handleDeleteUser
  const handleDeleteUser = async (id) => {
    // نعرض رسالة تأكيد قبل الحذف باستخدام toast
    const confirmed = await new Promise((resolve) => {
      toast(
        (t) => (
          <div className="flex flex-col gap-2">
            <span>Are you sure you want to delete this user?</span>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  resolve(true);
                  toast.dismiss(t.id);
                }}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition">
                Yes
              </button>
              <button
                onClick={() => {
                  resolve(false);
                  toast.dismiss(t.id);
                }}
                className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400 transition">
                No
              </button>
            </div>
          </div>
        ),
        { duration: Infinity } // نجعل الرسالة تبقى حتى يختار المستخدم
      );
    });

    if (!confirmed) return;

    // نحذف المستخدم بعد التأكيد
    try {
      const success = await deleteUserById(id);
      if (success) {
        setUsers((prev) => prev.filter((user) => user.id !== id));
        toast.success("User deleted successfully!");
        // يمكنك إعادة تحميل البيانات هنا أو تحديث state
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      toast.error("Error deleting user", error);
    }
  };
  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setEditForm({ name: user.name, email: user.email });
  };
  const handleSave = async (id) => {
    try {
      const updateUser = await updateUserById(id, editForm);
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? updateUser : user))
      );
      setEditingUserId(null);
      toast.success("User updated successfully ✅", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.log("failed to update user", error);
      toast.error("failed to update user ❌");
    }
  };
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Manage Users</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="border p-2">{user.id}</td>

                {/* إذا كان المستخدم في وضع التعديل */}
                {editingUserId === user.id ? (
                  <>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td className="border p-2">{user.name}</td>
                    <td className="border p-2">{user.email}</td>
                  </>
                )}

                <td className="border p-2 space-x-2">
                  {editingUserId === user.id ? (
                    <>
                      <button
                        onClick={() => handleSave(user.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUserId(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

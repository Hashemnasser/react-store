// src/pages/AdminUsers.jsx
import { useEffect, useMemo, useState } from "react";
import { fetchUsers, deleteUserById, updateUserById } from "@/api/users";
import toast from "react-hot-toast";
import { Edit, Trash, Save, X } from "lucide-react";

export default function AdminUsers() {
  // حالة التخزين
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [searchQuery, setSearchQuery] = useState("");

  // جلب المستخدمين
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data || []);
    } catch (err) {
      toast.error("Failed to fetch users");
      console.error(err);
    }
  };

  // حذف مستخدم مع تأكيد بسيط
  const handleDeleteUser = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this user?");
    if (!ok) return;
    try {
      const success = await deleteUserById(id);
      if (success) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        toast.success("User deleted");
      } else {
        toast.error("Delete failed");
      }
    } catch (err) {
      toast.error("Delete failed");
      console.error(err);
    }
  };

  // بدء التعديل
  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setEditForm({ name: user.name, email: user.email });
  };

  // إلغاء التعديل
  const handleCancel = () => {
    setEditingUserId(null);
    setEditForm({ name: "", email: "" });
  };

  // حفظ التعديل
  const handleSave = async (id) => {
    try {
      const updated = await updateUserById(id, editForm);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      setEditingUserId(null);
      toast.success("User updated");
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    }
  };

  // فلترة البحث
  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const name = (u?.name || "").toLowerCase();
      const email = (u?.email || "").toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [users, searchQuery]);

  return (
    <div className="flex flex-col  justify-center gap-y-8 mx-6   py-6">
      <h1 className="text-lg md:text-xl  font-bold dark:text-white  ">
        Manage Users :
      </h1>
      {/* عنوان + بحث */}
      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-[80%] px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
      />{" "}
      {/* ============================
      //     Mobile view: cards (no horizontal scroll)
      //     تظهر على الشاشات الصغيرة فقط (md:hidden)
      //    ============================ */}
      <div className=" space-y-3 md:max-w-[80%]">
        {filteredUsers.length ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-3 shadow-sm">
              <div className="flex items-start justify-between">
                {/* اسم المستخدم */}
                <div className="min-w-0">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold truncate dark:text-white">
                      {user.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {" "}
                      <span className="text-green-500">ID: </span>
                      {user.id}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 break-words">
                    {user.email}
                  </div>
                </div>

                {/* أيقونات الأكشنز للموبايل */}
                <div className="flex items-center gap-2 ml-3">
                  {editingUserId === user.id ? (
                    <>
                      <button
                        onClick={() => handleSave(user.id)}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Save">
                        <Save className="w-5 h-5 text-green-600" />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Cancel">
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Edit">
                        <Edit className="w-5 h-5 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Delete">
                        <Trash className="w-5 h-5 text-red-600" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* تفاصيل إضافية (Role) و inputs أثناء التعديل */}
              <div className="mt-2">
                {editingUserId === user.id ? (
                  <>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full mb-2 border rounded px-2 py-1 text-sm dark:bg-gray-900 dark:text-white"
                      placeholder="Name"
                    />
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      className="w-full border rounded px-2 py-1 text-sm dark:bg-gray-900 dark:text-white"
                      placeholder="Email"
                    />
                    <div className="mt-2 text-xs text-gray-400">
                      Role: {user.role}
                    </div>
                  </>
                ) : (
                  <div className="mt-2 text-xs text-gray-400">
                    Role: {user.role}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-6">
            No users match your search.
          </div>
        )}
      </div>
      {/* عدد النتائج */}
      <p className="text-xs text-gray-500 mt-3">
        Showing {filteredUsers.length} of {users.length} users
      </p>
    </div>
  );
}

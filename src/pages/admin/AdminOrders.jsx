// src/pages/AdminOrders.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchOrders, deleteOrderById, deleteAllOrders } from "@/api/orders";
import { fetchProducts } from "@/api/products";
import { fetchUsers } from "@/api/users";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { XIcon, Trash2Icon } from "lucide-react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOrder, setDrawerOrder] = useState(null); // لتخزين الطلب المفتوح في Drawer
  const [loading, setLoading] = useState(false);

  // تحميل البيانات
  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, productsData, userData] = await Promise.all([
        fetchOrders(),
        fetchProducts(),
        fetchUsers(),
      ]);
      setOrders(ordersData);
      setProducts(productsData);
      setUsers(userData);
    } catch (error) {
      toast.error("Failed to load data", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // دوال مساعدة
  const getProduct = (id) => products.find((p) => p.id == id);
  const getUserById = useCallback(
    (id) => users.find((user) => user.id === id),
    [users]
  );

  // حذف طلب محدد
  const handleDeleteOrder = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );
    if (!confirmed) return;

    try {
      await deleteOrderById(id);
      toast.success("Order deleted");
      setDrawerOrder(null); // اغلاق الـ Drawer بعد الحذف
      loadData();
    } catch (err) {
      toast.error("Failed to delete order", err.message);
    }
  };

  // حذف كل الطلبات
  const handleDeleteAll = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete all orders?"
    );
    if (!confirmed) return;

    try {
      await deleteAllOrders();
      toast.success("All orders deleted");
      loadData();
    } catch (err) {
      toast.error("Failed to delete all orders", err.message);
    }
  };

  // تصفية وفرز الطلبات
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = [...orders];

    if (filterStatus !== "all") {
      filtered = filtered.filter((order) => order.status === filterStatus);
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((order) => {
        const user = getUserById(order.userId);
        return (
          user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    switch (sortOption) {
      case "newest":
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "highTotal":
        filtered.sort((a, b) => b.total - a.total);
        break;
      case "lowTotal":
        filtered.sort((a, b) => a.total - b.total);
        break;
      default:
        break;
    }
    return filtered;
  }, [orders, filterStatus, sortOption, searchQuery, getUserById]);

  return (
    <div className="p-4 max-w-7xl mx-auto text-xs md:text-sm lg:text-xl">
      {/* شريط البحث */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <input
          type="text"
          className="border px-3 py-2 rounded w-full sm:w-64 dark:bg-gray-800 dark:text-white dark:border-gray-700"
          value={searchQuery}
          placeholder="Search by Email, Name or Order ID"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex flex-wrap gap-2 font-semibold ">
          <select
            value={filterStatus}
            className="border px-3 py-2 rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
            onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={sortOption}
            className="border px-3 py-2 rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
            onChange={(e) => setSortOption(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highTotal">Highest Total</option>
            <option value="lowTotal">Lowest Total</option>
          </select>
        </div>
      </div>

      {/* رأس الصفحة وزر حذف الكل */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="md:text-2xl font-semibold dark:text-white text-">
          All Orders ({orders.length})
        </h2>
        {orders.length > 0 && (
          <button
            onClick={handleDeleteAll}
            className="bg-red-600 text-white px-4 py-2 font-semibold rounded hover:bg-red-700 transition">
            Delete All
          </button>
        )}
      </div>

      {/* قائمة الطلبات */}
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No orders found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedOrders.map((order) => {
            const user = getUserById(order.userId);
            return (
              <motion.div
                layout
                key={order.id}
                className="bg-white dark:bg-gray-800 p-4 rounded shadow cursor-pointer hover:shadow-lg transition"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setDrawerOrder(order)} // فتح الـ Drawer عند الضغط
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-semibold dark:text-white">
                      {user?.name || user?.fullName || "Unknown User"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.date).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      order.status === "pending"
                        ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200"
                        : order.status === "delivered"
                        ? "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200"
                        : "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200"
                    }`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm font-semibold dark:text-white">
                  Total: ${order.total}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Drawer لعرض تفاصيل الطلب */}
      {drawerOrder && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex justify-end items-center"
          onClick={() => setDrawerOrder(null)}>
          <motion.div
            className="bg-white dark:bg-gray-900 w-full sm:w-96 h-fit  p-4 overflow-y-auto shadow-lg"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}>
            {/* زر إغلاق */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold dark:text-white">
                Order Details
              </h2>
              <button
                onClick={() => setDrawerOrder(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                <XIcon />
              </button>
            </div>

            {/* بيانات المستخدم */}
            <div className="mb-4">
              <p className="font-semibold dark:text-white">
                Customer:{" "}
                {getUserById(drawerOrder.userId)?.name ||
                  getUserById(drawerOrder.userId)?.fullName ||
                  "Unknown"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Email: {getUserById(drawerOrder.userId)?.email || "N/A"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Date: {new Date(drawerOrder.date).toLocaleString()}
              </p>
              <span
                className={`px-2 py-1 text-xs rounded ${
                  drawerOrder.status === "pending"
                    ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200"
                    : drawerOrder.status === "delivered"
                    ? "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200"
                    : "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200"
                }`}>
                {drawerOrder.status}
              </span>
            </div>

            {/* قائمة المنتجات */}
            <div className="space-y-2 mb-4">
              {drawerOrder.items.map((item) => {
                const product = getProduct(Number(item.id));
                return (
                  <div
                    key={`${drawerOrder.id}-${item.id}`}
                    className="flex items-center justify-between border p-2 rounded">
                    <div className="flex items-center gap-2">
                      <img
                        src={product?.image}
                        alt={product?.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium dark:text-white">
                          {product?.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold dark:text-white">
                      ${(product?.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* إجمالي الطلب وزر الحذف */}
            <div className="flex justify-between items-center mt-4">
              <p className="text-lg font-bold dark:text-white">
                Total: ${drawerOrder.total}
              </p>
              <button
                onClick={() => handleDeleteOrder(drawerOrder.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition flex items-center gap-1">
                <Trash2Icon size={16} /> Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

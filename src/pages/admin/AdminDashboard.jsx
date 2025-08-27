// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { fetchUsers } from "@/api/users";
import { fetchProducts } from "@/api/products";
import { fetchOrders } from "@/api/orders";
import { useNavigate } from "react-router-dom";
import SimpleSalesChart from "@/components/SalesChart";
import RecentUsers from "@/components/RecentUsers";

// مثال: تجميع المبيعات لكل يوم (هنا افتراضي)
const salesData = [
  { day: "Mon", sales: 5 },
  { day: "Tue", sales: 8 },
  { day: "Wed", sales: 12 },
  { day: "Thu", sales: 4 },
  { day: "Fri", sales: 9 },
  { day: "Sat", sales: 7 },
  { day: "Sun", sales: 10 },
];
const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const users = await fetchUsers();
      const products = await fetchProducts();
      const orders = await fetchOrders();

      setUsers(users);
      setProductsCount(products.length);
      setOrders(orders);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };
  const usersCount = users.length;
  const ordersCount = orders.length;
  const recentOrders = orders
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* الكرت الأول: Users */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Total Users
          </h2>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {usersCount}
          </p>
        </div>

        {/* الكرت الثاني: Products */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Total Products
          </h2>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {productsCount}
          </p>
        </div>

        {/* الكرت الثالث: Orders */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Total Orders
          </h2>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {ordersCount}
          </p>
        </div>
      </div>
      {/* آخر الطلبات */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
          Recent Orders
        </h2>
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="py-2 px-3">Order ID</th>
              <th className="py-2 px-3">Customer</th>
              <th className="py-2 px-3">Date</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <td className="py-2 px-3">{order.id}</td>
                <td className="py-2 px-3">{order.customerName}</td>
                <td className="py-2 px-3">
                  {new Date(order.date).toLocaleDateString()}
                </td>
                <td className="py-2 px-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-2 px-3">${order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 text-right">
          <button
            onClick={() => navigate("/admin/orders")}
            className="text-blue-600 dark:text-blue-400 hover:underline">
            View All
          </button>
        </div>
      </div>
      <SimpleSalesChart data={salesData} />
      <RecentUsers users={users} />
    </div>
  );
};

export default AdminDashboard;

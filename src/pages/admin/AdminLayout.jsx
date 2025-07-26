// src/pages/admin/AdminLayout.jsx
import React from "react";
import { Link, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col gap-3">
          <Link to="/admin" className="hover:text-blue-400">
            🏠 Dashboard
          </Link>
          <Link to="/admin/orders" className="hover:text-blue-400">
            📦 Orders
          </Link>
          <Link to="/admin/products" className="hover:text-blue-400">
            🛍️ Products
          </Link>
          <Link to="/admin/users" className="hover:text-blue-400">
            👤 Users
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 dark:bg-gray-900 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

// src/pages/admin/AdminLayout.jsx
import React from "react";
import { Link, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="grid grid-cols-12 min-h-screen ">
      {/* Sidebar */}
      <aside className="col-span-4 bg-gray-800 text-white p-6 space-y-4 md:col-span-2 sticky top-12 z-50 h-screen">
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
      <main className=" bg-gray-100 dark:bg-gray-900 p-4 col-span-8 md:col-span-9">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

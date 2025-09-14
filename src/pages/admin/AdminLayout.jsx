// src/pages/admin/AdminLayout.jsx
import React from "react";
import { Link, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="grid grid-cols-12 min-h-fit ">
      {/* Sidebar */}
      <aside className="col-span-3 bg-gray-800 text-white py-6 px-1 md:p-4 space-y-8 md:col-span-2 sticky top-12 z-50 h-[100%]">
        <h2 className=" text-xl md:text-2xl font-bold mb-6 mx-auto">
          Admin Panel
        </h2>
        <nav className="flex flex-col gap-4">
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
      <main className=" bg-gray-100 dark:bg-gray-900 md:p-4 col-span-9 md:col-span-10 ">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

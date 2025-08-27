// src/pages/admin/AdminProducts.jsx
import { useEffect, useState } from "react";
import { fetchProducts, deleteProductById } from "@/api/products";
import { Link } from "react-router-dom";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  // جلب المنتجات
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    loadProducts();
  }, []);

  // حذف منتج
  const handleDelete = async (id) => {
    try {
      await deleteProductById(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="p-6">
      {/* العنوان وزر إضافة */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Products
        </h1>

        <Link
          to="/admin/products/add"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
          + Add Product
        </Link>
      </div>

      {/* جدول المنتجات */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full border-collapse bg-white dark:bg-gray-800 text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                    {product.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {product.category}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    ${product.price}
                  </td>
                  <td className="px-4 py-3 flex justify-center gap-2">
                    <Link
                      to={`/admin/products/edit/${product.id}`}
                      className="px-3 py-1 bg-green-500 text-white rounded">
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700 transition">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

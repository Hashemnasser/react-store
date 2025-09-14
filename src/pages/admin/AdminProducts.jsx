// src/pages/admin/AdminProducts.jsx
import { useEffect, useMemo, useState } from "react";
import { fetchProducts, deleteProductById } from "@/api/products";
import { Link } from "react-router-dom";
import { Edit, Trash } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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
  // فلترة البحث
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter((pro) => {
      const name = (pro?.name || "").toLowerCase();
      const category = (pro?.category || "").toLowerCase();
      return name.includes(q) || category.includes(q);
    });
  }, [products, searchQuery]);
  return (
    <div className="px-3 py-6 md:p-6">
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
      <div className="flex flex-col  justify-center gap-y-8    py-6">
        {/* عنوان + بحث */}
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className=" w-full md:w-[50%] mx-auto px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />{" "}
        {filteredProducts.length ? (
          <>
            {/* ============================
            //     Mobile view: cards (no horizontal scroll)
            //     تظهر على الشاشات الصغيرة فقط (md:hidden)
            //    ============================ */}
            <div className=" md:hidden space-y-3 md:max-w-[80%]">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-3 shadow-sm">
                  <div className="flex items-start justify-between">
                    {/*اسم المنتج */}
                    <div className="min-w-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold truncate dark:text-white">
                          {product.name}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 break-words">
                        <span className="font-mono text-green-600">
                          Category :
                        </span>
                        {product.category}
                      </div>
                      <div>
                        <span className="font-mono text-blue-600">Price :</span>
                        {product.price}
                      </div>
                    </div>

                    {/* أيقونات الأكشنز للموبايل */}
                    <div className="flex items-center gap-2 ml-3">
                      <Link to={`/admin/products/edit/${product.id}`}>
                        <Edit className="w-5 h-5 text-blue-600" />
                      </Link>

                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Delete">
                        <Trash className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/*    جدول المنتجات للشاشات الكبيرة*/}
            <div className="overflow-x-auto rounded-lg shadow-md hidden md:flex">
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
                  {filteredProducts.map((product) => (
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
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-6">
            No Products match your search.
          </div>
        )}
      </div>
      {/* عدد النتائج */}
      <p className="text-xs text-gray-500 mt-3">
        Showing {filteredProducts.length} of {products.length} users
      </p>
    </div>
  );
}

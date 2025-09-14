// src/pages/admin/AddEditProduct.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addProduct,
  fetchProductById,
  updateProductById,
} from "@/api/products";

export default function AddEditProduct() {
  const { id } = useParams(); // لو جاي تعديل بنجيب الـ id من الرابط
  const navigate = useNavigate();

  // حالة النموذج
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  // تحميل بيانات المنتج إذا كنا بحالة تعديل
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchProductById(id)
        .then((data) => setFormData(data))
        .catch((err) => console.error("Error fetching product:", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  // تحديث الحقول
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // إرسال النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await updateProductById(id, formData);
        alert("Product updated successfully!");
      } else {
        await addProduct(formData);
        alert("Product added successfully!");
      }
      navigate("/admin/products"); // رجوع لصفحة المنتجات
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 shadow rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        {id ? "Edit Product" : "Add New Product"}
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData?.name}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData?.price}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData?.category}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200">
              Image URL
            </label>
            <input
              type="text"
              name="image"
              value={formData?.image}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200">
              Description
            </label>
            <textarea
              name="description"
              value={formData?.description}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              rows="4"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition">
            {loading ? "Saving..." : id ? "Update Product" : "Add Product"}
          </button>
        </form>
      )}
    </div>
  );
}

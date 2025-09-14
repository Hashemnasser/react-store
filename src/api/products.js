// src/api/products.js

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/products`;

// 🟢 جلب كل المنتجات
export const fetchProducts = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch products");
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error.message);
    return [];
  }
};

// 🟢 جلب منتج حسب ID
export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch product with id: " + id);
    return await response.json();
  } catch (error) {
    console.error("fetchProductById error:", error.message);
    return null;
  }
};

// 🗑️ حذف منتج حسب ID
export const deleteProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete product");
    return true;
  } catch (error) {
    console.error("Error deleting product:", error.message);
    return false;
  }
};

// 🟢 إضافة منتج جديد
export const addProduct = async (productData) => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    if (!res.ok) throw new Error("Failed to add product");
    return await res.json();
  } catch (error) {
    console.error("Error adding product:", error.message);
    return null;
  }
};

// 🟢 تعديل منتج حسب ID
export const updateProductById = async (id, updatedData) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT", // أو PATCH لو بدك تعدل بس حقول محددة
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
    if (!res.ok) throw new Error("Failed to update product");
    return await res.json();
  } catch (error) {
    console.error("Error updating product:", error.message);
    return null;
  }
};

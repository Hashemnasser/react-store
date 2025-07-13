
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_URL = `${BASE_URL}/products`;

export const fetchProducts = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error.message);
    return [];
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`API_URL/${id}`);
    if (!response.ok) {
      throw new Error("❌ Failed to fetch product with id: " + id);
    }

    const product = await response.json();
    return product;
  } catch (error) {
    console.error("🚨 fetchProductById error:", error.message);
    return null; // أو ممكن ترجع {} إذا حبيت
  }
};

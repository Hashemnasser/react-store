import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useWishList from "../context/useWishList";
import useCart from "../context/useCart";
import { fetchProducts } from "../api/products";
import { FaTrash, FaHeart } from "react-icons/fa";

const WishList = () => {
  const { wishList, removeFromWishList, clearWishList } = useWishList();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  // 🧠 جلب المنتجات مع try/catch
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error("❌ Failed to fetch products", err.message);
        setError("Failed to load products. Please try again.");
      }
    };
    loadProducts();
  }, []);

  // 🧠 تصفية المنتجات المفضلة
  const productsInWishList = useMemo(() => {
    return products.filter((product) => wishList.includes(product.id));
  }, [products, wishList]);

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto dark:text-white">
      <h1 className="text-3xl font-bold mb-6">My Wish List</h1>

      {/* رسالة الخطأ إن وُجدت */}
      {error && (
        <div className="text-red-600 font-medium bg-red-100 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      {/* فارغة؟ */}
      {productsInWishList.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          No items in wish list.
        </p>
      ) : (
        <>
          {/* 🧱 شبكة المنتجات */}
          <AnimatePresence>
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productsInWishList.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                  {/* ❤️ زر إزالة */}
                  <button
                    onClick={() => removeFromWishList(product.id)}
                    className="absolute top-1 right-1 text-pink-600 hover:text-pink-800 text-lg"
                    title="Remove from wishlist">
                    <FaTrash />
                  </button>

                  {/* 🖼️ صورة المنتج */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded mb-4"
                  />

                  {/* 📝 معلومات المنتج */}
                  <h2 className="text-lg font-semibold">{product.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
                    {product.category}
                  </p>
                  <p className="text-green-600 font-semibold mb-3">
                    ${product.price}
                  </p>

                  {/* 🛒 زر الإضافة إلى السلة */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    onClick={() => addToCart(product)}
                    className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 text-sm">
                    Add to Cart
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </>
      )}
      {productsInWishList.length > 0 && (
        <motion.button
          onClick={() => {
            if (window.confirm("Clear entire wish list?")) {
              clearWishList();
            }
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mt-6 bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 text-sm shadow">
          Clear All ❤️
        </motion.button>
      )}
    </div>
  );
};

export default WishList;

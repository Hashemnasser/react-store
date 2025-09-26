import { useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import useCart from "../context/useCart";
import { fetchProducts } from "../api/products";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error("❌ Failed to load products", err.message);
      }
    };
    load();
  }, []);

  // 🧠 دمج بيانات المنتج مع السلة
  const detailedCart = useMemo(() => {
    return cartItems
      .map((item) => {
        const product = products.find(
          (p) => p.id === item.productId || p.id === item.id
        );
        if (!product) return null;
        return {
          ...product,
          quantity: item.quantity,
          cartId: item.id, // ID من cartItems
        };
      })
      .filter(Boolean); // حذف العناصر null
  }, [cartItems, products]);

  const total = detailedCart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (detailedCart.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/products" className="text-blue-600 underline">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto dark:text-white dark:bg-gray-800">
      <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

      <motion.ul
        initial="hidden"
        animate="visible"
        className="divide-y-4 divide-gray-200">
        <AnimatePresence>
          {detailedCart.map((item) => (
            <motion.li
              key={item.cartId}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              layout
              className="flex justify-between items-center bg-white shadow p-4 rounded-lg dark:bg-gray-800">
              <div className="flex items-center gap-4">
                <img
                  loading="lazy"
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Quantity:{" "}
                    <span className="inline-flex items-center gap-2">
                      <button
                        onClick={() => decreaseQuantity(item.cartId)}
                        className="bg-gray-300 px-2 rounded">
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.cartId)}
                        className="bg-gray-300 px-2 rounded">
                        +
                      </button>
                    </span>
                  </p>
                  <p className="text-gray-800 dark:text-white font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.cartId, item.name)}
                className="text-red-500 hover:underline">
                Remove
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={clearCart}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Clear Cart
        </button>
        <div className="text-xl font-bold">
          Total: <span className="text-green-600">${total.toFixed(2)}</span>
        </div>
      </div>

      <Link
        to="/checkout"
        className="bg-green-600 inline-block text-white px-4 py-2 rounded mt-4 hover:bg-green-700">
        Proceed to Checkout
      </Link>
    </div>
  );
};

export default Cart;

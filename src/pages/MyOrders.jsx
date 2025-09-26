import React, { useEffect, useState } from "react";
import { deleteOrderById, fetchUserOrders } from "../api/orders";
import { fetchProducts } from "../api/products";
import { useAuth } from "../context/useAuth";
import useCart from "../context/useCart"; // ✅ استدعاء addToCart
import { motion } from "framer-motion";
import toast from "react-hot-toast"; // ✅ إشعار عند Re-order
import { printOrder } from "../utils/printOrder";

const MyOrders = () => {
  const { user } = useAuth();
  const { addToCart } = useCart(); // ✅ لإعادة إرسال الطلب
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const [ordersData, productsData] = await Promise.all([
          fetchUserOrders(user?.id),
          fetchProducts(),
        ]);
        ordersData.sort((a, b) => new Date(b.date) - new Date(a.date));

        setOrders(ordersData);
        setProducts(productsData);
      } catch (err) {
        console.error("❌ Error loading orders:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) loadOrders();
  }, [user?.id]);

  const handleClearAllOrders = async () => {
    if (!window.confirm("Clear entire orders list?")) return;

    try {
      await Promise.all(orders.map((order) => deleteOrderById(order.id)));
      setOrders([]);
    } catch (err) {
      console.error("❌ Failed to delete orders:", err.message);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      await deleteOrderById(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err) {
      console.error("❌ Failed to delete order:", err.message);
    }
  };

  const handleReorder = async (items) => {
    try {
      for (const item of items) {
        await addToCart(item); // 🧠 يعتمد على أن item يحتوي على id, quantity
      }
      toast.success("Order added back to cart 🛒");
    } catch (err) {
      console.error("❌ Reorder failed:", err.message);
      toast.error("Failed to re-order.");
    }
  };

  if (loading)
    return <p className="text-center p-8 dark:text-white">Loading orders...</p>;

  if (orders.length === 0)
    return (
      <p className="text-center p-8 text-gray-600 dark:text-white">
        You have no orders.
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.map((order) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 border-b pb-4">
          <h3 className="text-lg font-bold mb-2">Order ID: {order.id}</h3>
          <p className="text-sm text-gray-500 mb-2">
            Date: {new Date(order.date).toLocaleString()}
          </p>
          <p className="text-sm mb-2">
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`inline-block px-2 py-1 text-xs rounded font-medium
      ${
        order.status === "delivered"
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}>
              {order.status}
            </span>
          </p>

          <ul className="space-y-2">
            {order.items.map((item) => {
              const product = products.find((p) => p.id === item.id);
              if (!product) return null;

              return (
                <li
                  key={`${order.id}-${product.id}`}
                  className="flex items-center gap-4">
                  <img
                    loading="lazy"
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm text-green-600 font-bold">
                      ${(product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* ✅ الأزرار تحت الطلب */}
          <div className="flex gap-3 mt-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleReorder(order.items)}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
              🔁 Re-order
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDeleteOrder(order.id)}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">
              🗑️ Delete
            </motion.button>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => printOrder(order)}
            className="text-blue-600 text-sm underline hover:text-blue-800 py-3 mt-2 ">
            Print
          </motion.button>
        </motion.div>
      ))}

      {/* ✅ زر الحذف الكلي */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleClearAllOrders}
        className="mt-6 bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 text-sm shadow">
        Clear All
      </motion.button>
    </div>
  );
};

export default MyOrders;

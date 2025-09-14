import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCart from "../context/useCart";
import toast from "react-hot-toast";
import { useAuth } from "../context/useAuth";
import { fetchProducts } from "../api/products";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchProducts();
        setOrders(data);
      } catch (err) {
        console.error("Error loading products:", err.message);
      }
    };
    loadOrders();
  }, []);
  // ✅ جلب المنتجات
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error loading products:", err.message);
      }
    };
    loadProducts();
  }, []);

  // ✅ مطابقة عناصر السلة مع المنتجات
  // const productsInCheckout = cartItems
  //   .map((item) => {
  //     const product = products.find((p) => p.id === item.productId);
  //     return product ? { ...product, quantity: item.quantity } : null;
  //   })
  //   .filter(Boolean); // يحذف القيم null
  const productsInCheckout = cartItems.reduce((acc, item) => {
    const product = products.find((p) => p.id === item.productId);
    if (product) {
      acc.push({ ...product, quantity: item.quantity });
    }
    return acc;
  }, []);

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      const orderData = {
        userId: user?.id || "guest",
        items: productsInCheckout,
        total: productsInCheckout.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        date: new Date().toISOString(),
        status: "pending", // ✅ الحالة الابتدائية
      };

      const res = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Failed to place order.");

      toast.success("🎉 Order confirmed!", {
        position: "top-center",
        duration: 2500,
        style: {
          background: "#1e293b",
          color: "#fff",
          fontSize: "15px",
          borderRadius: "10px",
        },
      });

      clearCart();
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setError(err.message || "Unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center text-gray-600 p-8">
        Your cart is empty.
        <Link to="/products" className="text-blue-600 underline ml-2">
          Go shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 dark:text-white dark:bg-gray-800">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-600 text-white rounded">{error}</div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6 mb-6 dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <ul className="divide-y">
          {productsInCheckout.map((item) => (
            <li key={item.id} className="py-2 flex justify-between">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span className="font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 text-right font-bold text-lg">
          Total: $
          {productsInCheckout
            .reduce((total, item) => total + item.price * item.quantity, 0)
            .toFixed(2)}
        </div>
      </div>

      <div className="text-right">
        <button
          onClick={handleConfirm}
          disabled={loading}
          className={`px-6 py-2 rounded text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}>
          {loading ? "Processing..." : "Confirm Order"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;

import { createContext, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import {
  getCartItems,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCartFromServer,
} from "../api/cart";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  // 🧠 تحميل السلة من السيرفر عند تسجيل الدخول
  useEffect(() => {
    const loadCart = async () => {
      if (!user?.id) return;
      try {
        const data = await getCartItems(user.id);
        setCartItems(data);
      } catch (err) {
        console.error("❌ Error loading cart:", err.message);
        setCartItems([]);
      }
    };

    loadCart();
  }, [user?.id]);

  // ✅ إضافة منتج إلى السلة
  const handleAddToCart = async (product, quantity = 1) => {
    if (!user?.id) return;

    try {
      // تحقق إذا المنتج موجود مسبقًا
      const existing = cartItems.find((item) => item.productId === product.id);
      if (existing) {
        const updated = await updateCartItem(
          existing.id,
          existing.quantity + quantity
        );
        setCartItems((prev) =>
          prev.map((item) => (item.id === existing.id ? updated : item))
        );
      } else {
        const newItem = await addToCart(user.id, product.id, quantity);
        setCartItems((prev) => [...prev, newItem]);
      }
    } catch (err) {
      console.error("❌ Error adding to cart:", err.message);
    }
  };

  // ✅ إزالة منتج من السلة
  const handleRemoveFromCart = async (id) => {
    try {
      await removeFromCart(id);
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("❌ Error removing item:", err.message);
    }
  };

  // ✅ زيادة الكمية
  const increaseQuantity = async (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    try {
      const updated = await updateCartItem(id, item.quantity + 1);
      setCartItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
    } catch (err) {
      console.error("❌ Error increasing quantity:", err.message);
    }
  };

  // ✅ تقليل الكمية
  const decreaseQuantity = async (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item || item.quantity <= 1) return;

    try {
      const updated = await updateCartItem(id, item.quantity - 1);
      setCartItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
    } catch (err) {
      console.error("❌ Error decreasing quantity:", err.message);
    }
  };

  // ✅ تفريغ السلة
  const handleClearCart = async () => {
    if (!user?.id) return;
    try {
      await clearCartFromServer(user.id);
      setCartItems([]);
    } catch (err) {
      console.error("❌ Error clearing cart:", err.message);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart: handleAddToCart,
        removeFromCart: handleRemoveFromCart,
        clearCart: handleClearCart,
        increaseQuantity,
        decreaseQuantity,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartProvider, CartContext };

import {
  addToWishListAPI,
  fetchWishList,
  removeFromWishListAPI,
} from "../api/wishList";
import { createContext, useCallback, useEffect, useState } from "react";

const WishListContext = createContext();

const WishListProvider = ({ children }) => {
  const [wishList, setWishList] = useState([]);

  // ✅ جلب المفضلة من API
  useEffect(() => {
    const loadWishList = async () => {
      try {
        const data = await fetchWishList();
        setWishList(data.map((item) => item.id));
      } catch (error) {
        console.error("❌ Failed to load wish list", error.message);
      }
    };
    loadWishList();
  }, []);

  // ✅ إضافة
  const addToWishList = async (productId) => {
    try {
      await addToWishListAPI(productId);
      setWishList((prev) => [...prev, productId]);
    } catch (error) {
      console.error("❌ Failed to add to wish list", error.message);
    }
  };

  // ✅ إزالة
  const removeFromWishList = async (productId) => {
    try {
      await removeFromWishListAPI(productId);
      setWishList((prev) => prev.filter((id) => id !== productId));
    } catch (error) {
      console.error("❌ Failed to remove from wish list", error.message);
    }
  };

  const isInWishList = useCallback(
    (id) => {
      return wishList.includes(id); // ✅ التحقق المباشر من المصفوفة
    },
    [wishList]
  );

  const clearWishList = () => setWishList([]);

  return (
    <WishListContext.Provider
      value={{
        wishList,
        addToWishList,
        removeFromWishList,
        isInWishList,
        clearWishList,
      }}>
      {children}
    </WishListContext.Provider>
  );
};
export default WishListProvider;

export { WishListContext };

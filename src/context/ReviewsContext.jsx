import { fetchReviews, postReview } from "../api/reviews";
import { createContext, useEffect, useState } from "react";

const ReviewsContext = createContext();

export const ReviewsProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await fetchReviews(); // ← من ملف api/reviews.js
        setReviews(data);
      } catch (error) {
        console.error("❌ Failed to load reviews:", error.message);
        setReviews([]); // fallback
      }
    };

    loadReviews();
  }, []);

  // إضافة تعليق جديد
  const addReview = async (productId, userName, rating, comment) => {
    const newReview = {
      productId,
      userName,
      rating,
      comment,
      date: new Date().toISOString(),
    };

    try {
      const res = await postReview(newReview); // ← نمرر كائن
      setReviews((prev) => [...prev, res]);
    } catch (error) {
      console.error("❌ Failed to post review:", error.message);
    }
  };

  // استرجاع تعليقات منتج محدد
  const getReviewsByProduct = (productId) =>
    reviews.filter((r) => r.productId === productId);

  return (
    <ReviewsContext.Provider
      value={{ reviews, addReview, getReviewsByProduct }}>
      {children}
    </ReviewsContext.Provider>
  );
};

export { ReviewsContext };

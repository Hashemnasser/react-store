// api/reviews.js
const BASE_URL = "http://localhost:5000/reviews";

// جلب كل المراجعات
export const fetchReviews = async () => {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch reviews");
    return await res.json();
  } catch (error) {
    console.error("Error loading reviews:", error.message);
    return [];
  }
};

// إرسال مراجعة جديدة
export const postReview = async (review) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    });
    if (!res.ok) throw new Error("Failed to post review");
    return await res.json();
  } catch (error) {
    console.error("Error posting review:", error.message);
    return null;
  }
};

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProductById } from "../api/products";
import useCart from "../context/useCart";
import useReviews from "../context/useReviews";
import { motion } from "framer-motion";
import ProductCardSkeleton from "../components/ProductCardSkeleton"; // ✅ استخدام الهيكل العظمي
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

// تحويل LazyLoadImage إلى نسخة قابلة للتحريك
// const MotionLazyImage = motion.create(LazyLoadImage);

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { addReview, getReviewsByProduct } = useReviews();

  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("❌ Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* ✅ استخدام سكيلتون كمؤثر تحميل للصفحة */}
        <ProductCardSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 text-red-600 font-bold text-xl">
        Product not found.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-4xl mx-auto px-4 py-8 dark:text-white dark:bg-gray-800">
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}>
          <LazyLoadImage
            src={product.image}
            alt={product.name}
            effect="blur"
            className="w-full h-96 object-cover rounded-lg"
          />
        </motion.div>

        <div>
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
            className="text-3xl font-bold mb-4 dark:text-white">
            {product.name}
          </motion.h1>

          <motion.p
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
            className="text-gray-600 mb-4">
            {product.description}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="text-xl font-semibold text-green-700 mb-6">
            ${product.price}
          </motion.p>

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => addToCart(product)}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
            Add to Cart
          </motion.button>
        </div>
      </div>

      {/* ⭐ Review Form */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!userName || !rating || !comment) return;
            addReview(product.id, userName, rating, comment);
            setUserName("");
            setRating(0);
            setComment("");
          }}
          className="space-y-4 max-w-md">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Your Name"
            className="w-full px-4 py-2 border rounded-md dark:text-slate-600"
            required
          />

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                className={`cursor-pointer text-2xl ${
                  rating >= star ? "text-yellow-400" : "text-gray-400"
                }`}>
                ★
              </span>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            className="w-full px-4 py-2 border rounded-md h-28 dark:text-slate-600"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Submit Review
          </button>
        </form>
      </div>

      {/* ⭐ Display Reviews */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
        {getReviewsByProduct(product.id).length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <ul className="space-y-4">
            {getReviewsByProduct(product.id).map((review) => (
              <li key={review.id} className="border-b pb-4">
                <div className="flex items-center gap-2 text-yellow-400 text-lg">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>
                <p className="font-semibold">{review.userName}</p>
                <p className="text-gray-600 dark:text-white">
                  {review.comment}
                </p>
                <p className="text-sm text-gray-400 dark:text-slate-200">
                  {new Date(review.date).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

export default ProductDetails;

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useCart from "../context/useCart";
import useWishList from "../context/useWishList";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishList, addToWishList, removeFromWishList } = useWishList();

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return (
      <>
        {"★".repeat(fullStars)}
        {"☆".repeat(emptyStars)}
      </>
    );
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 relative"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200 }}>
      {/* ❤️ Wishlist icon */}
      <div
        onClick={() => {
          isInWishList(product.id)
            ? removeFromWishList(product.id)
            : addToWishList(product.id);
        }}
        className="absolute top-1 right-1 text-pink-500 cursor-pointer text-xl z-10">
        {isInWishList(product.id) ? <FaHeart /> : <FaRegHeart />}
      </div>

      <Link to={`/products/${product.id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-md mb-4"
        />

        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          {product.name}
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {product.category}
        </p>

        {/* ⭐ Rating display */}
        <p className="text-yellow-400 text-sm mt-1">
          {renderStars(product.rating || 4)}
        </p>

        <p className="text-green-600 font-bold mt-2">${product.price}</p>
      </Link>

      <button
        onClick={() => addToCart(product)}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition">
        Add to Cart
      </button>
    </motion.div>
  );
};

export default ProductCard;

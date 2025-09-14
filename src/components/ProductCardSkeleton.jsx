import { motion } from "framer-motion";

const ProductCardSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0.3, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 animate-pulse"
    >
      <div className="w-full h-40 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-3/4"></div>
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mt-4"></div>
    </motion.div>
  );
};

export default ProductCardSkeleton;

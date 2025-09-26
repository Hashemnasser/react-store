import React, {
  startTransition,
  useEffect,
  useMemo,
  useState,
  lazy,
  Suspense,
} from "react";
// import ProductCard from "../components/ProductCard";
import PriceFilterBar from "../components/PriceFilterBar";
import { useDebounce } from "../utils/CustomHooks";
import PageContainer from "../components/PageContainer";
import LoadingSpinner from "../components/LoadingSpinner";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import useWishList from "../context/useWishList";
import { fetchProducts } from "../api/products";

const ProductCard = lazy(() => import("../components/ProductCard"));
const categories = [
  "All",
  "Audio",
  "Chargers",
  "Cables",
  "Holders",
  "Stands",
  "Accessories",
];

const Products = () => {
  const [products, setProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(null);
  const [sortOption, setSortOption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { isInWishList } = useWishList();
  const debouncedValue = useDebounce(searchTerm, 500);
  useEffect(() => {
    setIsLoading(true);

    fetchProducts()
      .then(setProducts)
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  useEffect(() => {
    setCurrentPage(1);
    localStorage.setItem("searchTerm", debouncedValue);
    localStorage.setItem("selectedCategory", selectedCategory);
    localStorage.setItem("maxPrice", maxPrice !== null ? maxPrice : "");
    localStorage.setItem("sortOption", sortOption);
  }, [debouncedValue, selectedCategory, maxPrice, sortOption]);

  useEffect(() => {
    const savedSearch = localStorage.getItem("searchTerm");
    const savedCategory = localStorage.getItem("selectedCategory");
    const savedMaxPrice = localStorage.getItem("maxPrice");
    const saveSortOption = localStorage.getItem("sortOption");
    if (saveSortOption) setSortOption(saveSortOption);
    if (savedSearch) setSearchTerm(savedSearch);
    if (savedCategory) setSelectedCategory(savedCategory);
    if (savedMaxPrice) setMaxPrice(Number(savedMaxPrice));
  }, []);

  // useEffect(() => {
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // }, [currentPage]);

  const productsPerPage = 4;

  const filteredProducts = useMemo(() => {
    let result = products ?? [];

    switch (sortOption) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result = [...result].sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (maxPrice) {
      result = result.filter((p) => p.price <= maxPrice);
    }

    if (debouncedValue) {
      result = result.filter((p) =>
        (p.name + p.description)
          .toLowerCase()
          .includes(debouncedValue.toLowerCase())
      );
    }
    if (showFavoritesOnly) {
      result = result.filter((product) => isInWishList(product.id));
    }
    return result;
  }, [
    products,
    sortOption,
    debouncedValue,
    selectedCategory,
    maxPrice,
    showFavoritesOnly,
    isInWishList,
  ]);

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;

  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const goToPage = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      startTransition(() => {
        setIsLoading(true);
        setCurrentPage(pageNumber);
      });
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // ⏳ وهمي قصير للحركة

    return () => clearTimeout(delay);
  }, [currentProducts]);

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white dark:bg-gray-800">
          All Products
        </h1>

        <div className="mb-6 dark:text-slate-800 transition duration-300">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) =>
              startTransition(() => {
                setIsLoading(true);
                setSearchTerm(e.target.value);
              })
            }
            className="w-full md:w-1/2 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 hover:shadow-md focus:ring-blue-300"
          />
        </div>

        <div className="flex gap-4 items-center mt-1">
          <select
            className="border border-slate-400 rounded-md px-2 py-2 bg-pink-100 text-black hover:bg-pink-300 focus:outline-none focus:ring-1 focus:ring-blue-300 transition duration-500"
            value={sortOption}
            onChange={(e) =>
              startTransition(() => {
                setIsLoading(true);
                setSortOption(e.target.value);
              })
            }>
            <option value="" disabled hidden>
              Sort By
            </option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name-asc">Name: A → Z</option>
            <option value="name-desc">Name: Z → A</option>
            <option value="" hidden={sortOption === ""}>
              Clear Filter
            </option>
          </select>

          <div className="mt-6">
            <PriceFilterBar
              setMaxPrice={setMaxPrice}
              maxPrice={maxPrice}
              setIsLoading={setIsLoading}
            />
          </div>
        </div>
        <label className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={(e) => {
              setCurrentPage(1);
              setShowFavoritesOnly(e.target.checked);
            }}
            className="accent-pink-500"
          />
          <span className="text-sm dark:text-white text-gray-700 font-medium">
            Show Only Favorites ❤️
          </span>
        </label>

        <div>
          <h2 className="text-lg font-semibold mt-4 mb-2">
            Filter by Category
          </h2>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`rounded-full px-4 py-2 border ${
                selectedCategory === cat
                  ? "bg-black text-white hover:bg-opacity-50"
                  : "bg-pink-100 text-black hover:bg-pink-300"
              }`}
              onClick={() =>
                startTransition(() => {
                  setIsLoading(true);
                  setSelectedCategory(cat);
                })
              }>
              {cat}
            </button>
          ))}

          <button
            onClick={() => {
              startTransition(() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setMaxPrice(null);
                setSortOption("");
                localStorage.clear();
              });
            }}
            className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm hover:bg-red-400 transition">
            Reset Filters
          </button>
        </div>

        {/* ✅ الشبكة مع popLayout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              Array.from({ length: productsPerPage }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            ) : currentProducts.length > 0 ? (
              <Suspense
                fallback={Array.from({ length: productsPerPage }).map(
                  (_, index) => (
                    <ProductCardSkeleton key={index} />
                  )
                )}>
                {" "}
                {currentProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    layoutId={`product-card-${product.id}`}
                    variants={cardVariants}
                    initial="hidden"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.85, ease: "easeOut" }}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </Suspense>
            ) : (
              <p className="text-gray-600">No products found.</p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 🔢 Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2 items-center text-gray-800 dark:text-white">
            <button
              onClick={() => goToPage(currentPage - 1)}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              disabled={currentPage === 1}>
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => goToPage(index + 1)}
                className={`px-3 py-1 rounded-lg text-sm font-semibold border transition shadow-sm ${
                  currentPage === index + 1
                    ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white border-blue-600 shadow-md"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}>
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        )}
      </motion.div>
    </PageContainer>
  );
};

export default Products;

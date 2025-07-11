import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../api/products";

const Home = () => {
  const [products, setProducts] = useState([]);

  const featured = products.slice(0, 4); // أول 4 منتجات فقط
  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      {/* 👋 Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-8 rounded-xl shadow-lg mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to ProStore
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Discover the best products at the best prices.
        </p>
        <Link
          to="/products"
          className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-md shadow hover:bg-gray-100 transition">
          Browse Products
        </Link>
      </div>

      {/* 🛍️ Featured Products */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Featured Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;

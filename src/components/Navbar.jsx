import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import useCart from "../context/useCart";
import useWishList from "../context/useWishList";
import { useAuth } from "../context/useAuth";
import { FaHeart } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isBumping, setIsBumping] = useState(false);

  const { cartItems } = useCart();
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const { wishList } = useWishList();
  const { user, logout } = useAuth();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    if (cartItems.length === 0) return;
    setIsBumping(true);
    const timer = setTimeout(() => setIsBumping(false), 300);
    return () => clearTimeout(timer);
  }, [cartItems]);

  const getUserInitial = () => {
    return (
      user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?"
    );
  };

  return (
    <nav className="bg-white/50 backdrop-blur-md shadow-md  py-2 px-6 sticky top-0 z-50 dark:text-white dark:bg-gray-800">
      <div className="flex justify-between items-center gap-3">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600 ">
          ProStore
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-8 text-gray-700 font-medium dark:text-white text-[80%]">
          <li>
            <Link
              to="/"
              className="hover:text-blue-600 hover:scale-150  transition-all">
              Home
            </Link>
          </li>
          <li>
            <Link to="/products" className="hover:text-blue-600">
              Products
            </Link>
          </li>
          <li>
            <Link to="/cart" className="hover:text-blue-600">
              Cart
            </Link>
          </li>
          <li>
            <Link to="/wishlist" className="hover:text-blue-600">
              WishList
            </Link>
          </li>
          <li>
            {user?.role === "admin" && (
              <Link to="/admin" className="hover:text-blue-600">
                {" "}
                Admin Panel
              </Link>
            )}
          </li>
          <li>
            <Link to="/privacy-policy" className="hover:text-blue-600">
              Privacy Policy
            </Link>
          </li>
          {user && (
            <li>
              <Link to="/orders" className="hover:text-blue-600">
                My Orders
              </Link>
            </li>
          )}
          {user && (
            <li>
              <Link to="/profile" className="hover:text-blue-600">
                Profile
              </Link>
            </li>
          )}
        </ul>

        {/* Right Side */}
        <div className="flex items-center ml-4 gap-3 md:gap-8 text-center">
          {/* Toggle Dark Mode */}
          <button
            onClick={toggleDarkMode}
            className="text-[75%] ml-6 text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition"
            title="Toggle Theme">
            {isDarkMode ? "🌞" : "🌙"}
          </button>

          {/* WishList Icon */}
          <Link
            to="/wishlist"
            className="relative text-gray-700 dark:text-white">
            <FaHeart size={15} className="text-red-600" />
            {wishList.length > 0 && (
              <span className="absolute -top-3 -right-3 border border-red-500 text-red-600 text-xs rounded-full px-1">
                {wishList.length}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" className="relative">
            <span className="material-icons text-gray-700 dark:text-white text-lg">
              shopping_cart
            </span>
            <span
              className={`absolute -top-2 -right-2 bg-red-500 text-white text-sm w-4 h-4 flex items-center justify-center rounded-full transition-transform duration-300 ${
                isBumping ? "scale-150" : "scale-100"
              }`}>
              {cartCount}
            </span>
          </Link>

          {/* User Actions */}
          {user ? (
            <div className="flex items-center gap-3 w-full">
              <div
                className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm"
                title={user.name || user.email}>
                {getUserInitial()}
              </div>
              <button
                onClick={logout}
                className="text-red-600 text-[75%] font-semibold hover:underline">
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm">
              <Link to="/signin" className="text-blue-600 hover:underline">
                Sign In
              </Link>
              <Link to="/signup" className="text-green-600 hover:underline">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <span
            onClick={() => setMenuOpen(true)}
            className="md:hidden  material-icons cursor-pointer text-gray-600 hover:text-blue-500 hover:bg-slate-100 rounded-full">
            more_vert
          </span>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* الخلفية السوداء */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0  bg-opacity-70 bg-white  backdrop-blur-sm z-100"
              onClick={() => setMenuOpen(false)}
            />

            {/* القائمة الجانبية */}
            <motion.div
              initial={{ y: "-800%" }}
              animate={{ y: 0 }}
              exit={{ y: "-5000%" }}
              transition={{ duration: 0.5 }}
              className="fixed top-0 right-0 w-64 h-full z-50 bg-white dark:bg-gray-900 shadow-lg flex flex-col transition-transform duration-300 translate-x-0">
              {/* رأس القائمة */}
              <div className="flex justify-between items-center  z-60 relative ">
                <h2 className="text-xl font-bold text-blue-600 mx-auto ps-5">
                  Menu
                </h2>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="material-icons text-2xl text-gray-700 dark:text-white">
                  close
                </button>
              </div>

              {/* روابط القائمة */}
              <motion.div className="bg-white flex flex-col  items-center  ">
                {" "}
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="py-2 hover:text-blue-600">
                  Home
                </Link>
                <Link
                  to="/products"
                  onClick={() => setMenuOpen(false)}
                  className="py-2 hover:text-blue-600">
                  Products
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="py-2 hover:text-blue-600">
                  Cart
                </Link>
                {user?.role === "admin" && (
                  <Link to="/admin" className="hover:text-blue-600">
                    {" "}
                    Admin Panel
                  </Link>
                )}
                <Link
                  to="/wishlist"
                  onClick={() => setMenuOpen(false)}
                  className="py-2 hover:text-blue-600">
                  WishList
                </Link>
                <Link
                  to="/privacy-policy"
                  onClick={() => setMenuOpen(false)}
                  className="py-2 hover:text-blue-600">
                  Privacy Policy
                </Link>
                {user && (
                  <>
                    <Link
                      to="/orders"
                      onClick={() => setMenuOpen(false)}
                      className="py-2 hover:text-blue-600">
                      My Orders
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="py-2 hover:text-blue-600">
                      Profile
                    </Link>
                  </>
                )}
                {user ? (
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="py-2 text-left text-red-600 hover:underline">
                    Sign Out
                  </button>
                ) : (
                  <>
                    <Link
                      to="/signin"
                      onClick={() => setMenuOpen(false)}
                      className="py-2 text-blue-600 hover:underline">
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMenuOpen(false)}
                      className="py-2 text-green-600 hover:underline">
                      Sign Up
                    </Link>
                  </>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

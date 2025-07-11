import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import useCart from "../context/useCart";
import useWishList from "../context/useWishList";
import { useAuth } from "../context/useAuth";
import { FaHeart } from "react-icons/fa";

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
    <nav className="bg-white/50 backdrop-blur-md shadow-md py-2 px-6 sticky top-0 z-50 dark:text-white dark:bg-gray-800">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          ProStore
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-6 text-gray-700 font-medium dark:text-white">
          <li>
            <Link to="/" className="hover:text-blue-600">
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
          {user && (
            <li>
              <Link to="/orders" className="hover:text-blue-600">
                My Orders
              </Link>
            </li>
          )}{" "}
          {user && (
            <li>
              <Link to="/profile" className="hover:text-blue-600">
                Profile
              </Link>
            </li>
          )}
        </ul>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Toggle Dark Mode */}
          <button
            onClick={toggleDarkMode}
            className="text-sm text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition"
            title="Toggle Theme">
            {isDarkMode ? "🌞" : "🌙"}
          </button>

          {/* WishList Icon */}
          <Link
            to="/wishlist"
            className="relative text-gray-700 dark:text-white">
            <FaHeart size={20} className="text-red-600" />
            {wishList.length > 0 && (
              <span className="absolute -top-3 -right-3 border border-red-500 text-red-600 text-xs rounded-full px-1">
                {wishList.length}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" className="relative">
            <span className="material-icons text-gray-700 text- dark:text-white">
              shopping_cart
            </span>
            <span
              className={`absolute -top-2 -right-2 bg-red-500 text-white text-sm w-4 h-4 flex items-center justify-center rounded-full transition-transform duration-300 ${
                isBumping ? "scale-150" : "scale-100"
              }`}>
              {cartCount}
            </span>
          </Link>

          {/* User Menu */}
          {user ? (
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm"
                title={user.name || user.email}>
                {getUserInitial()}
              </div>
              <button
                onClick={logout}
                className="text-red-600 text-sm font-semibold hover:underline">
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

          {/* Mobile Menu Icon */}
          <span
            onClick={() => setMenuOpen(true)}
            className="md:hidden  material-icons cursor-pointer text-gray-600 hover:text-blue-500 hover:bg-slate-100 rounded-full">
            more_vert
          </span>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50">
          <div className="fixed top-0 right-0 w-64 h-full bg-white dark:bg-gray-900 shadow-lg p-6 flex flex-col gap-4 z-50">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-blue-600">Menu</h2>
              <button
                className="material-icons text-gray-600 text-2xl cursor-pointer dark:text-white"
                onClick={() => setMenuOpen(false)}
                aria-label="Close Menu">
                close
              </button>
            </div>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link to="/products" onClick={() => setMenuOpen(false)}>
              Products
            </Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)}>
              Cart
            </Link>
            <Link to="/wishlist" onClick={() => setMenuOpen(false)}>
              WishList
            </Link>
            {user && (
              <Link to="/orders" onClick={() => setMenuOpen(false)}>
                My Orders
              </Link>
            )}
            {user && (
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="hover:text-blue-600 dark:text-white">
                Profile
              </Link>
            )}
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="text-red-600 text-left hover:underline mt-2">
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  to="/signin"
                  onClick={() => setMenuOpen(false)}
                  className="text-blue-600">
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="text-green-600">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

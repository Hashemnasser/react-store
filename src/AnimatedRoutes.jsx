// src/AnimatedRoutes.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Products from "./pages/Products";
import Checkout from "./pages/Checkout";
import WishList from "./pages/WishList";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import PrivateRoute from "./utils/PrivateRoute";
import MyOrders from "./pages/MyOrders";
import UserProfile from "./pages/UserProfile";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route path="/products" element={<Products />} />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <PrivateRoute>
              <WishList />
            </PrivateRoute>
          }
        />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <MyOrders />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          }
        />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        {/* <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} /> // عند زيارة /admin
          <Route path="orders" element={<AdminOrders />} /> // عند زيارة
          /admin/orders
          <Route path="products" element={<AdminProducts />} /> // عند زيارة
          /admin/products
          <Route path="users" element={<AdminUsers />} /> // عند زيارة
          /admin/users
        </Route> */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          {/* <Route path="products" element={<AdminProducts />} /> */}
          <Route path="orders" element={<AdminOrders />} />
          {/* <Route path="users" element={<AdminUsers />} /> */}
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;

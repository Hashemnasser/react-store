import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext";
import WishListProvider from "./context/WishListContext";
import { ReviewsProvider } from "./context/ReviewsContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <WishListProvider>
            <ReviewsProvider>
              <App />
            </ReviewsProvider>
          </WishListProvider>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);

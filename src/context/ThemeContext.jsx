import { createContext, useState, useEffect, useMemo } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // نحاول نقرأ من localStorage أول مرة
    const stored = localStorage.getItem("dark-mode");
    return stored === "true";
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };
  // 🧠 عند كل تغيير، نضيف أو نحذف الكلاس من html
  useEffect(() => {
    localStorage.setItem("dark-mode", isDarkMode);
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  const value = useMemo(() => ({ isDarkMode, toggleDarkMode }), [isDarkMode]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
export { ThemeContext };

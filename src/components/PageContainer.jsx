// components/PageContainer.jsx
import React from "react";

const PageContainer = ({ children, className = "" }) => {
  return (
    <div
      className={`px-4 py-8 max-w-7xl mx-auto dark:text-white dark:bg-gray-800 transition duration-1000 ${className}`}
    >
      {children}
    </div>
  );
};

export default PageContainer;

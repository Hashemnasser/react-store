// src/components/SEO.jsx
import { useEffect } from "react";

const SEO = ({ title, description }) => {
  useEffect(() => {
    // تحديث العنوان
    if (title) {
      document.title = title || "ProStor|...";
    }

    // تحديث أو إنشاء meta description
    if (description) {
      let meta = document.querySelector("meta[name='description']");
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = description;
    }
  }, [title, description]);

  return null; // ما بترجع أي عنصر للصفحة
};

export default SEO;

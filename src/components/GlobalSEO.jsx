// src/components/GlobalSEO.jsx
import seoConfig from "@/utils/seoConfig";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
const GlobalSEO = () => {
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    const currentSEO = seoConfig[pathname] || {
      title: ` My Store${pathname}`,
      description: "Best products at best prices.",
    };

    document.title = currentSEO.title;

    let meta = document.querySelector("meta[name='description']");
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = currentSEO.description;
  }, [pathname]);

  return null;
};

export default GlobalSEO;

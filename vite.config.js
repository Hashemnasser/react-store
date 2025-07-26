import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// حل لمشكلة __dirname مع ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// التصدير النهائي
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});

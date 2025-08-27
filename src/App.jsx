// src/App.jsx
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import AnimatedRoutes from "./AnimatedRoutes";

const App = () => {
  return (
    <>
      <Router>
        <div className="min-h-screen bg-gray-100 dark:text-white dark:bg-gray-800">
          <Navbar />
          <main>
            <AnimatedRoutes /> {/* ✅ هنا صار كل شي مضبوط */}
          </main>
        </div>
      </Router>
      <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
    </>
  );
};

export default App;

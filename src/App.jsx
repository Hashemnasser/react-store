// src/App.jsx
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import AnimatedRoutes from "./AnimatedRoutes";
import Footer from "./components/Footer";

const App = () => {
  return (
    <>
      <Router>
        <div className="  overflow-x-visible min-h-screen bg-gray-100 dark:text-white dark:bg-gray-800 text-xs md:text-sm lg:text-lg ">
          <Navbar />
          <main>
            <AnimatedRoutes /> {/* ✅ هنا صار كل شي مضبوط */}
          </main>
          <Footer />
        </div>
      </Router>
      <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
    </>
  );
};

export default App;

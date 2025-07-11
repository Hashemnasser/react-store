import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/useAuth";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        navigate("/signin", { state: { from: location }, replace: true });
      }, 5000); // Wait 3 seconds before redirecting

      return () => clearTimeout(timer);
    }
  }, [user, navigate, location]);

  if (!user) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">🔒 Access Restricted</h2>
        <p className="mb-2">You need to be logged in to access this page.</p>
        <p>You will be redirected shortly...</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() =>
            navigate("/login", { state: { from: location }, replace: true })
          }>
          Login Now
        </button>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;

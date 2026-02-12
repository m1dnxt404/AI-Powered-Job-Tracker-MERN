import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight">
          AI Job Tracker
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="hover:text-blue-400 transition-colors"
              >
                Dashboard
              </Link>
              <span className="text-slate-400 text-sm">{user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-blue-400 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-surface/90 backdrop-blur-xl border-b border-outline-dim">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
            <svg
              className="w-4.5 h-4.5 text-on-primary"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </div>
          <span className="text-lg font-bold text-on-surface tracking-tight">
            JobTracker
            <span className="text-primary ml-0.5">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive("/dashboard")
                    ? "bg-primary/15 text-primary"
                    : "text-on-surface-dim hover:text-on-surface hover:bg-surface-bright"
                }`}
              >
                Dashboard
              </Link>
              <div className="w-px h-6 bg-outline-dim mx-2" />
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs font-semibold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-on-surface-dim hidden sm:block">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-on-surface-dim hover:text-error px-2.5 py-1.5 rounded-xl hover:bg-error/10 transition-all"
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive("/login")
                    ? "bg-surface-bright text-on-surface"
                    : "text-on-surface-dim hover:text-on-surface hover:bg-surface-bright"
                }`}
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="ml-1 px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-on-primary hover:bg-primary-bright shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

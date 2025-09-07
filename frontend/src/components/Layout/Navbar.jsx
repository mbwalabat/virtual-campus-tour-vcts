import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { authAPI } from '../../services/api.js';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const { user, logout, isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  // Signup form state
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');

  const handleSignupChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError('');
    setSignupSuccess('');
    try {
      // Call backend register API
      const res = await authAPI.register({
        name: form.name,
        email: form.email,
        password: form.password
      });
      // On success, log the user in
      const loginRes = await login(form.email, form.password);
      if (loginRes.success) {
        setSignupSuccess('Signup successful! Welcome.');
        setShowSignup(false);
        setForm({ name: '', email: '', password: '' });
      } else {
        setSignupError('Signup succeeded but login failed. Please try logging in.');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || err.message || 'Signup failed. Please try again.';
      setSignupError(msg);
    } finally {
      setSignupLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const getDashboardLink = () => {
    if (user?.role === 'superAdmin') return '/super-admin';
    if (user?.role === 'departmentAdmin') return '/department-admin';
    return '/admin';
  };

  return (
    <nav className="bg-white shadow-lg border-b-2 border-green-500">
      <div className="container">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">SAU</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Sindh Agriculture University
              </h1>
              <p className="text-sm text-gray-600">Virtual Campus Tour</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/campus-map" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Campus Map
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Contact
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
                >
                  <User size={20} />
                  <span className="font-medium">{user.name}</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="inline w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    {/* Only show dashboard for admin roles */}
                    {(user.role === 'superAdmin' || user.role === 'departmentAdmin') && (
                      <Link
                        to={getDashboardLink()}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="inline w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LogOut className="inline w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="btn btn-primary"
                >
                  Login
                </Link>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowSignup(true)}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Signup Modal */}
        {showSignup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
                onClick={() => setShowSignup(false)}
                aria-label="Close"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign Up</h2>
              <form onSubmit={handleSignup}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleSignupChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleSignupChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleSignupChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                {signupError && <div className="text-red-600 mb-4 text-center">{signupError}</div>}
                {signupSuccess && <div className="text-green-600 mb-4 text-center">{signupSuccess}</div>}
                <button
                  type="submit"
                  className="btn btn-secondary w-full py-3 text-lg font-semibold"
                  disabled={signupLoading}
                >
                  {signupLoading ? 'Signing Up...' : 'Sign Up'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col gap-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/campus-map" 
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Campus Map
              </Link>
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/profile" 
                    className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link 
                    to={getDashboardLink()} 
                    className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="text-left text-gray-700 hover:text-green-600 font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-primary inline-block"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
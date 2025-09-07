import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  MapPin, 
  Users, 
  Settings, 
  LogOut,
  ChevronRight,
  Home
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isSuperAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardRoute = () => {
    if (user?.role === 'superAdmin') return '/super-admin';
    if (user?.role === 'departmentAdmin') return '/department-admin';
    return '/admin';
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      href: getDashboardRoute(),
      icon: <LayoutDashboard size={20} />,
      allowed: true
    },
    {
      name: 'Manage Locations',
      href: '/admin/locations',
      icon: <MapPin size={20} />,
      allowed: true
    },
    {
      name: 'User Management',
      href: '/admin/users',
      icon: <Users size={20} />,
      allowed: isSuperAdmin
    },
    {
      name: 'Profile Settings',
      href: '/profile',
      icon: <Settings size={20} />,
      allowed: true
    }
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} admin-sidebar`}> 
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">SAU</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-800 truncate">Admin Panel</h2>
            <p className="text-sm text-gray-600 truncate">{user?.name}</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-4">
          <div className="px-3 mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Navigation
            </p>
          </div>
          
          {navigationItems.filter(item => item.allowed).map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`admin-nav-item ${isActive(item.href) ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.name}</span>
              {isActive(item.href) && <ChevronRight size={16} className="ml-auto" />}
            </Link>
          ))}

          <div className="border-t border-gray-200 mt-4 pt-4 px-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Other
            </p>
            <Link
              to="/"
              className="admin-nav-item"
              onClick={() => setSidebarOpen(false)}
            >
              <Home size={20} />
              <span>Back to Campus</span>
            </Link>
            <button
              onClick={handleLogout}
              className="admin-nav-item w-full text-left"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </nav>

        {/* User Info */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium">
                {user?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.role === 'superAdmin' ? 'Super Administrator' : 
                 user?.role === 'departmentAdmin' ? `${user?.department} Admin` : 
                 'Administrator'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>
          <div className="w-8"></div>
        </div>
        {/* Desktop toggle */}
        <div className="hidden md:flex items-center gap-2 p-4 pt-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 border border-gray-200"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Page Content */}
        <div className="p-4 md:p-8">
          {children}
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;
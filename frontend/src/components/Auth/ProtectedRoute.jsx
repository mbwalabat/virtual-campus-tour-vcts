import { useAuth } from '../../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole) {
    // Check if user has required role
    if (requiredRole === 'admin' && (user.role !== 'superAdmin' && user.role !== 'departmentAdmin')) {
      return <Navigate to="/" replace />;
    }
    
    if (requiredRole === 'superAdmin' && user.role !== 'superAdmin') {
      return <Navigate to="/" replace />;
    }
    
    if (requiredRole === 'departmentAdmin' && user.role !== 'departmentAdmin') {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
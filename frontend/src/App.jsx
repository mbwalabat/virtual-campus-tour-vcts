import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import CampusMap from './pages/CampusMap';
import LocationDetails from './pages/LocationDetails';
import Login from './pages/Auth/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import SuperAdminDashboard from './pages/Admin/SuperAdminDashboard';
import DepartmentAdminDashboard from './pages/Admin/DepartmentAdminDashboard';
import ManageLocations from './pages/Admin/ManageLocations';
import ManageUsers from './pages/Admin/ManageUsers';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/campus-map" element={<CampusMap />} />
              <Route path="/location/:id" element={<LocationDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/super-admin" element={
                <ProtectedRoute requiredRole="superAdmin">
                  <SuperAdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/department-admin" element={
                <ProtectedRoute requiredRole="departmentAdmin">
                  <DepartmentAdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/locations" element={
                <ProtectedRoute requiredRole="admin">
                  <ManageLocations />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/users" element={
                <ProtectedRoute requiredRole="superAdmin">
                  <ManageUsers />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
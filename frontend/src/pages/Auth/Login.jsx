import { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const Login = () => {
  // Clean, separate state management for better readability
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  // Email validation function
  const validateEmail = useCallback((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
  }, []);

  // Password validation function
  const validatePassword = useCallback((password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return null;
  }, []);

  // Form validation
  const validateForm = useCallback(() => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    const newErrors = {
      email: emailError,
      password: passwordError
    };
    
    const isValid = !emailError && !passwordError;
    
    setErrors(newErrors);
    setIsFormValid(isValid);
    
    return { errors: newErrors, isValid };
  }, [email, password, validateEmail, validatePassword]);

  // Enhanced input change handler
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    // Update the appropriate state based on field name
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  }, [errors]);

  // Input blur handler for validation
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate the field
    validateForm();
  }, [validateForm]);

  // Enhanced form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      email: true,
      password: true
    });
    
    // Validate form
    const { isValid } = validateForm();
    
    if (!isValid) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});

    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Redirect based on user role
        const user = result.user;
        if (user.role === 'superAdmin') {
          navigate('/super-admin');
        } else if (user.role === 'departmentAdmin') {
          navigate('/department-admin');
        } else {
          navigate(from);
        }
      } else {
        setErrors({
          general: result.message
        });
      }
    } catch (error) {
      setErrors({
        general: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  }, [email, password, validateForm, login, navigate, from]);

  // Toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // Memoized field validation status
  const getFieldStatus = useCallback((fieldName) => {
    const error = errors[fieldName];
    const isTouched = touched[fieldName];
    const hasValue = fieldName === 'email' ? email.length > 0 : password.length > 0;
    
    if (isTouched && error) return 'error';
    if (isTouched && hasValue && !error) return 'success';
    return 'default';
  }, [errors, touched, email, password]);

  // Memoized field classes
  const getFieldClasses = useCallback((fieldName) => {
    const status = getFieldStatus(fieldName);
    const baseClasses = "form-input pr-12 transition-all duration-200";
    
    switch (status) {
      case 'error':
        return `${baseClasses} border-red-300 focus:border-red-500 focus:ring-red-200`;
      case 'success':
        return `${baseClasses} border-green-300 focus:border-green-500 focus:ring-green-200`;
      default:
        return `${baseClasses} border-gray-300 focus:border-green-500 focus:ring-green-200`;
    }
  }, [getFieldStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">SAU</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to access the admin portal</p>
        </div>

        <div className="card shadow-xl">
          <form onSubmit={handleSubmit} noValidate>
            {/* General Error Display */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                <span className="text-red-700 text-sm">{errors.general}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <Mail className="inline w-4 h-4 mr-2" />
                Email Address
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getFieldClasses('email')}
                  placeholder="Enter your email address"
                  required
                  autoComplete="email"
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {getFieldStatus('email') === 'success' && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" size={20} />
                )}
                {getFieldStatus('email') === 'error' && (
                  <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" size={20} />
                )}
              </div>
              {errors.email && touched.email && (
                <p id="email-error" className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
                  <AlertCircle size={14} />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <Lock className="inline w-4 h-4 mr-2" />
                Password
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getFieldClasses('password')}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none focus:text-gray-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {getFieldStatus('password') === 'success' && (
                  <CheckCircle className="absolute right-10 top-1/2 transform -translate-y-1/2 text-green-500" size={20} />
                )}
                {getFieldStatus('password') === 'error' && (
                  <XCircle className="absolute right-10 top-1/2 transform -translate-y-1/2 text-red-500" size={20} />
                )}
              </div>
              {errors.password && touched.password && (
                <p id="password-error" className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
                  <AlertCircle size={14} />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className={`btn w-full text-lg py-3 mb-6 transition-all duration-200 ${
                isLoading || !isFormValid
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'btn-primary hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Demo Credentials
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <span className="font-medium">Super Admin:</span>
                <button
                  onClick={() => {
                    setEmail('superadmin@sau.edu.pk');
                    setTouched(prev => ({ ...prev, email: true }));
                    validateForm();
                  }}
                  className="font-mono text-green-600 hover:text-green-700 transition-colors duration-200"
                >
                  superadmin@sau.edu.pk
                </button>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <span className="font-medium">CS Dept Admin:</span>
                <button
                  onClick={() => {
                    setEmail('cs.admin@sau.edu.pk');
                    setTouched(prev => ({ ...prev, email: true }));
                    validateForm();
                  }}
                  className="font-mono text-green-600 hover:text-green-700 transition-colors duration-200"
                >
                  cs.admin@sau.edu.pk
                </button>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <span className="font-medium">Library Admin:</span>
                <button
                  onClick={() => {
                    setEmail('library.admin@sau.edu.pk');
                    setTouched(prev => ({ ...prev, email: true }));
                    validateForm();
                  }}
                  className="font-mono text-green-600 hover:text-green-700 transition-colors duration-200"
                >
                  library.admin@sau.edu.pk
                </button>
              </div>
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-blue-800 font-medium">Password for all:</span>
                  <button
                    onClick={() => {
                      setPassword('password123');
                      setTouched(prev => ({ ...prev, password: true }));
                      validateForm();
                    }}
                    className="font-mono text-blue-900 hover:text-blue-700 transition-colors duration-200"
                  >
                    password123
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link 
            to="/"
            className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200 flex items-center justify-center gap-2 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
            Back to Campus Tour
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
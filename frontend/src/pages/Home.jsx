import { Link } from 'react-router-dom';
import { MapPin, Users, BookOpen, Award, Play, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Interactive Campus Map',
      description: 'Explore our beautiful campus with an interactive map featuring 360° views of key locations.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Virtual Guided Tours',
      description: 'Take guided virtual tours of departments, hostels, libraries, and recreational facilities.'
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Detailed Information',
      description: 'Access comprehensive information about facilities, departments, and campus services.'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Excellence in Agriculture',
      description: 'Discover our world-class agricultural programs and state-of-the-art research facilities.'
    }
  ];

  const stats = [
    { number: '15,000+', label: 'Students' },
    { number: '500+', label: 'Faculty Members' },
    { number: '40+', label: 'Departments' },
    { number: '47', label: 'Years of Excellence' }
  ];

  const { user, login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError('');
    setSignupSuccess('');
    try {
      // Call backend register API
      const res = await import('../services/api').then(m => m.authAPI.register({
        name: form.name,
        email: form.email,
        password: form.password
      }));
      // On success, log the user in
      const loginRes = await login(form.email, form.password);
      if (loginRes.success) {
        setSignupSuccess('Signup successful! Welcome.');
      } else {
        setSignupError('Signup succeeded but login failed. Please try logging in.');
      }
    } catch (err) {
      setSignupError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Welcome to
                <span className="block text-yellow-300">
                  Sindh Agriculture University
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-green-100 mb-8 leading-relaxed">
                Experience our beautiful campus through an immersive virtual tour. 
                Explore state-of-the-art facilities, lush green spaces, and vibrant student life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/campus-map" 
                  className="btn btn-secondary flex items-center gap-2 text-lg px-8 py-4"
                >
                  <Play className="w-5 h-5" />
                  Start Virtual Tour
                </Link>
                <Link 
                  to="/about" 
                  className="btn btn-outline flex items-center gap-2 text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-green-800"
                >
                  Learn More
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
            
            <div className="slide-up">
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="SAU Campus"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-lg font-semibold">Sindh Agriculture University</p>
                  <p className="text-green-200">Tandojam Campus</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Signup Section */}
      <section className="py-12 bg-white">
        <div className="container max-w-lg mx-auto">
          {user ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-green-700 mb-2">Welcome, {user.name}!</h2>
              <p className="text-green-700">You are now signed in. Enjoy exploring the campus!</p>
            </div>
          ) : null}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Explore Our Virtual Campus
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our virtual campus tour offers an immersive experience that brings you closer 
              to the SAU community and helps you discover everything our university has to offer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center hover:shadow-xl transition-all duration-300">
                <div className="text-green-600 flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Highlights */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Campus Highlights
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the key areas of our campus that make SAU a premier destination for agricultural education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card overflow-hidden">
              <img
                src="https://images.pexels.com/photos/159775/library-books-bookshelves-159775.jpeg?auto=compress&cs=tinysrgb&w=500"
                alt="Central Library"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Central Library</h3>
                <p className="text-gray-600 mb-4">
                  Our state-of-the-art library with over 100,000 books and digital resources.
                </p>
                <Link 
                  to="/location/library" 
                  className="text-green-600 font-medium hover:text-green-700 flex items-center gap-1"
                >
                  Explore Library <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="card overflow-hidden">
              <img
                src="https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=500"
                alt="Computer Lab"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Computer Labs</h3>
                <p className="text-gray-600 mb-4">
                  Modern computer laboratories equipped with latest technology and software.
                </p>
                <Link 
                  to="/location/computer-lab" 
                  className="text-green-600 font-medium hover:text-green-700 flex items-center gap-1"
                >
                  Visit Labs <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="card overflow-hidden">
              <img
                src="https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=500"
                alt="Agriculture Fields"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Research Fields</h3>
                <p className="text-gray-600 mb-4">
                  Extensive agricultural research fields for practical learning and experimentation.
                </p>
                <Link 
                  to="/location/research-fields" 
                  className="text-green-600 font-medium hover:text-green-700 flex items-center gap-1"
                >
                  View Fields <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Explore Our Campus?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Take the first step towards your agricultural education journey. 
            Start your virtual tour now and discover what makes SAU special.
          </p>
          <Link 
            to="/campus-map" 
            className="btn btn-secondary text-lg px-8 py-4 inline-flex items-center gap-2"
          >
            <Play className="w-5 h-5" />
            Begin Virtual Tour
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
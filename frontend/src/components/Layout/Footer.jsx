import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* University Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">SAU</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Sindh Agriculture University</h3>
                <p className="text-gray-400">Tandojam, Sindh, Pakistan</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Established in 1977, Sindh Agriculture University is a leading institution 
              dedicated to excellence in agricultural education, research, and innovation. 
              Our virtual campus tour showcases our state-of-the-art facilities and 
              vibrant campus life.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-green-400" />
                <span className="text-sm text-gray-300">
                  Tandojam, Hyderabad, Sindh 70060, Pakistan
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-green-400" />
                <span className="text-sm text-gray-300">+92-22-2765870</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-green-400" />
                <span className="text-sm text-gray-300">info@sau.edu.pk</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/campus-map" 
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Campus Map
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  About University
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <a 
                  href="https://sau.edu.pk" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Official Website
                </a>
              </li>
              <li>
                <a 
                  href="https://sau.edu.pk/admissions" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Admissions
                </a>
              </li>
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Departments</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-300">Agricultural Engineering</span>
              </li>
              <li>
                <span className="text-gray-300">Computer Science</span>
              </li>
              <li>
                <span className="text-gray-300">Plant Breeding & Genetics</span>
              </li>
              <li>
                <span className="text-gray-300">Animal Husbandry</span>
              </li>
              <li>
                <span className="text-gray-300">Food Technology</span>
              </li>
              <li>
                <span className="text-gray-300">Economics & Management</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <span className="text-gray-400">Follow us:</span>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <Facebook size={16} />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <Twitter size={16} />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <Instagram size={16} />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <Youtube size={16} />
              </a>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm">
              © 2024 Sindh Agriculture University. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Virtual Campus Tour System - Final Year Project
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
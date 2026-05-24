
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-10 md:flex md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start">
              <Heart className="h-6 w-6 text-primary" strokeWidth={2} fill="rgba(25, 118, 210, 0.2)" />
              <span className="ml-2 text-lg font-bold text-gray-900">Medico</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Making healthcare accessible and wait times shorter.
            </p>
          </div>
          
          <div className="mt-8 md:mt-0">
            <div className="flex justify-center md:justify-end space-x-6">
              <Link to="/" className="text-gray-500 hover:text-primary">
                Home
              </Link>
              <Link to="/search" className="text-gray-500 hover:text-primary">
                Find Doctors
              </Link>
              <Link to="/about" className="text-gray-500 hover:text-primary">
                About
              </Link>
              <Link to="/contact" className="text-gray-500 hover:text-primary">
                Contact
              </Link>
            </div>
            <p className="mt-4 text-center md:text-right text-sm text-gray-500">
              &copy; {currentYear} Medico. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

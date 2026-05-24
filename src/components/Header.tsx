
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Menu, X, User, Calendar, LogOut, 
  Building2, Search, Heart, HomeIcon 
} from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    closeMenu();
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center text-primary">
            <Heart className="h-8 w-8 mr-2" strokeWidth={2} fill="rgba(25, 118, 210, 0.2)" />
            <span className="text-xl font-bold">Medico</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link to="/search" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Find Doctors
            </Link>
            {user && (
              <Link to="/appointments" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                My Appointments
              </Link>
            )}
            {user?.role === 'hospital' && (
              <Link to="/dashboard" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/appointments')}>
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>My Appointments</span>
                  </DropdownMenuItem>
                  {user.role === 'hospital' && (
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <Building2 className="mr-2 h-4 w-4" />
                      <span>Hospital Dashboard</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Sign in
                </Button>
                <Button onClick={() => navigate('/register')}>
                  Register
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden ml-4 p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="flex items-center text-gray-700 hover:bg-gray-100 hover:text-primary px-3 py-2 rounded-md text-base font-medium"
              onClick={closeMenu}
            >
              <HomeIcon className="mr-2 h-5 w-5" />
              Home
            </Link>
            <Link 
              to="/search" 
              className="flex items-center text-gray-700 hover:bg-gray-100 hover:text-primary px-3 py-2 rounded-md text-base font-medium"
              onClick={closeMenu}
            >
              <Search className="mr-2 h-5 w-5" />
              Find Doctors
            </Link>
            {user && (
              <Link 
                to="/appointments" 
                className="flex items-center text-gray-700 hover:bg-gray-100 hover:text-primary px-3 py-2 rounded-md text-base font-medium"
                onClick={closeMenu}
              >
                <Calendar className="mr-2 h-5 w-5" />
                My Appointments
              </Link>
            )}
            {user?.role === 'hospital' && (
              <Link 
                to="/dashboard" 
                className="flex items-center text-gray-700 hover:bg-gray-100 hover:text-primary px-3 py-2 rounded-md text-base font-medium"
                onClick={closeMenu}
              >
                <Building2 className="mr-2 h-5 w-5" />
                Dashboard
              </Link>
            )}
            {!user && (
              <>
                <Link 
                  to="/login" 
                  className="flex items-center text-gray-700 hover:bg-gray-100 hover:text-primary px-3 py-2 rounded-md text-base font-medium"
                  onClick={closeMenu}
                >
                  <User className="mr-2 h-5 w-5" />
                  Sign in
                </Link>
                <div className="px-3 py-2">
                  <Button className="w-full" onClick={() => { navigate('/register'); closeMenu(); }}>
                    Register
                  </Button>
                </div>
              </>
            )}
            {user && (
              <button
                onClick={handleLogout}
                className="flex w-full items-center text-gray-700 hover:bg-gray-100 hover:text-primary px-3 py-2 rounded-md text-base font-medium"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Log out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

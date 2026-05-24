import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'hospital' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'user' | 'hospital') => Promise<void>;
  logout: () => void;
  getAllUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('medicUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Initialize users in localStorage if not exists
  useEffect(() => {
    if (!localStorage.getItem('medicUsers')) {
      // Create admin user if it doesn't exist
      const adminUser = {
        id: 'admin-1',
        name: 'Admin',
        email: 'admin@medico.com',
        role: 'admin'
      };
      localStorage.setItem('medicUsers', JSON.stringify([adminUser]));
    }
  }, []);

  // Get all registered users
  const getAllUsers = (): User[] => {
    const storedUsers = localStorage.getItem('medicUsers');
    return storedUsers ? JSON.parse(storedUsers) : [];
  };

  // Simulating authentication - in a real app, this would connect to a backend
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple validation for demo purposes
      if (!email.includes('@') || password.length < 6) {
        throw new Error("Invalid credentials");
      }
      
      // Check if user exists in stored users
      const users = getAllUsers();
      const foundUser = users.find(u => u.email === email);
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('medicUser', JSON.stringify(foundUser));
        toast.success('Logged in successfully');
      } else {
        // For demo purposes, create a mock user if not found
        const mockUser = {
          id: `user-${Date.now()}`,
          name: email.split('@')[0],
          email,
          role: email.includes('hospital') ? 'hospital' : email === 'admin@medico.com' ? 'admin' : 'user' as 'user' | 'hospital' | 'admin'
        };
        
        setUser(mockUser);
        localStorage.setItem('medicUser', JSON.stringify(mockUser));
        
        // Add to users list
        users.push(mockUser);
        localStorage.setItem('medicUsers', JSON.stringify(users));
        
        toast.success('Logged in successfully');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: 'user' | 'hospital') => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple validation
      if (!email.includes('@') || password.length < 6) {
        throw new Error("Invalid email or password too short");
      }
      
      // Check if user already exists
      const users = getAllUsers();
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        throw new Error("User with this email already exists");
      }
      
      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        role,
      };
      
      // Add to users list
      users.push(newUser);
      localStorage.setItem('medicUsers', JSON.stringify(users));
      
      setUser(newUser);
      localStorage.setItem('medicUser', JSON.stringify(newUser));
      toast.success('Registered successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medicUser');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, getAllUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
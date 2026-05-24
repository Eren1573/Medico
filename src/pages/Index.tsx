
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Search, Clock, Calendar, Hospital, 
  CheckCircle, Shield, Star, ArrowRight 
} from 'lucide-react';
import { useData } from '@/contexts/DataContext';

const Index = () => {
  const navigate = useNavigate();
  const { hospitals } = useData();
  
  // Get featured hospitals (top 3 by rating)
  const featuredHospitals = [...hospitals]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Fast, Simple Healthcare <span className="text-primary">Appointment Booking</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Find and book appointments with top doctors and hospitals near you,
                reducing your waiting time and enhancing your healthcare experience.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/search')}
                  className="shadow-md"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Find Doctors
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => navigate('/register')}
                >
                  Create Account
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1631815588090-d4bfec5b7e85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                  alt="Doctor with patient"
                  className="rounded-lg shadow-xl w-full"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-primary" />
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Average Wait Time</p>
                      <p className="text-lg font-bold">15 minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How Medico Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Find Doctors</h3>
              <p className="text-gray-600">
                Search for doctors and hospitals by specialty, location, or name to find the perfect match for your healthcare needs.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Book Instantly</h3>
              <p className="text-gray-600">
                Select from available time slots and instantly book your appointment with a few simple clicks.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Skip the Wait</h3>
              <p className="text-gray-600">
                Reduce waiting times with our queue management system that provides real-time updates on your position.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hospitals */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Featured Hospitals</h2>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/search')}
              className="hidden md:flex items-center text-primary"
            >
              View all hospitals
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredHospitals.map((hospital) => (
              <div key={hospital.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48">
                  <img 
                    src={hospital.image} 
                    alt={hospital.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full flex items-center shadow-md">
                    <Star className="h-4 w-4 text-yellow-400 mr-1 fill-yellow-400" />
                    <span className="text-sm font-medium">{hospital.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2">{hospital.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{hospital.location}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hospital.specialties.slice(0, 3).map((specialty, index) => (
                      <span 
                        key={index} 
                        className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => navigate(`/hospital/${hospital.id}`)}
                  >
                    View Hospital
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Button 
              variant="outline" 
              onClick={() => navigate('/search')}
              className="items-center"
            >
              View all hospitals
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Medico</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start">
              <div className="bg-primary/10 rounded-full p-3 mt-1">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold mb-2">Save Time</h3>
                <p className="text-gray-600">
                  Our intelligent queue management system significantly reduces your waiting time at hospitals and clinics.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary/10 rounded-full p-3 mt-1">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
                <p className="text-gray-600">
                  Your personal and medical information is protected with advanced encryption and security measures.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary/10 rounded-full p-3 mt-1">
                <Hospital className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold mb-2">Wide Network</h3>
                <p className="text-gray-600">
                  Access a broad network of hospitals and specialists all from one convenient platform.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary/10 rounded-full p-3 mt-1">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
                <p className="text-gray-600">
                  Receive notifications and real-time updates about your appointment status and queue position.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to simplify your healthcare experience?</h2>
          <p className="text-primary-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already enjoying fast, convenient appointment booking and reduced waiting times.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={() => navigate('/register')}
            className="font-medium"
          >
            Get Started Today
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

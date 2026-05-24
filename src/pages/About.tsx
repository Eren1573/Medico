
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Heart, Clock, Calendar, Shield, 
  Building, Users, CheckCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Heart className="h-10 w-10 text-primary" strokeWidth={2} fill="rgba(25, 118, 210, 0.2)" />
            <span className="ml-2 text-3xl font-bold">Medico</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simplifying healthcare appointments and reducing waiting times for patients across the country.
          </p>
        </div>
      </section>
      
      {/* Our Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600">
              At Medico, our mission is to transform the healthcare booking experience by creating a
              platform that connects patients with healthcare providers efficiently,
              minimizing waiting times and enhancing overall patient satisfaction.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Save Time</h3>
              <p className="text-gray-600">
                Our platform significantly reduces waiting times through smart scheduling and efficient queue management.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-gray-600">
                Book appointments with just a few clicks, any time of day, from anywhere in the world.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Patient Safety</h3>
              <p className="text-gray-600">
                We prioritize data security and privacy, ensuring all your medical information stays protected.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Story */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
            <div className="prose max-w-none">
              <p className="mb-4">
                Medico is developed by our team as the part of Project in college with a simple but powerful vision: to eliminate the long waiting times that patients face when seeking medical care. After observing the frustration of patients spending hours in waiting rooms despite having scheduled appointments, our founders decided to create a solution.
              </p>
              <p className="mb-4">
                We started by building a queue management system that could provide real-time updates on waiting times. This quickly evolved into a comprehensive platform that connects patients with healthcare providers, streamlining the entire appointment booking process.
              </p>
              <p>
                Our project care through efficient scheduling. Our platform continues to evolve with new features and improvements, all aimed at making healthcare more accessible.
              </p>
            </div>
          </div>
        </div>
      </section>
      
     
      {/* <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Impact</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <Building className="h-10 w-10 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">500+</div>
              <p className="text-gray-600">Partner Hospitals</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <Users className="h-10 w-10 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <p className="text-gray-600">Doctors</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <Calendar className="h-10 w-10 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">100,000+</div>
              <p className="text-gray-600">Appointments Booked</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <Clock className="h-10 w-10 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">75%</div>
              <p className="text-gray-600">Average Wait Time Reduction</p>
            </div>
          </div>
        </div>
      </section> */}
      
      {/* Team Section (Placeholder) */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Leadership Team</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3,4,5].map((i) => (
              <div key={i} className="text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 bg-gray-200">
                  <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                    <span className="text-3xl text-primary/60 font-bold">
                      {["A", "M", "S" ,"AP","C"][i-1]}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold">
                  {["ANIL", "MANISH RATHOD", "SOWRI", " ADITYA PATHAK","CHARAN KUMAR"][i-1]}
                </h3>
                <p className="text-gray-600">
                  {["23H51A05F3", "23H51A05G8", "23H51A05M5","23H51A0566","23H51A05V6"][i-1]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join the Medico Community</h2>
          <p className="text-primary-foreground text-lg mb-8 max-w-2xl mx-auto">
            Experience faster, more efficient healthcare appointments today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={() => navigate('/register')}
            >
              Register Now
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white/10"
              onClick={() => navigate('/contact')}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;

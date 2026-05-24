
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Building, 
  User, 
  Search,
  BookOpen
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const HospitalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getHospitalById, getDoctorsByHospital } = useData();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [specialty, setSpecialty] = useState('All Specialties');
  
  const hospital = getHospitalById(id || '');
  const allDoctors = getDoctorsByHospital(id || '');
  
  if (!hospital) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Hospital Not Found</h2>
            <p className="text-gray-600 mb-4">
              The hospital you are looking for does not exist.
            </p>
            <Button onClick={() => navigate('/search')}>Search Hospitals</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Filter doctors based on search and specialty
  const filteredDoctors = allDoctors.filter(doctor => {
    const nameMatch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const specMatch = specialty === 'All Specialties' || doctor.specialty === specialty;
    return nameMatch && specMatch;
  });
  
  // Get unique specialties from this hospital's doctors
  const hospitalSpecialties = ['All Specialties', ...new Set(allDoctors.map(doctor => doctor.specialty))];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hospital Header Section */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="rounded-lg overflow-hidden h-48 w-full md:w-64 md:h-40 flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <img 
                src={hospital.image} 
                alt={hospital.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{hospital.name}</h1>
              <div className="flex items-center mt-2">
                <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-gray-600">{hospital.location}</span>
                <div className="ml-4 flex items-center bg-white px-2 py-1 rounded-full shadow-sm">
                  <Star className="h-4 w-4 text-yellow-400 mr-1 fill-yellow-400" />
                  <span className="text-sm font-medium">{hospital.rating.toFixed(1)}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {hospital.specialties.map((spec, index) => (
                  <span 
                    key={index} 
                    className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hospital Info and Doctors */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hospital Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Hospital Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Building className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Facility Type</h4>
                    <p className="text-gray-600 text-sm">
                      Multi-specialty Hospital
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Working Hours</h4>
                    <p className="text-gray-600 text-sm">
                      Monday - Friday: 8:00 AM - 8:00 PM<br />
                      Saturday: 9:00 AM - 5:00 PM<br />
                      Sunday: 10:00 AM - 2:00 PM
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Contact</h4>
                    <p className="text-gray-600 text-sm">
                      (555) 123-4567<br />
                      contact@{hospital.name.toLowerCase().replace(/\s+/g, '')}.com
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Available Doctors</h4>
                    <p className="text-gray-600 text-sm">
                      {allDoctors.length} Medical professionals
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <BookOpen className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium">About</h4>
                    <p className="text-gray-600 text-sm">
                      {hospital.name} is a leading healthcare provider dedicated to delivering exceptional medical care. 
                      Our state-of-the-art facilities and expert medical staff are committed to improving patient health and wellbeing.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Doctors List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Available Doctors</h2>
            
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-grow">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search doctors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-64">
                <Select value={specialty} onValueChange={(value) => setSpecialty(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {hospitalSpecialties.map((spec) => (
                      <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {filteredDoctors.length > 0 ? (
              <div className="space-y-4">
                {filteredDoctors.map((doctor) => (
                  <Card key={doctor.id} className="doctor-card">
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="w-20 h-20 rounded-full overflow-hidden mr-4 flex-shrink-0">
                          <img 
                            src={doctor.image} 
                            alt={doctor.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <h3 className="font-bold text-lg">{doctor.name}</h3>
                              <p className="text-gray-500">{doctor.specialty}</p>
                              <div className="flex items-center mt-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                <span className="text-sm ml-1">{doctor.rating.toFixed(1)}</span>
                                <span className="mx-2">•</span>
                                <span className="text-sm">{doctor.experience} years experience</span>
                              </div>
                            </div>
                            
                            <Button
                              className="mt-3 md:mt-0"
                              onClick={() => navigate(`/doctor/${doctor.id}`)}
                            >
                              Book Appointment
                            </Button>
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {doctor.bio}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold">No doctors found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HospitalDetail;

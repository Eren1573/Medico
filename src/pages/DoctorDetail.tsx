
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Star, Clock, Calendar as CalendarIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { format, addDays, isAfter } from 'date-fns';

const DoctorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getDoctorById, bookAppointment } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const doctor = getDoctorById(id || '');
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState<any>(null);

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Doctor Not Found</h2>
            <p className="text-gray-600 mb-4">
              The doctor you are looking for does not exist.
            </p>
            <Button onClick={() => navigate('/search')}>Search Doctors</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Generate available time slots for the selected date
  const getAvailableTimeSlots = () => {
    if (!date) return [];
    
    const dayOfWeek = format(date, 'EEEE');
    const availableSlots = doctor.availability
      .filter(slot => slot.includes(dayOfWeek))
      .map(slot => slot.split(' ').slice(1).join(' '));
      
    return availableSlots;
  };

  const handleBooking = () => {
    if (!user) {
      toast.error('Please login to book an appointment');
      navigate('/login');
      return;
    }
    
    if (!date || !selectedTimeSlot) {
      toast.error('Please select a date and time');
      return;
    }
    
    setIsBookingModalOpen(true);
  };

  const confirmBooking = async () => {
    if (!user || !date || !selectedTimeSlot) return;
    
    setIsLoading(true);
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const appointment = await bookAppointment(
        doctor.id,
        formattedDate,
        selectedTimeSlot,
        user.id
      );
      
      setBookedAppointment(appointment);
      setIsBookingModalOpen(false);
      setIsConfirmationModalOpen(true);
    } catch (error) {
      toast.error('Failed to book appointment. Please try again.');
      console.error('Booking error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const viewAppointments = () => {
    setIsConfirmationModalOpen(false);
    navigate('/appointments');
  };

  // Disable past dates in the calendar
  const disabledDays = {
    before: new Date(),
  };

  const availableTimeSlots = getAvailableTimeSlots();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doctor Details */}
          <div className="lg:col-span-2">
            {/* Doctor Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row">
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto md:mx-0 md:mr-6 flex-shrink-0 mb-4 md:mb-0">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                <div>
                  <h1 className="text-2xl font-bold">{doctor.name}</h1>
                  <p className="text-lg text-gray-600">{doctor.specialty}</p>
                  
                  <div className="flex items-center mt-2">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 mr-1 fill-yellow-400" />
                      <span className="font-medium">{doctor.rating.toFixed(1)}</span>
                    </div>
                    <span className="mx-2 text-gray-300">•</span>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-500 mr-1" />
                      <span>{doctor.experience} years experience</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-2">
                    <MapPin className="h-5 w-5 text-gray-500 mr-1" />
                    <span className="text-gray-600">{doctor.hospitalName}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Doctor Bio */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">About</h2>
              <p className="text-gray-700">
                {doctor.bio}
              </p>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900">Specialty</h3>
                  <p className="text-gray-700">{doctor.specialty}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900">Experience</h3>
                  <p className="text-gray-700">{doctor.experience} years</p>
                </div>
              </div>
            </div>
            
            {/* Reviews Section (Placeholder) */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Patient Reviews</h2>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-1 fill-yellow-400" />
                  <span className="font-medium">{doctor.rating.toFixed(1)}</span>
                </div>
              </div>
              
              {/* Sample reviews */}
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="border-b pb-4 last:border-0">
                    <div className="flex items-center mb-1">
                      <p className="font-medium">Patient {i + 1}</p>
                      <div className="ml-auto flex">
                        {Array(Math.floor(4 + Math.random())).fill(0).map((_, j) => (
                          <Star key={j} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {[
                        "Dr. was very professional and thorough. Took the time to explain everything clearly.",
                        "Great doctor! Very knowledgeable and caring. Highly recommend!",
                        "Excellent care and attention. The doctor was patient and addressed all my concerns."
                      ][i % 3]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Appointment Booking Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Book an Appointment</h2>
                
                {/* Calendar */}
                <div className="mb-6">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={disabledDays}
                    className="rounded-md border"
                  />
                </div>
                
                {/* Available time slots */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Available Time Slots</h3>
                  {availableTimeSlots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {availableTimeSlots.map((slot, index) => (
                        <Button
                          key={index}
                          variant={selectedTimeSlot === slot ? "default" : "outline"}
                          className={`text-sm h-auto py-1.5`}
                          onClick={() => setSelectedTimeSlot(slot)}
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No available slots for the selected date. Please select another date.
                    </p>
                  )}
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleBooking}
                  disabled={!date || !selectedTimeSlot || availableTimeSlots.length === 0}
                >
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Booking Confirmation Dialog */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Appointment</DialogTitle>
            <DialogDescription>
              Please review the details of your appointment before confirming.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Doctor:</span>
              <span className="font-medium">{doctor.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Specialty:</span>
              <span>{doctor.specialty}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Hospital:</span>
              <span>{doctor.hospitalName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date:</span>
              <span>{date ? format(date, 'MMMM d, yyyy') : ''}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Time:</span>
              <span>{selectedTimeSlot}</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmBooking} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" /> 
                  Processing...
                </>
              ) : (
                'Confirm Booking'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Success Confirmation Dialog */}
      <Dialog open={isConfirmationModalOpen} onOpenChange={setIsConfirmationModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-green-600">
              <CheckCircle className="mr-2 h-5 w-5" /> 
              Appointment Booked Successfully
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            {bookedAppointment && (
              <>
                <div className="bg-green-50 border border-green-100 rounded-md p-4">
                  <p className="font-medium text-green-800">Your appointment is confirmed!</p>
                  <p className="text-sm text-green-600 mt-1">Appointment ID: {bookedAppointment.id}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Doctor:</span>
                    <span className="font-medium">{bookedAppointment.doctorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hospital:</span>
                    <span>{bookedAppointment.hospitalName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span>{bookedAppointment.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Time:</span>
                    <span>{bookedAppointment.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Queue Position:</span>
                    <span>{bookedAppointment.queuePosition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Est. Waiting Time:</span>
                    <span>{bookedAppointment.estimatedWaitTime} mins</span>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-100 rounded-md p-4 flex items-start">
                  <AlertCircle className="text-blue-500 h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800">
                      Please arrive 15 minutes before your appointment time. 
                      Bring any relevant medical records or insurance information.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              className="w-full sm:w-auto" 
              onClick={() => setIsConfirmationModalOpen(false)}
            >
              Close
            </Button>
            <Button 
              className="w-full sm:w-auto" 
              onClick={viewAppointments}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              View My Appointments
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default DoctorDetail;

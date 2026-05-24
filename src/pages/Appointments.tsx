
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  X,
  User,
  BadgeInfo
} from 'lucide-react';
import { format, isAfter } from 'date-fns';

const statusColors = {
  pending: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  confirmed: 'bg-green-50 border-green-200 text-green-700',
  completed: 'bg-blue-50 border-blue-200 text-blue-700',
  cancelled: 'bg-red-50 border-red-200 text-red-700',
};

const statusIcons = {
  pending: <Clock className="h-5 w-5 text-yellow-500" />,
  confirmed: <CheckCircle className="h-5 w-5 text-green-500" />,
  completed: <CheckCircle className="h-5 w-5 text-blue-500" />,
  cancelled: <X className="h-5 w-5 text-red-500" />,
};

const Appointments = () => {
  const { user } = useAuth();
  const { getUserAppointments, cancelAppointment, getHospitalAppointments } = useData();
  const navigate = useNavigate();
  
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  // Load appointments
  useEffect(() => {
    if (!user) return;
    
    const loadAppointments = () => {
      if (user.role === 'hospital') {
        return getHospitalAppointments(user.id);
      } else {
        return getUserAppointments(user.id);
      }
    };
    
    const allAppointments = loadAppointments();
    setAppointments(allAppointments);
  }, [user, getUserAppointments, getHospitalAppointments]);
  
  // Filter appointments based on active tab
  const getFilteredAppointments = () => {
    if (!appointments) return [];
    
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    
    switch (activeTab) {
      case 'upcoming':
        return appointments.filter(apt => 
          (apt.status === 'confirmed' || apt.status === 'pending') && 
          (apt.date > todayStr || (apt.date === todayStr))
        );
      case 'past':
        return appointments.filter(apt => 
          apt.status === 'completed' || 
          apt.status === 'cancelled' ||
          apt.date < todayStr
        );
      default:
        return appointments;
    }
  };
  
  const filteredAppointments = getFilteredAppointments();
  
  // Open cancel dialog
  const openCancelDialog = (appointmentId: string) => {
    setAppointmentToCancel(appointmentId);
    setCancelDialogOpen(true);
  };
  
  // Handle appointment cancellation
  const handleCancelAppointment = async () => {
    if (!appointmentToCancel) return;
    
    setIsLoading(true);
    try {
      await cancelAppointment(appointmentToCancel);
      
      // Update the local state
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentToCancel 
            ? { ...apt, status: 'cancelled' } 
            : apt
        )
      );
      
      toast.success('Appointment cancelled successfully');
      setCancelDialogOpen(false);
    } catch (error) {
      toast.error('Failed to cancel appointment');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null; // Will redirect to login
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-2">My Appointments</h1>
        <p className="text-gray-600 mb-8">View and manage your appointments</p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {filteredAppointments.length > 0 ? (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <Card key={appointment.id} className="appointment-card overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-start md:items-center mb-4 md:mb-0">
                      <div className={`flex items-center justify-center rounded-full p-2 mr-4 ${
                        appointment.status === 'confirmed' ? 'bg-green-100' :
                        appointment.status === 'pending' ? 'bg-yellow-100' :
                        appointment.status === 'completed' ? 'bg-blue-100' : 'bg-red-100'
                      }`}>
                        {statusIcons[appointment.status as 'pending' | 'confirmed' | 'completed' | 'cancelled']}
                      </div>
                      
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-bold text-lg">{appointment.doctorName}</h3>
                          <span className={`ml-3 text-xs px-2 py-1 rounded-full border ${
                            statusColors[appointment.status as 'pending' | 'confirmed' | 'completed' | 'cancelled']
                          }`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {appointment.hospitalName}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:items-end">
                      <div className="flex items-center mb-2">
                        <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-sm">{appointment.date}</span>
                        <span className="mx-1 text-gray-400">•</span>
                        <span className="text-sm">{appointment.time}</span>
                      </div>
                      
                      {appointment.status === 'confirmed' && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Queue: #{appointment.queuePosition} (Est. wait: {appointment.estimatedWaitTime} mins)</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {appointment.status === 'confirmed' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => openCancelDialog(appointment.id)}
                      >
                        Cancel
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/doctor/${appointment.doctorId}`)}
                    >
                      <User className="h-4 w-4 mr-1" />
                      View Doctor
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/hospital/${appointment.hospitalId}`)}
                    >
                      View Hospital
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold">No {activeTab} appointments</h3>
            <p className="text-gray-500 mt-2">
              {activeTab === 'upcoming' 
                ? "You don't have any upcoming appointments" 
                : "You don't have any past appointments"
              }
            </p>
            <Button 
              onClick={() => navigate('/search')} 
              className="mt-4"
            >
              Find Doctors
            </Button>
          </div>
        )}
      </div>
      
      {/* Cancel Appointment Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              Cancel Appointment
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-red-50 p-4 rounded-md">
              <div className="flex items-start">
                <BadgeInfo className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">
                  Cancelling less than 24 hours before your appointment may result in a cancellation fee
                  according to the hospital's policy.
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Keep Appointment
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelAppointment}
              disabled={isLoading}
            >
              {isLoading ? 'Cancelling...' : 'Yes, Cancel Appointment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Appointments;

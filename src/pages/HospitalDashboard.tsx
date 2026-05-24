
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  User,
} from 'lucide-react';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const statusColors = {
  confirmed: '#10b981',  // green
  pending: '#f59e0b',    // amber
  completed: '#3b82f6',  // blue
  cancelled: '#ef4444',  // red
};

const HospitalDashboard = () => {
  const { user } = useAuth();
  const { getHospitalAppointments } = useData();
  const navigate = useNavigate();
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedChart, setSelectedChart] = useState<'weekly' | 'monthly'>('weekly');
  
  // Redirect to login if not authenticated or not a hospital user
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'hospital') {
      navigate('/');
    }
  }, [user, navigate]);
  
  if (!user || user.role !== 'hospital') {
    return null;
  }
  
  // Get all appointments for this hospital
  const allAppointments = getHospitalAppointments(user.id);
  
  // Filter today's appointments
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayAppointments = allAppointments.filter(apt => apt.date === todayStr);
  
  // Filter appointments by selected date
  const selectedDateStr = date ? format(date, 'yyyy-MM-dd') : '';
  const selectedDateAppointments = allAppointments.filter(apt => apt.date === selectedDateStr);
  
  // Calculate statistics
  const totalAppointments = allAppointments.length;
  const confirmedAppointments = allAppointments.filter(apt => apt.status === 'confirmed').length;
  const completedAppointments = allAppointments.filter(apt => apt.status === 'completed').length;
  const cancelledAppointments = allAppointments.filter(apt => apt.status === 'cancelled').length;
  
  // Calculate appointment status data for pie chart
  const statusData = [
    { name: 'Confirmed', value: confirmedAppointments, color: statusColors.confirmed },
    { name: 'Completed', value: completedAppointments, color: statusColors.completed },
    { name: 'Cancelled', value: cancelledAppointments, color: statusColors.cancelled },
  ];
  
  // Generate dummy trend data for line chart
  const generateTrendData = (type: 'weekly' | 'monthly') => {
    if (type === 'weekly') {
      return [
        { name: 'Mon', appointments: 12 },
        { name: 'Tue', appointments: 19 },
        { name: 'Wed', appointments: 15 },
        { name: 'Thu', appointments: 18 },
        { name: 'Fri', appointments: 21 },
        { name: 'Sat', appointments: 25 },
        { name: 'Sun', appointments: 17 },
      ];
    } else {
      return [
        { name: 'Week 1', appointments: 65 },
        { name: 'Week 2', appointments: 78 },
        { name: 'Week 3', appointments: 82 },
        { name: 'Week 4', appointments: 70 },
      ];
    }
  };
  
  const trendData = generateTrendData(selectedChart);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-2">Hospital Dashboard</h1>
        <p className="text-gray-600 mb-8">Manage your hospital appointments and schedule</p>
        
        {/* Dashboard Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-7 w-7 text-blue-500 mr-2" />
                <span className="text-3xl font-bold">{totalAppointments}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Today's Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CalendarIcon className="h-7 w-7 text-primary mr-2" />
                <span className="text-3xl font-bold">{todayAppointments.length}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="h-7 w-7 text-green-500 mr-2" />
                <span className="text-3xl font-bold">{completedAppointments}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Cancellations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <XCircle className="h-7 w-7 text-red-500 mr-2" />
                <span className="text-3xl font-bold">{cancelledAppointments}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar and Appointments */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Appointments Schedule</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Calendar Component */}
                  <div className="md:w-1/2">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                    />
                  </div>
                  
                  {/* Appointments for Selected Date */}
                  <div className="md:w-1/2">
                    <h3 className="font-semibold mb-4">
                      {date ? format(date, 'MMMM d, yyyy') : 'Today'}'s Appointments
                    </h3>
                    
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {selectedDateAppointments.length > 0 ? (
                        selectedDateAppointments.map((apt) => (
                          <div 
                            key={apt.id} 
                            className="p-3 border rounded-md flex items-center justify-between"
                          >
                            <div>
                              <div className="font-medium">{apt.time}</div>
                              <div className="text-sm text-gray-600">{apt.doctorName}</div>
                              <div className="text-xs mt-1">
                                <span className={`px-2 py-0.5 rounded-full ${
                                  apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                  apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  apt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                                </span>
                              </div>
                            </div>
                            <div className="text-sm">
                              <div className="flex items-center text-gray-600">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>Queue #{apt.queuePosition}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          No appointments scheduled for this date
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 text-center">
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => navigate('/appointments')}
                >
                  View All Appointments
                </Button>
              </CardFooter>
            </Card>
            
            {/* Trends */}
            <Card className="mt-8">
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle>Appointment Trends</CardTitle>
                  <Select 
                    value={selectedChart} 
                    onValueChange={(value) => setSelectedChart(value as 'weekly' | 'monthly')}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={trendData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="appointments"
                        stroke="#1976D2"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Status and Breakdown */}
          <div className="lg:col-span-1 space-y-8">
            {/* Appointment Status */}
            <Card>
              <CardHeader>
                <CardTitle>Appointment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Performance Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Appointment Completion Rate</span>
                    <span className="text-sm font-medium">
                      {totalAppointments > 0 
                        ? `${((completedAppointments / totalAppointments) * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ 
                        width: totalAppointments > 0 
                          ? `${(completedAppointments / totalAppointments) * 100}%` 
                          : '0%'
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Cancellation Rate</span>
                    <span className="text-sm font-medium">
                      {totalAppointments > 0 
                        ? `${((cancelledAppointments / totalAppointments) * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full" 
                      style={{ 
                        width: totalAppointments > 0 
                          ? `${(cancelledAppointments / totalAppointments) * 100}%` 
                          : '0%'
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="pt-4 grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center text-green-700 mb-1">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">15%</span>
                    </div>
                    <p className="text-xs text-gray-600">Bookings (vs last week)</p>
                  </div>
                  
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center text-red-700 mb-1">
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">3%</span>
                    </div>
                    <p className="text-xs text-gray-600">Cancellations (vs last week)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/appointments')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Manage Appointments
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Update Doctor Availability
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HospitalDashboard;

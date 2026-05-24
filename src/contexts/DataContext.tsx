
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { generateMockData } from '../lib/mock-data';

export interface Hospital {
  id: string;
  name: string;
  location: string;
  specialties: string[];
  image: string;
  rating: number;
  doctors: Doctor[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospitalId: string;
  hospitalName: string;
  image: string;
  rating: number;
  availability: string[];
  bio: string;
  experience: number;
}

export interface Appointment {
  id: string;
  userId: string;
  doctorId: string;
  doctorName: string;
  hospitalId: string;
  hospitalName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  queuePosition: number;
  estimatedWaitTime: number;
}

interface DataContextType {
  hospitals: Hospital[];
  doctors: Doctor[];
  appointments: Appointment[];
  isLoading: boolean;
  searchHospitals: (query: string, specialty?: string) => Hospital[];
  searchDoctors: (query: string, specialty?: string) => Doctor[];
  getDoctorsByHospital: (hospitalId: string) => Doctor[];
  getHospitalById: (id: string) => Hospital | undefined;
  getDoctorById: (id: string) => Doctor | undefined;
  bookAppointment: (doctorId: string, date: string, time: string, userId: string) => Promise<Appointment>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
  getUserAppointments: (userId: string) => Appointment[];
  getHospitalAppointments: (hospitalId: string) => Appointment[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hospitalData, setHospitalData] = useState<Hospital[]>([]);
  const [doctorData, setDoctorData] = useState<Doctor[]>([]);
  const [appointmentData, setAppointmentData] = useState<Appointment[]>([]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load data from localStorage if available
        const storedHospitals = localStorage.getItem('medicHospitals');
        const storedDoctors = localStorage.getItem('medicDoctors');
        const storedAppointments = localStorage.getItem('medicAppointments');
        
        if (storedHospitals && storedDoctors) {
          setHospitalData(JSON.parse(storedHospitals));
          setDoctorData(JSON.parse(storedDoctors));
          setAppointmentData(storedAppointments ? JSON.parse(storedAppointments) : []);
        } else {
          // Generate mock data if not available
          const { hospitals, doctors } = generateMockData();
          setHospitalData(hospitals);
          setDoctorData(doctors);
          
          // Save to localStorage
          localStorage.setItem('medicHospitals', JSON.stringify(hospitals));
          localStorage.setItem('medicDoctors', JSON.stringify(doctors));
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // Generate mock data as fallback
        const { hospitals, doctors } = generateMockData();
        setHospitalData(hospitals);
        setDoctorData(doctors);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Save appointments whenever they change
  useEffect(() => {
    if (appointmentData.length > 0) {
      localStorage.setItem('medicAppointments', JSON.stringify(appointmentData));
    }
  }, [appointmentData]);

  // Search hospitals by name or specialty
  const searchHospitals = (query: string, specialty?: string): Hospital[] => {
    const lowerQuery = query.toLowerCase();
    return hospitalData.filter(hospital => 
      (hospital.name.toLowerCase().includes(lowerQuery) || 
       hospital.location.toLowerCase().includes(lowerQuery)) &&
      (!specialty || hospital.specialties.includes(specialty))
    );
  };

  // Search doctors by name or specialty
  const searchDoctors = (query: string, specialty?: string): Doctor[] => {
    const lowerQuery = query.toLowerCase();
    return doctorData.filter(doctor => 
      (doctor.name.toLowerCase().includes(lowerQuery)) &&
      (!specialty || doctor.specialty === specialty)
    );
  };

  // Get doctors by hospital
  const getDoctorsByHospital = (hospitalId: string): Doctor[] => {
    return doctorData.filter(doctor => doctor.hospitalId === hospitalId);
  };

  // Get hospital by ID
  const getHospitalById = (id: string): Hospital | undefined => {
    return hospitalData.find(hospital => hospital.id === id);
  };

  // Get doctor by ID
  const getDoctorById = (id: string): Doctor | undefined => {
    return doctorData.find(doctor => doctor.id === id);
  };

  // Book appointment
  const bookAppointment = async (doctorId: string, date: string, time: string, userId: string): Promise<Appointment> => {
    // Get doctor and hospital details
    const doctor = doctorData.find(d => d.id === doctorId);
    if (!doctor) {
      throw new Error('Doctor not found');
    }
    
    const hospital = hospitalData.find(h => h.id === doctor.hospitalId);
    if (!hospital) {
      throw new Error('Hospital not found');
    }
    
    // Calculate queue position and wait time
    const existingAppointments = appointmentData.filter(
      a => a.doctorId === doctorId && a.date === date && a.status !== 'cancelled'
    );
    const queuePosition = existingAppointments.length + 1;
    const estimatedWaitTime = queuePosition * 15; // Estimate 15 min per patient
    
    // Create new appointment
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      doctorId,
      doctorName: doctor.name,
      hospitalId: doctor.hospitalId,
      hospitalName: hospital.name,
      date,
      time,
      status: 'confirmed',
      queuePosition,
      estimatedWaitTime
    };
    
    setAppointmentData(prev => [...prev, newAppointment]);
    return newAppointment;
  };

  // Cancel appointment
  const cancelAppointment = async (appointmentId: string): Promise<void> => {
    setAppointmentData(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'cancelled' } 
          : apt
      )
    );
  };

  // Get user appointments
  const getUserAppointments = (userId: string): Appointment[] => {
    return appointmentData.filter(apt => apt.userId === userId);
  };

  // Get hospital appointments
  const getHospitalAppointments = (hospitalId: string): Appointment[] => {
    return appointmentData.filter(apt => apt.hospitalId === hospitalId);
  };

  return (
    <DataContext.Provider value={{
      hospitals: hospitalData,
      doctors: doctorData,
      appointments: appointmentData,
      isLoading,
      searchHospitals,
      searchDoctors,
      getDoctorsByHospital,
      getHospitalById,
      getDoctorById,
      bookAppointment,
      cancelAppointment,
      getUserAppointments,
      getHospitalAppointments
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

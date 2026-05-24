
import { Hospital, Doctor } from '../contexts/DataContext';

const specialties = [
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Oncology',
  'Gynecology',
  'Ophthalmology',
  'Psychiatry',
  'Dentistry'
];

// Helper to generate random time slots
const generateAvailability = () => {
  const slots = [];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
  
  // For each day, randomly select 2-4 time slots
  days.forEach(day => {
    const numSlots = 2 + Math.floor(Math.random() * 3); // 2-4 slots
    const availableTimes = [...times].sort(() => 0.5 - Math.random()).slice(0, numSlots);
    
    availableTimes.forEach(time => {
      slots.push(`${day} ${time}`);
    });
  });
  
  return slots;
};

// Generate a random rating between 3.5 and 5.0
const generateRating = () => {
  return Math.floor(35 + Math.random() * 15) / 10;
};

export const generateMockData = () => {
  const hospitals: Hospital[] = [
    {
      id: 'hosp-1',
      name: 'Central Medical Hospital',
      location: 'New York, NY',
      specialties: ['Cardiology', 'Neurology', 'Orthopedics'],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600',
      rating: generateRating(),
      doctors: []
    },
    {
      id: 'hosp-2',
      name: 'Greenview Health Center',
      location: 'Los Angeles, CA',
      specialties: ['Pediatrics', 'Dermatology', 'Gynecology'],
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=600',
      rating: generateRating(),
      doctors: []
    },
    {
      id: 'hosp-3',
      name: 'Riverside Medical Clinic',
      location: 'Chicago, IL',
      specialties: ['Oncology', 'Cardiology', 'Psychiatry'],
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=600',
      rating: generateRating(),
      doctors: []
    },
    {
      id: 'hosp-4',
      name: 'Harmony General Hospital',
      location: 'Houston, TX',
      specialties: ['Orthopedics', 'Ophthalmology', 'Dermatology'],
      image: 'https://images.unsplash.com/photo-1587351021355-a9562f0d268d?w=800&h=600',
      rating: generateRating(),
      doctors: []
    },
    {
      id: 'hosp-5',
      name: 'Sunshine Community Hospital',
      location: 'Miami, FL',
      specialties: ['Pediatrics', 'Dentistry', 'Gynecology'],
      image: 'https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?w=800&h=600',
      rating: generateRating(),
      doctors: []
    }
  ];

  const doctors: Doctor[] = [];
  const doctorImages = [
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400',
    'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400',
    'https://images.unsplash.com/photo-1651008376906-ef240b376559?w=400&h=400',
    'https://images.unsplash.com/photo-1618498082410-b4aa22193b38?w=400&h=400',
    'https://images.unsplash.com/photo-1658204238967-3a81a63e9b2d?w=400&h=400',
    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400',
  ];

  const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'Robert', 'Lisa', 'David', 'Maria', 'James', 'Patricia'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

  // Generate 20 doctors across all hospitals
  for (let i = 0; i < 20; i++) {
    const hospitalIndex = i % hospitals.length;
    const hospital = hospitals[hospitalIndex];
    
    // Select a specialty from the hospital's specialties
    const specialty = hospital.specialties[Math.floor(Math.random() * hospital.specialties.length)];
    
    const doctorId = `dr-${i + 1}`;
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `Dr. ${firstName} ${lastName}`;
    const imageIndex = i % doctorImages.length;
    
    const doctor: Doctor = {
      id: doctorId,
      name,
      specialty,
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      image: doctorImages[imageIndex],
      rating: generateRating(),
      availability: generateAvailability(),
      bio: `${name} is a dedicated ${specialty} specialist with a passion for patient care. With extensive training and experience, they provide comprehensive care using the latest medical techniques.`,
      experience: 5 + Math.floor(Math.random() * 20) // 5-24 years
    };
    
    doctors.push(doctor);
    
    // Add doctor to hospital's doctors array
    hospital.doctors.push(doctor);
  }

  return { hospitals, doctors };
};

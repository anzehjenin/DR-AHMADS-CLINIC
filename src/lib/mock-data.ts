// ─── Types ──────────────────────────────────────────────────────────────────

export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled' | 'no-show';

export interface Clinic {
  id: string;
  name: string;
  location: string;
  phone: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  clinicId: string;
  avatar: string;
  rating: number;
  bio: string;
  reviewCount: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  clinicId: string;
  date: string;
  time: string;
  duration: number;
  status: AppointmentStatus;
  type: string;
  notes: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface AvailableSlot {
  id: string;
  doctorId: string;
  date: string;
  time: string;
  available: boolean;
}

// ─── Clinics ────────────────────────────────────────────────────────────────

export const clinics: Clinic[] = [
  {
    id: 'clinic-1',
    name: 'Sehha Plus — Al Olaya',
    location: 'Al Olaya District, Riyadh',
    phone: '+962 11 234 5678',
  },
  {
    id: 'clinic-2',
    name: 'Sehha Plus — Al Malqa',
    location: 'Al Malqa District, Riyadh',
    phone: '+962 11 345 6789',
  },
  {
    id: 'clinic-3',
    name: 'Sehha Plus — Al Rawdah',
    location: 'Al Rawdah District, Jeddah',
    phone: '+962 12 456 7890',
  },
  {
    id: 'clinic-4',
    name: 'Sehha Plus — Al Nakheel',
    location: 'Al Nakheel District, Riyadh',
    phone: '+962 11 567 8901',
  },
];

// ─── Doctors ────────────────────────────────────────────────────────────────

export const doctors: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Khalid Al-Farsi',
    specialty: 'General Medicine',
    clinicId: 'clinic-1',
    avatar: '👨‍⚕️',
    rating: 4.9,
    bio: 'Experienced family physician with 12 years of practice. Specializes in preventive care.',
    reviewCount: 234,
  },
  {
    id: 'doc-2',
    name: 'Dr. Nora Al-Salem',
    specialty: 'Dermatology',
    clinicId: 'clinic-1',
    avatar: '👩‍⚕️',
    rating: 4.8,
    bio: 'Board-certified dermatologist. Expert in cosmetic and medical dermatology.',
    reviewCount: 189,
  },
  {
    id: 'doc-3',
    name: 'Dr. Ahmed Al-Harbi',
    specialty: 'Pediatrics',
    clinicId: 'clinic-2',
    avatar: '👨‍⚕️',
    rating: 4.7,
    bio: 'Gentle pediatrician loved by kids and parents. Specializes in child development.',
    reviewCount: 312,
  },
  {
    id: 'doc-4',
    name: 'Dr. Layla Al-Mutairi',
    specialty: 'Cardiology',
    clinicId: 'clinic-2',
    avatar: '👩‍⚕️',
    rating: 4.9,
    bio: 'Leading cardiologist with advanced training in heart health and prevention.',
    reviewCount: 156,
  },
  {
    id: 'doc-5',
    name: 'Dr. Omar Al-Dosari',
    specialty: 'Dentistry',
    clinicId: 'clinic-3',
    avatar: '👨‍⚕️',
    rating: 4.6,
    bio: 'Compassionate dentist specializing in restorative and cosmetic procedures.',
    reviewCount: 201,
  },
  {
    id: 'doc-6',
    name: 'Dr. Fatima Al-Zahrani',
    specialty: 'Dermatology',
    clinicId: 'clinic-3',
    avatar: '👩‍⚕️',
    rating: 4.8,
    bio: 'Skin care specialist with expertise in acne, eczema, and laser treatments.',
    reviewCount: 178,
  },
  {
    id: 'doc-7',
    name: 'Dr. Youssef Al-Qahtani',
    specialty: 'General Medicine',
    clinicId: 'clinic-4',
    avatar: '👨‍⚕️',
    rating: 4.5,
    bio: 'Dedicated general practitioner focused on holistic health and wellness.',
    reviewCount: 145,
  },
  {
    id: 'doc-8',
    name: 'Dr. Hana Al-Ghamdi',
    specialty: 'Pediatrics',
    clinicId: 'clinic-4',
    avatar: '👩‍⚕️',
    rating: 4.7,
    bio: 'Experienced pediatrician with a warm, family-centered approach to child care.',
    reviewCount: 267,
  },
];

// ─── Current Patient ────────────────────────────────────────────────────────

export const currentPatient: Patient = {
  id: 'patient-1',
  name: 'Sara Al-Rashid',
  email: 'sara.alrashid@email.com',
  phone: '+962 50 123 4567',
  avatar: '👩',
};

// ─── Appointments ───────────────────────────────────────────────────────────

export const appointments: Appointment[] = [
  // ── 3 Upcoming ──
  {
    id: 'apt-1',
    patientId: 'patient-1',
    patientName: 'Sara Al-Rashid',
    doctorId: 'doc-1',
    clinicId: 'clinic-1',
    date: '2026-05-22',
    time: '09:00 AM',
    duration: 30,
    status: 'upcoming',
    type: 'General Checkup',
    notes: 'Annual wellness visit. Please bring previous lab results.',
  },
  {
    id: 'apt-2',
    patientId: 'patient-1',
    patientName: 'Sara Al-Rashid',
    doctorId: 'doc-2',
    clinicId: 'clinic-1',
    date: '2026-05-25',
    time: '11:30 AM',
    duration: 45,
    status: 'upcoming',
    type: 'Skin Consultation',
    notes: 'Follow-up on previous dermatology assessment.',
  },
  {
    id: 'apt-3',
    patientId: 'patient-1',
    patientName: 'Sara Al-Rashid',
    doctorId: 'doc-4',
    clinicId: 'clinic-2',
    date: '2026-05-28',
    time: '02:00 PM',
    duration: 60,
    status: 'upcoming',
    type: 'Cardiology Review',
    notes: 'Routine heart health screening. Fasting recommended.',
  },
  // ── 5 Completed ──
  {
    id: 'apt-4',
    patientId: 'patient-1',
    patientName: 'Sara Al-Rashid',
    doctorId: 'doc-1',
    clinicId: 'clinic-1',
    date: '2026-04-10',
    time: '10:00 AM',
    duration: 30,
    status: 'completed',
    type: 'General Checkup',
    notes: 'All vitals normal. Recommended blood work in 6 months.',
  },
  {
    id: 'apt-5',
    patientId: 'patient-1',
    patientName: 'Sara Al-Rashid',
    doctorId: 'doc-3',
    clinicId: 'clinic-2',
    date: '2026-03-15',
    time: '09:30 AM',
    duration: 30,
    status: 'completed',
    type: 'Pediatric Consult',
    notes: 'Consultation regarding child vaccination schedule.',
  },
  {
    id: 'apt-6',
    patientId: 'patient-1',
    patientName: 'Sara Al-Rashid',
    doctorId: 'doc-5',
    clinicId: 'clinic-3',
    date: '2026-02-20',
    time: '03:00 PM',
    duration: 45,
    status: 'completed',
    type: 'Dental Checkup',
    notes: 'Routine dental examination. Minor cleaning performed.',
  },
  {
    id: 'apt-7',
    patientId: 'patient-1',
    patientName: 'Sara Al-Rashid',
    doctorId: 'doc-6',
    clinicId: 'clinic-3',
    date: '2026-01-12',
    time: '01:00 PM',
    duration: 30,
    status: 'completed',
    type: 'Skin Assessment',
    notes: 'Routine skin check completed. All clear.',
  },
  {
    id: 'apt-8',
    patientId: 'patient-1',
    patientName: 'Sara Al-Rashid',
    doctorId: 'doc-8',
    clinicId: 'clinic-4',
    date: '2025-12-05',
    time: '11:00 AM',
    duration: 30,
    status: 'completed',
    type: 'Follow-up',
    notes: 'Post-flu follow-up. Fully recovered.',
  },
  // ── 1 Cancelled ──
  {
    id: 'apt-9',
    patientId: 'patient-1',
    patientName: 'Sara Al-Rashid',
    doctorId: 'doc-7',
    clinicId: 'clinic-4',
    date: '2026-04-28',
    time: '04:00 PM',
    duration: 30,
    status: 'cancelled',
    type: 'General Consultation',
    notes: 'Cancelled due to scheduling conflict. Freed slot for another patient.',
  },
];

// ─── Available Time Slots (for rebooking — simple) ──────────────────────────

export const availableTimeSlots: TimeSlot[] = [
  { time: '08:00 AM', available: true },
  { time: '08:30 AM', available: false },
  { time: '09:00 AM', available: true },
  { time: '09:30 AM', available: true },
  { time: '10:00 AM', available: false },
  { time: '10:30 AM', available: true },
  { time: '11:00 AM', available: true },
  { time: '11:30 AM', available: false },
  { time: '12:00 PM', available: true },
  { time: '12:30 PM', available: false },
  { time: '01:00 PM', available: true },
  { time: '01:30 PM', available: true },
  { time: '02:00 PM', available: true },
  { time: '02:30 PM', available: false },
  { time: '03:00 PM', available: true },
  { time: '03:30 PM', available: true },
  { time: '04:00 PM', available: false },
  { time: '04:30 PM', available: true },
];

// ─── Available Slots (for booking flow — per doctor/date) ───────────────────

export const availableSlots: AvailableSlot[] = [
  // Dr. Khalid Al-Farsi (doc-1) — General Medicine
  { id: 'slot-1',  doctorId: 'doc-1', date: '2026-05-23', time: '09:00 AM', available: true },
  { id: 'slot-2',  doctorId: 'doc-1', date: '2026-05-23', time: '10:30 AM', available: true },
  { id: 'slot-3',  doctorId: 'doc-1', date: '2026-05-23', time: '02:00 PM', available: true },
  { id: 'slot-4',  doctorId: 'doc-1', date: '2026-05-26', time: '09:00 AM', available: true },
  { id: 'slot-5',  doctorId: 'doc-1', date: '2026-05-26', time: '11:00 AM', available: true },
  // Dr. Nora Al-Salem (doc-2) — Dermatology
  { id: 'slot-6',  doctorId: 'doc-2', date: '2026-05-24', time: '10:00 AM', available: true },
  { id: 'slot-7',  doctorId: 'doc-2', date: '2026-05-24', time: '01:00 PM', available: true },
  { id: 'slot-8',  doctorId: 'doc-2', date: '2026-05-27', time: '09:30 AM', available: true },
  { id: 'slot-9',  doctorId: 'doc-2', date: '2026-05-27', time: '03:00 PM', available: true },
  // Dr. Ahmed Al-Harbi (doc-3) — Pediatrics
  { id: 'slot-10', doctorId: 'doc-3', date: '2026-05-23', time: '08:30 AM', available: true },
  { id: 'slot-11', doctorId: 'doc-3', date: '2026-05-23', time: '11:00 AM', available: true },
  { id: 'slot-12', doctorId: 'doc-3', date: '2026-05-25', time: '09:00 AM', available: true },
  // Dr. Layla Al-Mutairi (doc-4) — Cardiology
  { id: 'slot-13', doctorId: 'doc-4', date: '2026-05-24', time: '11:00 AM', available: true },
  { id: 'slot-14', doctorId: 'doc-4', date: '2026-05-24', time: '02:30 PM', available: true },
  { id: 'slot-15', doctorId: 'doc-4', date: '2026-05-29', time: '10:00 AM', available: true },
  // Dr. Omar Al-Dosari (doc-5) — Dentistry
  { id: 'slot-16', doctorId: 'doc-5', date: '2026-05-23', time: '09:30 AM', available: true },
  { id: 'slot-17', doctorId: 'doc-5', date: '2026-05-23', time: '01:30 PM', available: true },
  { id: 'slot-18', doctorId: 'doc-5', date: '2026-05-26', time: '10:00 AM', available: true },
  // Dr. Fatima Al-Zahrani (doc-6) — Dermatology
  { id: 'slot-19', doctorId: 'doc-6', date: '2026-05-24', time: '08:00 AM', available: true },
  { id: 'slot-20', doctorId: 'doc-6', date: '2026-05-24', time: '11:30 AM', available: true },
  { id: 'slot-21', doctorId: 'doc-6', date: '2026-05-28', time: '09:00 AM', available: true },
  // Dr. Youssef Al-Qahtani (doc-7) — General Medicine
  { id: 'slot-22', doctorId: 'doc-7', date: '2026-05-25', time: '10:00 AM', available: true },
  { id: 'slot-23', doctorId: 'doc-7', date: '2026-05-25', time: '03:00 PM', available: true },
  // Dr. Hana Al-Ghamdi (doc-8) — Pediatrics
  { id: 'slot-24', doctorId: 'doc-8', date: '2026-05-26', time: '08:00 AM', available: true },
  { id: 'slot-25', doctorId: 'doc-8', date: '2026-05-26', time: '12:00 PM', available: true },
  { id: 'slot-26', doctorId: 'doc-8', date: '2026-05-29', time: '01:00 PM', available: true },
];

// ─── Helper Functions ───────────────────────────────────────────────────────

export function getDoctorById(id: string): Doctor | undefined {
  return doctors.find((d) => d.id === id);
}

export function getClinicById(id: string): Clinic | undefined {
  return clinics.find((c) => c.id === id);
}

export function getAppointmentsByStatus(status: AppointmentStatus): Appointment[] {
  return appointments.filter((a) => a.status === status);
}

export function getAppointmentsForPatient(patientId: string): Appointment[] {
  return appointments.filter((a) => a.patientId === patientId);
}

export function getDoctorsByClinic(clinicId: string): Doctor[] {
  return doctors.filter((d) => d.clinicId === clinicId);
}

export function getDoctorsBySpecialty(specialty: string): Doctor[] {
  return doctors.filter((d) => d.specialty === specialty);
}

export function getAvailableSlots(): TimeSlot[] {
  return availableTimeSlots.filter((s) => s.available);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getRelativeDate(dateStr: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  target.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;

  return formatDate(dateStr);
}

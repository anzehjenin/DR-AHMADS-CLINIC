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
    name: 'Sehha Plus — Sweifieh',
    location: 'Sweifieh, Amman',
    phone: '+962 11 234 5678',
  },
  {
    id: 'clinic-2',
    name: 'Sehha Plus — Khalda',
    location: 'Khalda, Amman',
    phone: '+962 11 345 6789',
  },
  {
    id: 'clinic-3',
    name: 'Sehha Plus — Jubeiha',
    location: 'Jubeiha, Amman',
    phone: '+962 12 456 7890',
  },
  {
    id: 'clinic-4',
    name: 'Sehha Plus — Marka',
    location: 'Marka, Amman',
    phone: '+962 11 567 8901',
  },
];

// ─── Doctors ────────────────────────────────────────────────────────────────

export const doctors: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Maha Suleiman (د. مها سليمان)',
    specialty: 'General Medicine',
    clinicId: 'clinic-1',
    avatar: '👩‍⚕️',
    rating: 4.9,
    bio: 'Experienced general medicine practitioner. Known for compassionate patient care and extensive experience.',
    reviewCount: 234,
  },
  {
    id: 'doc-2',
    name: 'Dr. Ramzi Haddad (د. رمزي حداد)',
    specialty: 'Pediatrics',
    clinicId: 'clinic-1',
    avatar: '👨‍⚕️',
    rating: 4.8,
    bio: 'Compassionate pediatric consultant specializing in child growth, developmental health, and general checkups.',
    reviewCount: 189,
  },
  {
    id: 'doc-3',
    name: 'Dr. Yasmin Abu Joudeh (د. ياسمين أبو جودة)',
    specialty: 'Dermatology',
    clinicId: 'clinic-2',
    avatar: '👩‍⚕️',
    rating: 4.7,
    bio: 'Board-certified dermatologist. Expert in treating complex clinical skin conditions and cosmetic dermatology.',
    reviewCount: 312,
  },
  {
    id: 'doc-4',
    name: 'Dr. Selim Nashashibi (د. سليم نشاشيبي)',
    specialty: 'General Medicine',
    clinicId: 'clinic-3',
    avatar: '👨‍⚕️',
    rating: 4.9,
    bio: 'Dedicated family medicine expert with advanced training in preventive diagnostics and long-term care management.',
    reviewCount: 156,
  },
  {
    id: 'doc-5',
    name: 'Dr. Nadia Qaqish (د. ناديا قاقيش)',
    specialty: 'Pediatrics',
    clinicId: 'clinic-4',
    avatar: '👩‍⚕️',
    rating: 4.6,
    bio: 'Experienced, family-focused pediatrician specializing in infant health care and early childhood medicine.',
    reviewCount: 201,
  },
  {
    id: 'doc-6',
    name: 'Dr. Bassam Khoury (د. بسام خوري)',
    specialty: 'Dermatology',
    clinicId: 'clinic-1',
    avatar: '👨‍⚕️',
    rating: 4.8,
    bio: 'Skin wellness specialist with over a decade of clinical experience in acne, medical laser, and skin checks.',
    reviewCount: 178,
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
    type: 'Pediatric Consult',
    notes: 'Follow-up on previous pediatric assessment.',
  },
  {
    id: 'apt-3',
    patientId: 'patient-1',
    patientName: 'Sara Al-Rashid',
    doctorId: 'doc-3',
    clinicId: 'clinic-2',
    date: '2026-05-28',
    time: '02:00 PM',
    duration: 60,
    status: 'upcoming',
    type: 'Skin Consultation',
    notes: 'Routine skin screening.',
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
    doctorId: 'doc-2',
    clinicId: 'clinic-1',
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
    doctorId: 'doc-4',
    clinicId: 'clinic-3',
    date: '2026-02-20',
    time: '03:00 PM',
    duration: 45,
    status: 'completed',
    type: 'General Consultation',
    notes: 'Routine blood pressure assessment. Normal levels.',
  },
  {
    id: 'apt-7',
    patientId: 'patient-1',
    patientName: 'Sara Al-Rashid',
    doctorId: 'doc-3',
    clinicId: 'clinic-2',
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
    doctorId: 'doc-5',
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
    doctorId: 'doc-6',
    clinicId: 'clinic-1',
    date: '2026-04-28',
    time: '04:00 PM',
    duration: 30,
    status: 'cancelled',
    type: 'Dermatology Consultation',
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
  // Dr. Maha Suleiman (doc-1) — General Medicine
  { id: 'slot-1',  doctorId: 'doc-1', date: '2026-05-23', time: '09:00 AM', available: true },
  { id: 'slot-2',  doctorId: 'doc-1', date: '2026-05-23', time: '10:30 AM', available: true },
  { id: 'slot-3',  doctorId: 'doc-1', date: '2026-05-23', time: '02:00 PM', available: true },
  { id: 'slot-4',  doctorId: 'doc-1', date: '2026-05-26', time: '09:00 AM', available: true },
  { id: 'slot-5',  doctorId: 'doc-1', date: '2026-05-26', time: '11:00 AM', available: true },
  // Dr. Ramzi Haddad (doc-2) — Pediatrics
  { id: 'slot-6',  doctorId: 'doc-2', date: '2026-05-24', time: '10:00 AM', available: true },
  { id: 'slot-7',  doctorId: 'doc-2', date: '2026-05-24', time: '01:00 PM', available: true },
  { id: 'slot-8',  doctorId: 'doc-2', date: '2026-05-27', time: '09:30 AM', available: true },
  { id: 'slot-9',  doctorId: 'doc-2', date: '2026-05-27', time: '03:00 PM', available: true },
  // Dr. Yasmin Abu Joudeh (doc-3) — Dermatology
  { id: 'slot-10', doctorId: 'doc-3', date: '2026-05-23', time: '08:30 AM', available: true },
  { id: 'slot-11', doctorId: 'doc-3', date: '2026-05-23', time: '11:00 AM', available: true },
  { id: 'slot-12', doctorId: 'doc-3', date: '2026-05-25', time: '09:00 AM', available: true },
  // Dr. Selim Nashashibi (doc-4) — General Medicine
  { id: 'slot-13', doctorId: 'doc-4', date: '2026-05-24', time: '11:00 AM', available: true },
  { id: 'slot-14', doctorId: 'doc-4', date: '2026-05-24', time: '02:30 PM', available: true },
  { id: 'slot-15', doctorId: 'doc-4', date: '2026-05-29', time: '10:00 AM', available: true },
  // Dr. Nadia Qaqish (doc-5) — Pediatrics
  { id: 'slot-16', doctorId: 'doc-5', date: '2026-05-23', time: '09:30 AM', available: true },
  { id: 'slot-17', doctorId: 'doc-5', date: '2026-05-23', time: '01:30 PM', available: true },
  { id: 'slot-18', doctorId: 'doc-5', date: '2026-05-26', time: '10:00 AM', available: true },
  // Dr. Bassam Khoury (doc-6) — Dermatology
  { id: 'slot-19', doctorId: 'doc-6', date: '2026-05-24', time: '08:00 AM', available: true },
  { id: 'slot-20', doctorId: 'doc-6', date: '2026-05-24', time: '11:30 AM', available: true },
  { id: 'slot-21', doctorId: 'doc-6', date: '2026-05-28', time: '09:00 AM', available: true },
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

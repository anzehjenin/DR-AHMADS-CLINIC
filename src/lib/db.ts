import fs from 'fs';
import path from 'path';
import postgres from 'postgres';
import { Clinic, Doctor, Appointment, Patient, AvailableSlot } from './mock-data';

const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

// Interface representing the database schema
export interface DatabaseSchema {
  patients: Patient[];
  clinics: Clinic[];
  doctors: Doctor[];
  appointments: Appointment[];
  availableSlots: AvailableSlot[];
}

// Fallback in-memory database in case file-system is read-only (e.g. serverless environment like Vercel)
let inMemoryDb: DatabaseSchema | null = null;

// Initialize Postgres Client
let sql: any = null;
let usePostgres = false;

if (process.env.DATABASE_URL) {
  try {
    sql = postgres(process.env.DATABASE_URL, {
      ssl: { rejectUnauthorized: false },
      max: 10,
    });
    usePostgres = true;
    console.log('Postgres connection client initialized.');
  } catch (err) {
    console.error('Failed to initialize Postgres client, falling back to local file:', err);
  }
}

/**
 * Reads the database content either from db.json or memory fallback.
 */
export function readDb(): DatabaseSchema {
  try {
    if (inMemoryDb) {
      return inMemoryDb;
    }

    if (fs.existsSync(DB_FILE)) {
      const dataStr = fs.readFileSync(DB_FILE, 'utf8');
      const data = JSON.parse(dataStr) as DatabaseSchema;
      return data;
    }
  } catch (error) {
    console.error('Failed to read database file, falling back to in-memory store:', error);
  }

  // Load from local static JSON structure if first time and read fails or doesn't exist
  const initialSchema: DatabaseSchema = {
    patients: [
      {
        id: "patient-1",
        name: "Sara Al-Rashid",
        email: "sara.alrashid@email.com",
        phone: "+966 50 123 4567",
        avatar: "👩"
      }
    ],
    clinics: [
      {
        id: 'clinic-1',
        name: 'Sehha Plus — Al Olaya',
        location: 'Al Olaya District, Riyadh',
        phone: '+966 11 234 5678',
      },
      {
        id: 'clinic-2',
        name: 'Sehha Plus — Al Malqa',
        location: 'Al Malqa District, Riyadh',
        phone: '+966 11 345 6789',
      },
      {
        id: 'clinic-3',
        name: 'Sehha Plus — Al Rawdah',
        location: 'Al Rawdah District, Jeddah',
        phone: '+966 12 456 7890',
      },
      {
        id: 'clinic-4',
        name: 'Sehha Plus — Al Nakheel',
        location: 'Al Nakheel District, Riyadh',
        phone: '+966 11 567 8901',
      }
    ],
    doctors: [
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
      }
    ],
    appointments: [
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
      }
    ],
    availableSlots: [
      { id: 'slot-1',  doctorId: 'doc-1', date: '2026-05-23', time: '09:00 AM', available: true },
      { id: 'slot-2',  doctorId: 'doc-1', date: '2026-05-23', time: '10:30 AM', available: true },
      { id: 'slot-3',  doctorId: 'doc-1', date: '2026-05-23', time: '02:00 PM', available: true },
      { id: 'slot-4',  doctorId: 'doc-1', date: '2026-05-26', time: '09:00 AM', available: true },
      { id: 'slot-5',  doctorId: 'doc-1', date: '2026-05-26', time: '11:00 AM', available: true },
      { id: 'slot-6',  doctorId: 'doc-2', date: '2026-05-24', time: '10:00 AM', available: true },
      { id: 'slot-7',  doctorId: 'doc-2', date: '2026-05-24', time: '01:00 PM', available: true },
      { id: 'slot-8',  doctorId: 'doc-2', date: '2026-05-27', time: '09:30 AM', available: true },
      { id: 'slot-9',  doctorId: 'doc-2', date: '2026-05-27', time: '03:00 PM', available: true },
      { id: 'slot-10', doctorId: 'doc-3', date: '2026-05-23', time: '08:30 AM', available: true },
      { id: 'slot-11', doctorId: 'doc-3', date: '2026-05-23', time: '11:00 AM', available: true },
      { id: 'slot-12', doctorId: 'doc-3', date: '2026-05-25', time: '09:00 AM', available: true },
      { id: 'slot-13', doctorId: 'doc-4', date: '2026-05-24', time: '11:00 AM', available: true },
      { id: 'slot-14', doctorId: 'doc-4', date: '2026-05-24', time: '02:30 PM', available: true },
      { id: 'slot-15', doctorId: 'doc-4', date: '2026-05-29', time: '10:00 AM', available: true },
      { id: 'slot-16', doctorId: 'doc-5', date: '2026-05-23', time: '09:30 AM', available: true },
      { id: 'slot-17', doctorId: 'doc-5', date: '2026-05-23', time: '01:30 PM', available: true },
      { id: 'slot-18', doctorId: 'doc-5', date: '2026-05-26', time: '10:00 AM', available: true },
      { id: 'slot-19', doctorId: 'doc-6', date: '2026-05-24', time: '08:00 AM', available: true },
      { id: 'slot-20', doctorId: 'doc-6', date: '2026-05-24', time: '11:30 AM', available: true },
      { id: 'slot-21', doctorId: 'doc-6', date: '2026-05-28', time: '09:00 AM', available: true },
      { id: 'slot-22', doctorId: 'doc-7', date: '2026-05-25', time: '10:00 AM', available: true },
      { id: 'slot-23', doctorId: 'doc-7', date: '2026-05-25', time: '03:00 PM', available: true },
      { id: 'slot-24', doctorId: 'doc-8', date: '2026-05-26', time: '08:00 AM', available: true },
      { id: 'slot-25', doctorId: 'doc-8', date: '2026-05-26', time: '12:00 PM', available: true },
      { id: 'slot-26', doctorId: 'doc-8', date: '2026-05-29', time: '01:00 PM', available: true }
    ]
  };

  inMemoryDb = initialSchema;
  return initialSchema;
}

/**
 * Writes data back to db.json, or updates the in-memory fallback.
 */
export function writeDb(data: DatabaseSchema): boolean {
  inMemoryDb = data;
  try {
    const parentDir = path.dirname(DB_FILE);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Failed to write database file, holding in memory:', error);
    return false;
  }
}

/* ─── Schema Setup & Seeder ─── */
let isDbInitialized = false;

async function ensureInitialized() {
  if (!usePostgres || isDbInitialized) return;

  try {
    // 1. Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS clinics (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS doctors (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        specialty VARCHAR(100) NOT NULL,
        clinic_id VARCHAR(50) REFERENCES clinics(id) ON DELETE SET NULL,
        avatar VARCHAR(255),
        rating NUMERIC(3, 2),
        bio TEXT,
        review_count INTEGER
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS patients (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50) UNIQUE NOT NULL,
        avatar VARCHAR(255)
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS available_slots (
        id VARCHAR(50) PRIMARY KEY,
        doctor_id VARCHAR(50) REFERENCES doctors(id) ON DELETE CASCADE,
        date VARCHAR(20) NOT NULL,
        time VARCHAR(20) NOT NULL,
        available BOOLEAN DEFAULT TRUE
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS appointments (
        id VARCHAR(50) PRIMARY KEY,
        patient_id VARCHAR(50) REFERENCES patients(id) ON DELETE CASCADE,
        patient_name VARCHAR(255) NOT NULL,
        doctor_id VARCHAR(50) REFERENCES doctors(id) ON DELETE SET NULL,
        clinic_id VARCHAR(50) REFERENCES clinics(id) ON DELETE SET NULL,
        date VARCHAR(20) NOT NULL,
        time VARCHAR(20) NOT NULL,
        duration INTEGER DEFAULT 30,
        status VARCHAR(20) DEFAULT 'upcoming',
        type VARCHAR(100),
        notes TEXT
      )
    `;

    // Seed database if empty
    await seedDatabase();

    isDbInitialized = true;
    console.log('Postgres initialized.');
  } catch (err) {
    console.error('Failed to run schema migrations on Postgres:', err);
    usePostgres = false;
  }
}

async function seedDatabase() {
  const db = readDb();

  // Seed clinics
  const clinicRows = await sql`SELECT count(*) FROM clinics`;
  if (parseInt(clinicRows[0].count) === 0) {
    for (const c of db.clinics) {
      await sql`
        INSERT INTO clinics (id, name, location, phone)
        VALUES (${c.id}, ${c.name}, ${c.location}, ${c.phone})
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }

  // Seed doctors
  const doctorRows = await sql`SELECT count(*) FROM doctors`;
  if (parseInt(doctorRows[0].count) === 0) {
    for (const d of db.doctors) {
      await sql`
        INSERT INTO doctors (id, name, specialty, clinic_id, avatar, rating, bio, review_count)
        VALUES (${d.id}, ${d.name}, ${d.specialty}, ${d.clinicId}, ${d.avatar || null}, ${d.rating}, ${d.bio || null}, ${d.reviewCount})
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }

  // Seed patients
  const patientRows = await sql`SELECT count(*) FROM patients`;
  if (parseInt(patientRows[0].count) === 0) {
    for (const p of db.patients) {
      await sql`
        INSERT INTO patients (id, name, email, phone, avatar)
        VALUES (${p.id}, ${p.name}, ${p.email || null}, ${p.phone}, ${p.avatar || null})
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }

  // Seed available slots
  const slotRows = await sql`SELECT count(*) FROM available_slots`;
  if (parseInt(slotRows[0].count) === 0) {
    for (const s of db.availableSlots) {
      await sql`
        INSERT INTO available_slots (id, doctor_id, date, time, available)
        VALUES (${s.id}, ${s.doctorId}, ${s.date}, ${s.time}, ${s.available})
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }

  // Seed appointments
  const apptRows = await sql`SELECT count(*) FROM appointments`;
  if (parseInt(apptRows[0].count) === 0) {
    for (const a of db.appointments) {
      await sql`
        INSERT INTO appointments (id, patient_id, patient_name, doctor_id, clinic_id, date, time, duration, status, type, notes)
        VALUES (${a.id}, ${a.patientId}, ${a.patientName}, ${a.doctorId}, ${a.clinicId}, ${a.date}, ${a.time}, ${a.duration}, ${a.status}, ${a.type}, ${a.notes || null})
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }
}

// ─── Query helpers ──────────────────────────────────────────────────────────

export async function getPatientById(id: string): Promise<Patient | undefined> {
  if (usePostgres) {
    try {
      await ensureInitialized();
      const rows = await sql`SELECT * FROM patients WHERE id = ${id}`;
      if (rows.length === 0) return undefined;
      const p = rows[0];
      return { id: p.id, name: p.name, email: p.email, phone: p.phone, avatar: p.avatar };
    } catch (e) {
      console.error('Postgres error in getPatientById:', e);
    }
  }
  const db = readDb();
  return db.patients.find(p => p.id === id);
}

export async function getPatientByPhone(phone: string): Promise<Patient | undefined> {
  if (usePostgres) {
    try {
      await ensureInitialized();
      const cleanPhone = phone.replace(/[\s+-]/g, '');
      const rows = await sql`SELECT * FROM patients`;
      return rows.map((p: any) => ({
        id: p.id,
        name: p.name,
        email: p.email,
        phone: p.phone,
        avatar: p.avatar
      })).find((p: any) => p.phone.replace(/[\s+-]/g, '').endsWith(cleanPhone));
    } catch (e) {
      console.error('Postgres error in getPatientByPhone:', e);
    }
  }
  const db = readDb();
  const cleanPhone = phone.replace(/[\s+-]/g, '');
  return db.patients.find(p => p.phone.replace(/[\s+-]/g, '').endsWith(cleanPhone));
}

export async function createPatient(patient: Omit<Patient, 'id'>): Promise<Patient> {
  if (usePostgres) {
    try {
      await ensureInitialized();
      const countRows = await sql`SELECT count(*) FROM patients`;
      const nextIdNum = parseInt(countRows[0].count) + 1;
      const id = `patient-${nextIdNum}`;
      await sql`
        INSERT INTO patients (id, name, email, phone, avatar)
        VALUES (${id}, ${patient.name}, ${patient.email || null}, ${patient.phone}, ${patient.avatar || null})
      `;
      return { ...patient, id };
    } catch (e) {
      console.error('Postgres error in createPatient:', e);
    }
  }
  const db = readDb();
  const id = `patient-${db.patients.length + 1}`;
  const newPatient: Patient = { ...patient, id };
  db.patients.push(newPatient);
  writeDb(db);
  return newPatient;
}

export async function getClinics(): Promise<Clinic[]> {
  if (usePostgres) {
    try {
      await ensureInitialized();
      const rows = await sql`SELECT * FROM clinics`;
      return rows.map((r: any) => ({ id: r.id, name: r.name, location: r.location, phone: r.phone }));
    } catch (e) {
      console.error('Postgres error in getClinics:', e);
    }
  }
  return readDb().clinics;
}

export async function getDoctors(): Promise<Doctor[]> {
  if (usePostgres) {
    try {
      await ensureInitialized();
      const rows = await sql`SELECT * FROM doctors`;
      return rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        specialty: r.specialty,
        clinicId: r.clinic_id,
        avatar: r.avatar,
        rating: Number(r.rating),
        bio: r.bio,
        reviewCount: r.review_count
      }));
    } catch (e) {
      console.error('Postgres error in getDoctors:', e);
    }
  }
  return readDb().doctors;
}

export async function getAppointments(patientId: string): Promise<Appointment[]> {
  if (usePostgres) {
    try {
      await ensureInitialized();
      const rows = await sql`SELECT * FROM appointments WHERE patient_id = ${patientId}`;
      return rows.map((r: any) => ({
        id: r.id,
        patientId: r.patient_id,
        patientName: r.patient_name,
        doctorId: r.doctor_id,
        clinicId: r.clinic_id,
        date: r.date,
        time: r.time,
        duration: r.duration,
        status: r.status as any,
        type: r.type,
        notes: r.notes
      }));
    } catch (e) {
      console.error('Postgres error in getAppointments:', e);
    }
  }
  const db = readDb();
  return db.appointments.filter(a => a.patientId === patientId);
}

export async function getAvailableSlots(): Promise<AvailableSlot[]> {
  if (usePostgres) {
    try {
      await ensureInitialized();
      const rows = await sql`SELECT * FROM available_slots`;
      return rows.map((r: any) => ({
        id: r.id,
        doctorId: r.doctor_id,
        date: r.date,
        time: r.time,
        available: r.available
      }));
    } catch (e) {
      console.error('Postgres error in getAvailableSlots:', e);
    }
  }
  return readDb().availableSlots;
}

export async function createAppointment(appointment: Omit<Appointment, 'id'>): Promise<Appointment> {
  if (usePostgres) {
    try {
      await ensureInitialized();
      const countRows = await sql`SELECT count(*) FROM appointments`;
      const nextIdNum = parseInt(countRows[0].count) + 1;
      const id = `apt-${nextIdNum}`;

      await sql.begin(async (sql: any) => {
        await sql`
          INSERT INTO appointments (id, patient_id, patient_name, doctor_id, clinic_id, date, time, duration, status, type, notes)
          VALUES (${id}, ${appointment.patientId}, ${appointment.patientName}, ${appointment.doctorId}, ${appointment.clinicId}, ${appointment.date}, ${appointment.time}, ${appointment.duration}, ${appointment.status}, ${appointment.type}, ${appointment.notes || null})
        `;

        await sql`
          UPDATE available_slots
          SET available = FALSE
          WHERE doctor_id = ${appointment.doctorId} AND date = ${appointment.date} AND time = ${appointment.time}
        `;
      });

      return { ...appointment, id };
    } catch (e) {
      console.error('Postgres error in createAppointment:', e);
    }
  }

  const db = readDb();
  const id = `apt-${db.appointments.length + 1}`;
  const newAppointment: Appointment = { ...appointment, id };
  db.appointments.push(newAppointment);

  const slotIndex = db.availableSlots.findIndex(
    s => s.doctorId === appointment.doctorId && s.date === appointment.date && s.time === appointment.time
  );
  if (slotIndex !== -1) {
    db.availableSlots[slotIndex].available = false;
  }

  writeDb(db);
  return newAppointment;
}

export async function cancelAppointment(appointmentId: string): Promise<boolean> {
  if (usePostgres) {
    try {
      await ensureInitialized();

      const appts = await sql`SELECT * FROM appointments WHERE id = ${appointmentId}`;
      if (appts.length === 0) return false;
      const appt = appts[0];

      await sql.begin(async (sql: any) => {
        await sql`
          UPDATE appointments
          SET status = 'cancelled'
          WHERE id = ${appointmentId}
        `;

        await sql`
          UPDATE available_slots
          SET available = TRUE
          WHERE doctor_id = ${appt.doctor_id} AND date = ${appt.date} AND time = ${appt.time}
        `;
      });
      return true;
    } catch (e) {
      console.error('Postgres error in cancelAppointment:', e);
      return false;
    }
  }

  const db = readDb();
  const appointmentIndex = db.appointments.findIndex(a => a.id === appointmentId);
  if (appointmentIndex === -1) return false;

  const appt = db.appointments[appointmentIndex];
  db.appointments[appointmentIndex].status = 'cancelled';

  const slotIndex = db.availableSlots.findIndex(
    s => s.doctorId === appt.doctorId && s.date === appt.date && s.time === appt.time
  );
  if (slotIndex !== -1) {
    db.availableSlots[slotIndex].available = true;
  }

  writeDb(db);
  return true;
}

export async function rescheduleAppointment(appointmentId: string, newSlotId: string): Promise<boolean> {
  if (usePostgres) {
    try {
      await ensureInitialized();

      const appts = await sql`SELECT * FROM appointments WHERE id = ${appointmentId}`;
      if (appts.length === 0) return false;
      const appt = appts[0];
      const oldDate = appt.date;
      const oldTime = appt.time;
      const oldDoctorId = appt.doctor_id;

      const slots = await sql`SELECT * FROM available_slots WHERE id = ${newSlotId} AND available = TRUE`;
      if (slots.length === 0) return false;
      const newSlot = slots[0];

      await sql.begin(async (sql: any) => {
        await sql`
          UPDATE available_slots
          SET available = FALSE
          WHERE id = ${newSlotId}
        `;

        await sql`
          UPDATE available_slots
          SET available = TRUE
          WHERE doctor_id = ${oldDoctorId} AND date = ${oldDate} AND time = ${oldTime}
        `;

        await sql`
          UPDATE appointments
          SET date = ${newSlot.date}, time = ${newSlot.time}
          WHERE id = ${appointmentId}
        `;
      });
      return true;
    } catch (e) {
      console.error('Postgres error in rescheduleAppointment:', e);
      return false;
    }
  }

  const db = readDb();
  const appointmentIndex = db.appointments.findIndex(a => a.id === appointmentId);
  if (appointmentIndex === -1) return false;

  const appt = db.appointments[appointmentIndex];
  const oldDate = appt.date;
  const oldTime = appt.time;
  const oldDoctorId = appt.doctorId;

  const newSlotIndex = db.availableSlots.findIndex(s => s.id === newSlotId);
  if (newSlotIndex === -1 || !db.availableSlots[newSlotIndex].available) return false;

  const newSlot = db.availableSlots[newSlotIndex];

  db.availableSlots[newSlotIndex].available = false;

  const oldSlotIndex = db.availableSlots.findIndex(
    s => s.doctorId === oldDoctorId && s.date === oldDate && s.time === oldTime
  );
  if (oldSlotIndex !== -1) {
    db.availableSlots[oldSlotIndex].available = true;
  }

  db.appointments[appointmentIndex].date = newSlot.date;
  db.appointments[appointmentIndex].time = newSlot.time;

  writeDb(db);
  return true;
}


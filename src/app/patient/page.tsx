"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Heart, Calendar, User, 
  Plus, Award, Loader2, Stethoscope, MapPin, Clock, CalendarDays
} from "lucide-react";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  clinicId: string;
  date: string;
  time: string;
  duration: number;
  status: 'upcoming' | 'completed' | 'cancelled' | 'no-show';
  type: string;
  notes: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  clinicId: string;
  avatar: string;
}

interface Clinic {
  id: string;
  name: string;
  location: string;
}

export default function PatientDashboard() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [meRes, apptsRes, docsRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/appointments'),
          fetch('/api/doctors')
        ]);

        if (meRes.ok && apptsRes.ok && docsRes.ok) {
          const meData = await meRes.json();
          const apptsData = await apptsRes.json();
          const docsData = await docsRes.json();

          setPatient(meData.patient);
          setAppointments(apptsData.appointments || []);
          setDoctors(docsData.doctors || []);
          setClinics(docsData.clinics || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const getDoctor = (id: string) => doctors.find(d => d.id === id);
  const getClinic = (id: string) => clinics.find(c => c.id === id);

  const upcomingAppointments = appointments.filter(a => a.status === 'upcoming');

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  const patientFirstName = patient ? patient.name.split(' ')[0] : 'Sarah';

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Header Section */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-warm-gray-800 tracking-tight">
            Good morning, {patientFirstName}.
          </h1>
          <p className="text-warm-gray-500 mt-1">Here is your health overview for today.</p>
        </div>
        <Link 
          href="/patient/book" 
          className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2.5 px-6 rounded-2xl text-sm transition-all duration-200 shadow-md shadow-teal-500/10 active:scale-95 flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" /> Book Appointment
        </Link>
      </section>

      {/* Streak Banner */}
      <section className="bg-gradient-to-r from-teal-400 to-[#4AD99A] rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md shadow-teal-500/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(255,255,255,0.15),transparent)] pointer-events-none"></div>
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0 border border-white/10">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">7 Day Attendance Streak!</h2>
            <p className="text-teal-50 text-sm mt-1 leading-relaxed">
              You&apos;re doing great. Keep up the healthy habits.
            </p>
          </div>
        </div>
        <button className="bg-white text-teal-800 font-bold py-2.5 px-6 rounded-2xl text-sm hover:bg-teal-50 transition-all duration-200 whitespace-nowrap shadow-sm active:scale-95 relative z-10 cursor-pointer">
          View Rewards
        </button>
      </section>

      {/* Upcoming Appointments */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-warm-gray-800 tracking-tight">Upcoming Visits</h2>
          <Link href="/patient/appointments" className="text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors">
            View All History
          </Link>
        </div>

        {upcomingAppointments.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-warm-gray-200/60 text-center space-y-4">
            <div className="w-12 h-12 bg-warm-gray-50 rounded-full flex items-center justify-center mx-auto text-warm-gray-400">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-warm-gray-800 text-sm">No upcoming appointments</h3>
              <p className="text-warm-gray-500 text-xs mt-1">You have no healthcare appointments scheduled right now.</p>
            </div>
            <Link 
              href="/patient/book" 
              className="inline-flex bg-teal-50 text-teal-700 font-bold text-xs py-2.5 px-6 rounded-2xl border border-teal-200 hover:bg-teal-100 transition-colors"
            >
              Book one now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingAppointments.map((appt) => {
              const doc = getDoctor(appt.doctorId);
              const clinic = getClinic(appt.clinicId);
              return (
                <div key={appt.id} className="bg-white rounded-3xl p-6 border border-warm-gray-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                  <div>
                    {/* Doctor Header */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0 text-2xl">
                        {doc?.avatar || "👨‍⚕️"}
                      </div>
                      <div>
                        <h3 className="font-bold text-warm-gray-800 text-sm">{doc?.name || "Healthcare Specialist"}</h3>
                        <p className="text-warm-gray-500 text-xs">{doc?.specialty || appt.type}</p>
                      </div>
                    </div>

                    {/* Clinic Detail */}
                    {clinic && (
                      <div className="flex items-center gap-2 text-warm-gray-500 text-xs mb-3 font-semibold">
                        <MapPin className="w-4 h-4 text-warm-gray-400 shrink-0" />
                        <span className="truncate">{clinic.name}</span>
                      </div>
                    )}

                    {/* Schedule Badge */}
                    <div className="flex items-center gap-2 text-teal-700 bg-teal-50/60 border border-teal-100/50 p-3 rounded-2xl mb-5 text-xs font-bold">
                      <CalendarDays className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>{formatDate(appt.date)} at {appt.time}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-auto">
                    <Link
                      href="/patient/appointments"
                      className="flex-1 py-2.5 rounded-2xl text-center text-xs font-bold text-warm-gray-600 border border-warm-gray-200 hover:bg-warm-gray-50 transition-colors"
                    >
                      Reschedule
                    </Link>
                    <Link
                      href={`/patient/cancel/${appt.id}`}
                      className="flex-1 py-2.5 rounded-2xl text-center text-xs font-bold text-coral-500 border border-coral-200 hover:bg-coral-50/30 transition-colors"
                    >
                      Cancel Slot
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Book New Appointment Banner Link */}
      <section className="pt-2">
        <Link 
          href="/patient/book" 
          className="w-full bg-[#E5F7ED] hover:bg-[#D5F0DF] transition-all duration-200 border border-[#C5E9D5] rounded-3xl p-5 flex items-center gap-4 text-left group hover:shadow-md cursor-pointer"
        >
          <div className="w-12 h-12 bg-[#C9EFD8] rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#B5E6CA] transition-colors border border-[#AEE2C3] shadow-sm">
            <Plus className="w-6 h-6 text-[#106A38]" />
          </div>
          <div>
            <h3 className="font-bold text-[#106A38] text-sm group-hover:text-green-800 transition-colors">Book New Appointment</h3>
            <p className="text-slate-600 text-xs mt-0.5 font-semibold">Find a clinic and reserve your slot instantly</p>
          </div>
        </Link>
      </section>

    </div>
  );
}


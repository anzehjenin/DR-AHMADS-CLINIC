'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Clock,
  MapPin,
  Stethoscope,
  RefreshCw,
  Filter,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';

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

type FilterTab = 'all' | 'upcoming' | 'completed' | 'cancelled';

const TABS: { value: FilterTab; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function AppointmentsPage() {
  const [tab, setTab] = useState<FilterTab>('all');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [apptsRes, docsRes] = await Promise.all([
          fetch('/api/appointments'),
          fetch('/api/doctors'),
        ]);

        if (apptsRes.ok && docsRes.ok) {
          const apptsData = await apptsRes.json();
          const docsData = await docsRes.json();
          setAppointments(apptsData.appointments || []);
          setDoctors(docsData.doctors || []);
          setClinics(docsData.clinics || []);
        }
      } catch (err) {
        console.error('Failed to load appointments data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getDoctorName = (id: string) => doctors.find((d) => d.id === id)?.name ?? 'Unknown Doctor';
  const getDoctorSpecialty = (id: string) => doctors.find((d) => d.id === id)?.specialty ?? 'General Health';
  const getClinicName = (id: string) => clinics.find((c) => c.id === id)?.name ?? 'Sehha Plus Clinic';

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleCancelClick = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment slot?')) return;

    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' }),
      });

      if (res.ok) {
        // Optimistically update status in state
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
        );
      } else {
        alert('Failed to cancel appointment. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again.');
    }
  };

  const statusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'upcoming':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 shadow-sm animate-pulse-soft">
            <CalendarDays className="w-3 h-3" /> Upcoming
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50/70 text-teal-600 border border-teal-100">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-warm-gray-100 text-warm-gray-500 border border-warm-gray-200">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-warm-gray-100 text-warm-gray-500 border border-warm-gray-200">
            <XCircle className="w-3 h-3" /> No-Show
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  const filtered = tab === 'all' ? appointments : appointments.filter((a) => a.status === tab);

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-warm-gray-800 flex items-center gap-2 tracking-tight">
          <CalendarDays className="w-6 h-6 text-teal-500" />
          My Appointments
        </h1>
        <p className="text-warm-gray-500 text-sm mt-1">
          All your past and future visits in one place.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-warm-gray-400 mr-1" />
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              tab === t.value
                ? 'bg-teal-500 text-white shadow-md shadow-teal-500/10'
                : 'bg-white text-warm-gray-500 border border-warm-gray-200 hover:border-teal-300 hover:text-teal-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Appointment List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-warm-gray-200/60 text-center animate-fade-in">
          <p className="text-warm-gray-400 font-medium text-sm">No appointments to show here.</p>
          <Link 
            href="/patient/book" 
            className="inline-flex bg-teal-50 text-teal-700 border border-teal-200 font-semibold text-xs py-2 px-5 rounded-xl mt-4 hover:bg-teal-100 transition-colors"
          >
            Book your first appointment
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((appt, i) => {
            const doc = doctors.find(d => d.id === appt.doctorId);
            return (
              <div
                key={appt.id}
                className="bg-white rounded-3xl p-5 shadow-sm border border-warm-gray-200/60 hover:shadow-md transition-all duration-200 animate-slide-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Info */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-warm-gray-100 text-2xl ${
                        appt.status === 'upcoming'
                          ? 'bg-teal-50 border-teal-100'
                          : appt.status === 'completed'
                          ? 'bg-teal-50/20'
                          : 'bg-warm-gray-50'
                      }`}
                    >
                      {doc?.avatar || "👨‍⚕️"}
                    </div>
                    <div>
                      <h3 className="font-bold text-warm-gray-800 text-sm">
                        {getDoctorName(appt.doctorId)}
                      </h3>
                      <p className="text-xs text-warm-gray-500 font-medium">
                        {getDoctorSpecialty(appt.doctorId)}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-2.5 text-[11px] text-warm-gray-500 font-semibold">
                        <span className="flex items-center gap-1 bg-warm-gray-50 px-2.5 py-1 rounded-xl">
                          <MapPin className="w-3.5 h-3.5 text-warm-gray-400" />
                          {getClinicName(appt.clinicId)}
                        </span>
                        <span className="flex items-center gap-1 bg-warm-gray-50 px-2.5 py-1 rounded-xl">
                          <CalendarDays className="w-3.5 h-3.5 text-warm-gray-400" />
                          {formatDate(appt.date)}
                        </span>
                        <span className="flex items-center gap-1 bg-warm-gray-50 px-2.5 py-1 rounded-xl">
                          <Clock className="w-3.5 h-3.5 text-warm-gray-400" />
                          {appt.time}
                        </span>
                      </div>
                      {appt.notes && (
                        <p className="text-xs text-warm-gray-400 mt-2 italic bg-cream-50/50 p-2 rounded-xl border border-warm-gray-100/30">
                          Note: {appt.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status + Actions */}
                  <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                    {statusBadge(appt.status)}

                    {appt.status === 'upcoming' && (
                      <div className="flex gap-2 mt-0 sm:mt-2.5">
                        <Link
                          href={`/patient/appointments`}
                          onClick={() => alert("Please book a new slot, then cancel this one. Rescheduling options can also be managed directly by contacting our clinic support.")}
                          className="px-3 py-1.5 text-xs font-semibold text-teal-600 border border-teal-200 rounded-xl hover:bg-teal-50 transition-all active:scale-95 flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Reschedule
                        </Link>
                        <button
                          onClick={() => handleCancelClick(appt.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-coral-500 border border-coral-200 rounded-xl hover:bg-coral-50/30 transition-all active:scale-95 cursor-pointer"
                        >
                          Cancel Slot
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


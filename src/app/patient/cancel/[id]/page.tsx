'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Heart,
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Stethoscope,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';

const CANCEL_REASONS = [
  { emoji: '🚗', label: 'Getting there is tricky today' },
  { emoji: '🤒', label: 'Not feeling up to it' },
  { emoji: '📅', label: 'Something came up' },
  { emoji: '🔄', label: "I'd rather reschedule" },
  { emoji: '💭', label: 'Other / No reason needed' },
];

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/* ──────────────────────────────────────────── Floating Hearts ── */
function FloatingHearts() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {Array.from({ length: 8 }).map((_, i) => (
        <span
          key={i}
          className="absolute text-lg animate-float"
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 25}%`,
            animationDelay: `${i * 0.4}s`,
            opacity: 0.35,
          }}
        >
          {i % 2 === 0 ? '💚' : '✨'}
        </span>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────── Main Component ── */
export default function CancelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  /* Dynamic States */
  const [appointment, setAppointment] = useState<any | null>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [clinics, setClinics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const [apptsRes, docsRes] = await Promise.all([
          fetch('/api/appointments'),
          fetch('/api/doctors'),
        ]);

        if (apptsRes.ok && docsRes.ok) {
          const apptsData = await apptsRes.json();
          const docsData = await docsRes.json();

          setDoctors(docsData.doctors || []);
          setClinics(docsData.clinics || []);

          const appt = (apptsData.appointments || []).find((a: any) => a.id === id);
          if (appt) {
            setAppointment(appt);
          } else {
            setError('Appointment details could not be found.');
          }
        } else {
          setError('Failed to fetch clinic schedules.');
        }
      } catch (err) {
        console.error(err);
        setError('Network error. Unable to load appointment.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const getDoctorName = (doctorId: string) => {
    return doctors.find((d) => d.id === doctorId)?.name ?? 'Your Doctor';
  };

  const getDoctorSpecialty = (doctorId: string) => {
    return doctors.find((d) => d.id === doctorId)?.specialty ?? '';
  };

  const getClinicName = (clinicId: string) => {
    return clinics.find((c) => c.id === clinicId)?.name ?? '';
  };

  const handleCancelClick = async () => {
    setCancelling(true);
    setError(null);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel', reason: selectedReason }),
      });

      if (res.ok) {
        setStep(2);
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to cancel appointment. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection failure. Failed to cancel appointment.');
    } finally {
      setCancelling(false);
    }
  };

  /* Loading state view */
  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center bg-white rounded-3xl border border-warm-gray-200/60 p-8 max-w-xl mx-auto shadow-sm animate-fade-in font-sans">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
        <p className="text-xs text-warm-gray-400 font-semibold mt-3">Loading appointment details...</p>
      </div>
    );
  }

  /* If appointment not found or error occurred */
  if (error || !appointment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in max-w-xl mx-auto font-sans bg-white border border-warm-gray-200/60 p-8 rounded-3xl">
        <div className="w-16 h-16 rounded-2xl bg-coral-50 border border-coral-100 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-coral-500" />
        </div>
        <h2 className="text-xl font-bold text-warm-gray-800 mb-2">
          Unable to proceed
        </h2>
        <p className="text-warm-gray-500 text-xs font-semibold mb-6 max-w-xs leading-relaxed">
          {error || 'It looks like this appointment doesn\'t exist or was already handled.'}
        </p>
        <Link
          href="/patient"
          className="px-6 py-2.5 bg-teal-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-teal-600 transition-colors shadow-sm"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  /* ─── Step 1: "Life Happens" ─── */
  if (step === 1) {
    return (
      <div className="max-w-xl mx-auto animate-slide-up font-sans">
        {/* Back link */}
        <button
          onClick={() => router.back()}
          disabled={cancelling}
          className="flex items-center gap-1 text-xs font-bold text-warm-gray-400 hover:text-teal-600 mb-6 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-warm-gray-200/60 overflow-hidden">
          {/* Header */}
          <div className="bg-teal-50/60 px-6 py-8 text-center border-b border-warm-gray-100">
            <span className="text-4xl block mb-3 animate-bounce-gentle">🌿</span>
            <h1 className="text-2xl font-bold text-warm-gray-800 mb-2 tracking-tight">
              No worries at all! Life happens.
            </h1>
            <p className="text-warm-gray-500 text-xs font-medium max-w-md mx-auto leading-relaxed">
              You&apos;re about to free up this slot so someone who really needs it can
              get care. That&apos;s actually a really kind thing to do.
            </p>
          </div>

          {/* Appointment details */}
          <div className="px-6 py-5 border-b border-warm-gray-200/60 bg-cream-50/20">
            <p className="text-[10px] font-bold text-warm-gray-400 uppercase tracking-widest mb-3">
              Appointment you&apos;re freeing up
            </p>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0 border border-teal-100 text-xl">
                {doctors.find((d) => d.id === appointment.doctorId)?.avatar || "👨‍⚕️"}
              </div>
              <div>
                <h3 className="font-bold text-warm-gray-800 text-sm">
                  {getDoctorName(appointment.doctorId)}
                </h3>
                <p className="text-xs text-warm-gray-400 font-semibold">
                  {getDoctorSpecialty(appointment.doctorId)}
                </p>
                <div className="flex flex-wrap gap-2 mt-2.5 text-[11px] font-bold text-warm-gray-500">
                  <span className="flex items-center gap-1 bg-white border border-warm-gray-200/60 px-2.5 py-1 rounded-xl">
                    <CalendarDays className="w-3.5 h-3.5 text-warm-gray-400" />
                    {formatDate(appointment.date)}
                  </span>
                  <span className="flex items-center gap-1 bg-white border border-warm-gray-200/60 px-2.5 py-1 rounded-xl">
                    <Clock className="w-3.5 h-3.5 text-warm-gray-400" />
                    {appointment.time}
                  </span>
                  <span className="flex items-center gap-1 bg-white border border-warm-gray-200/60 px-2.5 py-1 rounded-xl">
                    <MapPin className="w-3.5 h-3.5 text-warm-gray-400" />
                    {getClinicName(appointment.clinicId)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Reason selection (optional) */}
          <div className="px-6 py-5">
            <p className="text-xs font-bold text-warm-gray-600 mb-3 uppercase tracking-wide">
              Mind sharing why? <span className="text-warm-gray-400">(totally optional)</span>
            </p>
            <div className="space-y-2">
              {CANCEL_REASONS.map((r) => (
                <button
                  key={r.label}
                  disabled={cancelling}
                  onClick={() =>
                    setSelectedReason(selectedReason === r.label ? null : r.label)
                  }
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-200 border cursor-pointer ${
                    selectedReason === r.label
                      ? 'bg-teal-50 border-teal-300 text-teal-700'
                      : 'bg-warm-gray-50 border-warm-gray-200/60 text-warm-gray-600 hover:bg-cream-100 hover:border-warm-gray-300'
                  }`}
                >
                  <span className="mr-2 text-sm">{r.emoji}</span>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCancelClick}
              disabled={cancelling}
              className="flex-1 px-6 py-3.5 bg-teal-500 text-white rounded-2xl font-bold hover:bg-teal-600 transition-all active:scale-98 shadow-sm hover:shadow-md text-center cursor-pointer text-xs uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {cancelling ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Freeing up...
                </>
              ) : (
                'Free Up My Slot 💚'
              )}
            </button>
            <button
              onClick={() => router.back()}
              disabled={cancelling}
              className="flex-1 px-6 py-3.5 border border-warm-gray-300 text-warm-gray-600 rounded-2xl font-bold hover:bg-warm-gray-50 transition-all active:scale-98 text-center cursor-pointer text-xs uppercase tracking-wider"
            >
              Keep My Appointment
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Step 2: Positive Confirmation ─── */
  return (
    <div className="max-w-xl mx-auto animate-scale-in font-sans">
      <div className="bg-white rounded-3xl shadow-sm border border-warm-gray-200/60 overflow-hidden relative">
        <FloatingHearts />

        <div className="px-6 py-12 text-center relative z-10">
          {/* Animated heart */}
          <div className="w-20 h-20 mx-auto mb-6 bg-teal-100 rounded-full flex items-center justify-center animate-bounce-gentle border border-teal-200">
            <Heart className="w-10 h-10 text-teal-500 fill-teal-500 animate-pulse-soft" />
          </div>

          <h1 className="text-2xl font-bold text-warm-gray-800 mb-2 tracking-tight">
            You just helped someone! 🎉
          </h1>
          <p className="text-warm-gray-500 text-xs font-semibold max-w-sm mx-auto leading-relaxed mb-2">
            Your slot has been freed up and someone on the waitlist will be
            notified. Thank you for being thoughtful!
          </p>

          {/* Sparkle row */}
          <div className="flex items-center justify-center gap-1 text-amber-400 mb-8">
            <Sparkles className="w-4 h-4 animate-pulse-soft" />
            <Sparkles className="w-5 h-5 animate-pulse-soft" style={{ animationDelay: '0.3s' }} />
            <Sparkles className="w-4 h-4 animate-pulse-soft" style={{ animationDelay: '0.6s' }} />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
            <Link
              href="/patient/book"
              className="flex-1 px-6 py-3.5 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 transition-colors shadow-sm hover:shadow-md text-center text-xs uppercase tracking-wider"
            >
              Rebook for Another Day
            </Link>
            <Link
              href="/patient"
              className="flex-1 px-6 py-3.5 border border-warm-gray-300 text-warm-gray-600 rounded-xl font-bold hover:bg-warm-gray-50 transition-colors text-center text-xs uppercase tracking-wider"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

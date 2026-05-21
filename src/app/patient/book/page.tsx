'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Stethoscope,
  Heart,
  Brain,
  Eye,
  Smile,
  Baby,
  Star,
  CalendarDays,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';

/* ── Specialty Config ── */
const SPECIALTIES = [
  { name: 'General Medicine', icon: Stethoscope, color: 'bg-teal-50 text-teal-600' },
  { name: 'Dermatology', icon: Eye, color: 'bg-coral-50 text-coral-500' },
  { name: 'Pediatrics', icon: Baby, color: 'bg-amber-50 text-amber-500' },
  { name: 'Cardiology', icon: Heart, color: 'bg-coral-50 text-coral-400' },
  { name: 'Dentistry', icon: Smile, color: 'bg-teal-50 text-teal-500' },
];

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export default function BookAppointmentPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  /* API States */
  const [doctors, setDoctors] = useState<any[]>([]);
  const [clinics, setClinics] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadSchedules() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/doctors');
      if (res.ok) {
        const data = await res.json();
        setDoctors(data.doctors || []);
        setClinics(data.clinics || []);
        setAvailableSlots(data.availableSlots || []);
      } else {
        setError('Failed to retrieve clinic schedules. Please reload.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection failed. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSchedules();
  }, []);

  const getClinicName = (id: string) => {
    return clinics.find((c) => c.id === id)?.name ?? '';
  };

  /* Derived data */
  const filteredDoctors = useMemo(
    () => (selectedSpecialty ? doctors.filter((d) => d.specialty === selectedSpecialty) : []),
    [selectedSpecialty, doctors],
  );

  const filteredSlots = useMemo(
    () =>
      selectedDoctorId
        ? availableSlots.filter((s) => s.doctorId === selectedDoctorId && s.available)
        : [],
    [selectedDoctorId, availableSlots],
  );

  const selectedDoctor = useMemo(
    () => doctors.find((d) => d.id === selectedDoctorId),
    [selectedDoctorId, doctors],
  );

  const selectedSlot = useMemo(
    () => availableSlots.find((s) => s.id === selectedSlotId),
    [selectedSlotId, availableSlots],
  );

  /* Unique dates for selected doctor's slots */
  const slotDates = useMemo(() => {
    const dates = Array.from(new Set(filteredSlots.map((s) => s.date)));
    dates.sort();
    return dates;
  }, [filteredSlots]);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const timesForDate = useMemo(
    () => filteredSlots.filter((s) => s.date === selectedDate),
    [filteredSlots, selectedDate],
  );

  /* Navigation helpers */
  const goBack = () => {
    if (step === 1) router.push('/patient');
    else {
      if (step === 3) {
        setSelectedSlotId(null);
        setSelectedDate(null);
      }
      setStep((s) => Math.max(1, s - 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedDoctor || !selectedSlot) return;

    setBookingLoading(true);
    setError(null);

    let type = 'General Consultation';
    if (selectedSpecialty === 'General Medicine') type = 'General Checkup';
    else if (selectedSpecialty === 'Dermatology') type = 'Skin Consultation';
    else if (selectedSpecialty === 'Pediatrics') type = 'Pediatric Consult';
    else if (selectedSpecialty === 'Cardiology') type = 'Cardiology Review';
    else if (selectedSpecialty === 'Dentistry') type = 'Dental Checkup';

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: selectedDoctorId,
          clinicId: selectedDoctor.clinicId,
          date: selectedSlot.date,
          time: selectedSlot.time,
          notes: 'Booked online via patient portal.',
          type,
        }),
      });

      if (res.ok) {
        setStep(4);
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to save appointment. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error. Failed to confirm booking.');
    } finally {
      setBookingLoading(false);
    }
  };

  const stepLabels = ['Specialty', 'Doctor', 'Date & Time', 'Confirm'];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in font-sans">
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={goBack}
          disabled={bookingLoading}
          className="w-9 h-9 rounded-xl bg-white border border-warm-gray-200 flex items-center justify-center text-warm-gray-500 hover:text-teal-600 hover:border-teal-300 transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-warm-gray-800 tracking-tight">Book an Appointment</h1>
          <p className="text-xs text-warm-gray-500">
            Step {step} of 4 — {stepLabels[step - 1]}
          </p>
        </div>
      </div>

      {/* ── Progress Bar ── */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              s <= step ? 'bg-teal-500' : 'bg-warm-gray-200'
            }`}
          />
        ))}
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="bg-coral-50 border border-coral-200 text-coral-600 rounded-2xl p-4 flex items-start gap-3 animate-shake">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm">Action failed</h4>
            <p className="text-xs mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* ── Loading Overlay/State ── */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center bg-white rounded-3xl border border-warm-gray-200/60 p-8">
          <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
          <p className="text-xs text-warm-gray-400 font-semibold mt-3">Loading available appointments...</p>
        </div>
      ) : (
        <>
          {/* ────────────────────── Step 1: Specialty ────────────────────── */}
          {step === 1 && (
            <div className="space-y-4 animate-slide-up">
              <p className="text-warm-gray-600 text-sm">
                What kind of care are you looking for? 🌱
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SPECIALTIES.map((spec) => {
                  const Icon = spec.icon;
                  const isSelected = selectedSpecialty === spec.name;
                  return (
                    <button
                      key={spec.name}
                      onClick={() => {
                        setSelectedSpecialty(spec.name);
                        setSelectedDoctorId(null);
                        setSelectedSlotId(null);
                        setSelectedDate(null);
                        setStep(2);
                      }}
                      className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-200 hover:shadow-md cursor-pointer ${
                        isSelected
                          ? 'border-teal-400 bg-teal-50 shadow-sm'
                          : 'border-warm-gray-200/60 bg-white hover:border-teal-300'
                      }`}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${spec.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-warm-gray-700 text-sm">{spec.name}</span>
                      <ArrowRight className="w-4 h-4 text-warm-gray-300 ml-auto" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ────────────────────── Step 2: Doctor ────────────────────── */}
          {step === 2 && (
            <div className="space-y-4 animate-slide-up">
              <p className="text-warm-gray-600 text-sm">
                Choose a doctor you&apos;d like to see for{' '}
                <span className="font-bold text-teal-600">{selectedSpecialty}</span>
              </p>

              {filteredDoctors.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center border border-warm-gray-200/60 shadow-sm">
                  <p className="text-warm-gray-400 font-medium text-sm">No doctors available for this specialty.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredDoctors.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => {
                        setSelectedDoctorId(doc.id);
                        setSelectedSlotId(null);
                        setSelectedDate(null);
                        setStep(3);
                      }}
                      className={`w-full text-left p-5 rounded-3xl border transition-all duration-200 hover:shadow-md cursor-pointer ${
                        selectedDoctorId === doc.id
                          ? 'border-teal-400 bg-teal-50 shadow-sm'
                          : 'border-warm-gray-200/60 bg-white hover:border-teal-300'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center shrink-0 border border-teal-100 text-2xl">
                          {doc.avatar || "👨‍⚕️"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-warm-gray-800 text-sm">{doc.name}</h3>
                          <p className="text-xs text-warm-gray-500 mt-1 line-clamp-2 leading-relaxed">{doc.bio}</p>
                          <div className="flex items-center gap-3 mt-3 text-[11px] font-semibold text-warm-gray-500">
                            <span className="flex items-center gap-1 text-amber-500">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              {doc.rating}
                            </span>
                            <span className="text-warm-gray-400">
                              {doc.reviewCount} reviews
                            </span>
                            <span className="flex items-center gap-1 text-warm-gray-400">
                              <MapPin className="w-3.5 h-3.5" />
                              {getClinicName(doc.clinicId)}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-warm-gray-300 mt-1 shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ────────────────────── Step 3: Date & Time ────────────────────── */}
          {step === 3 && (
            <div className="space-y-5 animate-slide-up">
              <p className="text-warm-gray-600 text-sm">
                Pick a day and time with{' '}
                <span className="font-bold text-teal-600">{selectedDoctor?.name}</span>
              </p>

              {slotDates.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center border border-warm-gray-200/60 shadow-sm">
                  <p className="text-warm-gray-400 font-medium text-sm">
                    No available slots right now. Try another doctor. 🌻
                  </p>
                </div>
              ) : (
                <>
                  {/* Date pills */}
                  <div>
                    <p className="text-xs font-semibold text-warm-gray-400 uppercase tracking-wider mb-2">
                      Available Dates
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {slotDates.map((d) => (
                        <button
                          key={d}
                          onClick={() => {
                            setSelectedDate(d);
                            setSelectedSlotId(null);
                          }}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
                            selectedDate === d
                              ? 'bg-teal-500 text-white border-teal-500 shadow-sm'
                              : 'bg-white text-warm-gray-500 border-warm-gray-200 hover:border-teal-300 hover:text-teal-600'
                          }`}
                        >
                          <CalendarDays className="w-3.5 h-3.5 inline mr-1.5" />
                          {formatDate(d)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time slots */}
                  {selectedDate && (
                    <div className="animate-fade-in">
                      <p className="text-xs font-semibold text-warm-gray-400 uppercase tracking-wider mb-2">
                        Available Times
                      </p>
                      {timesForDate.length === 0 ? (
                        <p className="text-sm text-warm-gray-500">No times for this date.</p>
                      ) : (
                        <div className="flex gap-2 flex-wrap">
                          {timesForDate.map((slot) => (
                            <button
                              key={slot.id}
                              onClick={() => setSelectedSlotId(slot.id)}
                              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
                                selectedSlotId === slot.id
                                  ? 'bg-teal-500 text-white border-teal-500 shadow-sm'
                                  : 'bg-white text-warm-gray-500 border-warm-gray-200 hover:border-teal-300 hover:text-teal-600'
                              }`}
                            >
                              <Clock className="w-3.5 h-3.5 inline mr-1.5" />
                              {slot.time}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Booking Confirmation trigger */}
                  {selectedSlotId && (
                    <div className="animate-fade-in pt-4">
                      <button
                        onClick={handleConfirmBooking}
                        disabled={bookingLoading}
                        className="w-full px-6 py-3.5 bg-teal-500 text-white rounded-2xl font-bold hover:bg-teal-600 transition-all active:scale-98 shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {bookingLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Securing Your Slot...
                          </>
                        ) : (
                          <>
                            Confirm Booking <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ────────────────────── Step 4: Confirmation ────────────────────── */}
          {step === 4 && selectedDoctor && selectedSlot && (
            <div className="space-y-6 animate-scale-in font-sans">
              <div className="bg-white rounded-3xl shadow-sm border border-warm-gray-200/60 overflow-hidden">
                {/* Success header */}
                <div className="bg-teal-50/70 px-6 py-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-teal-100 rounded-full flex items-center justify-center animate-bounce-gentle border border-teal-200">
                    <CheckCircle2 className="w-8 h-8 text-teal-500" />
                  </div>
                  <h2 className="text-xl font-bold text-warm-gray-800 tracking-tight">
                    You&apos;re all set! 🎉
                  </h2>
                  <p className="text-xs text-warm-gray-500 mt-1.5 font-medium">
                    Your appointment has been booked. We&apos;ll send you a reminder!
                  </p>
                </div>

                {/* Details */}
                <div className="px-6 py-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0 border border-teal-100 text-xl">
                      {selectedDoctor.avatar || "👨‍⚕️"}
                    </div>
                    <div>
                      <p className="font-bold text-warm-gray-800 text-sm">
                        {selectedDoctor.name}
                      </p>
                      <p className="text-xs text-warm-gray-500 font-semibold">{selectedDoctor.specialty}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold text-warm-gray-600">
                    <div className="flex items-center gap-2 bg-cream-50/50 border border-warm-gray-100 rounded-xl px-3 py-2.5">
                      <CalendarDays className="w-4 h-4 text-teal-500" />
                      {formatDate(selectedSlot.date)}
                    </div>
                    <div className="flex items-center gap-2 bg-cream-50/50 border border-warm-gray-100 rounded-xl px-3 py-2.5">
                      <Clock className="w-4 h-4 text-teal-500" />
                      {selectedSlot.time}
                    </div>
                    <div className="flex items-center gap-2 bg-cream-50/50 border border-warm-gray-100 rounded-xl px-3 py-2.5">
                      <MapPin className="w-4 h-4 text-teal-500" />
                      {getClinicName(selectedDoctor.clinicId)}
                    </div>
                  </div>

                  {/* Sparkle divider */}
                  <div className="flex items-center justify-center gap-1 text-amber-400 pt-2">
                    <Sparkles className="w-4 h-4 animate-pulse-soft" />
                    <span className="text-[11px] font-bold text-warm-gray-400">Your health matters to us</span>
                    <Sparkles className="w-4 h-4 animate-pulse-soft" style={{ animationDelay: '0.5s' }} />
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => router.push('/patient')}
                    className="flex-1 px-6 py-3 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 transition-colors shadow-sm text-center cursor-pointer text-xs uppercase tracking-wider"
                  >
                    Back to Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setStep(1);
                      setSelectedSpecialty(null);
                      setSelectedDoctorId(null);
                      setSelectedSlotId(null);
                      setSelectedDate(null);
                      loadSchedules();
                    }}
                    className="flex-1 px-6 py-3 border border-warm-gray-300 text-warm-gray-600 rounded-xl font-bold hover:bg-warm-gray-50 transition-colors text-center cursor-pointer text-xs uppercase tracking-wider"
                  >
                    Book Another
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}


'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Heart, LayoutDashboard, CalendarDays, Plus, LogOut, Loader2, User } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

const navItems = [
  { href: '/patient', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/patient/appointments', label: 'My Appointments', icon: CalendarDays },
  { href: '/patient/book', label: 'Book New', icon: Plus },
];

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    async function fetchMe() {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.patient) {
            setPatient(data.patient);
          } else {
            // Redirect to login page if no active session (handled by proxy too)
            router.push('/');
          }
        }
      } catch (err) {
        console.error('Failed to load session:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/me', { method: 'POST' });
      if (response.ok) {
        router.push('/');
      }
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  const isActive = (href: string) => {
    if (href === '/patient') return pathname === '/patient';
    return pathname.startsWith(href);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
          <p className="text-xs text-warm-gray-500 font-semibold tracking-wide uppercase">
            Loading your portal...
          </p>
        </div>
      </div>
    );
  }

  if (!patient) return null;

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col font-sans">
      {/* ── Top Navigation ── */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-warm-gray-200 sticky top-0 z-50 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/patient" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center shadow-md shadow-teal-500/10 group-hover:shadow-lg transition-all active:scale-95 duration-200">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-lg font-bold text-warm-gray-800 tracking-tight">
                Sehha<span className="text-teal-600">Plus</span>
              </span>
            </Link>

            {/* Nav links — Desktop */}
            <div className="hidden sm:flex items-center gap-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive(href)
                      ? 'bg-teal-50 text-teal-700 shadow-sm border border-teal-100/50'
                      : 'text-warm-gray-500 hover:text-teal-600 hover:bg-teal-50/30'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>

            {/* Greeting & Interactive Profile */}
            <div className="flex items-center gap-3 relative">
              <span className="text-sm font-semibold text-warm-gray-600 hidden sm:inline">
                Hi, {patient.name.split(' ')[0]}! 👋
              </span>
              
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 rounded-xl bg-teal-100/70 border border-teal-200 hover:border-teal-400 flex items-center justify-center text-teal-700 font-bold text-sm relative hover:bg-teal-100 transition-all duration-200 cursor-pointer shadow-sm hover:shadow active:scale-95"
              >
                {patient.avatar ? (
                  <span className="text-lg">{patient.avatar}</span>
                ) : (
                  patient.name.charAt(0)
                )}
              </button>

              {/* Dynamic Action Dropdown */}
              {showDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="absolute right-0 top-12 w-48 bg-white border border-warm-gray-200 rounded-2xl shadow-xl py-2 z-20 animate-scale-in">
                    <div className="px-4 py-2 border-b border-warm-gray-100">
                      <p className="text-xs font-bold text-warm-gray-800 truncate">{patient.name}</p>
                      <p className="text-[10px] text-warm-gray-400 truncate mt-0.5">{patient.phone}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-coral-500 hover:bg-coral-50/50 font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Nav links — Mobile */}
        <div className="sm:hidden flex items-center justify-around pb-2 px-2 border-t border-warm-gray-100 pt-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl text-[10px] font-bold transition-all duration-200 ${
                isActive(href)
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-warm-gray-400 hover:text-teal-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* ── Page Content ── */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 relative z-10">
        {children}
      </main>
    </div>
  );
}


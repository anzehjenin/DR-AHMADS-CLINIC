"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, ArrowRight, Loader2, ShieldCheck, HelpCircle } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to send code");
      }

      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otp }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Invalid verification code");
      }

      // Successful verification! Secure session cookie is now set.
      router.push("/patient");
    } catch (err: any) {
      setError(err.message || "Failed to verify. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-100 rounded-full blur-3xl opacity-40 pointer-events-none animate-pulse-soft"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-coral-100 rounded-full blur-3xl opacity-30 pointer-events-none animate-pulse-soft" style={{ animationDelay: "1s" }}></div>

      {/* Main Patient Login Card */}
      <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-3xl shadow-[0_8px_32px_rgba(15,169,104,0.06)] border border-warm-gray-200 p-8 relative z-10 animate-scale-in">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Heart className="w-8 h-8 text-white fill-white animate-pulse-soft" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-warm-gray-800 mb-2 tracking-tight">
          Welcome to <span className="text-teal-600">Sehha Plus</span>
        </h1>
        <p className="text-center text-warm-gray-500 mb-6 text-sm">
          Enter your number to view or manage your appointments.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-coral-50 border border-coral-200 text-coral-500 rounded-xl text-xs font-medium text-center animate-shake">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={step === "phone" ? handlePhoneSubmit : handleOtpSubmit} className="space-y-5">
          {step === "phone" ? (
            <div>
              <label className="block text-xs font-semibold text-warm-gray-500 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <div className="flex gap-2">
                <span className="inline-flex items-center px-4 rounded-xl border border-warm-gray-200 bg-warm-gray-50 text-warm-gray-600 text-sm font-semibold">
                  +962
                </span>
                <input
                  type="tel"
                  required
                  placeholder="50 123 4567"
                  disabled={loading}
                  className="flex-1 px-4 py-3.5 rounded-xl border border-warm-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all font-semibold text-warm-gray-800 shadow-sm disabled:opacity-50 text-sm"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-warm-gray-500 uppercase tracking-wider mb-2">
                Verification Code
              </label>
              <input
                type="text"
                required
                maxLength={4}
                placeholder="0 0 0 0"
                disabled={loading}
                className="w-full px-4 py-3.5 rounded-xl border border-warm-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-center tracking-[0.5em] font-bold text-lg text-warm-gray-800 shadow-sm disabled:opacity-50"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              />
              <p className="text-xs text-warm-gray-400 mt-2 text-center">
                Code sent to <span className="font-semibold">{phone}</span>
              </p>

              {/* Demo Helper Box */}
              <div className="mt-4 p-3 bg-teal-50/50 border border-teal-100 rounded-xl flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-teal-700 leading-relaxed font-medium">
                  <strong>Testing Tip:</strong> Use the verification code <strong className="bg-teal-100 px-1.5 py-0.5 rounded text-teal-800">1234</strong> to sign in securely.
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-teal-400 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-teal-500/10 active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {step === "phone" ? "Send Code" : "Sign In"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {step === "otp" && (
          <button
            onClick={() => {
              setStep("phone");
              setOtp("");
              setError(null);
            }}
            disabled={loading}
            className="w-full text-center text-xs font-semibold text-warm-gray-400 hover:text-teal-600 transition-colors mt-4 block"
          >
            ← Back to phone number
          </button>
        )}
      </div>

      {/* Trust Badge footer */}
      <div className="mt-8 flex items-center gap-1.5 text-xs text-warm-gray-400 font-medium relative z-10">
        <ShieldCheck className="w-4 h-4 text-teal-500/80" />
        <span>Securely encrypted connection</span>
      </div>
    </div>
  );
}


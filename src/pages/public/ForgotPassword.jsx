import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { forgotPasswordAPI } from '../../api/auth.api';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Please enter your email address'); return; }
    setLoading(true);
    try {
      await forgotPasswordAPI({ email });
      setSent(true);
    } catch (err) {
      // Even on error we show success to avoid email enumeration
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0a1e] to-[#1a0533] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
      <div className="w-full max-w-md relative z-10">
        {/* Brand */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-900/50">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">FreelanceRadar</span>
        </Link>

        <div className="bg-[#140d26]/80 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-2xl p-8">
          {sent ? (
            /* ── SUCCESS STATE ─────────────────────────── */
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/20">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Check your email</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                If an account with <strong className="text-white">{email}</strong> exists, we've sent a password reset link.
                The link expires in <strong className="text-white">15 minutes</strong>.
              </p>
              <p className="text-xs text-gray-500">
                Didn't receive it? Check your spam folder or{' '}
                <button
                  onClick={() => setSent(false)}
                  className="text-violet-400 hover:text-violet-300 font-medium"
                >
                  try again
                </button>
                .
              </p>
              <Link
                to="/login"
                className="block w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold text-center shadow-lg shadow-violet-900/50 hover:scale-[1.01] transition-all"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            /* ── FORM STATE ───────────────────────────── */
            <>
              <h2 className="text-2xl font-bold text-white text-center mb-1">Forgot password?</h2>
              <p className="text-sm text-gray-400 text-center mb-6">
                Enter your email and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-violet-400 transition-colors" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-violet-900/50 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : 'Send Reset Link'}
                </button>
              </form>

              <p className="text-center text-sm text-gray-400 mt-6">
                Remember your password?{' '}
                <Link to="/login" className="font-semibold text-violet-400 hover:text-violet-300">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

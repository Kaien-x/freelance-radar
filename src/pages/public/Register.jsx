import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Zap, Loader2, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMail } from "react-icons/hi";
import { FaUserTie, FaBriefcase } from "react-icons/fa";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function Register() {
  const [tab, setTab] = useState('google');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('jobseeker');
  const [loading, setLoading] = useState(false);
  const [gsiReady, setGsiReady] = useState(false);
  const googleBtnRef = useRef(null);

  const { loginWithGoogle, registerWithEmail } = useAuthStore();
  const navigate = useNavigate();

  const redirectUser = (user) => {
    if (user?.role === 'jobposter') navigate('/poster/dashboard', { replace: true });
    else if (user?.role === 'admin') navigate('/admin/dashboard', { replace: true });
    else navigate('/dashboard', { replace: true });
  };

  const handleCredentialResponse = useCallback(async (response) => {
    if (!response?.credential) {
      toast.error('Google authentication failed. Please try again.');
      return;
    }
    setLoading(true);
    try {
      const user = await loginWithGoogle(response.credential, role);
      toast.success('Account created! Welcome to FreelanceRadar 🎉');
      redirectUser(user);
    } catch (err) {
      toast.error(err?.message || 'Google sign-up failed');
    } finally {
      setLoading(false);
    }
  }, [loginWithGoogle, navigate, role]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || tab !== 'google') return;

    const init = () => {
      if (!window.google?.accounts?.id) return false;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
      });
      if (googleBtnRef.current) {
        window.google.accounts.id.renderButton(
          googleBtnRef.current,
          {
            type: 'standard',
            shape: 'pill',
            theme: 'filled_black',
            size: 'large',
            text: 'continue_with',
            width: 360,
            logo_alignment: 'left',
          }
        );
      }
      setGsiReady(true);
      return true;
    };

    if (init()) return;
    const iv = setInterval(() => { if (init()) clearInterval(iv); }, 200);
    return () => clearInterval(iv);
  }, [handleCredentialResponse, tab]);

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const user = await registerWithEmail(name, email, password, role);
      toast.success('Account created! Check your email for a verification code.');
      if (!user.isEmailVerified) {
        navigate('/verify-email', { replace: true });
        return;
      }
      redirectUser(user);
    } catch (err) {
      toast.error(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      value: "jobseeker",
      label: "I want to work",
      desc: "Find freelance opportunities",
      icon: FaUserTie,
    },
    {
      value: "jobposter",
      label: "I want to hire",
      desc: "Post jobs & find talent",
      icon: FaBriefcase,
    },
  ];

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

        {/* Card */}
        <div className="bg-[#140d26]/80 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-2xl p-8">
          <h2 className="text-2xl font-bold text-white text-center mb-1">Create account</h2>
          <p className="text-sm text-gray-400 text-center mb-6">Join thousands of freelancers today</p>

          {/* Tabs */}
          <div className="flex rounded-xl border border-white/10 p-1 mb-6 bg-white/5">
            {['google', 'email'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${tab === t ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'
                  }`}
              >
                <button>
                  <div className="flex items-center justify-center gap-2">
                    {t === "google" ? (
                      <>
                        <FcGoogle className="h-5 w-5" />
                        <span>Google</span>
                      </>
                    ) : (
                      <>
                        <HiOutlineMail className="h-5 w-5 text-violet-300" />
                        <span>Email</span>
                      </>
                    )}
                  </div>
                </button>
              </button>
            ))}
          </div>

          {/* Role selector — shown for both tabs */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              I want to…
            </p>

            <div className="grid grid-cols-2 gap-3">
              {roles.map((r) => {
                const Icon = r.icon;
                const active = role === r.value;

                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`
            relative rounded-xl p-4 text-left transition-all duration-300
            border backdrop-blur-md
            ${active
                        ? "border-violet-500/70 bg-violet-500/10 shadow-[0_0_25px_rgba(139,92,246,0.25)]"
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                      }
          `}
                  >
                    {/* Icon */}
                    <div
                      className={`
              mb-2 flex h-9 w-9 items-center justify-center rounded-lg
              ${active ? "bg-violet-500/20 text-violet-300" : "bg-white/5 text-gray-400"}
            `}
                    >
                      <Icon size={18} />
                    </div>

                    {/* Text */}
                    <p
                      className={`text-sm font-semibold ${active ? "text-violet-300" : "text-gray-200"
                        }`}
                    >
                      {r.label}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">{r.desc}</p>

                    {/* Active dot */}
                    {active && (
                      <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── GOOGLE TAB ─────────────────────────────── */}
          {tab === 'google' && (
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold">
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating account…
                </div>
              ) : (
                <div ref={googleBtnRef} className="flex justify-center w-full" style={{ minHeight: 44 }} />
              )}
              {!gsiReady && !loading && (
                <p className="text-xs text-gray-400 text-center animate-pulse">Loading Google Sign-Up…</p>
              )}
            </div>
          )}

          {/* ── EMAIL TAB ──────────────────────────────── */}
          {tab === 'email' && (
            <form onSubmit={handleEmailRegister} className="space-y-4">
              {/* Name */}
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-violet-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
                />
              </div>
              {/* Email */}
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
              {/* Password */}
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-violet-400 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password (min. 8 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Confirm Password */}
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-violet-400 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-violet-900/50 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</> : 'Create Account'}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-violet-400 hover:text-violet-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

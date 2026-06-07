import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Zap, Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMail } from "react-icons/hi";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function Login() {
  const [tab, setTab] = useState('google'); // 'google' | 'email'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gsiReady, setGsiReady] = useState(false);
  const googleBtnRef = useRef(null);

  const { loginWithGoogle, loginWithEmail } = useAuthStore();
  const navigate = useNavigate();

  const redirectUser = (user) => {
    if (user?.role === 'jobposter') navigate('/poster/dashboard', { replace: true });
    else if (user?.role === 'admin') navigate('/admin/dashboard', { replace: true });
    else navigate('/dashboard', { replace: true });
  };

  // ── Google handler ──────────────────────────────────────────────────────────
  const handleCredentialResponse = useCallback(async (response) => {
    if (!response?.credential) {
      toast.error('Google authentication failed. Please try again.');
      return;
    }
    setLoading(true);
    try {
      const user = await loginWithGoogle(response.credential);
      toast.success('Welcome back!');
      redirectUser(user);
    } catch (err) {
      toast.error(err?.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  }, [loginWithGoogle, navigate]);

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

  // ── Email handler ───────────────────────────────────────────────────────────
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const user = await loginWithEmail(email, password);
      if (!user.isEmailVerified) {
        toast.success('Please verify your email to continue.');
        navigate('/verify-email', { replace: true });
        return;
      }
      toast.success('Welcome back!');
      redirectUser(user);
    } catch (err) {
      toast.error(err?.message || 'Login failed. Please try again.');
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

        {/* Card */}
        <div className="bg-[#140d26]/80 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-2xl p-8">
          <h2 className="text-2xl font-bold text-white text-center mb-1">Welcome back</h2>
          <p className="text-sm text-gray-400 text-center mb-6">Sign in to your account to continue</p>

          {/* Tabs */}
          <div className="flex rounded-xl border border-white/10 p-1 mb-6 bg-white/5">
            {['google', 'email'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${tab === t
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
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

          {/* ── GOOGLE TAB ─────────────────────────────── */}
          {tab === 'google' && (
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold">
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                </div>
              ) : (
                <div ref={googleBtnRef} className="flex justify-center w-full" style={{ minHeight: 44 }} />
              )}
              {!gsiReady && !loading && (
                <p className="text-xs text-gray-400 text-center animate-pulse">Loading Google Sign-In…</p>
              )}
            </div>
          )}

          {/* ── EMAIL TAB ──────────────────────────────── */}
          {tab === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
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
                  placeholder="Password"
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

              {/* Forgot password */}
              <div className="text-right">
                <Link to="/forgot-password" className="text-xs text-violet-400 hover:text-violet-300 font-medium">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-violet-900/50 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : 'Sign In'}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-violet-400 hover:text-violet-300">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

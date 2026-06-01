import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Zap, Loader2, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [gsiReady, setGsiReady] = useState(false);
  const googleBtnRef = useRef(null);
  const { loginWithGoogle } = useAuthStore();
  const navigate = useNavigate();

  const handleCredentialResponse = useCallback(async (response) => {
    if (!response?.credential) {
      toast.error('Google authentication failed. Please try again.');
      return;
    }

    setLoading(true);
    try {
      const user = await loginWithGoogle(response.credential);
      toast.success('Successfully authenticated!');

      // Redirect based on role
      if (user?.role === 'jobseeker') navigate('/dashboard', { replace: true });
      else if (user?.role === 'jobposter') navigate('/poster/dashboard', { replace: true });
      else if (user?.role === 'admin') navigate('/admin/dashboard', { replace: true });
      else navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Authentication failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [loginWithGoogle, navigate]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.error('VITE_GOOGLE_CLIENT_ID is not set');
      return;
    }

    const initGoogle = () => {
      if (!window.google?.accounts?.id) return false;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
      });

      if (googleBtnRef.current) {
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          type: 'standard',
          shape: 'rectangular',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          width: 350,
          logo_alignment: 'left',
        });
      }
      setGsiReady(true);
      return true;
    };

    if (initGoogle()) return;

    const interval = setInterval(() => {
      if (initGoogle()) clearInterval(interval);
    }, 200);

    return () => clearInterval(interval);
  }, [handleCredentialResponse]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Brand */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-11 h-11 bg-violet-600 rounded-2xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">FreelanceRadar</span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="space-y-6">

            {/* Header */}
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-violet-100">
                <Shield className="h-6 w-6 text-violet-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome</h2>
              <p className="mt-1 text-sm text-gray-500">
                Sign in or create an account to continue
              </p>
            </div>

            {/* Google Button */}
            <div className="flex flex-col items-center gap-4">
              {loading ? (
                <div className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating…
                </div>
              ) : (
                <div
                  ref={googleBtnRef}
                  className="flex justify-center w-full"
                  style={{ minHeight: 44 }}
                />
              )}

              {!gsiReady && !loading && (
                <p className="text-xs text-gray-400 animate-pulse">
                  Loading Google Auth…
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-gray-400 uppercase tracking-wider">
                  Secure &amp; Private
                </span>
              </div>
            </div>

            {/* Info box */}
            <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
              <p className="text-sm text-gray-600 leading-relaxed text-center">
                We use Google to verify your identity. Your password is never stored.
                Only your name, email, and profile picture are saved.
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

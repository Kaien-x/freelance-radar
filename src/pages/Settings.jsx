import { useState } from 'react';
import { Mail, Zap, Lock, Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { updateProfileAPI } from '../api/user.api';

const cardClass = 'bg-[#1a0f2e] rounded-2xl border border-[#2d1f4e] p-5 md:p-7';

function Toggle({ enabled, onChange, disabled = false }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
        disabled ? 'bg-[#2d1f4e] cursor-not-allowed' : enabled ? 'bg-[#7c3aed]' : 'bg-[#2d1f4e]'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
          enabled && !disabled ? 'translate-x-5' : ''
        }`}
      />
    </button>
  );
}

export default function Settings() {
  const { user, refreshUser } = useAuthStore();
  const [alerts, setAlerts] = useState({
    weeklyDigest:  user?.emailAlerts?.weeklyDigest !== false,
    savedSearches: user?.emailAlerts?.savedSearches !== false,
  });
  const [saving, setSaving] = useState(false);

  const isPro = ['pro', 'agency'].includes(user?.plan);

  const save = async (next) => {
    setAlerts(next);
    setSaving(true);
    try {
      await updateProfileAPI({
        emailAlerts: {
          ...user?.emailAlerts,
          weeklyDigest:  next.weeklyDigest,
          savedSearches: next.savedSearches,
        },
      });
      await refreshUser();
      toast.success('Settings saved');
    } catch {
      toast.error('Save failed — try again');
      setAlerts(alerts); // revert on failure
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-gray-400 mt-1">Manage your email notifications</p>
      </div>

      <div className={cardClass}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#7c3aed]/15 flex items-center justify-center">
            <Bell size={18} className="text-violet-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Email notifications</h2>
        </div>

        <div className="space-y-5">
          {/* Weekly digest — free */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Mail size={17} className="text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">Weekly job digest</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Every Monday: the week's best jobs matched to your skills.
                </p>
              </div>
            </div>
            <Toggle
              enabled={alerts.weeklyDigest}
              onChange={(v) => save({ ...alerts, weeklyDigest: v })}
              disabled={saving}
            />
          </div>

          {/* Saved search alerts */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Bell size={17} className="text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">Saved search alerts</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Emails when new jobs match your saved searches.
                </p>
              </div>
            </div>
            <Toggle
              enabled={alerts.savedSearches}
              onChange={(v) => save({ ...alerts, savedSearches: v })}
              disabled={saving}
            />
          </div>

          {/* Instant alerts — Pro locked */}
          <div className="flex items-start justify-between gap-4 rounded-xl border border-violet-500/20 bg-[#12072a] p-4 -mx-1">
            <div className="flex items-start gap-3">
              <Zap size={17} className="text-violet-400 mt-0.5 shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white">Instant job match alerts</p>
                  <span className="text-[10px] font-bold uppercase tracking-wide bg-[#7c3aed] text-white px-2 py-0.5 rounded-full">Pro</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Get an email the moment a matching job is posted — before it gets buried.
                </p>
              </div>
            </div>
            {isPro ? (
              <Toggle enabled={user?.emailAlerts?.jobMatches} onChange={() => {}} disabled={saving} />
            ) : (
              <Lock size={16} className="text-gray-500 mt-1 shrink-0" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';

export default function StatsCard({ label, to, value, icon: Icon, color = 'violet', trend, dark = false }) {
  const lightColors = {
    violet: 'bg-gradient-to-br from-violet-100 to-violet-50 text-violet-700 shadow-lg shadow-violet-500/10',
    blue: 'bg-gradient-to-br from-blue-100 to-blue-50 text-blue-700 shadow-lg shadow-blue-500/10',
    green: 'bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-700 shadow-lg shadow-emerald-500/10',
    amber: 'bg-gradient-to-br from-amber-100 to-amber-50 text-amber-700 shadow-lg shadow-amber-500/10',
  };

  const darkIconColors = {
    violet: 'bg-violet-600/20 text-violet-400',
    blue: 'bg-blue-600/20 text-blue-400',
    green: 'bg-emerald-600/20 text-emerald-400',
    amber: 'bg-amber-600/20 text-amber-400',
  };

  const IconWrapper = to ? Link : 'div';
  const iconWrapperProps = to ? { to } : {};

  if (dark) {
    return (
      <div className="rounded-2xl border border-[#2d1f4e] bg-[#1a0f2e] p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-gray-400">{label}</p>
            <h3 className="mt-2 text-3xl font-bold text-white">{value}</h3>
            {trend && (
              <p className="mt-2 text-xs font-medium text-emerald-400">{trend}</p>
            )}
          </div>
          <IconWrapper
            {...iconWrapperProps}
            className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${darkIconColors[color]}`}
          >
            <Icon className="w-5 h-5" />
          </IconWrapper>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white/80 backdrop-blur-xl p-6 shadow-sm hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1 transition-all duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl rounded-full bg-violet-200/30" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <h3 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">{value}</h3>
          {trend && (
            <p className="mt-2 text-xs font-medium text-emerald-600">{trend}</p>
          )}
        </div>

        <IconWrapper
          {...iconWrapperProps}
          className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${lightColors[color]}`}
        >
          <Icon className="w-6 h-6" />
        </IconWrapper>
      </div>
    </div>
  );
}

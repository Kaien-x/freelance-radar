import { Link } from 'react-router-dom';
export default function StatsCard({ label, to, value, icon: Icon, color = 'violet', trend }) {
  const colors = {
  violet:
    "bg-gradient-to-br from-violet-100 to-violet-50 text-violet-700 shadow-lg shadow-violet-500/10",

  blue:
    "bg-gradient-to-br from-blue-100 to-blue-50 text-blue-700 shadow-lg shadow-blue-500/10",

  green:
    "bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-700 shadow-lg shadow-emerald-500/10",

  amber:
    "bg-gradient-to-br from-amber-100 to-amber-50 text-amber-700 shadow-lg shadow-amber-500/10",
};

  return (
    <div
      className="
    group relative overflow-hidden
    rounded-3xl
    border border-gray-100
    bg-white/80 backdrop-blur-xl
    p-6
    shadow-sm
    hover:shadow-xl hover:shadow-violet-500/10
    hover:-translate-y-1
    transition-all duration-300
  "
    >

      {/* glow */}
      <div className="
    absolute top-0 right-0
    w-32 h-32
    opacity-0 group-hover:opacity-100
    transition-opacity duration-500
    blur-3xl rounded-full
    bg-violet-200/30
  " />

      <div className="relative flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-gray-500">
            {label}
          </p>

          <h3 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
            {value}
          </h3>

          {trend && (
            <p className="mt-2 text-xs font-medium text-emerald-600">
              {trend}
            </p>
          )}
        </div>

        <Link
          to={to}
          className={`
        relative
        w-14 h-14 rounded-2xl
        flex items-center justify-center
        transition-all duration-300
        group-hover:scale-110
        ${colors[color]}
      `}
        >
          <Icon className="w-6 h-6" />
        </Link>

      </div>
    </div>
  );
}

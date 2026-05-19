import { Link } from 'react-router-dom';
export default function StatsCard({ label, to, value, icon: Icon, color = 'violet', trend }) {
  const colors = {
    violet: 'bg-violet-50 text-violet-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-300 ease-out">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && <p className="text-xs text-green-600 mt-1">{trend}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Link to={to}>
            <Icon className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

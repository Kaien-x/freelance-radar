import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard,
  Briefcase,
  User,
  LogOut,
  Zap,
  PlusCircle,
  List,
  Users,
  ChevronLeft,
  X,
  Mail,
  Activity,
} from 'lucide-react';

const navConfig = {
  jobseeker: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/jobs', icon: Briefcase, label: 'Browse Jobs' },
    { to: '/profile', icon: User, label: 'Profile' },
  ],
  jobposter: [
    { to: '/poster/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/poster/create-job', icon: PlusCircle, label: 'Post a Job' },
    { to: '/poster/my-jobs', icon: List, label: 'My Jobs' },
  ],
  admin: [
    { to: '/admin/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users',      icon: Users,           label: 'Users' },
    { to: '/admin/activity',   icon: Activity,        label: 'Activity' },
    { to: '/admin/waitlist',   icon: Mail,            label: 'Waitlist' },
    { to: '/admin/jobs',       icon: Briefcase,       label: 'Jobs' },
    { to: '/admin/emails',     icon: Mail,            label: 'Emails' },
  ],
};

export default function Sidebar({
  collapsed,
  onToggle,
  mobile = false,
  onClose,
}) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const nav = navConfig[user?.role] || [];
  const isDark = user?.role === 'admin' || user?.role === 'jobposter' || user?.role === 'jobseeker';

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside
      className={`
        ${mobile ? 'w-72' : collapsed ? 'w-20' : 'w-72'}
        h-screen flex flex-col transition-all duration-300 relative
        ${isDark
          ? 'bg-[#12072a] border-r border-[#2d1f4e]'
          : 'bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.03)]'
        }
      `}
    >
      <div className="px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            {!isDark && (
              <div className="absolute inset-0 bg-violet-500 blur-xl opacity-40 rounded-full" />
            )}
            <div
              onClick={onToggle}
              className={`hover:cursor-pointer relative w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg ${
                isDark
                  ? 'bg-[#7c3aed] shadow-violet-900/40'
                  : 'bg-gradient-to-br from-violet-600 to-indigo-600 shadow-violet-500/20'
              }`}
            >
              <Zap className="w-5 h-5 text-white" />
            </div>
          </div>

          {(!collapsed || mobile) && (
            <div>
              <h1 className={`font-bold text-[17px] leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <Link to={`${nav[0]?.to}`}>FreelanceRadar</Link>
              </h1>
              {user?.role === 'admin' && (
                <p className="text-xs text-gray-500 mt-1">Built by Manvendra</p>
              )}
            </div>
          )}
        </div>

        {mobile ? (
          <button
            onClick={onClose}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              isDark
                ? 'text-gray-400 hover:text-white hover:bg-[#1a0f2e]'
                : 'text-gray-400 hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        ) : !collapsed ? (
          <button
            onClick={onToggle}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              isDark
                ? 'text-gray-400 hover:bg-[#1a0f2e] hover:text-white'
                : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        ) : (
          <div onClick={onToggle} className={`${collapsed ? 'hidden' : ''} cursor-pointer`}>
            <ChevronLeft className="w-5 h-5 text-gray-400 rotate-180" />
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={mobile ? onClose : undefined}
            className={({ isActive }) =>
              isDark
                ? `group relative flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#7c3aed] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-[#1a0f2e]'
                  }`
                : `group relative flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20'
                      : 'text-gray-500 hover:bg-white hover:shadow-md hover:text-gray-900'
                  }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`flex items-center justify-center transition-transform duration-200 ${!isActive && !isDark && 'group-hover:scale-110'}`}>
                  <Icon className="w-5 h-5 shrink-0" />
                </div>
                {(!collapsed || mobile) && (
                  <span className="tracking-[0.2px]">{label}</span>
                )}
                {isActive && (!collapsed || mobile) && !isDark && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-white/80" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4">
        {(!collapsed || mobile) ? (
          <div
            className={
              isDark
                ? 'p-3 rounded-2xl bg-[#1a0f2e] border border-[#2d1f4e]'
                : 'p-3 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 shadow-sm'
            }
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center ${
                  isDark ? 'bg-[#2d1f4e] ring-2 ring-[#2d1f4e]' : 'bg-violet-100 ring-2 ring-white shadow-sm'
                }`}>
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className={`font-bold text-sm ${isDark ? 'text-violet-300' : 'text-violet-700'}`}>
                      {user?.name?.[0]}
                    </span>
                  )}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 ${isDark ? 'border-[#1a0f2e]' : 'border-white'}`} />
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {user?.name}
                </p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isDark
                  ? 'text-gray-400 hover:bg-red-500/10 hover:text-red-400'
                  : 'text-gray-500 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center transition-all ${
              isDark
                ? 'text-gray-400 hover:bg-red-500/10 hover:text-red-400'
                : 'text-gray-500 hover:bg-red-50 hover:text-red-600'
            }`}
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </aside>
  );
}

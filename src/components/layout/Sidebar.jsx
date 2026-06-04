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
  X
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
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/jobs', icon: Briefcase, label: 'Jobs' },
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

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <aside
      className={`
        ${mobile ? 'w-72' : collapsed ? 'w-20' : 'w-72'}
        h-screen
        bg-white/80 backdrop-blur-xl
        border-r border-white/20
        flex flex-col
        transition-all duration-300
        shadow-[0_0_40px_rgba(0,0,0,0.03)]
        relative
      `}
    >
      <div className="px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-violet-500 blur-xl opacity-40 rounded-full" />

            <div onClick={onToggle} className="hover:cursor-pointer relative w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
          </div>

          {(!collapsed || mobile) && (
            <div>
              <h1 className="font-bold text-gray-900 text-[17px] leading-none">
                <Link to={`${nav[0]?.to}`}>FreelanceRadar</Link>
              </h1>
            </div>
          )}
        </div>

        {mobile ? (
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        ) : !collapsed ? (
          <button
            onClick={onToggle}
            className="
              w-9 h-9 rounded-xl
              flex items-center justify-center
              text-gray-400
              hover:bg-gray-100
              hover:text-gray-700
              transition-all
            "
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        ) : (
          <div
            onClick={onToggle}
            className={`
              ${collapsed ? 'hidden' : ''}
              cursor-pointer
            `}
          >
            <ChevronLeft className="w-5 h-5 text-gray-400 rotate-180" />
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `
                group relative flex items-center
                gap-4 px-4 py-3 rounded-2xl
                text-sm font-medium
                transition-all duration-200

                ${
                  isActive
                    ? `
                      bg-gradient-to-r from-violet-600 to-indigo-600
                      text-white
                      shadow-lg shadow-violet-500/20
                    `
                    : `
                      text-gray-500
                      hover:bg-white
                      hover:shadow-md
                      hover:text-gray-900
                    `
                }
              `
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`
                    flex items-center justify-center
                    transition-transform duration-200
                    ${!isActive && 'group-hover:scale-110'}
                  `}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                </div>

                {(!collapsed || mobile) && (
                  <span className="tracking-[0.2px]">
                    {label}
                  </span>
                )}

                {isActive && (!collapsed || mobile) && (
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
            className="
              p-3 rounded-2xl
              bg-gradient-to-br from-gray-50 to-white
              border border-gray-100
              shadow-sm
            "
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl overflow-hidden bg-violet-100 flex items-center justify-center ring-2 ring-white shadow-sm">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-bold text-violet-700">
                      {user?.name?.[0]}
                    </span>
                  )}
                </div>

                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name}
                </p>

                <p className="text-xs text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="
                mt-4 w-full flex items-center justify-center gap-2
                py-2.5 rounded-xl
                text-sm font-medium
                text-gray-500
                hover:bg-red-50
                hover:text-red-600
                transition-all
              "
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="
              w-12 h-12 mx-auto
              rounded-2xl
              flex items-center justify-center
              text-gray-500
              hover:bg-red-50
              hover:text-red-600
              transition-all
            "
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </aside>
  );
}
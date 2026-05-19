import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard, Briefcase, FileText, MessageSquare,
  User, LogOut, Zap, PlusCircle, List, Users, Settings,
  ChevronLeft, Menu
} from 'lucide-react';

const navConfig = {
  jobseeker: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/jobs', icon: Briefcase, label: 'Browse Jobs' },
    { to: '/applications', icon: FileText, label: 'Applications' },
    { to: '/proposals', icon: MessageSquare, label: 'Proposals' },
    { to: '/resume', icon: FileText, label: 'Resume' },
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

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const nav = navConfig[user?.role] || [];

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-60'} bg-white border-r border-gray-100 flex flex-col transition-all duration-300 h-screen sticky top-0`}>
      
      {/* Logo */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">FreelanceRadar</span>
          </div>
        )}
        {collapsed && <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center mx-auto"><Zap className="w-4 h-4 text-white" /></div>}
        <button onClick={onToggle} className="text-gray-400 hover:text-gray-600 transition-colors ml-auto">
          {collapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="px-4 py-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize
            ${user?.role === 'admin' ? 'bg-red-50 text-red-600' :
              user?.role === 'jobposter' ? 'bg-blue-50 text-blue-600' :
              'bg-violet-50 text-violet-600'}`}>
            {user?.role}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${isActive ? 'bg-violet-50 text-violet-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
            }>
            <Icon className="w-4 h-4 shrink-0" />
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-gray-100">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 mb-1 rounded-lg bg-gray-50">
            <div className="w-7 h-7 bg-violet-100 rounded-full flex items-center justify-center text-xs font-bold text-violet-700 shrink-0">
              {user?.avatar ? (
                  <img src={`http://localhost:8008${user.avatar}`} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span>{user?.name?.[0]}</span>
                )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        )}
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors">
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  );
}

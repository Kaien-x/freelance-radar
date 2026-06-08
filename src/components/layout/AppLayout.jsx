import { useState } from 'react';
import { Menu, Zap } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Sidebar from './Sidebar';

export default function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuthStore();
  const isDarkLayout = user?.role === 'admin' || user?.role === 'jobposter' || user?.role === 'jobseeker';

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkLayout ? 'bg-[#0a0118]' : 'bg-gray-50'}`}>

      {/* Dark layout mobile top navbar */}
      {isDarkLayout && (
        <header className="md:hidden fixed top-0 left-0 right-0 z-30 h-14 bg-[#12072a] border-b border-[#2d1f4e] flex items-center px-4 gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1a0f2e] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#7c3aed] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm">FreelanceRadar</span>
          </div>
        </header>
      )}

      {/* Light layout mobile hamburger */}
      {!isDarkLayout && (
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden fixed top-4 left-4 z-[10] bg-white p-3 rounded-xl shadow-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      <div className="hidden md:block">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </div>

      <div
        onClick={() => setMobileMenuOpen(false)}
        className={`md:hidden fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      <div
        className={`md:hidden fixed top-0 left-0 z-50 h-screen transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          collapsed={false}
          mobile={true}
          onClose={() => setMobileMenuOpen(false)}
        />
      </div>

      <main className="flex-1 overflow-auto w-full min-w-0">
        <div className={`max-w-7xl mx-auto px-4 md:px-8 min-w-0 ${
          isDarkLayout ? 'pt-16 md:pt-6 pb-6' : 'p-4 md:p-6 pt-20 md:pt-6'
        }`}>
          {children}
        </div>
      </main>
    </div>
  );
}

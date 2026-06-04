import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

export default function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="
          md:hidden
          fixed top-4 left-4 z-[10]
          bg-white
          p-3
          rounded-xl
          shadow-lg
        "
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Mobile Backdrop */}
      <div
        onClick={() => setMobileMenuOpen(false)}
        className={`
          md:hidden fixed inset-0 z-40 bg-black/40
          transition-opacity duration-300
          ${
            mobileMenuOpen
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none'
          }
        `}
      />

      {/* Mobile Sliding Drawer */}
      <div
        className={`
          md:hidden
          fixed top-0 left-0 z-50
          h-screen
          transform
          transition-transform
          duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)]
          ${
            mobileMenuOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }
        `}
      >
        <Sidebar
          collapsed={false}
          mobile={true}
          onClose={() => setMobileMenuOpen(false)}
        />
      </div>

      <main className="flex-1 overflow-auto w-full">
        <div className="max-w-6xl mx-auto p-4 md:p-6 pt-20 md:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}
import { useState } from 'react';
import Sidebar from './Sidebar';

export default function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

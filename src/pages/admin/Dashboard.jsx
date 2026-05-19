import { useState } from 'react';
import StatsCard from '../../components/shared/StatsCard';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, jobs: 0, applications: 0 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Platform overview and management</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatsCard label="Total Users" value={stats.users} color="violet" />
        <StatsCard label="Total Jobs" value={stats.jobs} color="blue" />
        <StatsCard label="Applications" value={stats.applications} color="green" />
      </div>
    </div>
  );
}

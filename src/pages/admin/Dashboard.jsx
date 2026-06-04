import { useEffect, useState } from 'react';
import StatsCard from '../../components/shared/StatsCard';
import { Users, Briefcase, Building } from "lucide-react";
import { getUsersCount } from '../../api/admin.api';
import { getAllJobs } from '../../api/admin.api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, jobs: 0, applications: 0 });
  const [users, setUsers] = useState([]);
  const [totalMatch, setTotalMatch] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = { matchSkills: false };
    Promise.all([getUsersCount(), getAllJobs(params)])
      .then(([usersRes, jobsRes]) => {
        setUsers(usersRes.data.users || []);
        setStats({ users: usersRes.data.users || 0, jobs: jobsRes.data.jobs || 0, applications: 0 });
        setTotalMatch(jobsRes.data.length || 0);
      })
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Platform overview and management</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatsCard label="Total Users" value={stats.users} color="violet" icon={Users} />
        <StatsCard label="Total Jobs" value={totalMatch} color="blue" icon={Briefcase} />
        <StatsCard label="Applications" value={stats.applications} color="green" icon={Building} />
      </div>
    </div>
  );
}

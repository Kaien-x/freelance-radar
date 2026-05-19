import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Eye, PlusCircle, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import StatsCard from '../../components/shared/StatsCard';
import { getMyJobsAPI } from '../../api/jobs.api';

export default function PosterDashboard() {
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyJobsAPI().then(res => setJobs(res.data || [])).finally(() => setLoading(false));
  }, []);

  const totalApplications = jobs.reduce((sum, j) => sum + (j.applicationCount || 0), 0);
  const totalViews = jobs.reduce((sum, j) => sum + (j.views || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your job postings and applicants.</p>
        </div>
        <Link to="/poster/create-job"
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <PlusCircle className="w-4 h-4" />Post a Job
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatsCard label="Active Jobs" value={jobs.filter(j => j.status === 'open').length} icon={Briefcase} color="violet" />
        <StatsCard label="Total Applications" value={totalApplications} icon={Users} color="blue" />
        <StatsCard label="Total Views" value={totalViews} icon={Eye} color="green" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Recent Job Posts</h2>
          <Link to="/poster/my-jobs" className="text-sm text-violet-600 hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="space-y-3">
          {jobs.slice(0, 5).map(job => (
            <div key={job._id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
              <div>
                <p className="font-medium text-sm text-gray-900">{job.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{job.applicationCount} applicants · {job.views} views</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium
                  ${job.status === 'open' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                  {job.status}
                </span>
                <Link to={`/poster/applicants/${job._id}`}
                  className="text-xs text-violet-600 hover:underline">
                  View Applicants
                </Link>
              </div>
            </div>
          ))}
          {!loading && jobs.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-sm">No jobs posted yet.</p>
              <Link to="/poster/create-job" className="text-violet-600 text-sm hover:underline mt-2 block">Post your first job →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

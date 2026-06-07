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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back,{" "}
            <span className="text-violet-400">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-sm text-gray-400 mt-1">Manage your job postings and applicants.</p>
        </div>
        <Link
          to="/poster/create-job"
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" /> Post a Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatsCard label="Active Jobs" value={jobs.filter(j => j.status === 'open').length} icon={Briefcase} color="violet" dark />
        <StatsCard label="Total Applications" value={totalApplications} icon={Users} color="blue" dark />
        <StatsCard label="Total Views" value={totalViews} icon={Eye} color="green" dark />
      </div>

      {/* Recent Job Posts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-white">Recent Job Posts</h2>
            <p className="text-xs text-gray-500 mt-0.5">Your latest job listings</p>
          </div>
          <Link
            to="/poster/my-jobs"
            className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {jobs.slice(0, 5).map(job => (
            <div
              key={job._id}
              className="bg-[#1a0f2e] border border-[#2d1f4e] hover:border-violet-500/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-200"
            >
              <div className="min-w-0">
                <p className="font-medium text-sm text-white truncate">{job.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {job.applicationCount} applicants · {job.views} views
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium
                  ${job.status === 'open'
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                  }`}
                >
                  {job.status}
                </span>
                <Link
                  to={`/poster/applicants/${job._id}`}
                  className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                >
                  View Applicants
                </Link>
              </div>
            </div>
          ))}

          {!loading && jobs.length === 0 && (
            <div className="text-center py-16 bg-[#1a0f2e] border border-[#2d1f4e] rounded-xl">
              <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-6 h-6 text-violet-400" />
              </div>
              <p className="text-sm text-gray-400">No jobs posted yet.</p>
              <Link
                to="/poster/create-job"
                className="text-violet-400 hover:text-violet-300 text-sm mt-2 block transition-colors"
              >
                Post your first job →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

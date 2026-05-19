import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, MessageSquare, TrendingUp, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import StatsCard from '../../components/shared/StatsCard';
import { getJobsAPI } from '../../api/jobs.api';
import { getMyApplicationsAPI } from '../../api/applications.api';
import { JobCardSkeleton } from '../../components/ui/skeleton';
import JobCard from '../../components/shared/JobCard';

export default function SeekerDashboard() {
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getJobsAPI({ limit: 6 }), getMyApplicationsAPI()])
      .then(([jobsRes, appsRes]) => {
        setJobs(jobsRes.data.jobs || []);
        setApplications(appsRes.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const profileComplete = user?.skills?.length > 0 && user?.title && user?.bio;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Good morning, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Here's your freelance activity overview.</p>
      </div>

      {!profileComplete && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-4">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">Complete your profile to get better matches</p>
            <p className="text-xs text-amber-600">Add your bio, skills, and title to improve job matching.</p>
          </div>
          <Link to="/profile" className="text-xs bg-amber-600 text-white px-3 py-1.5 rounded-lg hover:bg-amber-700 transition-colors shrink-0">
            Complete Profile
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard label="Skill Match Jobs" to="/jobs" value={jobs?.length || 0} icon={Briefcase} color="violet" />
        <StatsCard label="Applications" to="/applications" value={applications?.length || 0} icon={FileText} color="blue" />
        <StatsCard label="Skills Added" to="/profile" value={user?.skills?.length || 0} icon={TrendingUp} color="green" />
        <StatsCard label="Proposals" to="/proposals" value="0" icon={MessageSquare} color="amber" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Recommended Jobs</h2>
          <Link to="/jobs" className="text-sm text-violet-600 hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {jobs?.length > 0 ? (
            loading ? (
              Array(jobs.length)
                .fill(0)
                .map((_, i) => <JobCardSkeleton key={i} />)
            ) : (
              jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  showMatchScore
                  onGenerateProposal={(j) =>
                    console.log("generate for", j._id)
                  }
                />
              ))
            )
          ) : (
            <div className="col-span-2 text-center py-8 text-gray-500">
              We couldn't find any jobs matching your profile. Try updating your
              skills or filters to see more matches.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

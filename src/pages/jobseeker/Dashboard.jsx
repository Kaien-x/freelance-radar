import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, MessageSquare, TrendingUp, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import StatsCard from '../../components/shared/StatsCard';
import { getJobsAPI } from '../../api/jobs.api';
import { getMyApplicationsAPI } from '../../api/applications.api';
import { JobCardSkeleton } from '../../components/ui/skeleton';
import JobCard from '../../components/shared/JobCard';

import JobDetailsModal from '../../components/jobs/JobDetailsModal';

export default function SeekerDashboard() {
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState([]);
  const [totalMatch, setTotalMatch] = useState(0);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const params = { limit: 4, matchSkills: true };
    // Always request jobs that match skills, if 0 skills backend returns 0 jobs
    Promise.all([getJobsAPI(params), getMyApplicationsAPI()])
      .then(([jobsRes, appsRes]) => {
        setJobs(jobsRes.data.jobs || []);
        setTotalMatch(jobsRes.data.total || 0);
        setApplications(appsRes.data || []);
      })
      .finally(() => setLoading(false));
  }, []);
  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const profileComplete = user?.skills?.length > 0 && user?.title && user?.bio;

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Good morning,{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              {user?.name?.split(" ")[0]}
            </span>{" "}
            👋
          </h1>

          <p className="text-gray-500 mt-2">
            Here’s your freelance activity overview.
          </p>
        </div>

      </div>

      {/* PROFILE ALERT */}
      {!profileComplete && (
        <div className="
      relative overflow-hidden
      rounded-3xl
      border border-amber-200/60
      bg-gradient-to-r from-amber-50 to-orange-50
      p-5
      flex flex-col md:flex-row md:items-center gap-4
      shadow-sm
    ">

          <div className="
        absolute top-0 right-0
        w-40 h-40
        bg-amber-200/20
        blur-3xl rounded-full
      " />

          <div className="
        w-12 h-12 rounded-2xl
        bg-amber-100
        flex items-center justify-center
        shrink-0
      ">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>

          <div className="flex-1 relative">
            <p className="font-semibold text-amber-900 text-lg">
              Complete your profile to get better matches
            </p>

            <p className="text-sm text-amber-700 mt-1">
              Add your bio, skills, and title to improve job matching.
            </p>
          </div>

          <Link
            to="/profile"
            className="
          relative
          px-5 py-3 rounded-2xl
          bg-gradient-to-r from-amber-500 to-orange-500
          text-white text-sm font-semibold
          hover:shadow-lg hover:shadow-amber-500/20
          transition-all
        "
          >
            Complete Profile
          </Link>
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <StatsCard
          label="Skill Match Jobs"
          to="/jobs"
          value={totalMatch}
          icon={Briefcase}
          color="violet"
        />
        {console.log(user)}
        <StatsCard
          label="Skills Added"
          to="/profile"
          value={user?.skills?.length || 0}
          icon={TrendingUp}
          color="green"
        />
      </div>

      {/* JOBS */}
      <div>

        <div className="flex items-center justify-between mb-5">

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Recommended Jobs
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              AI-curated opportunities based on your profile
            </p>
          </div>

          <Link
            to="/jobs"
            className="
          group flex items-center gap-2
          text-sm font-semibold text-violet-600
          hover:text-violet-700
          transition-all
        "
          >
            View all

            <ArrowRight className="
          w-4 h-4
          transition-transform
          group-hover:translate-x-1
        " />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
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
                  onSelect={handleJobSelect}
                //onGenerateProposal={(j) =>
                //console.log("generate for", j._id)
                //}
                />
              ))
            )
          ) : (
            <div className="
          col-span-2
          rounded-3xl
          border border-dashed border-gray-200
          bg-white/70
          p-14
          text-center
        ">
              <p className="text-gray-500 text-lg">
                No matching jobs found.
              </p>

              <p className="text-sm text-gray-400 mt-2">
                Update your skills or preferences to improve recommendations.
              </p>
            </div>
          )}
        </div>

      </div>
      <JobDetailsModal job={selectedJob} open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}

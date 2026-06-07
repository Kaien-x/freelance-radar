import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Pencil,
  Trash2,
  PlusCircle,
  Users,
  AlertCircle,
  RefreshCw,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getMyJobsAPI, deleteJobAPI } from '../../api/jobs.api';

const DURATION_LABELS = {
  less_1_month: 'Less than 1 month',
  '1_3_months': '1–3 months',
  '3_6_months': '3–6 months',
  '6_plus_months': '6+ months',
};

const EXPERIENCE_LABELS = {
  entry: 'Entry level',
  intermediate: 'Intermediate',
  expert: 'Expert',
};

function formatBudget(budget) {
  if (!budget || (!budget.min && !budget.max)) return null;
  const suffix = budget.type === 'hourly' ? '/hr' : '';
  if (budget.min && budget.max) return `$${budget.min} – $${budget.max}${suffix}`;
  if (budget.min) return `From $${budget.min}${suffix}`;
  if (budget.max) return `Up to $${budget.max}${suffix}`;
  return null;
}

function formatDate(date) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function StatusBadge({ status }) {
  const styles = {
    open: 'bg-green-500/10 text-green-400 border-green-500/20',
    closed: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    draft: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium border capitalize ${styles[status] || styles.closed}`}>
      {status || 'unknown'}
    </span>
  );
}

function JobCardSkeleton() {
  return (
    <div className="bg-[#1a0f2e] border border-[#2d1f4e] rounded-xl p-5 animate-pulse">
      <div className="h-4 bg-[#2d1f4e] rounded w-3/4 mb-3" />
      <div className="h-3 bg-[#2d1f4e] rounded w-1/2 mb-4" />
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="h-10 bg-[#2d1f4e] rounded-lg" />
        <div className="h-10 bg-[#2d1f4e] rounded-lg" />
      </div>
      <div className="flex gap-2">
        <div className="h-9 bg-[#2d1f4e] rounded-lg flex-1" />
        <div className="h-9 bg-[#2d1f4e] rounded-lg flex-1" />
      </div>
    </div>
  );
}

function DeleteConfirmModal({ job, onClose, onConfirm, deleting }) {
  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
      <div
        className="w-full max-w-md bg-[#1a0f2e] border border-[#2d1f4e] rounded-xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-400" />
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Delete job posting?</h3>
        <p className="text-sm text-gray-400 mb-1">
          You are about to permanently remove:
        </p>
        <p className="text-sm font-medium text-white mb-4 truncate">"{job.title}"</p>
        <p className="text-xs text-gray-500 mb-6">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={deleting}
            className="flex-1 px-4 py-2.5 border border-[#2d1f4e] rounded-lg text-sm text-gray-400 hover:text-white hover:border-gray-500 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getMyJobsAPI();
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError(err?.message || 'Failed to load your jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleDelete = async () => {
    if (!jobToDelete) return;
    setDeleting(true);
    try {
      await deleteJobAPI(jobToDelete._id);
      toast.success('Job deleted successfully');
      setJobs((prev) => prev.filter((j) => j._id !== jobToDelete._id));
      setJobToDelete(null);
    } catch (err) {
      toast.error(err?.message || 'Failed to delete job');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Jobs</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your job postings</p>
        </div>
        <Link
          to="/poster/create-job"
          className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Post New Job
        </Link>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="bg-[#1a0f2e] border border-red-500/30 rounded-xl p-8 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-white font-medium mb-1">Could not load jobs</p>
          <p className="text-sm text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchJobs}
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="bg-[#1a0f2e] border border-[#2d1f4e] rounded-xl py-16 px-6 text-center">
          <div className="w-14 h-14 bg-violet-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Briefcase className="w-7 h-7 text-violet-400" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">No jobs posted yet</h2>
          <p className="text-sm text-gray-400 max-w-sm mx-auto mb-6">
            Create your first job posting to start attracting talented freelancers to your projects.
          </p>
          <Link
            to="/poster/create-job"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Create Your First Job
          </Link>
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => {
            const salary = formatBudget(job.budget);
            return (
              <article
                key={job._id}
                className="group bg-[#1a0f2e] border border-[#2d1f4e] hover:border-violet-500/50 rounded-xl p-5 transition-all duration-200 hover:shadow-lg hover:shadow-violet-900/10 flex flex-col"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-semibold text-white leading-snug line-clamp-2 group-hover:text-violet-300 transition-colors">
                      {job.title}
                    </h2>
                    {job.category && (
                      <span className="inline-block mt-2 text-xs px-2.5 py-0.5 rounded-full bg-[#3b1f8c] text-[#a78bfa] font-medium">
                        {job.category}
                      </span>
                    )}
                  </div>
                  <StatusBadge status={job.status} />
                </div>

                <div className="grid grid-cols-2 gap-2.5 mb-4 flex-1">
                  <div className="flex items-center gap-2 text-xs text-gray-400 bg-[#12072a] border border-[#2d1f4e] rounded-lg px-3 py-2">
                    <MapPin className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                    <span className="truncate">{job.location || 'Remote'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 bg-[#12072a] border border-[#2d1f4e] rounded-lg px-3 py-2">
                    <Briefcase className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                    <span className="truncate">
                      {DURATION_LABELS[job.duration] || job.jobType || 'Freelance'}
                    </span>
                  </div>
                  {salary && (
                    <div className="flex items-center gap-2 text-xs text-gray-400 bg-[#12072a] border border-[#2d1f4e] rounded-lg px-3 py-2">
                      <DollarSign className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                      <span className="truncate">{salary}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-400 bg-[#12072a] border border-[#2d1f4e] rounded-lg px-3 py-2">
                    <Clock className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                    <span className="truncate">{formatDate(job.createdAt)}</span>
                  </div>
                </div>

                {job.experienceLevel && (
                  <p className="text-xs text-gray-500 mb-3">
                    Experience: {EXPERIENCE_LABELS[job.experienceLevel] || job.experienceLevel}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pt-3 border-t border-[#2d1f4e]">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {job.applicationCount || 0} applicants
                  </span>
                  <span>{job.views || 0} views</span>
                </div>

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => navigate(`/poster/edit-job/${job._id}`)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 border border-[#2d1f4e] rounded-lg text-sm text-gray-300 hover:text-white hover:border-violet-500/50 hover:bg-violet-500/10 transition-all"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setJobToDelete(job)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 border border-[#2d1f4e] rounded-lg text-sm text-red-400 hover:text-red-300 hover:border-red-500/30 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <DeleteConfirmModal
        job={jobToDelete}
        onClose={() => !deleting && setJobToDelete(null)}
        onConfirm={handleDelete}
        deleting={deleting}
      />
    </div>
  );
}

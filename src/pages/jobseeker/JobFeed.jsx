import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import JobCard from '../../components/shared/JobCard';
import JobDetailsModal from '../../components/jobs/JobDetailsModal';
import { getJobAPI } from '../../api/jobs.api';
import { getJobsAPI, getCategoriesAPI } from '../../api/jobs.api';
import { JobCardSkeleton } from '../../components/ui/skeleton';
import { Search, Filter, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import useTrackPage from '../../hooks/useTrackPage';

const darkInputClass =
  'w-full h-12 md:h-14 px-4 rounded-xl bg-[#12072a] border border-[#2d1f4e] text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/50 transition-all';

export default function JobFeed() {
  useTrackPage('jobs');
  const [search, setSearch] = useState('');
  const [skills, setSkills] = useState('');
  const [category, setCategory] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [matchSkills, setMatchSkills] = useState(false);

  const { isAuthenticated, user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', search, skills, category, experienceLevel, sort, page, matchSkills],
    queryFn: () => getJobsAPI({
      search,
      skills,
      category,
      experienceLevel,
      sort,
      page,
      limit: 10,
      matchSkills: matchSkills ? 'true' : 'false'
    }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['job-categories'],
    queryFn: getCategoriesAPI,
  });

  const jobs = data?.data?.jobs || [];
  const totalPages = data?.data?.pages || 1;
  const categories = categoriesData?.data || [];

  const handleJobSelect = async (job) => {
    try {
      const { data } = await getJobAPI(job._id);
      setSelectedJob(data);
    } catch (e) {
      setSelectedJob(job);
    }
    setIsModalOpen(true);
  };

  const handleFilterChange = (filterSetter, value) => {
    filterSetter(value);
    setPage(1); // Reset to first page when filters change
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Browse{" "}
            <span className="text-[#7c3aed]">Jobs</span>
          </h1>

          <p className="text-sm text-gray-400 mt-2">
            Find opportunities matched to your skills
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="rounded-2xl border border-[#2d1f4e] bg-[#1a0f2e] p-4 md:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SEARCH */}
          <div className="md:col-span-2 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#7c3aed] transition-colors" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => handleFilterChange(setSearch, e.target.value)}
              className={`${darkInputClass} pl-12`}
            />
          </div>

          {/* CATEGORY */}
          <select
            value={category}
            onChange={(e) => handleFilterChange(setCategory, e.target.value)}
            className={darkInputClass}
          >
            <option value="" className="bg-[#12072a]">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-[#12072a]">{cat}</option>
            ))}
          </select>

          {/* MATCH SKILLS TOGGLE */}
          <div className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-all ${
            matchSkills
              ? 'border-[#7c3aed]/50 bg-[#7c3aed]/10'
              : 'border-[#2d1f4e] bg-[#12072a]'
          }`}>
            <div>
              <p className="text-sm font-semibold text-white">Match my skills</p>
              <p className="text-xs text-gray-400">Only show jobs relevant to your profile</p>
            </div>

            <button
              type="button"
              onClick={() => {
                setMatchSkills(!matchSkills);
                setPage(1);
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-all duration-300 ${
                matchSkills ? 'bg-[#7c3aed]' : 'bg-[#2d1f4e]'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-300 ${
                  matchSkills ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          Array(8).fill(0).map((_, i) => <JobCardSkeleton key={i} dark />)
        ) : jobs.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-[#2d1f4e] bg-[#1a0f2e] p-12 text-center">
            <Bookmark className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No jobs found</h3>
            <p className="text-gray-400">Try adjusting your filters</p>
          </div>
        ) : (
          jobs.map((job) => (
            <JobCard key={job._id} job={job} showMatchScore onSelect={handleJobSelect} />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 px-4 py-2 border border-[#2d1f4e] rounded-lg bg-[#1a0f2e] text-gray-300 hover:border-[#7c3aed]/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex gap-1 items-center">
            {(() => {
              const pages = [];
              const maxPagesToShow = 3;

              pages.push(1);

              if (page > maxPagesToShow + 1) {
                pages.push('...');
              }

              for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
                if (!pages.includes(i)) {
                  pages.push(i);
                }
              }

              if (page < totalPages - maxPagesToShow) {
                pages.push('...');
              }

              if (totalPages > 1 && !pages.includes(totalPages)) {
                pages.push(totalPages);
              }

              return pages.map((pageNum, idx) => (
                pageNum === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">...</span>
                ) : (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      page === pageNum
                        ? 'bg-[#7c3aed] text-white'
                        : 'border border-[#2d1f4e] bg-[#1a0f2e] text-gray-300 hover:border-[#7c3aed]/50 hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              ));
            })()}
          </div>

          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1 px-4 py-2 border border-[#2d1f4e] rounded-lg bg-[#1a0f2e] text-gray-300 hover:border-[#7c3aed]/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <JobDetailsModal job={selectedJob} open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}

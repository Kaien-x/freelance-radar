import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import JobCard from '../../components/shared/JobCard';
import JobDetailsModal from '../../components/jobs/JobDetailsModal';
import { getJobsAPI } from '../../api/jobs.api';
import { JobCardSkeleton } from '../../components/ui/Skeleton';
import { Search, Filter, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';

export default function JobFeed() {
  const [search, setSearch] = useState('');
  const [skills, setSkills] = useState('');
  const [category, setCategory] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', search, skills, category, experienceLevel, sort, page],
    queryFn: () => getJobsAPI({ 
      search, 
      skills, 
      category, 
      experienceLevel, 
      sort,
      page,
      limit: 10
    }),
  });

  const jobs = data?.data?.jobs || [];
  const totalPages = data?.data?.pages || 1;

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleFilterChange = (filterSetter, value) => {
    filterSetter(value);
    setPage(1); // Reset to first page when filters change
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Browse Jobs</h1>
        <p className="text-gray-500 text-sm mt-1">Find opportunities matched to your skills</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => handleFilterChange(setSearch, e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <input
            type="text"
            placeholder="Skills (comma-separated)"
            value={skills}
            onChange={(e) => handleFilterChange(setSkills, e.target.value)}
            className="md:w-48 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <select
            value={category}
            onChange={(e) => handleFilterChange(setCategory, e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="">All Categories</option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile Development">Mobile Development</option>
            <option value="Data Science">Data Science</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
          </select>
          <select
            value={experienceLevel}
            onChange={(e) => handleFilterChange(setExperienceLevel, e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="">All Levels</option>
            <option value="entry">Entry</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
          <select
            value={sort}
            onChange={(e) => handleFilterChange(setSort, e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="budget_high">Budget: High to Low</option>
            <option value="budget_low">Budget: Low to High</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {isLoading ? (
          Array(8).fill(0).map((_, i) => <JobCardSkeleton key={i} />)
        ) : jobs.length === 0 ? (
          <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-12 text-center">
            <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          jobs.map((job) => (
            <JobCard key={job._id} job={job} showMatchScore onSelect={handleJobSelect} />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:border-violet-300 hover:bg-violet-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex gap-1 items-center">
            {(() => {
              const pages = [];
              const maxPagesToShow = 3;
              
              // Always show first page
              pages.push(1);
              
              // Show pages around current page
              if (page > maxPagesToShow + 1) {
                pages.push('...');
              }
              
              for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
                if (!pages.includes(i)) {
                  pages.push(i);
                }
              }
              
              // Show ellipsis before last page if needed
              if (page < totalPages - maxPagesToShow) {
                pages.push('...');
              }
              
              // Always show last page if more than one page
              if (totalPages > 1 && !pages.includes(totalPages)) {
                pages.push(totalPages);
              }
              
              return pages.map((pageNum, idx) => (
                pageNum === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
                ) : (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      page === pageNum
                        ? 'bg-violet-600 text-white'
                        : 'border border-gray-200 text-gray-700 hover:border-violet-300 hover:bg-violet-50'
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
            className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:border-violet-300 hover:bg-violet-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

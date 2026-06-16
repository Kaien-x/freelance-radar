import { useEffect, useState } from "react";
import { Pencil, Trash2, Search, Briefcase, ExternalLink } from "lucide-react";
import { getAllJobs } from '../../api/admin.api';
import ResponsiveTable from '../../components/shared/ResponsiveTable';

const searchInputClass =
  "w-full pl-10 pr-4 py-3 bg-[#12072a] border border-[#2d1f4e] rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/50";

const paginationBtnClass =
  "px-4 py-2 rounded-xl border border-[#2d1f4e] bg-[#1a0f2e] text-gray-300 hover:bg-[#12072a] hover:text-white disabled:opacity-50 transition-colors";

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");

  const limit = 10;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = { category: category || '', matchSkills: false  };
      const response = await getAllJobs(params);

      setJobs(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job?.title?.toLowerCase().includes(search.toLowerCase()) ||
      job?.company?.toLowerCase().includes(search.toLowerCase()) ||
      job?.location?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredJobs.length / limit);

  const paginatedJobs = filteredJobs.slice(
    (page - 1) * limit,
    page * limit
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Job Management</h1>
        <p className="text-sm text-gray-400 mt-1">Manage platform job postings</p>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-4 top-3.5 text-gray-500" />
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className={searchInputClass}
        />
      </div>

      <ResponsiveTable minWidth="min-w-[640px]">
        <thead>
          <tr className="bg-[#1a0f2e] border-b border-[#2d1f4e]">
            <th className="px-4 md:px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-400 whitespace-nowrap">Job</th>
            <th className="px-4 md:px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-400 whitespace-nowrap">Source</th>
            <th className="px-4 md:px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-400 whitespace-nowrap">Posted</th>
            <th className="px-4 md:px-6 py-4 text-right text-xs uppercase tracking-wider text-gray-400 whitespace-nowrap">Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedJobs.length === 0 ? (
            <tr>
              <td colSpan="6" className="py-10 text-center text-gray-400 bg-[#12072a]">
                No jobs found
              </td>
            </tr>
          ) : (
            paginatedJobs.map((job) => (
              <tr
                key={job._id}
                className="bg-[#12072a] border-b border-[#1e1040] hover:bg-[#1a0f2e] transition-colors"
              >
                <td className="px-4 md:px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1e1040] flex items-center justify-center text-[#a78bfa]">
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-200">{job.title}</p>
                      <p className="text-sm text-gray-400 truncate max-w-xs">
                        {job.description?.slice(0, 80)}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 md:px-6 py-4">
                  <span className="px-3 py-1 rounded-full bg-[#1e1040] text-[#a78bfa] text-sm">
                    {job.source || "Manual"}
                  </span>
                </td>

                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {job.createdAt ? (
                    <>
                      <p>{new Date(job.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{new Date(job.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</p>
                    </>
                  ) : "-"}
                </td>

                <td className="px-4 md:px-6 py-4">
                  <div className="flex justify-end gap-1">
                    <button className="p-2 rounded-lg text-[#a78bfa] hover:bg-[#7c3aed]/10 transition-colors">
                      <Pencil size={18} />
                    </button>
                    <button className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors">
                      <Trash2 size={18} />
                    </button>
                    <a
                      href={job.redditUrl}
                      className="p-2 rounded-lg text-gray-400 hover:text-[#a78bfa] hover:bg-[#7c3aed]/10 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={18} />
                    </a>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </ResponsiveTable>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-sm text-gray-400">
            Showing {paginatedJobs.length} of {filteredJobs.length} jobs
          </p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className={paginationBtnClass}>
              Previous
            </button>
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className={paginationBtnClass}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

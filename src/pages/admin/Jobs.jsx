import { useEffect, useState } from "react";
import { Pencil, Trash2, Search, Briefcase, ExternalLink } from "lucide-react";
import { getAllJobs } from '../../api/admin.api';

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
        <p className="text-gray-500">Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Job Management
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          Manage platform job postings
        </p>
      </div>

      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-3.5 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-left">Job</th>
              <th className="px-6 py-4 text-left">Source</th>
              <th className="px-6 py-4 text-left">Posted</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedJobs.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="py-10 text-center text-gray-500"
                >
                  No jobs found
                </td>
              </tr>
            ) : (
              paginatedJobs.map((job) => (
                <tr
                  key={job._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                        <Briefcase size={18} />
                      </div>

                      <div>
                        <p className="font-semibold">
                          {job.title}
                        </p>

                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {job.description?.slice(0, 80)}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                      {job.source || "Manual"}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {job.createdAt
                      ? new Date(job.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                      : "-"}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100">
                        <Pencil size={18} />
                      </button>

                      <button className="p-2 rounded-lg bg-red-50 hover:bg-red-100">
                        <Trash2 size={18} />
                      </button>
                      <a href={job.redditUrl} className="p-2 rounded-lg bg-yellow-50 hover:bg-yellow-100" target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={18} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {paginatedJobs.length} of{" "}
            {filteredJobs.length} jobs
          </p>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 border rounded-xl disabled:opacity-50"
            >
              Previous
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 border rounded-xl disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getJobApplicantsAPI, updateApplicationStatusAPI } from '../../api/applications.api';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export default function Applicants() {
  const { jobId } = useParams();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await getJobApplicantsAPI(jobId);
        setApps(data || []);
      } catch (e) {
        toast.error('Failed to load applicants');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [jobId]);

  const changeStatus = async (applicationId, newStatus) => {
    try {
      const { data } = await updateApplicationStatusAPI(applicationId, newStatus);
      setApps((prev) => prev.map(a => a._id === data._id ? data : a));
      toast.success('Status updated');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Applicants for Job</h1>
        <p className="text-gray-400 text-sm mt-1">Review and manage applications</p>
      </div>

      <div className="rounded-2xl border border-[#2d1f4e] bg-[#1a0f2e] p-6 space-y-4">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : apps.length === 0 ? (
          <p className="text-gray-400">No applications yet</p>
        ) : (
          apps.map(app => (
            <div key={app._id} className="rounded-xl border border-[#2d1f4e] p-4 bg-[#12072a]">
              <div className="flex items-start gap-4">
                <img src={app.applicant?.avatar || '/avatars/default.png'} alt="avatar" className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-semibold">{app.applicant?.name}</div>
                      <div className="text-sm text-gray-400">{app.applicant?.title || ''} • {formatDistanceToNow(new Date(app.createdAt))} ago</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${app.status === 'pending' ? 'bg-yellow-600 text-white' : app.status === 'viewed' ? 'bg-blue-600 text-white' : app.status === 'hired' ? 'bg-green-600 text-white' : 'bg-gray-500 text-white'}`}>
                        {app.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {(app.applicant?.skills || []).map((s, i) => (
                      <span key={i} className="px-2 py-1 rounded-full text-xs bg-[#1e1040] border border-[#2d1f4e] text-[#a78bfa]">{s.skill}</span>
                    ))}
                  </div>

                  <div className="mt-3 text-sm text-gray-200">
                    <div className="mb-2">
                      <div className="font-medium text-gray-300">Cover letter</div>
                      <div className="mt-2 bg-[#0f0a1e] p-3 rounded-md border border-[#2d1f4e] text-sm text-gray-200 max-h-44 overflow-auto">{app.proposal || app.coverLetter}</div>
                    </div>

                    {app.portfolioUrl && (
                      <p className="mt-2 text-sm"><a href={app.portfolioUrl} target="_blank" rel="noreferrer" className="text-[#7c3aed]">Portfolio / Work samples</a></p>
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button onClick={() => changeStatus(app._id, 'viewed')} className="px-3 py-1 rounded-lg bg-[#7c3aed] text-white text-sm">Mark Reviewed</button>
                    <button onClick={() => changeStatus(app._id, 'shortlisted')} className="px-3 py-1 rounded-lg bg-[#2d1f4e] text-white text-sm">Shortlist</button>
                    <button onClick={() => changeStatus(app._id, 'rejected')} className="px-3 py-1 rounded-lg bg-[#991b1b] text-white text-sm">Reject</button>
                    <button onClick={() => changeStatus(app._id, 'hired')} className="px-3 py-1 rounded-lg bg-green-600 text-white text-sm">Accept / Hire</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

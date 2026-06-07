import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { getJobAPI, updateJobAPI } from '../../api/jobs.api';
import toast from 'react-hot-toast';

const emptyForm = {
  title: '',
  description: '',
  skills: '',
  category: '',
  location: 'Remote',
  experienceLevel: 'intermediate',
  budget: { type: 'fixed', min: '', max: '' },
  duration: '1_3_months',
  status: 'open',
};

export default function EditJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getJobAPI(jobId);
        const job = res.data;
        setForm({
          title: job.title || '',
          description: job.description || '',
          skills: Array.isArray(job.skills) ? job.skills.join(', ') : '',
          category: job.category || '',
          location: job.location || 'Remote',
          experienceLevel: job.experienceLevel || 'intermediate',
          budget: {
            type: job.budget?.type || 'fixed',
            min: job.budget?.min ?? '',
            max: job.budget?.max ?? '',
          },
          duration: job.duration || '1_3_months',
          status: job.status || 'open',
        });
      } catch (err) {
        console.error('Failed to load job:', err);
        setError(err?.message || 'Failed to load job');
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateJobAPI(jobId, {
        ...form,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        budget: {
          type: form.budget.type,
          min: form.budget.min ? Number(form.budget.min) : 0,
          max: form.budget.max ? Number(form.budget.max) : 0,
        },
      });
      toast.success('Job updated successfully!');
      navigate('/poster/my-jobs');
    } catch (err) {
      toast.error(err?.message || 'Failed to update job');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-[#2d1f4e] bg-[#12072a] text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
        <p className="text-sm text-gray-400">Loading job details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <p className="text-white font-medium mb-2">Could not load job</p>
        <p className="text-sm text-gray-400 mb-6">{error}</p>
        <Link
          to="/poster/my-jobs"
          className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        to="/poster/my-jobs"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Jobs
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Edit Job</h1>
        <p className="text-sm text-gray-400 mt-1">Update your job posting details.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-[#1a0f2e] border border-[#2d1f4e] rounded-xl p-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Job Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="e.g. React Developer needed for SaaS project"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
          <textarea
            rows={6}
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Describe the job, requirements, and deliverables..."
            className={`${inputClass} resize-none`}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Required Skills</label>
          <input
            type="text"
            value={form.skills}
            onChange={(e) => setForm((p) => ({ ...p, skills: e.target.value }))}
            placeholder="React, Node.js, MongoDB (comma separated)"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              placeholder="Web Development"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
              placeholder="Remote"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Experience Level</label>
            <select
              value={form.experienceLevel}
              onChange={(e) => setForm((p) => ({ ...p, experienceLevel: e.target.value }))}
              className={inputClass}
            >
              <option value="entry" className="bg-[#1a0f2e]">Entry</option>
              <option value="intermediate" className="bg-[#1a0f2e]">Intermediate</option>
              <option value="expert" className="bg-[#1a0f2e]">Expert</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Duration</label>
            <select
              value={form.duration}
              onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
              className={inputClass}
            >
              <option value="less_1_month" className="bg-[#1a0f2e]">Less than 1 month</option>
              <option value="1_3_months" className="bg-[#1a0f2e]">1–3 months</option>
              <option value="3_6_months" className="bg-[#1a0f2e]">3–6 months</option>
              <option value="6_plus_months" className="bg-[#1a0f2e]">6+ months</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
            className={inputClass}
          >
            <option value="open" className="bg-[#1a0f2e]">Open</option>
            <option value="closed" className="bg-[#1a0f2e]">Closed</option>
            <option value="draft" className="bg-[#1a0f2e]">Draft</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Budget</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select
              value={form.budget.type}
              onChange={(e) => setForm((p) => ({ ...p, budget: { ...p.budget, type: e.target.value } }))}
              className={inputClass}
            >
              <option value="fixed" className="bg-[#1a0f2e]">Fixed</option>
              <option value="hourly" className="bg-[#1a0f2e]">Hourly</option>
            </select>
            <input
              type="number"
              placeholder="Min $"
              value={form.budget.min}
              onChange={(e) => setForm((p) => ({ ...p, budget: { ...p.budget, min: e.target.value } }))}
              className={inputClass}
            />
            <input
              type="number"
              placeholder="Max $"
              value={form.budget.max}
              onChange={(e) => setForm((p) => ({ ...p, budget: { ...p.budget, max: e.target.value } }))}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2 border-t border-[#2d1f4e]">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/poster/my-jobs')}
            className="px-5 py-2.5 border border-[#2d1f4e] rounded-lg text-sm text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

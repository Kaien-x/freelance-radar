import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJobAPI } from '../../api/jobs.api';
import toast from 'react-hot-toast';

export default function CreateJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', skills: '', category: '',
    location: 'Remote', experienceLevel: 'intermediate',
    budget: { type: 'fixed', min: '', max: '' },
    duration: '1_3_months', status: 'open'
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createJobAPI({
        ...form,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      });
      toast.success('Job posted successfully!');
      navigate('/poster/my-jobs');
    } catch (err) {
      toast.error(err.message || 'Failed to create job');
    } finally {
      setSaving(false);
    }
  };

  const field = (name, label, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-white mb-1.5">{label}</label>
      <input type={type} placeholder={placeholder} value={form[name]}
        onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
        required />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Post a New Job</h1>
        <p className="text-sm text-gray-400 mt-1">Fill in the details below to find the right freelancer.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Form — takes 2/3 width on desktop */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-5 bg-[#1a0f2e] border border-[#2d1f4e] rounded-xl p-6">

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Job Title</label>
              {field('title', '', 'text', 'e.g. React Developer needed for SaaS project')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
              <textarea
                rows={6}
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Describe the job, requirements, and deliverables..."
                className="w-full px-4 py-3 rounded-xl border border-[#2d1f4e] bg-[#12072a] text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Required Skills</label>
              {field('skills', '', 'text', 'React, Node.js, MongoDB (comma separated)')}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
                {field('category', '', 'text', 'Web Development')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Location</label>
                {field('location', '', 'text', 'Remote')}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Experience Level</label>
              <select
                value={form.experienceLevel}
                onChange={e => setForm(p => ({ ...p, experienceLevel: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-[#2d1f4e] bg-[#12072a] text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all"
              >
                <option value="entry" className="bg-[#1a0f2e]">Entry</option>
                <option value="intermediate" className="bg-[#1a0f2e]">Intermediate</option>
                <option value="expert" className="bg-[#1a0f2e]">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Budget</label>
              <div className="grid grid-cols-3 gap-3">
                <select
                  value={form.budget.type}
                  onChange={e => setForm(p => ({ ...p, budget: { ...p.budget, type: e.target.value } }))}
                  className="px-4 py-3 rounded-xl border border-[#2d1f4e] bg-[#12072a] text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all"
                >
                  <option value="fixed" className="bg-[#1a0f2e]">Fixed</option>
                  <option value="hourly" className="bg-[#1a0f2e]">Hourly</option>
                </select>
                <input
                  type="number"
                  placeholder="Min $"
                  value={form.budget.min}
                  onChange={e => setForm(p => ({ ...p, budget: { ...p.budget, min: e.target.value } }))}
                  className="px-4 py-3 rounded-xl border border-[#2d1f4e] bg-[#12072a] text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all"
                />
                <input
                  type="number"
                  placeholder="Max $"
                  value={form.budget.max}
                  onChange={e => setForm(p => ({ ...p, budget: { ...p.budget, max: e.target.value } }))}
                  className="px-4 py-3 rounded-xl border border-[#2d1f4e] bg-[#12072a] text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2 border-t border-[#2d1f4e]">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-colors"
              >
                {saving ? 'Posting...' : 'Post Job'}
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

        {/* Sidebar tips — fills the empty space */}
        <div className="space-y-4">

          <div className="bg-[#1a0f2e] border border-[#2d1f4e] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Tips for a great post</h3>
            <ul className="space-y-3">
              {[
                { tip: 'Be specific about the skills you need', icon: '✓' },
                { tip: 'Include a realistic budget range', icon: '✓' },
                { tip: 'Describe deliverables clearly', icon: '✓' },
                { tip: 'Mention your timeline', icon: '✓' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-violet-400 text-xs mt-0.5 font-bold">{item.icon}</span>
                  <span className="text-xs text-gray-400 leading-relaxed">{item.tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#1a0f2e] border border-[#2d1f4e] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-2">Reach</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              Your job will be visible to all freelancers on FreelancerRadar and matched to users with relevant skills.
            </p>
            <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-lg px-3 py-2">
              <span className="text-violet-400 text-lg">👥</span>
              <div>
                <p className="text-xs font-medium text-violet-300">50+ freelancers</p>
                <p className="text-xs text-gray-500">actively looking for work</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a0f2e] border border-[#2d1f4e] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-2">Posting is free</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Job postings are completely free during our early access period. Post as many jobs as you need.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

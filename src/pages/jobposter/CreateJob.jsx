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
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input type={type} placeholder={placeholder} value={form[name]}
        onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        required />
    </div>
  );

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a New Job</h1>
      <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-gray-100 rounded-2xl p-6">
        {field('title', 'Job Title', 'text', 'e.g. React Developer needed for SaaS project')}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea rows={5} value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            placeholder="Describe job, requirements, and deliverables..."
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
            required />
        </div>
        
        {field('skills', 'Required Skills', 'text', 'React, Node.js, MongoDB (comma separated)')}
        {field('category', 'Category', 'text', 'Web Development')}
        
        <div className="grid grid-cols-2 gap-4">
          {field('location', 'Location', 'text', 'Remote')}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Experience Level</label>
            <select value={form.experienceLevel} onChange={e => setForm(p => ({ ...p, experienceLevel: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
              <option value="entry">Entry</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
          <div className="grid grid-cols-3 gap-3">
            <select value={form.budget.type} onChange={e => setForm(p => ({ ...p, budget: { ...p.budget, type: e.target.value } }))}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
              <option value="fixed">Fixed</option>
              <option value="hourly">Hourly</option>
            </select>
            <input type="number" placeholder="Min $" value={form.budget.min}
              onChange={e => setForm(p => ({ ...p, budget: { ...p.budget, min: e.target.value } }))}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            <input type="number" placeholder="Max $" value={form.budget.max}
              onChange={e => setForm(p => ({ ...p, budget: { ...p.budget, max: e.target.value } }))}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-colors">
            {saving ? 'Posting...' : 'Post Job'}
          </button>
          <button type="button" onClick={() => navigate('/poster/my-jobs')}
            className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Navigate } from 'react-router-dom';
import { getAllSkills, updateSkillsAPI } from '../../api/auth.api';
import { useAuthStore } from '../../store/authStore';
import { Sparkles, Loader2, X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { getJobsAPI, getCategoriesAPI } from '../../api/jobs.api';

export default function SetupSkills() {

  const [selectedCategory, setSelectedCategory] = useState(null);

  // const categories = categoriesData?.data || [];
  // const { data: categoriesData } = useQuery({
  //   queryKey: ['job-categories'],
  //   queryFn: getCategoriesAPI,
  // });

  const normalizeSkill = (skill) =>
    skill.toLowerCase().replace(/[-\s]/g, '');

  const uniqueSkills = selectedCategory?.keywords
    ? [...new Map(
      selectedCategory.keywords.map(skill => [
        normalizeSkill(skill),
        skill
      ])
    ).values()]
    : [];
  const { data: skillsData } = useQuery({
    queryKey: ['job-skills'],
    queryFn: getAllSkills,
  });

  const categories =
    skillsData?.data
      ? Array.isArray(skillsData.data)
        ? skillsData.data
        : [skillsData.data]
      : [];
  const { user, refreshUser } = useAuthStore();
  const navigate = useNavigate();

  const [skills, setSkills] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  if (user?.role === 'jobseeker' && user?.skills?.length > 0) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleAddSkill = (skill) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (skills.map(s => s.toLowerCase()).includes(trimmed.toLowerCase())) {
      setInputValue('');
      return;
    }
    setSkills([...skills, trimmed]);
    setInputValue('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill(inputValue);
    }
  };

  const handleSave = async () => {
    if (skills.length === 0) {
      toast.error('Please add at least one skill to continue');
      return;
    }

    setLoading(true);
    try {
      await updateSkillsAPI(skills);
      await refreshUser();
      toast.success('Skills saved successfully!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Failed to save skills. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0118] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#1a0f2e] rounded-3xl border border-[#2d1f4e] p-8 md:p-12 shadow-2xl shadow-purple-950/50">

        {/* Icon */}
        <div className="mx-auto w-16 h-16 bg-[#2d1f4e] rounded-2xl flex items-center justify-center mb-6">
          <Sparkles className="w-8 h-8 text-violet-400" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-black text-white text-center mb-3">
          Let's set up your profile
        </h1>
        <p className="text-gray-400 text-center mb-10 text-base leading-relaxed">
          FreelancerRadar matches you with jobs based on your skills.{' '}
          <br className="hidden md:block" />
          Add at least one to get started.
        </p>

        {/* Input area */}
        <div className="max-w-md mx-auto mb-10">
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Your Skills
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Graphic Design, TypeScript..."
              className="w-full pl-4 pr-12 py-4 rounded-xl bg-[#12072a] border border-[#2d1f4e] text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all text-base"
            />
            <button
              onClick={() => handleAddSkill(inputValue)}
              className="absolute right-3 p-2 bg-violet-600/20 text-violet-400 rounded-lg hover:bg-violet-600/40 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Selected Skills */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 p-4 bg-[#12072a] rounded-xl border border-[#2d1f4e]">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-1.5 bg-violet-600/20 border border-violet-500/30 text-violet-300 px-3 py-1.5 rounded-lg text-sm font-medium"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Suggestions */}
          <div className="mt-8">
            {!selectedCategory ? (
              <>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Categories
                </p>

                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={`${cat.category}-${cat.weight}`}
                      onClick={() => setSelectedCategory(cat)}
                      className="px-3 py-1.5 rounded-full border border-[#2d1f4e] text-sm text-gray-400 hover:border-violet-500/50 hover:text-violet-300 hover:bg-violet-600/10 transition-all"
                    >
                      {cat.category}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Skills in {selectedCategory.category}
                  </p>

                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-xs text-violet-400 hover:text-violet-300"
                  >
                    ← Back
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="flex flex-wrap gap-2">
                    {uniqueSkills
                      .filter(skill => !skills.includes(skill))
                      .map((skill) => (
                        <button
                          key={`${selectedCategory.category}-${skill}`}
                          onClick={() => handleAddSkill(skill)}
                          className="px-3 py-1.5 rounded-full border border-[#2d1f4e] text-sm text-gray-400 hover:border-violet-500/50 hover:text-violet-300 hover:bg-violet-600/10 transition-all"
                        >
                          + {skill}
                        </button>
                      ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action area */}
        <div className="border-t border-[#2d1f4e] pt-8 mt-4">
          <button
            onClick={handleSave}
            disabled={skills.length === 0 || loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-violet-900/50 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
            ) : (
              'Complete Setup'
            )}
          </button>
          <p className="text-center text-xs text-gray-500 mt-4">
            You can always add more skills later in your profile settings.
          </p>
        </div>

      </div>
    </div>
  );
}
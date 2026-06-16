import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProfileAPI, updateProfileAPI, updateSkillsAPI,
  uploadAvatarAPI, uploadResumeAPI
} from '../../api/user.api';
import { Camera, Upload, X, Plus, Trash2, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

const cardClass = 'bg-[#1a0f2e] rounded-2xl border border-[#2d1f4e] p-5 md:p-7';
const sectionTitle = 'text-lg font-semibold text-white mb-6';
const labelClass = 'block text-sm text-gray-400 mb-1.5';
const inputClass =
  'w-full h-12 px-4 rounded-lg bg-[#12072a] border border-[#2d1f4e] text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/50 transition-all';
const selectClass =
  'w-full px-3 py-2 rounded-lg bg-[#12072a] border border-[#2d1f4e] text-white focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/50';

export default function Profile() {
  const queryClient = useQueryClient();
  const [avatarFile, setAvatarFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('intermediate');
  const [newSkillYears, setNewSkillYears] = useState('');

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [hourlyRateMin, setHourlyRateMin] = useState('');
  const [hourlyRateMax, setHourlyRateMax] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfileAPI,
  });

  const user = data?.data;

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setTitle(user.title || '');
      setWebsite(user.website || '');
      setLocation(user.location || '');
      setBio(user.bio || '');
      setHourlyRateMin(user.hourlyRate?.min || '');
      setHourlyRateMax(user.hourlyRate?.max || '');
    }
  }, [user]);

  const handleSaveProfile = () => {
    profileMutation.mutate({
      name,
      title,
      website,
      location,
      bio,
      hourlyRate: {
        min: hourlyRateMin ? Number(hourlyRateMin) : null,
        max: hourlyRateMax ? Number(hourlyRateMax) : null,
      }
    });
  };

  const profileMutation = useMutation({
    mutationFn: updateProfileAPI,
    onSuccess: async () => {
      toast.success('Profile updated');
      queryClient.invalidateQueries(['profile']);

      // Refresh user data in auth store to update sidebar
      const { refreshUser } = useAuthStore.getState();
      await refreshUser();
    },
    onError: () => toast.error('Failed to update profile'),
  });

  const skillsMutation = useMutation({
    mutationFn: updateSkillsAPI,

    onSuccess: async () => {
      toast.success('Skills updated');

      queryClient.invalidateQueries(['profile']);

      setNewSkill('');
      setNewSkillYears('');

      // refresh auth/localStorage user
      const { refreshUser } = useAuthStore.getState();
      await refreshUser();
    },

    onError: () => toast.error('Failed to update skills'),
  });

  const avatarMutation = useMutation({
    mutationFn: async (file) => {
      if (!file || !(file instanceof File)) {
        throw new Error('Invalid avatar file');
      }

      const formData = new FormData();
      formData.append('avatar', file, file.name);

      return uploadAvatarAPI(formData);
    },
    onSuccess: async () => {
      toast.success('Avatar uploaded');
      queryClient.invalidateQueries(['profile']);
      setAvatarFile(null);

      // Refresh user data in auth store to update avatar in sidebar
      const { refreshUser } = useAuthStore.getState();
      await refreshUser();
    },
    onError: (error) => {
      console.error('Avatar upload error:', error);
      toast.error('Failed to upload avatar');
    },
  });

  const resumeMutation = useMutation({
    mutationFn: async (file) => {
      if (!file || !(file instanceof File)) {
        throw new Error('Invalid resume file');
      }

      const formData = new FormData();
      formData.append('resume', file);
      return uploadResumeAPI(formData);
    },
    onSuccess: async (response) => {
      console.log('Resume upload response:', response);
      console.log('Extracted skills:', response?.data?.extractedSkills);

      toast.success('Resume uploaded and parsed successfully');

      queryClient.invalidateQueries(['profile']);

      setResumeFile(null);

      const { refreshUser } = useAuthStore.getState();

      await refreshUser();
    },
    onError: () => toast.error('Failed to upload resume'),
  });

  const handleAddSkill = () => {
    if (!newSkill) return;
    const currentSkills = user?.skills || [];
    skillsMutation.mutate([
      ...currentSkills,
      { skill: newSkill, level: newSkillLevel, years: Number(newSkillYears) || 0 }
    ]);
  };

  const handleRemoveSkill = (skillToRemove) => {
    const currentSkills = user?.skills || [];
    skillsMutation.mutate(currentSkills.filter(s => s.skill !== skillToRemove));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-[#2d1f4e] rounded w-1/3 animate-pulse" />
        <div className={`${cardClass} animate-pulse h-96`} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          My <span className="text-[#7c3aed]">Profile</span>
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Manage your professional identity and freelancer settings.
        </p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-7 items-start">
          {/* Left Column - Personal Info and Skills */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info Section */}
            <div className={cardClass}>
              <h2 className={sectionTitle}>Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., John Doe"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    readOnly
                    className={`${inputClass} bg-[#0a0118] text-gray-500 cursor-not-allowed opacity-80`}
                  />
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Email address cannot be changed.</span>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Full Stack Developer"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Website</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className={labelClass}>Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., New York, USA"
                  className={inputClass}
                />
              </div>
              <div className="mt-6">
                <label className={labelClass}>Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself and your experience..."
                  rows={4}
                  className={`${inputClass} h-auto py-3 resize-none`}
                />
              </div>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={profileMutation.isPending}
                  className="inline-flex items-center justify-center rounded-full bg-[#7c3aed] px-6 h-12 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60 transition-all"
                >
                  {profileMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

            {/* Skills Section */}
            <div className={cardClass}>
              <h2 className={sectionTitle}>Skills</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill"
                    className={`lg:col-span-5 ${inputClass} h-10`}
                  />

                  <select
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(e.target.value)}
                    className={`lg:col-span-3 ${selectClass}`}
                  >
                    <option value="beginner" className="bg-[#12072a]">Beginner</option>
                    <option value="intermediate" className="bg-[#12072a]">Intermediate</option>
                    <option value="advanced" className="bg-[#12072a]">Advanced</option>
                    <option value="expert" className="bg-[#12072a]">Expert</option>
                  </select>

                  <input
                    type="text"
                    value={newSkillYears}
                    onChange={(e) => setNewSkillYears(e.target.value)}
                    placeholder="Years"
                    className={`lg:col-span-2 ${inputClass} h-10`}
                  />

                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="lg:col-span-2 w-full px-4 py-2 bg-[#7c3aed] text-white rounded-lg hover:bg-violet-500 transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {user?.skills?.map((skill, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#7c3aed] text-white rounded-full text-sm"
                    >
                      <span className="font-medium capitalize">{skill.skill}</span>
                      <span className="text-violet-200">•</span>
                      <span className="text-xs capitalize text-violet-100">{skill.level}</span>
                      {skill.years ? <span className="text-xs text-violet-200">({skill.years}y)</span> : null}
                      <button
                        onClick={() => handleRemoveSkill(skill.skill)}
                        className="hover:text-red-300 ml-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => skillsMutation.mutate(user?.skills || [])}
                  disabled={skillsMutation.isPending}
                  className="mt-4 px-4 py-2 bg-[#7c3aed] text-white rounded-full hover:bg-violet-500 disabled:opacity-60 transition"
                >
                  Update Skills
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Avatar and Resume */}
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className={cardClass}>
              <h2 className={sectionTitle}>Avatar</h2>
              <div className="flex flex-col items-center gap-4">
                <div className="w-28 h-28 rounded-full bg-[#12072a] ring-4 ring-[#2d1f4e] overflow-hidden flex items-center justify-center">
                  {user?.avatar ? (
                    <img src={`${user.avatar}`} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="text-2xl font-bold text-[#a78bfa]">{user?.name?.[0]}</span>
                  )}
                </div>
                <label className="cursor-pointer">
                  <span className="flex items-center gap-2 px-4 py-2 border border-[#7c3aed] text-[#a78bfa] text-sm rounded-full hover:bg-[#7c3aed]/10 transition-colors">
                    <Camera className="w-4 h-4" />
                    Change Avatar
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) setAvatarFile(file);
                    }}
                    className="hidden"
                  />
                </label>
                {avatarFile && (
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-sm text-gray-400 truncate flex-1">{avatarFile.name}</span>
                    <button
                      onClick={() => avatarMutation.mutate(avatarFile)}
                      disabled={avatarMutation.isPending}
                      className="px-3 py-1 bg-[#7c3aed] text-white text-sm rounded-lg"
                    >
                      Upload
                    </button>
                    <button
                      onClick={() => setAvatarFile(null)}
                      className="px-3 py-1 border border-[#2d1f4e] text-gray-400 text-sm rounded-lg hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Resume Section */}
            {/* <div className={cardClass}>
              <h2 className={sectionTitle}>Resume</h2>
              {user?.resume ? (
                <div className="space-y-3">
                  <div className="bg-[#12072a] p-3 rounded-lg border border-[#2d1f4e]">
                    <div className="text-xs text-gray-500 text-center">
                      Uploaded: {new Date(user.resume.uploadedAt).toLocaleDateString()}
                    </div>
                    <div className="mt-2">
                      <label className="flex flex-col items-center gap-2 p-4 border border-dashed border-[#2d1f4e] rounded-xl cursor-pointer hover:border-[#7c3aed]/50 transition-colors">
                        <Upload className="w-6 h-6 text-[#7c3aed]" />
                        <span className="text-sm text-gray-300">Update Resume</span>
                        <span className="text-xs text-gray-500">PDF or Word</span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) setResumeFile(file);
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-[#2d1f4e] rounded-2xl bg-[#12072a] cursor-pointer hover:border-[#7c3aed]/50 transition-colors">
                  <Upload className="w-8 h-8 text-[#7c3aed]" />
                  <span className="text-sm text-gray-300">Upload Resume</span>
                  <span className="text-xs text-gray-500">PDF or Word</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) setResumeFile(file);
                    }}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            {resumeFile && (
              <div className="flex items-center gap-2 mt-3">
                <span className="text-sm text-gray-400 truncate flex-1">{resumeFile.name}</span>
                <button
                  onClick={() => resumeMutation.mutate(resumeFile)}
                  disabled={resumeMutation.isPending}
                  className="px-3 py-1 bg-[#7c3aed] text-white text-sm rounded-lg"
                >
                  Upload
                </button>
                <button
                  onClick={() => setResumeFile(null)}
                  className="px-3 py-1 border border-[#2d1f4e] text-gray-400 text-sm rounded-lg hover:text-white"
                >
                  Cancel
                </button>
              </div>
            )} */}
          </div>
        </div>
    </div>
  );
}

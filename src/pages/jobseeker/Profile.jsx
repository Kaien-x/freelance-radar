import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProfileAPI, updateProfileAPI, updateSkillsAPI,
  uploadAvatarAPI, uploadResumeAPI
} from '../../api/user.api';
import { Camera, Upload, X, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

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
    onSuccess: () => {
      toast.success('Skills updated');
      queryClient.invalidateQueries(['profile']);
      setNewSkill('');
      setNewSkillYears('');
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
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="bg-white rounded-xl border border-gray-100 p-8 animate-pulse h-96" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Profile</h1>

      {isLoading ? (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="animate-pulse">
              <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Info and Skills */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., John Doe"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Full Stack Developer"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Website</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., New York, USA"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Hourly Rate (Min)</label>
                  <input
                    type="number"
                    value={hourlyRateMin}
                    onChange={(e) => setHourlyRateMin(e.target.value)}
                    placeholder="e.g., 50"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Hourly Rate (Max)</label>
                  <input
                    type="number"
                    value={hourlyRateMax}
                    onChange={(e) => setHourlyRateMax(e.target.value)}
                    placeholder="e.g., 150"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself and your experience..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={profileMutation.isPending}
                  className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {profileMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <select
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                  <input
                    type="text"
                    value={newSkillYears}
                    onChange={(e) => setNewSkillYears(e.target.value)}
                    placeholder="Years"
                    className="w-16 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {user?.skills?.map((skill, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-1.5 bg-violet-50 text-violet-700 rounded-full text-sm"
                    >
                      <span className="font-medium capitalize">{skill.skill}</span>
                      <span className="text-violet-500">•</span>
                      <span className="text-xs capitalize">{skill.level}</span>
                      {skill.years && <span className="text-xs">({skill.years}y)</span>}
                      <button
                        onClick={() => handleRemoveSkill(skill.skill)}
                        className="hover:text-violet-900"
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
                  className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                >
                  Update Skills
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Avatar and Resume */}
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Avatar</h2>
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-violet-100 flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img src={`http://localhost:8008${user.avatar}`} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="text-2xl font-bold text-violet-600">{user?.name?.[0]}</span>
                  )}
                </div>
                <label className="cursor-pointer">
                  <span className="flex items-center gap-2 px-3 py-1 bg-violet-600 text-white text-sm rounded-lg">
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
                    <span className="text-sm text-gray-600 truncate flex-1">{avatarFile.name}</span>
                    <button
                      onClick={() => avatarMutation.mutate(avatarFile)}
                      disabled={avatarMutation.isPending}
                      className="px-3 py-1 bg-violet-600 text-white text-sm rounded-lg"
                    >
                      Upload
                    </button>
                    <button
                      onClick={() => setAvatarFile(null)}
                      className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Resume Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resume</h2>
              {user?.resume ? (
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 text-center">
                      Uploaded: {new Date(user.resume.uploadedAt).toLocaleDateString()}
                    </div>
                    <div className="mt-2">
                      <label className="flex flex-col items-center gap-2 p-2 border border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition-colors">
                        <Upload className="w-6 h-6 text-gray-400" />
                        <span className="text-sm text-gray-600">Update Resume</span>
                        <span className="text-xs text-gray-400">PDF or Word</span>
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
                <label className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-600">Upload Resume</span>
                  <span className="text-xs text-gray-400">PDF or Word</span>
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
                <span className="text-sm text-gray-600 truncate flex-1">{resumeFile.name}</span>
                <button
                  onClick={() => resumeMutation.mutate(resumeFile)}
                  disabled={resumeMutation.isPending}
                  className="px-3 py-1 bg-violet-600 text-white text-sm rounded-lg"
                >
                  Upload
                </button>
                <button
                  onClick={() => setResumeFile(null)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Zap, Briefcase, Search, Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'jobseeker' });
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Register form submitted:', form);
    
    try {
      const user = await register(form);
      console.log('Registration successful:', user);
      toast.success('Account created!');
      if (user.role === 'jobseeker') navigate('/dashboard');
      else if (user.role === 'jobposter') navigate('/poster/dashboard');
      else navigate('/app');
    } catch (err) {
      console.error('Registration error:', err);
      toast.error(err?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">FreelanceRadar</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Create your account</h1>
          <p className="text-sm text-gray-500 mb-6">Join thousands of freelancers and clients</p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { role: 'jobseeker', icon: Search, label: 'I want to work', desc: 'Find freelance jobs' },
              { role: 'jobposter', icon: Briefcase, label: 'I want to hire', desc: 'Post jobs & find talent' },
            ].map(({ role, icon: Icon, label, desc }) => (
              <button key={role} type="button" onClick={() => setForm(p => ({ ...p, role }))}
                className={`p-4 rounded-xl border-2 text-left transition-all
                  ${form.role === role ? 'border-violet-500 bg-violet-50' : 'border-gray-100 hover:border-gray-200'}`}>
                <Icon className={`w-5 h-5 mb-2 ${form.role === role ? 'text-violet-600' : 'text-gray-400'}`} />
                <p className={`text-sm font-semibold ${form.role === role ? 'text-violet-700' : 'text-gray-700'}`}>{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
              { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                <input type={type} placeholder={placeholder} value={form[name]}
                  onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  required />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="8+ characters" 
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account? <Link to="/login" className="text-violet-600 hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

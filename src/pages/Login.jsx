import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Zap, Loader2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    
    if (!email || !password) {
      toast.error('Please enter email and password')
      return
    }
    
    setLoading(true)
    
    try {
      const user = await login(email, password)
      toast.success('Login successful!')
      
      // Navigate based on role
      if (user?.role === 'jobseeker') navigate('/dashboard', { replace: true })
      else if (user?.role === 'jobposter') navigate('/poster/dashboard', { replace: true })
      else if (user?.role === 'admin') navigate('/admin/dashboard', { replace: true })
      else navigate('/dashboard', { replace: true })
      
    } catch (err) {
      console.error('Login error:', err)
      toast.error(err?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-11 h-11 bg-violet-600 rounded-2xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">FreelanceRadar</span>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
              <input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="you@example.com" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input 
                  id="password" 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
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
            <button 
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Sign In
            </button>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            No account? <Link to="/register" className="text-violet-600 hover:underline font-medium">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

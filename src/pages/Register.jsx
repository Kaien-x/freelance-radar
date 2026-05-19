import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Zap, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/')
      toast.success('Account created! Upload your resume to get started.')
    } catch {
      toast.error('Registration failed. Email may be taken.')
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
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Create your account</CardTitle>
            <CardDescription>Start finding freelance jobs on Reddit</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {['name', 'email', 'password'].map((field) => (
                <div key={field} className="space-y-1.5">
                  <Label htmlFor={field} className="capitalize">
                    {field}
                  </Label>
                  <Input
                    id={field}
                    type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                    value={form[field]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
                    placeholder={field === 'name' ? 'John Doe' : field === 'email' ? 'you@example.com' : '••••••••'}
                    required
                  />
                </div>
              ))}
              <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create Account — It's Free
              </Button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-4">
              Have an account? <Link to="/login" className="text-violet-600 hover:underline font-medium">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

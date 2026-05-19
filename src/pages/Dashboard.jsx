import { useQuery } from '@tanstack/react-query'
import { Briefcase, MessageSquare, TrendingUp, User, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../api/client'
import { useEffect } from 'react'

export default function Dashboard() {
  const { user, isAuthenticated, refreshUser, initializeAuth } = useAuthStore()
  
  useEffect(() => {
    console.log('Dashboard - Auth state:', { isAuthenticated, user })
    
    // Initialize auth state on component mount
    const authState = initializeAuth()
    console.log('Initialized auth state:', authState)
    
    if (isAuthenticated && !user) {
      console.log('User is authenticated but no user data, refreshing...')
      refreshUser()
    }
  }, [isAuthenticated, user, refreshUser, initializeAuth])
  
  const { data: jobs } = useQuery({ 
    queryKey: ['jobs'], 
    queryFn: () => api.get('/jobs?sort=score').then((r) => r.data),
    enabled: isAuthenticated
  })
  const { data: proposals } = useQuery({ 
    queryKey: ['proposals'], 
    queryFn: () => api.get('/proposals').then((r) => r.data),
    enabled: isAuthenticated
  })

  const stats = [
    { label: 'New Matches', value: jobs?.data?.length ?? 0, icon: Briefcase, color: 'text-violet-600 bg-violet-50' },
    { label: 'Proposals Generated', value: proposals?.data?.length ?? 0, icon: MessageSquare, color: 'text-blue-600 bg-blue-50' },
    { label: 'Profile Strength', value: `${user?.skills?.length > 0 ? 80 : 30}%`, icon: TrendingUp, color: 'text-green-600 bg-green-50' },
    { label: 'Skills Added', value: user?.skills?.length ?? 0, icon: User, color: 'text-amber-600 bg-amber-50' },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
  Good morning, {user?.name ? user.name.split(' ')[0] : 'Guest'} 👋
</h1>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening with your job search.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="pt-5">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {user?.skills?.length === 0 && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="pt-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-amber-800">Upload your resume to get started</p>
              <p className="text-sm text-amber-600 mt-1">We'll automatically extract your skills and find matching jobs.</p>
            </div>
            <Button asChild size="sm" className="bg-amber-600 hover:bg-amber-700 shrink-0">
              <Link to="/resume">Upload Now <ArrowRight className="w-3.5 h-3.5 ml-1.5" /></Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">Recent Matches</h2>
        <Link to="/jobs" className="text-sm text-violet-600 hover:underline">View all →</Link>
      </div>

      <div className="space-y-3">
        {jobs?.data?.slice(0, 3).map((match) => (
          <Card key={match.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="pt-4 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">{match.job_post?.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">r/{match.job_post?.subreddit} · {match.match_score}% match</p>
              </div>
              <Button asChild size="sm" variant="outline" className="shrink-0 ml-3">
                <Link to="/jobs">View</Link>
              </Button>
            </CardContent>
          </Card>
        ))}

        {(!jobs?.data || jobs.data.length === 0) && (
          <div className="text-center py-12 text-gray-400">
            <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No matches yet. Upload your resume and refresh jobs.</p>
          </div>
        )}
      </div>
    </div>
  )
}

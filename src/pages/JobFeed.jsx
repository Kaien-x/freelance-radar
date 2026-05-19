import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import api from '../api/client'
import JobCard from '../components/jobs/JobCard'
import toast from 'react-hot-toast'

export default function JobFeed() {
  const queryClient = useQueryClient()
  const [sort, setSort] = useState('score')
  const [refreshing, setRefreshing] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', sort],
    queryFn: () => api.get(`/jobs?sort=${sort}`).then((r) => r.data),
  })

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await api.post('/jobs/refresh')
      toast.success('Fetching new jobs... Check back in 2 minutes.')
    } finally {
      setRefreshing(false)
    }
  }

  const handleDismiss = (matchId) => {
    queryClient.setQueryData(['jobs', sort], (old) => ({
      ...old,
      data: old?.data?.filter((m) => m.id !== matchId) ?? [],
    }))
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Feed</h1>
          <p className="text-sm text-gray-500 mt-1">{data?.data?.length ?? 0} matches found for your skills</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-full">
            {['score', 'newest'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSort(s)}
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                  sort === s ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <Button size="sm" variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading && Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-3xl p-5">
            <Skeleton className="h-4 w-3/4 mb-3" />
            <Skeleton className="h-3 w-full mb-2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}

        {!isLoading && data?.data?.map((match) => (
          <JobCard key={match.id} match={match} onDismiss={handleDismiss} />
        ))}

        {!isLoading && (!data?.data || data.data.length === 0) && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">No matches found. Make sure your skills are added and try refreshing.</p>
            <Button onClick={handleRefresh} className="mt-4 bg-violet-600 hover:bg-violet-700">
              Fetch Jobs Now
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

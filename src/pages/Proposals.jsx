import { useQuery } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, ExternalLink } from 'lucide-react'
import api from '../api/client'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'

export default function Proposals() {
  const { data, isLoading } = useQuery({
    queryKey: ['proposals'],
    queryFn: () => api.get('/proposals').then((r) => r.data),
  })

  const copy = async (text) => {
    await navigator.clipboard.writeText(text)
    toast.success('Copied!')
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Proposals</h1>
      <div className="space-y-4">
        {data?.data?.map((p) => (
          <Card key={p.id}>
            <CardContent className="pt-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-medium text-sm text-gray-900 line-clamp-1">{p.job_match?.job_post?.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDistanceToNow(new Date(p.created_at))} ago</p>
                </div>
                <Badge variant="outline" className="capitalize shrink-0">{p.tone}</Badge>
              </div>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-3xl p-4 whitespace-pre-wrap">{p.content}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={() => copy(p.content)}>
                  <Copy className="w-3.5 h-3.5 mr-1.5" />Copy
                </Button>
                {p.job_match?.job_post?.url && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={p.job_match.job_post.url} target="_blank" rel="noreferrer">
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" />View Job
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {!isLoading && (!data?.data || data.data.length === 0) && (
          <div className="text-center py-16 text-gray-400 text-sm">No proposals yet. Go to Job Feed and generate your first one.</div>
        )}
      </div>
    </div>
  )
}

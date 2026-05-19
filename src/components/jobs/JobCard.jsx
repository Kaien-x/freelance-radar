import { useState } from 'react'
import { ExternalLink, Zap, X, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import ProposalModal from '../proposal/ProposalModal'
import { formatDistanceToNow } from 'date-fns'
import api from '../../api/client'

const scoreColor = (s) =>
  s >= 80 ? 'bg-green-100 text-green-700' : s >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'

export default function JobCard({ match, onDismiss }) {
  const [showProposal, setShowProposal] = useState(false)
  const { job_post: job, match_score, match_reasons } = match

  const dismiss = async () => {
    await api.post(`/jobs/${match.id}/dismiss`)
    onDismiss(match.id)
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow border border-gray-100">
        <CardContent className="pt-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">r/{job?.subreddit}</Badge>
                {job?.flair && <Badge className="text-xs bg-violet-100 text-violet-700">{job.flair}</Badge>}
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {job?.posted_at ? formatDistanceToNow(new Date(job.posted_at)) + ' ago' : ''}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">{job?.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-3">{job?.body?.slice(0, 200) || 'No description.'}</p>
              {match_reasons?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {match_reasons.slice(0, 3).map((r, i) => (
                    <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                      {r}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <div className={`text-sm font-bold px-2.5 py-1 rounded-lg ${scoreColor(match_score)}`}>{match_score}%</div>
              <button onClick={dismiss} className="text-gray-300 hover:text-gray-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0 gap-2">
          <Button size="sm" className="flex-1 bg-violet-600 hover:bg-violet-700" onClick={() => setShowProposal(true)}>
            <Zap className="w-3.5 h-3.5 mr-1.5" />Generate Proposal
          </Button>
          <Button size="sm" variant="outline" asChild>
            <a href={job?.url} target="_blank" rel="noreferrer">
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />View Post
            </a>
          </Button>
        </CardFooter>
      </Card>
      <ProposalModal open={showProposal} onClose={() => setShowProposal(false)} matchId={match.id} jobTitle={job?.title} />
    </>
  )
}

import { useState, useEffect } from 'react'
import { Loader2, Copy, RefreshCw, Check } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import api from '../../api/client'
import toast from 'react-hot-toast'

const TONES = ['professional', 'friendly', 'technical']

export default function ProposalModal({ open, onClose, matchId, jobTitle }) {
  const [proposal, setProposal] = useState('')
  const [tone, setTone] = useState('professional')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open) {
      setProposal('')
      setTone('professional')
      setLoading(false)
      setCopied(false)
    }
  }, [open])

  const generate = async (nextTone = tone) => {
    setLoading(true)
    try {
      const { data } = await api.post('/proposals/generate', { match_id: matchId, tone: nextTone })
      setProposal(data.content)
      setTone(nextTone)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Generation failed.')
    } finally {
      setLoading(false)
    }
  }

  const copy = async () => {
    if (!proposal) return
    await navigator.clipboard.writeText(proposal)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Copied!')
  }

  const changeTone = (newTone) => {
    setTone(newTone)
    if (proposal) generate(newTone)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>AI Proposal Generator</DialogTitle>
          <p className="text-sm text-gray-500 line-clamp-1">{jobTitle}</p>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => changeTone(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  tone === t
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          {!proposal && !loading && (
            <Button onClick={() => generate()} className="w-full bg-violet-600 hover:bg-violet-700 h-12">
              ✨ Generate Proposal
            </Button>
          )}
          {loading && (
            <div className="flex items-center justify-center h-28 gap-3 text-violet-600">
              <Loader2 className="animate-spin" />
              <span className="text-sm">Writing your proposal...</span>
            </div>
          )}
          {proposal && !loading && (
            <>
              <Textarea value={proposal} onChange={(e) => setProposal(e.target.value)} className="min-h-[180px] text-sm resize-none" />
              <div className="flex flex-wrap gap-2">
                <Button onClick={copy} variant="outline" className="flex-1">
                  {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button onClick={() => generate()} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />Regenerate
                </Button>
              </div>
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-2xl p-3">
                💡 Personalize before sending — edit above then copy and paste into the Reddit post comment.
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

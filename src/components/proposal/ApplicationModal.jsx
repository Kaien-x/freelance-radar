import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import { applyToJobAPI } from '@/api/applications.api'

export default function ApplicationModal({ open, onClose, jobId, onApplied }) {
  const { user } = useAuthStore();
  const [coverLetter, setCoverLetter] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) {
      setCoverLetter('')
      setPortfolioUrl('')
      setSubmitting(false)
    }
  }, [open])

  const submit = async () => {
    if (coverLetter.trim().length < 50) return toast.error('Cover letter must be at least 50 characters')
    setSubmitting(true)
    try {
      await applyToJobAPI({ jobId, coverLetter: coverLetter.trim(), portfolioUrl: portfolioUrl.trim() })
      toast.success('Application submitted! The employer will contact you if interested.')
      onClose()
      onApplied?.()
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to submit application')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose} className="z-[9999]">
      <DialogContent className="max-w-lg w-full rounded-2xl border border-[#2d1f4e] bg-[#1a0f2e] p-6">
        <DialogHeader>
          <DialogTitle>Apply to this role</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 font-medium">Why are you a good fit for this role?</label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Briefly describe your relevant experience and why you want this job..."
              className="min-h-[160px] w-full rounded-xl border border-[#2d1f4e] bg-[#12072a] px-4 py-3 text-sm text-gray-200 outline-none resize-vertical"
            />
            <p className="text-xs text-gray-400 mt-1">Minimum 50 characters</p>
          </div>

          <div>
            <label className="text-sm text-gray-300 font-medium">Portfolio or relevant work link</label>
            <input value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} placeholder="https://github.com/... or your portfolio" className="w-full rounded-xl border border-[#2d1f4e] bg-[#12072a] px-3 py-2 text-sm text-gray-200 outline-none" />
          </div>

          <div>
            <label className="text-sm text-gray-300 font-medium">Your skills</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {(user?.skills || []).map((s, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-[#3b1f8c] text-[#a78bfa] text-sm font-medium border border-[#2d1f4e]">{s.skill}</span>
              ))}
              {(!user?.skills || user.skills.length === 0) && <p className="text-sm text-gray-400">No skills listed on your profile</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={submit} className="flex-1 bg-violet-600 hover:bg-violet-700" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Application'}</Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

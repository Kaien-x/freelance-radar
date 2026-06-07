import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { MapPin, Clock, DollarSign, ExternalLink, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getEffectiveBudget, formatBudget } from '../../utils/budgetExtractor';
import ReactMarkdown from 'react-markdown';

const scrollAreaClass = `
  flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-8
  [&::-webkit-scrollbar]:w-1.5
  [&::-webkit-scrollbar-track]:bg-[#12072a]
  [&::-webkit-scrollbar-thumb]:bg-[#7c3aed]/50
  [&::-webkit-scrollbar-thumb]:rounded-full
`;

import ApplicationModal from '../proposal/ApplicationModal';
import { useAuthStore } from '../../store/authStore';

export default function JobDetailsModal({ job, open, onOpenChange }) {
  const [localJob, setLocalJob] = useState(job);
  const [showApply, setShowApply] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => setLocalJob(job), [job]);
  if (!localJob) return null;

  const effectiveBudget = getEffectiveBudget(job);
  const budgetDisplay = formatBudget(effectiveBudget);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="items-end sm:items-center p-0 sm:p-4">
      <DialogContent className="p-0 overflow-hidden w-full h-full max-h-full sm:max-w-[600px] sm:max-h-[85vh] sm:h-auto rounded-t-xl rounded-b-none sm:rounded-xl border border-[#2d1f4e] bg-[#1a0f2e] shadow-2xl flex flex-col">

        {/* HEADER */}
        <div className="border-b border-[#2d1f4e] px-4 sm:px-6 py-5 flex items-start justify-between bg-[#1a0f2e] shrink-0">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs bg-[#3b1f8c] text-[#a78bfa] px-3 py-1 rounded-full font-medium">
                {job.category || 'General'}
              </span>
            </div>

            <DialogTitle className="text-xl font-bold text-white leading-snug mt-2">
              {job.title}
            </DialogTitle>
          </div>

          <button
            onClick={() => onOpenChange(false)}
            className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TOP ACTION BAR */}
        {localJob.redditUrl ? (
          <div className="px-4 sm:px-6 py-4 border-b border-[#2d1f4e] bg-[#12072a] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
            <div>
              <p className="text-sm font-medium text-white">Interested in this role?</p>
              <p className="text-sm text-gray-400 mt-1">Open the original job post instantly</p>
            </div>

            <a href={localJob.redditUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#7c3aed] hover:bg-violet-500 text-white rounded-lg font-medium transition-all shrink-0">
              <ExternalLink className="w-4 h-4" />
              View Job
            </a>
          </div>
        ) : (
          <div className="px-4 sm:px-6 py-4 border-b border-[#2d1f4e] bg-[#12072a] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
            <div>
              <p className="text-sm font-medium text-white">Interested in this role?</p>
              <p className="text-sm text-gray-400 mt-1">Apply directly through FreelancerRadar</p>
            </div>

            <div>
              {localJob.hasApplied ? (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium">Applied</span>
              ) : (
                <button onClick={() => setShowApply(true)} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#7c3aed] hover:bg-violet-500 text-white rounded-lg font-medium transition-all shrink-0">
                  Apply Now
                </button>
              )}
            </div>
          </div>
        )}

        {/* SCROLLABLE AREA */}
          <div className={scrollAreaClass}>

          {/* INFO CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

            {job.location && (
              <div className="rounded-lg border border-[#2d1f4e] p-3 bg-[#12072a]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#a78bfa] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400">
                      Location
                    </p>
                    <p className="text-sm font-semibold text-white mt-1">
                      {job.location}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-lg border border-[#2d1f4e] p-3 bg-[#12072a]">
              <div className="flex items-start gap-3">
                <DollarSign className="w-4 h-4 text-[#a78bfa] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400">
                    Budget
                  </p>
                  <p className="text-sm font-semibold text-white mt-1">
                    {budgetDisplay}
                    {effectiveBudget?.source === 'extracted' && (
                      <span className="text-xs text-gray-500 ml-1 font-normal">
                        (from post)
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-[#2d1f4e] p-3 bg-[#12072a]">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#a78bfa] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400">
                    Posted
                  </p>
                  <p className="text-sm font-semibold text-white mt-1">
                    {formatDistanceToNow(new Date(job.createdAt))} ago
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <h3 className="text-base font-semibold text-white pb-2 mb-4 border-b border-[#2d1f4e]">
              Description
            </h3>

            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  ul: ({ children }) => (
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-6 space-y-2 mb-4">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-[1.7] text-sm text-gray-300">
                      {children}
                    </li>
                  ),
                  p: ({ children }) => (
                    <p className="mb-4 text-sm text-gray-300 leading-[1.7]">
                      {children}
                    </p>
                  ),
                  strong: ({ children }) => (
                    <strong className="text-white font-semibold">{children}</strong>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-base font-semibold text-white mb-3 mt-4">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-base font-semibold text-white mb-3 mt-4">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm font-semibold text-white mb-2 mt-3">{children}</h3>
                  ),
                }}
              >
                {job.description}
              </ReactMarkdown>
            </div>
          </div>

          {/* SKILLS */}
          {job.skills?.length > 0 && (
            <div>
              <h3 className="text-base font-semibold text-white pb-2 mb-4 border-b border-[#2d1f4e]">
                Required Skills
              </h3>

              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-full bg-[#3b1f8c] text-[#a78bfa] text-sm font-medium border border-[#2d1f4e]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* PROJECT SCOPE */}
          {job.scope && (
            <div>
              <h3 className="text-base font-semibold text-white pb-2 mb-3 border-b border-[#2d1f4e]">
                Project Scope
              </h3>

              <p className="text-sm leading-[1.7] text-gray-300">
                {job.scope}
              </p>
            </div>
          )}

        </div>

        <ApplicationModal open={showApply} onClose={() => setShowApply(false)} jobId={localJob._id} onApplied={() => setLocalJob({ ...localJob, hasApplied: true })} />

      </DialogContent>
    </Dialog>
  );
}

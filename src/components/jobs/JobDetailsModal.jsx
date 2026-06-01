import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { MapPin, Clock, DollarSign, ExternalLink, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getEffectiveBudget, formatBudget } from '../../utils/budgetExtractor';
import ReactMarkdown from 'react-markdown'

export default function JobDetailsModal({ job, open, onOpenChange }) {
  if (!job) return null;

  const effectiveBudget = getEffectiveBudget(job);
  const budgetDisplay = formatBudget(effectiveBudget);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden max-w-4xl w-full h-[90vh] rounded-3xl border-0 flex flex-col">

        {/* HEADER */}
        <div className="border-b border-gray-100 px-6 py-5 flex items-start justify-between bg-white">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="text-xs bg-violet-100 text-violet-700 px-3 py-1 rounded-full font-medium">
                {job.category || "General"}
              </span>
            </div>

            <DialogTitle className="text-2xl font-bold text-gray-900 leading-snug">
              {job.title}
            </DialogTitle>
          </div>

          <button
            onClick={() => onOpenChange(false)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* TOP ACTION BAR */}
        {job.redditUrl && (
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Interested in this role?
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Open the original job post instantly
              </p>
            </div>

            <a
              href={job.redditUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-all shadow-sm"
            >
              <ExternalLink className="w-4 h-4" />
              View Job
            </a>
          </div>
        )}

        {/* ONLY SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">

          {/* INFO CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {job.location && (
              <div className="rounded-2xl border border-gray-100 p-4 bg-gray-50">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-violet-500 mt-0.5" />

                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Location
                    </p>

                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {job.location}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-gray-100 p-4 bg-gray-50">
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-green-500 mt-0.5" />

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Budget
                  </p>

                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {budgetDisplay}

                    {effectiveBudget?.source === "extracted" && (
                      <span className="text-xs text-gray-400 ml-1">
                        (from post)
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 p-4 bg-gray-50">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-orange-500 mt-0.5" />

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Posted
                  </p>

                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {formatDistanceToNow(new Date(job.createdAt))} ago
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Description
            </h3>

            <div className="prose prose-sm max-w-none text-gray-700 prose-p:mb-4 prose-li:mb-2 prose-ul:mb-4 prose-ol:mb-4 prose-headings:text-gray-900 prose-strong:text-gray-900">
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
                    <li className="leading-7 text-gray-700">
                      {children}
                    </li>
                  ),

                  p: ({ children }) => (
                    <p className="mb-4 leading-7 text-gray-700">
                      {children}
                    </p>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Required Skills
              </h3>

              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-2 rounded-xl bg-violet-50 text-violet-700 text-sm font-medium border border-violet-100"
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
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Project Scope
              </h3>

              <p className="text-sm leading-7 text-gray-600">
                {job.scope}
              </p>
            </div>
          )}

        </div>

      </DialogContent>
    </Dialog>
  );
}

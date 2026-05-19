import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { MapPin, Clock, DollarSign, ExternalLink, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getEffectiveBudget, formatBudget } from '../../utils/budgetExtractor';

export default function JobDetailsModal({ job, open, onOpenChange }) {
  if (!job) return null;

  const effectiveBudget = getEffectiveBudget(job);
  const budgetDisplay = formatBudget(effectiveBudget);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-start justify-between mb-0 rounded-t-3xl z-10">
          <DialogHeader>
            <DialogTitle>{job.title}</DialogTitle>
          </DialogHeader>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="px-6 pb-6 pt-4 space-y-6">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs bg-violet-50 text-violet-600 px-3 py-1 rounded-full font-medium">
              {job.category || 'General'}
            </span>
            {job.experienceLevel && (
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full capitalize">
                {job.experienceLevel}
              </span>
            )}
          </div>

          {/* Key Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {job.location && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
                  <p className="text-sm font-medium text-gray-900">{job.location}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Budget</p>
                <p className="text-sm font-medium text-gray-900">
                  {budgetDisplay}
                  {effectiveBudget?.source === 'extracted' && (
                    <span className="text-xs text-gray-400 ml-1">(from post)</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Posted</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDistanceToNow(new Date(job.createdAt))} ago
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          {/* Skills */}
          {job.skills?.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map(skill => (
                  <span
                    key={skill}
                    className="text-xs bg-gray-50 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-md hover:border-violet-300 hover:bg-violet-50 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Details */}
          {job.scope && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Project Scope</h3>
              <p className="text-sm text-gray-600">{job.scope}</p>
            </div>
          )}

          {/* Reddit Link */}
          {job.redditUrl && (
            <div className="pt-4 border-t border-gray-100">
              <a
                href={job.redditUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View on Reddit
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

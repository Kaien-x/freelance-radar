import { MapPin, Clock, DollarSign } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getEffectiveBudget, formatBudget } from '../../utils/budgetExtractor';
import ReactMarkdown from 'react-markdown';

const CATEGORY_COLORS = {
  'Web Development': 'bg-blue-950/60 text-blue-400 border-blue-800/50',
  Design: 'bg-pink-950/60 text-pink-400 border-pink-800/50',
  'Data Science': 'bg-yellow-950/60 text-yellow-400 border-yellow-800/50',
  DevOps: 'bg-orange-950/60 text-orange-400 border-orange-800/50',
  Blockchain: 'bg-cyan-950/60 text-cyan-400 border-cyan-800/50',
  'Content Writing': 'bg-green-950/60 text-green-400 border-green-800/50',
  'Game Dev': 'bg-red-950/60 text-red-400 border-red-800/50',
  Cybersecurity: 'bg-rose-950/60 text-rose-400 border-rose-800/50',
  QA: 'bg-indigo-950/60 text-indigo-400 border-indigo-800/50',
  General: 'bg-gray-800/60 text-gray-400 border-gray-700/50',
  'AI Training': 'bg-violet-950/60 text-violet-400 border-violet-800/50',
  'Virtual Assistant': 'bg-teal-950/60 text-teal-400 border-teal-800/50',
};

const defaultCategoryStyle = 'bg-[#1e1040] text-[#a78bfa] border-[#2d1f4e]';

export default function JobCard({ job, onApply, onGenerateProposal, onSelect, showMatchScore = false }) {
  const effectiveBudget = getEffectiveBudget(job);
  const budgetDisplay = formatBudget(effectiveBudget);
  const category = job.category || 'General';
  const categoryStyle = CATEGORY_COLORS[category] || defaultCategoryStyle;

  return (
    <div
      onClick={() => onSelect?.(job)}
      className="group relative overflow-hidden rounded-2xl border border-[#2d1f4e] bg-[#1a0f2e] p-5 md:p-6 transition-all duration-300 hover:border-[#7c3aed]/60 hover:shadow-lg hover:shadow-violet-900/20 cursor-pointer"
    >
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${categoryStyle}`}>
              {category}
            </span>

            {showMatchScore && job.matchScore > 0 && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  job.matchScore >= 80
                    ? 'bg-[#052e16] text-[#4ade80]'
                    : job.matchScore >= 50
                      ? 'bg-amber-950/50 text-amber-400'
                      : 'bg-[#1e1040] text-gray-400'
                }`}
              >
                {job.matchScore}% Match
              </span>
            )}
          </div>

          <a
            href={job.redditUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-white leading-snug line-clamp-2 group-hover:text-[#a78bfa] transition-colors">
              {job.title}
            </h3>
          </a>

          <p className="mt-2 text-sm leading-relaxed text-gray-400 line-clamp-3">
            <ReactMarkdown>{job.description}</ReactMarkdown>
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-gray-400">
            {job.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {job.location}
              </span>
            )}

            <span className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" />
              {budgetDisplay}
            </span>

            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {formatDistanceToNow(new Date(job.createdAt))} ago
            </span>
          </div>

          {job.skills?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {job.skills.slice(0, 5).map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#12072a] border border-[#2d1f4e] text-gray-400"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

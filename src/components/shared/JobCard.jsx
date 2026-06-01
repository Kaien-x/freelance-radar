import { MapPin, Clock, DollarSign, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getEffectiveBudget, formatBudget } from '../../utils/budgetExtractor';
import ReactMarkdown from 'react-markdown'

export default function JobCard({ job, onApply, onGenerateProposal, onSelect, showMatchScore = false }) {
  const effectiveBudget = getEffectiveBudget(job);
  const budgetDisplay = formatBudget(effectiveBudget);

  return (
    <div
      onClick={() => onSelect?.(job)}
      className="
    group relative overflow-hidden
    rounded-3xl
    border border-gray-100
    bg-white/80 backdrop-blur-xl
    p-6
    transition-all duration-300
    hover:-translate-y-1
    hover:shadow-2xl hover:shadow-violet-500/10
    hover:border-violet-200
    cursor-pointer
  "
    >

      {/* glow effect */}
      <div className="
    absolute top-0 right-0
    w-40 h-40
    bg-violet-200/20
    blur-3xl rounded-full
    opacity-0 group-hover:opacity-100
    transition-opacity duration-500
  " />

      <div className="relative flex items-start justify-between gap-4">

        <div className="flex-1 min-w-0">

          {/* TAGS */}
          <div className="flex flex-wrap items-center gap-2 mb-4">

            <span className="
          px-3 py-1 rounded-full
          text-xs font-semibold
          bg-gradient-to-r from-violet-100 to-violet-50
          text-violet-700
        ">
              {job.category || "General"}
            </span>

            {showMatchScore && job.matchScore > 0 && (
              <span
                className={`
              px-3 py-1 rounded-full
              text-xs font-bold
              ${job.matchScore >= 80
                    ? "bg-emerald-100 text-emerald-700"
                    : job.matchScore >= 50
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-100 text-gray-500"
                  }
            `}
              >
                {job.matchScore}% Match
              </span>
            )}
          </div>

          {/* TITLE */}
          <a
            href={job.redditUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="
          text-xl font-bold
          text-gray-900
          leading-snug
          line-clamp-2
          group-hover:text-violet-700
          transition-colors
        ">
              {job.title}
            </h3>
          </a>

          {/* DESCRIPTION */}
          <p className="
        mt-3 text-sm leading-7
        text-gray-500
        line-clamp-3
      ">
            <ReactMarkdown>{job.description}</ReactMarkdown>
          </p>

          {/* META */}
          <div className="
        flex flex-wrap items-center
        gap-4 mt-5
        text-sm text-gray-400
      ">

            {job.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {job.location}
              </span>
            )}

            <span className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" />
              {budgetDisplay}
            </span>

            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {formatDistanceToNow(new Date(job.createdAt))} ago
            </span>
          </div>

          {/* SKILLS */}
          {job.skills?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {job.skills.slice(0, 5).map((skill) => (
                <span
                  key={skill}
                  className="
                px-3 py-1 rounded-xl
                text-xs font-medium
                bg-gray-50
                border border-gray-100
                text-gray-600
                hover:border-violet-200
                hover:text-violet-700
                transition-colors
              "
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

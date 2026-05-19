import { MapPin, Clock, DollarSign, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getEffectiveBudget, formatBudget } from '../../utils/budgetExtractor';

export default function JobCard({ job, onApply, onGenerateProposal, onSelect, showMatchScore = false }) {
  const effectiveBudget = getEffectiveBudget(job);
  const budgetDisplay = formatBudget(effectiveBudget);

  return (
    <div 
      onClick={() => onSelect?.(job)}
      className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all hover:border-violet-200 hover:scale-[1.02] cursor-pointer">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full font-medium">
              {job.category || 'General'}
            </span>
            {job.experienceLevel && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                {job.experienceLevel}
              </span>
            )}
            {showMatchScore && job.matchScore > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold
                ${job.matchScore >= 80 ? 'bg-green-100 text-green-700' :
                  job.matchScore >= 50 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-500'}`}>
                {job.matchScore}% match
              </span>
            )}
          </div>
          <a href={job.redditUrl} target="_blank" rel="noopener noreferrer">
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
              {job.title}
            </h3>
          </a>

          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{job.description}</p>

          <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
            {job.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>}
            <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{budgetDisplay}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDistanceToNow(new Date(job.createdAt))} ago</span>
          </div>

          {job.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {job.skills.slice(0, 5).map(skill => (
                <span key={skill} className="text-xs bg-gray-50 text-gray-600 border border-gray-100 px-2 py-0.5 rounded-md">{skill}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
        {onGenerateProposal && (
          <button onClick={() => onGenerateProposal(job)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-colors">
            <Zap className="w-3.5 h-3.5" />Generate Proposal
          </button>
        )}
        {onApply && (
          <button onClick={() => onApply(job)}
            className="flex-1 px-3 py-2 border border-gray-200 hover:border-violet-300 hover:bg-violet-50 text-gray-700 hover:text-violet-700 text-sm font-medium rounded-lg transition-colors">
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
}

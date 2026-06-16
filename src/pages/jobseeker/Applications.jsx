import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyApplicationsAPI, withdrawApplicationAPI } from '../../api/applications.api';
import { format } from 'date-fns';
import { Briefcase, Calendar, DollarSign, X, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const statusColors = {
  pending:     'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  viewed:      'bg-blue-500/10 text-blue-400 border-blue-500/20',
  shortlisted: 'bg-green-500/10 text-green-400 border-green-500/20',
  rejected:    'bg-red-500/10 text-red-400 border-red-500/20',
  hired:       'bg-violet-500/10 text-violet-400 border-violet-500/20',
};

const statusLabels = {
  pending:     'Pending',
  viewed:      'Viewed',
  shortlisted: 'Shortlisted',
  rejected:    'Rejected',
  hired:       'Hired',
};

export default function Applications() {
  const [filter, setFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['applications', filter],
    queryFn: () => getMyApplicationsAPI(filter === 'all' ? {} : { status: filter }),
  });

  const applications = data?.data?.applications || [];

  const withdrawMutation = useMutation({
    mutationFn: withdrawApplicationAPI,
    onSuccess: () => {
      toast.success('Application withdrawn');
      queryClient.invalidateQueries(['applications']);
    },
    onError: () => toast.error('Failed to withdraw application'),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Applications</h1>
          <p className="text-gray-400 text-sm mt-1">Track your job applications</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'viewed', 'shortlisted'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 text-sm rounded-lg border capitalize transition-colors ${
                filter === s
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-[#1a0f2e] text-gray-400 border-[#2d1f4e] hover:text-white hover:border-violet-500/50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#1a0f2e] rounded-xl border border-[#2d1f4e] p-6 animate-pulse">
              <div className="h-4 bg-[#2d1f4e] rounded w-1/3 mb-4" />
              <div className="h-3 bg-[#2d1f4e] rounded w-2/3 mb-2" />
              <div className="h-3 bg-[#2d1f4e] rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-[#1a0f2e] rounded-xl border border-[#2d1f4e] p-12 text-center">
          <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No applications yet</h3>
          <p className="text-gray-400">Start applying to jobs to see them here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="bg-[#1a0f2e] rounded-xl border border-[#2d1f4e] p-6 hover:border-violet-500/30 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white mb-1">{app.job?.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {app.job?.poster?.company?.name || app.job?.poster?.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(app.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full border capitalize ${statusColors[app.status]}`}>
                  {statusLabels[app.status]}
                </span>
              </div>

              <p className="text-sm text-gray-400 mb-4 line-clamp-2">{app.proposal}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {app.bidAmount && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      ${app.bidAmount}
                    </span>
                  )}
                </div>
                {app.status === 'pending' && (
                  <button
                    onClick={() => withdrawMutation.mutate(app._id)}
                    className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

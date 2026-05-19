import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyApplicationsAPI, withdrawApplicationAPI } from '../../api/applications.api';
import { format } from 'date-fns';
import { Briefcase, Calendar, DollarSign, X, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const statusColors = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  viewed: 'bg-blue-50 text-blue-700 border-blue-200',
  shortlisted: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  hired: 'bg-purple-50 text-purple-700 border-purple-200',
};

const statusLabels = {
  pending: 'Pending',
  viewed: 'Viewed',
  shortlisted: 'Shortlisted',
  rejected: 'Rejected',
  hired: 'Hired',
};

export default function Applications() {
  const [filter, setFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['applications', filter],
    queryFn: () => getMyApplicationsAPI(filter === 'all' ? {} : { status: filter }),
  });

  const applications = data?.data?.applications || [];
  const total = data?.data?.total || 0;

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-500 text-sm mt-1">Track your job applications</p>
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'viewed', 'shortlisted'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 text-sm rounded-lg border capitalize transition-colors ${
                filter === s
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
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
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
          <p className="text-gray-500">Start applying to jobs to see them here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{app.job?.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
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

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{app.proposal}</p>

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
                    className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
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

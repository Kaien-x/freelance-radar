import { useEffect, useState, useCallback } from 'react';
import { Mail, CheckCircle, XCircle, Send, AlertCircle, X } from 'lucide-react';
import StatsCard from '../../components/shared/StatsCard';
import ResponsiveTable from '../../components/shared/ResponsiveTable';
import { getEmailLogs, getEmailStats } from '../../api/admin.api';

const TYPE_BADGES = {
  verification: 'bg-[#1e1040] text-[#a78bfa]',
  alert: 'bg-amber-950/50 text-amber-400',
  digest: 'bg-blue-950/50 text-blue-400',
  'reset-password': 'bg-orange-950/50 text-orange-400',
  welcome: 'bg-[#052e16] text-[#4ade80]',
  general: 'bg-[#1e1040] text-gray-400',
};

const TYPE_LABELS = {
  verification: 'Verification',
  alert: 'Alert',
  digest: 'Digest',
  'reset-password': 'Reset Password',
  welcome: 'Welcome',
  general: 'General',
};

const paginationBtnClass =
  'px-4 py-2 rounded-xl border border-[#2d1f4e] bg-[#1a0f2e] text-gray-300 hover:bg-[#12072a] hover:text-white disabled:opacity-50 transition-colors';

function StatusBadge({ status }) {
  const isSent = status === 'sent';
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${isSent ? 'bg-[#052e16] text-[#4ade80]' : 'bg-red-950/50 text-red-400'
        }`}
    >
      {isSent ? <CheckCircle size={14} /> : <XCircle size={14} />}
      {isSent ? 'Sent' : 'Failed'}
    </span>
  );
}

function TypeBadge({ type }) {
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${TYPE_BADGES[type] || TYPE_BADGES.general}`}>
      {TYPE_LABELS[type] || type}
    </span>
  );
}

function EmailDetailModal({ email, onClose }) {
  if (!email) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full h-full sm:h-auto sm:max-w-2xl sm:rounded-2xl bg-[#1a0f2e] border-0 sm:border border-[#2d1f4e] shadow-2xl flex flex-col sm:max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 md:px-6 py-5 border-b border-[#2d1f4e]">
          <h2 className="text-lg font-bold text-white">Email Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#12072a] transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">To</p>
              <p className="text-sm text-gray-200 break-all">{email.to}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Sent At</p>
              <p className="text-sm text-gray-200">
                {new Date(email.sentAt)
                  .toLocaleString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })
                  .replace(/\b(am|pm)\b/i, match => match.toUpperCase())}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Subject</p>
            <p className="text-sm text-gray-200">{email.subject}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Type</p>
              <TypeBadge type={email.type} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Status</p>
              <StatusBadge status={email.status} />
            </div>
          </div>

          {email.status === 'failed' && email.error && (
            <div className="rounded-xl border border-red-500/30 bg-red-950/30 p-4">
              <p className="text-xs uppercase tracking-wider text-red-400 mb-1">Error</p>
              <p className="text-sm text-red-300">{email.error}</p>
            </div>
          )}

          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Email Body</p>
            <div
              className="rounded-xl border border-[#2d1f4e] bg-[#12072a] p-4 overflow-auto max-h-80"
              dangerouslySetInnerHTML={{ __html: email.body }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminEmails() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    totalSent: 0,
    totalFailed: 0,
    sentToday: 0,
    failedToday: 0,
  });
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (statusFilter) params.status = statusFilter;

      const [logsRes, statsRes] = await Promise.all([
        getEmailLogs(params),
        getEmailStats(),
      ]);

      setLogs(logsRes.data?.logs || []);
      setPagination((prev) => ({
        ...prev,
        ...(logsRes.data?.pagination || {}),
      }));
      setStats(statsRes.data || {});
    } catch (error) {
      console.error('Failed to fetch email logs:', error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (filter) => {
    setStatusFilter(filter);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  if (loading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Loading email logs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Email Logs</h1>
        <p className="text-sm text-gray-400 mt-1">Track all emails sent by the platform</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard label="Total Sent" value={stats.totalSent ?? 0} color="green" icon={Send} dark />
        <StatsCard label="Total Failed" value={stats.totalFailed ?? 0} color="amber" icon={AlertCircle} dark />
        <StatsCard label="Sent Today" value={stats.sentToday ?? 0} color="violet" icon={CheckCircle} dark />
        <StatsCard label="Failed Today" value={stats.failedToday ?? 0} color="blue" icon={XCircle} dark />
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { label: 'All', value: '' },
          { label: 'Sent', value: 'sent' },
          { label: 'Failed', value: 'failed' },
        ].map(({ label, value }) => (
          <button
            key={label}
            onClick={() => handleFilterChange(value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${statusFilter === value
              ? 'bg-[#7c3aed] text-white'
              : 'bg-[#1a0f2e] border border-[#2d1f4e] text-gray-400 hover:text-white hover:border-[#7c3aed]/50'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      <ResponsiveTable minWidth="min-w-[760px]">
        <thead>
          <tr className="bg-[#1a0f2e] border-b border-[#2d1f4e]">
            <th className="px-4 md:px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-400 whitespace-nowrap">To</th>
            <th className="px-4 md:px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-400 whitespace-nowrap">Subject</th>
            <th className="px-4 md:px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-400 whitespace-nowrap">Type</th>
            <th className="px-4 md:px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-400 whitespace-nowrap">Status</th>
            <th className="px-4 md:px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-400 whitespace-nowrap">Date</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan="5" className="py-10 text-center text-gray-400 bg-[#12072a]">
                <div className="flex flex-col items-center gap-2">
                  <Mail className="w-8 h-8 text-gray-600" />
                  No email logs found
                </div>
              </td>
            </tr>
          ) : (
            logs.map((log) => (
              <tr
                key={log._id}
                onClick={() => setSelectedEmail(log)}
                className="bg-[#12072a] border-b border-[#1e1040] hover:bg-[#1a0f2e] cursor-pointer transition-colors"
              >
                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                  <p className="text-sm text-gray-200">{log.to}</p>
                </td>
                <td className="px-4 md:px-6 py-4">
                  <p className="text-sm text-gray-200 max-w-xs">{log.subject}</p>
                </td>
                <td className="px-4 md:px-6 py-4">
                  <TypeBadge type={log.type} />
                </td>
                <td className="px-4 md:px-6 py-4">
                  <StatusBadge status={log.status} />
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {new Date(log.sentAt)
                    .toLocaleString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })
                    .replace(/\b(am|pm)\b/i, match => match.toUpperCase())}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </ResponsiveTable>

      {pagination.pages > 1 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-sm text-gray-400">
            Showing {logs.length} of {pagination.total} emails
          </p>
          <div className="flex gap-2 items-center">
            <button
              disabled={pagination.page === 1 || loading}
              onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
              className={paginationBtnClass}
            >
              Previous
            </button>
            <span className="px-2 text-sm text-gray-400">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              disabled={pagination.page >= pagination.pages || loading}
              onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
              className={paginationBtnClass}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {selectedEmail && (
        <EmailDetailModal email={selectedEmail} onClose={() => setSelectedEmail(null)} />
      )}
    </div>
  );
}

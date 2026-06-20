import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow, format } from 'date-fns';
import { getActivitySummary, getUserTimeline, getOutreachList } from '../../api/activity.api';
import { Activity, Clock, LogIn, Eye, Copy, Check, ChevronLeft, User } from 'lucide-react';

const PAGE_LABELS = {
  dashboard:    'Dashboard',
  jobs:         'Job Feed',
  profile:      'Profile',
  applications: 'Applications',
};

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
    </button>
  );
}

function TimelinePanel({ userId, onBack }) {
  const { data, isLoading } = useQuery({
    queryKey: ['user-timeline', userId],
    queryFn: () => getUserTimeline(userId).then(r => r.data),
  });

  if (isLoading) return <div className="text-gray-400 py-10 text-center">Loading timeline…</div>;

  const logs = data || [];

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors">
        <ChevronLeft size={16} /> Back to all users
      </button>
      <h2 className="text-lg font-bold text-white mb-4">User activity timeline</h2>
      {logs.length === 0 ? (
        <p className="text-gray-500 text-sm">No activity recorded yet.</p>
      ) : (
        <div className="space-y-2">
          {logs.map(log => (
            <div key={log._id} className="flex items-start gap-4 rounded-xl bg-[#1a0f2e] border border-[#2d1f4e] px-4 py-3">
              <div className="mt-0.5">
                {log.event === 'login'
                  ? <LogIn size={15} className="text-violet-400" />
                  : <Eye size={15} className="text-blue-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium">
                  {log.event === 'login'
                    ? `Logged in via ${log.meta?.method || 'unknown'}`
                    : `Visited ${PAGE_LABELS[log.page] || log.page}`}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {format(new Date(log.createdAt), 'dd MMM yyyy, HH:mm')}
                  {' · '}
                  {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OutreachPanel() {
  const { data, isLoading } = useQuery({
    queryKey: ['outreach-list'],
    queryFn: () => getOutreachList().then(r => r.data),
  });

  if (isLoading) return <div className="text-gray-400 py-6 text-center text-sm">Loading…</div>;

  const waitlist     = data?.waitlist    || [];
  const recentUsers  = data?.recentUsers || [];

  const allEmails = [
    ...waitlist.map(w => w.email),
    ...recentUsers.map(u => u.email),
  ].join(', ');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Outreach email list</h2>
        <CopyButton text={allEmails} />
      </div>

      {/* Waitlist */}
      <div>
        <p className="text-xs uppercase tracking-wider text-violet-400 font-semibold mb-3">
          Pro waitlist ({waitlist.length})
        </p>
        {waitlist.length === 0 ? (
          <p className="text-sm text-gray-500">No waitlist signups yet.</p>
        ) : (
          <div className="space-y-2">
            {waitlist.map(w => (
              <div key={w._id} className="flex items-center justify-between rounded-xl bg-[#1a0f2e] border border-violet-500/20 px-4 py-2.5">
                <div>
                  <p className="text-sm text-white font-medium">{w.name || '—'}</p>
                  <p className="text-xs text-gray-400">{w.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(w.createdAt), { addSuffix: true })}</span>
                  <CopyButton text={w.email} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent non-waitlist users */}
      <div>
        <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">
          10 most recent users (not on waitlist)
        </p>
        {recentUsers.length === 0 ? (
          <p className="text-sm text-gray-500">None found.</p>
        ) : (
          <div className="space-y-2">
            {recentUsers.map(u => (
              <div key={u._id} className="flex items-center justify-between rounded-xl bg-[#1a0f2e] border border-[#2d1f4e] px-4 py-2.5">
                <div>
                  <p className="text-sm text-white font-medium">{u.name}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(u.createdAt), { addSuffix: true })}</span>
                  <CopyButton text={u.email} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Copy all */}
      <div className="rounded-xl bg-[#12072a] border border-[#2d1f4e] p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-400 font-medium">All emails (copy to paste into Gmail BCC)</p>
          <CopyButton text={allEmails} />
        </div>
        <p className="text-xs text-gray-500 break-all leading-relaxed">{allEmails || '—'}</p>
      </div>
    </div>
  );
}

export default function AdminActivity() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [tab, setTab]                   = useState('activity'); // 'activity' | 'outreach'

  const { data, isLoading } = useQuery({
    queryKey: ['activity-summary'],
    queryFn:  () => getActivitySummary().then(r => r.data),
    enabled:  tab === 'activity',
  });

  const rows = data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">User Activity</h1>
        <p className="text-sm text-gray-400 mt-1">See who is coming back and what they do</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2">
        {[['activity', 'Activity Logs'], ['outreach', 'Outreach List']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => { setTab(key); setSelectedUser(null); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === key
                ? 'bg-[#7c3aed] text-white'
                : 'bg-[#1a0f2e] text-gray-400 hover:text-white border border-[#2d1f4e]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'outreach' && <OutreachPanel />}

      {tab === 'activity' && (
        selectedUser ? (
          <TimelinePanel userId={selectedUser} onBack={() => setSelectedUser(null)} />
        ) : (
          <>
            {isLoading ? (
              <div className="text-gray-400 text-sm py-10 text-center">Loading activity…</div>
            ) : rows.length === 0 ? (
              <div className="rounded-2xl border border-[#2d1f4e] bg-[#12072a] p-10 text-center text-gray-500 text-sm">
                No activity recorded yet. Activity will appear as users log in and visit pages.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-[#2d1f4e]">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="bg-[#1a0f2e] border-b border-[#2d1f4e]">
                      <th className="px-5 py-4 text-left text-xs uppercase tracking-wider text-gray-400">User</th>
                      <th className="px-5 py-4 text-left text-xs uppercase tracking-wider text-gray-400">Last seen</th>
                      <th className="px-5 py-4 text-left text-xs uppercase tracking-wider text-gray-400">Logins</th>
                      <th className="px-5 py-4 text-left text-xs uppercase tracking-wider text-gray-400">Pages visited</th>
                      <th className="px-5 py-4 text-left text-xs uppercase tracking-wider text-gray-400">Last page</th>
                      <th className="px-5 py-4 text-left text-xs uppercase tracking-wider text-gray-400">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(row => {
                      const isRecent = new Date(row.lastSeen) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                      return (
                        <tr
                          key={row.userId}
                          onClick={() => setSelectedUser(row.userId)}
                          className="bg-[#12072a] border-b border-[#1e1040] hover:bg-[#1a0f2e] cursor-pointer transition-colors"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#2d1f4e] flex items-center justify-center text-violet-300 font-bold text-sm shrink-0">
                                {row.avatar
                                  ? <img src={row.avatar} className="w-full h-full rounded-full object-cover" alt="" />
                                  : row.name?.[0]?.toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-white truncate">{row.name}</p>
                                <p className="text-xs text-gray-500 truncate">{row.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full shrink-0 ${isRecent ? 'bg-green-400' : 'bg-gray-600'}`} />
                              <span className="text-sm text-gray-300">
                                {formatDistanceToNow(new Date(row.lastSeen), { addSuffix: true })}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-300">{row.loginCount}</td>
                          <td className="px-5 py-4 text-sm text-gray-300">{row.pageCount}</td>
                          <td className="px-5 py-4 text-sm text-gray-400">
                            {PAGE_LABELS[row.lastPage] || row.lastPage || '—'}
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-500">
                            {row.joinedAt ? format(new Date(row.joinedAt), 'dd MMM yyyy') : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { getWaitlistAdminAPI, deleteWaitlistAdminAPI } from '../../api/waitlist.api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function AdminWaitlist() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 20;

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getWaitlistAdminAPI({ page, limit });
      setEntries(data.entries || []);
      setTotal(data.total || 0);
    } catch (e) {
      toast.error('Failed to load waitlist');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page]);

  const remove = async (id) => {
    if (!confirm('Delete this entry?')) return;
    try {
      await deleteWaitlistAdminAPI(id);
      toast.success('Deleted');
      load();
    } catch (e) { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Waitlist</h1>
        <p className="text-gray-400 text-sm mt-1">Manage Pro waitlist signups</p>
      </div>

      <div className="rounded-2xl border border-[#2d1f4e] bg-[#1a0f2e] p-6">
        <div className="mb-4">
          <div className="text-sm text-gray-400">Total Signups</div>
          <div className="text-2xl font-bold text-white">{total}</div>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : entries.length === 0 ? (
          <p className="text-gray-400">No waitlist signups yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-gray-400">
                  <th className="py-2">Email</th>
                  <th>Name</th>
                  <th>Source</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(e => (
                  <tr key={e._id} className="border-t border-[#2d1f4e]">
                    <td className="py-3 text-white text-sm">{e.email}</td>
                    <td className="py-3 text-gray-300 text-sm">{e.name || '—'}</td>
                    <td className="py-3 text-gray-300 text-sm">{e.source}</td>
                    <td className="py-3 text-gray-300 text-sm">{format(new Date(e.createdAt), 'PP p')}</td>
                    <td className="py-3"><button onClick={() => remove(e._id)} className="px-3 py-1 rounded-lg bg-red-600 text-white text-sm">Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {total > limit && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-400">Page {page} of {Math.ceil(total/limit)}</div>
            <div className="flex gap-2">
              <button disabled={page===1} onClick={() => setPage(p => Math.max(1, p-1))} className="px-3 py-1 rounded bg-[#2d1f4e] text-gray-200">Prev</button>
              <button disabled={page>=Math.ceil(total/limit)} onClick={() => setPage(p => p+1)} className="px-3 py-1 rounded bg-[#2d1f4e] text-gray-200">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

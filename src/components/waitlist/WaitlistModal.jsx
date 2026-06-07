import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { joinWaitlistAPI } from '@/api/waitlist.api';
import { useAuthStore } from '@/store/authStore';

export default function WaitlistModal({ open, onClose }) {
  const { user } = useAuthStore();
  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setEmail(user?.email || '');
      setName(user?.name || '');
    }
  }, [open, user]);

  const validateEmail = (e) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    return re.test(String(e).toLowerCase());
  }

  const submit = async () => {
    if (!validateEmail(email)) return toast.error('Please enter a valid email');
    setLoading(true);
    try {
      const res = await joinWaitlistAPI({ email, name });
      const message = res?.data?.message;
      if (message === 'You are already on the waitlist!') {
        toast.success(message);
      } else {
        toast.success("You're on the waitlist! We'll email you when Pro launches.");
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose} className="z-[9999]">
      <DialogContent className="max-w-md w-full rounded-2xl border border-[#2d1f4e] bg-[#1a0f2e] p-6">
        <DialogHeader>
          <DialogTitle>Join the Pro Waitlist</DialogTitle>
          <p className="text-sm text-gray-400">Be first to know when Pro launches</p>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-[#2d1f4e] bg-[#12072a] px-3 py-2 text-sm text-gray-200 outline-none" />
          </div>

          <div>
            <label className="text-sm text-gray-300">Your name (optional)</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-[#2d1f4e] bg-[#12072a] px-3 py-2 text-sm text-gray-200 outline-none" />
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={submit} className="flex-1 bg-violet-600" disabled={loading}>{loading ? 'Joining...' : 'Join Waitlist'}</Button>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '../store/authStore'
import api from '../api/client'
import toast from 'react-hot-toast'

export default function Settings() {
  const { user, refreshUser } = useAuthStore()
  const [form, setForm] = useState({ name: user?.name ?? '', reddit_username: user?.reddit_username ?? '' })
  const [saving, setSaving] = useState(false)

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/profile', form)
      await refreshUser()
      toast.success('Settings saved!')
    } catch {
      toast.error('Save failed.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>
                Reddit Username <span className="text-gray-400">(optional)</span>
              </Label>
              <Input
                value={form.reddit_username}
                onChange={(e) => setForm((prev) => ({ ...prev, reddit_username: e.target.value }))}
                placeholder="u/yourusername"
              />
            </div>
            <Button type="submit" className="bg-violet-600 hover:bg-violet-700" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

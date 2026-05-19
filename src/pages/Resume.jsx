import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, X, CheckCircle } from 'lucide-react'
import ResumeUpload from '../components/resume/ResumeUpload'
import api from '../api/client'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'

export default function Resume() {
  const queryClient = useQueryClient()
  const { user, refreshUser } = useAuthStore()
  const [newSkill, setNewSkill] = useState('')
  const skills = user?.skills ?? []

  const { data: resume } = useQuery({
    queryKey: ['resume'],
    queryFn: () => api.get('/resume').then((r) => r.data),
    refetchInterval: (data) => (data?.status === 'parsing' ? 2000 : false),
  })

  const addSkill = async () => {
    if (!newSkill.trim()) return
    const updated = [...skills, { skill: newSkill.trim(), years_experience: 1, level: 'intermediate' }]
    await api.put('/profile/skills', { skills: updated })
    await refreshUser()
    setNewSkill('')
    toast.success('Skill added!')
    queryClient.invalidateQueries(['jobs'])
  }

  const removeSkill = async (skillName) => {
    const updated = skills.filter((s) => s.skill !== skillName)
    await api.put('/profile/skills', { skills: updated })
    await refreshUser()
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Resume & Skills</h1>
        <p className="text-sm text-gray-500 mt-1">Your skills power your job matches.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload Resume</CardTitle>
        </CardHeader>
        <CardContent>
          {resume?.status === 'parsed' && (
            <div className="flex items-center gap-2 text-green-600 mb-4 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Resume parsed: {resume.filename}
            </div>
          )}
          <ResumeUpload onParsed={() => { refreshUser(); queryClient.invalidateQueries(['resume']) }} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map((s) => (
              <Badge key={s.skill} variant="secondary" className="gap-1.5 pr-1.5 py-1">
                {s.skill}
                <button onClick={() => removeSkill(s.skill)} className="hover:text-red-500 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {skills.length === 0 && <p className="text-sm text-gray-400">No skills yet. Upload resume or add manually.</p>}
          </div>
          <div className="flex gap-2 flex-wrap">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSkill()}
              placeholder="Add a skill (e.g. React, Laravel)"
              className="max-w-xs"
            />
            <Button onClick={addSkill} size="sm" className="bg-violet-600 hover:bg-violet-700">
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

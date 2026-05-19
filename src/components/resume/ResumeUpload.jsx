import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, Loader2, CheckCircle } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import api from '../../api/client'
import toast from 'react-hot-toast'

export default function ResumeUpload({ onParsed }) {
  const [status, setStatus] = useState('idle')
  const [progress, setProgress] = useState(0)

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (!file) return
      const formData = new FormData()
      formData.append('resume', file)

      try {
        setStatus('uploading')
        setProgress(20)
        await api.post('/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        setStatus('parsing')
        setProgress(50)

        const poll = setInterval(async () => {
          const { data } = await api.get('/resume')
          if (data?.status === 'parsed') {
            clearInterval(poll)
            setStatus('done')
            setProgress(100)
            onParsed(data)
            toast.success('Resume parsed! Skills extracted.')
          } else if (data?.status === 'failed') {
            clearInterval(poll)
            setStatus('error')
            toast.error('Parsing failed. Try again.')
          } else {
            setProgress((prev) => Math.min(prev + 8, 88))
          }
        }, 2500)
      } catch {
        setStatus('error')
        toast.error('Upload failed.')
      }
    },
    [onParsed],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  })

  const icons = { idle: Upload, uploading: Loader2, parsing: FileText, done: CheckCircle, error: Upload }
  const Icon = icons[status] ?? Upload

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-violet-500 bg-violet-50' : 'border-gray-200 hover:border-violet-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <Icon
          className={`w-10 h-10 mx-auto mb-3 ${
            status === 'done' ? 'text-green-500' : status === 'idle' ? 'text-gray-300' : 'text-violet-500'
          } ${status === 'uploading' || status === 'parsing' ? 'animate-spin' : ''}`}
        />
        <p className="text-sm font-medium text-gray-700">
          {status === 'idle' && 'Drop your PDF resume here or click to browse'}
          {status === 'uploading' && 'Uploading...'}
          {status === 'parsing' && 'AI is extracting your skills...'}
          {status === 'done' && 'Resume parsed successfully!'}
          {status === 'error' && 'Failed. Try again.'}
        </p>
        <p className="text-xs text-gray-400 mt-1">PDF only · Max 5MB</p>
      </div>
      {status !== 'idle' && <Progress value={progress} className="h-1.5" />}
    </div>
  )
}

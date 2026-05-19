import { useEffect } from 'react'
import { cn } from '../../lib/utils'

export function Dialog({ open, onOpenChange, children }) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onOpenChange(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-3xl bg-white shadow-2xl">
        {children}
      </div>
    </div>
  )
}

export function DialogContent({ className, children, ...props }) {
  return (
    <div className={cn('rounded-3xl bg-white p-6', className)} {...props}>
      {children}
    </div>
  )
}

export function DialogHeader({ className, children, ...props }) {
  return (
    <div className={cn('mb-5', className)} {...props}>
      {children}
    </div>
  )
}

export function DialogTitle({ className, children, ...props }) {
  return (
    <h2 className={cn('text-xl font-semibold text-gray-900', className)} {...props}>
      {children}
    </h2>
  )
}

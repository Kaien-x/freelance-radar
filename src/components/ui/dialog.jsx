import { useEffect } from 'react'
import { cn } from '../../lib/utils'

export function Dialog({ open, onOpenChange, children, className }) {
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

  const onOverlayMouseDown = (e) => {
    if (e.target === e.currentTarget) onOpenChange(false)
  }

  return (
    <div onMouseDown={onOverlayMouseDown} className={cn('fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4', className)}>
      {children}
    </div>
  )
}

export function DialogContent({ className, children, ...props }) {
  return (
    <div onMouseDown={(e) => e.stopPropagation()} className={cn('w-full max-w-3xl max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-3xl shadow-2xl p-6', className)} {...props}>
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
    <h2 className={cn('text-xl font-semibold text-white', className)} {...props}>
      {children}
    </h2>
  )
}

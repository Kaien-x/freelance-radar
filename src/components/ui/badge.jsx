import { cn } from '../../lib/utils'

export function Badge({ variant = 'default', className, children, ...props }) {
  const variants = {
    default: 'bg-violet-100 text-violet-700',
    outline: 'border border-gray-200 bg-white text-gray-600',
    secondary: 'bg-gray-100 text-gray-700',
  }

  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', variants[variant], className)} {...props}>
      {children}
    </span>
  )
}

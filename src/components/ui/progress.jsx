import { cn } from '../../lib/utils'

export function Progress({ value = 0, className, ...props }) {
  return (
    <div className={cn('relative h-2 overflow-hidden rounded-full bg-gray-200', className)} {...props}>
      <div className="h-full rounded-full bg-violet-600 transition-all duration-300" style={{ width: `${value}%` }} />
    </div>
  )
}

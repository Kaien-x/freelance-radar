import { cn } from '../../lib/utils'

export function Input({ className, ...props }) {
  return (
    <input
      className={cn('w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-violet-400 focus:ring-2 focus:ring-violet-100', className)}
      {...props}
    />
  )
}

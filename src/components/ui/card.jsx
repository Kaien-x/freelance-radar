import { cn } from '../../lib/utils'

export function Card({ className, children, ...props }) {
  return (
    <div className={cn('rounded-3xl border border-gray-100 bg-white shadow-sm', className)} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('border-b border-gray-100 px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn('px-6 py-5', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn('border-t border-gray-100 px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }) {
  return (
    <div className={cn('text-lg font-semibold text-gray-900', className)} {...props}>
      {children}
    </div>
  )
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn('text-sm text-gray-500', className)} {...props}>
      {children}
    </p>
  )
}

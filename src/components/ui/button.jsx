import { cloneElement } from 'react'
import { cn } from '../../lib/utils'

const variants = {
  default: 'bg-violet-600 text-white hover:bg-violet-700',
  outline: 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
}

const sizes = {
  default: 'h-11 px-4 py-2 text-sm',
  sm: 'h-9 px-3 text-xs',
}

export function Button({ asChild, variant = 'default', size = 'default', className, children, ...props }) {
  const classes = cn(
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  )

  if (asChild && typeof children === 'object' && children !== null) {
    return cloneElement(children, { className: cn(children.props.className, classes), ...props })
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}

import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

export const Skeleton = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-xl bg-slate-200', className)}
      {...props}
    />
  )
}

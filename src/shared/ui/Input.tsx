import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

export const Input = ({ className, ...props }: ComponentProps<'input'>) => {
  return (
    <input
      data-slot="input"
      className={cn(
        'h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-100',
        className,
      )}
      {...props}
    />
  )
}

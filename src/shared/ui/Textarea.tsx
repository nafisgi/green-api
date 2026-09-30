import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

export const Textarea = ({
  className,
  ...props
}: ComponentProps<'textarea'>) => {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'min-h-8 w-full resize-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400',
        className,
      )}
      {...props}
    />
  )
}

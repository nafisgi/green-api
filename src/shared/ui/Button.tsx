import { Slot } from 'radix-ui'
import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

type ButtonProps = ComponentProps<'button'> & {
  asChild?: boolean
  variant?: 'primary' | 'ghost'
}

export const Button = ({
  asChild = false,
  className,
  variant = 'primary',
  ...props
}: ButtonProps) => {
  const Component = asChild ? Slot.Root : 'button'
  return (
    <Component
      data-slot="button"
      className={cn(
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary'
          ? 'bg-[#0d8b68] text-white hover:bg-[#087a5b]'
          : 'text-slate-500 hover:bg-slate-100 hover:text-[#087a5b]',
        className,
      )}
      {...props}
    />
  )
}

import { X } from 'lucide-react'
import { Dialog as Primitive } from 'radix-ui'
import type { ReactNode } from 'react'

import { cn } from '@/shared/lib/cn'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  children: ReactNode
  className?: string
}

export const Dialog = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: DialogProps) => {
  return (
    <Primitive.Root open={open} onOpenChange={onOpenChange}>
      <Primitive.Portal>
        <Primitive.Overlay className="fixed inset-0 z-40 bg-slate-950/55" />
        <Primitive.Content
          className={cn(
            'fixed top-1/2 left-1/2 z-50 w-[min(calc(100%-2rem),26rem)] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-8 shadow-2xl focus:outline-none',
            className,
          )}
        >
          <Primitive.Close
            className="absolute top-5 right-5 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Закрыть"
          >
            <X aria-hidden="true" size={19} />
          </Primitive.Close>
          <Primitive.Title className="text-2xl font-bold text-slate-900">
            {title}
          </Primitive.Title>
          <Primitive.Description className="mt-2 mb-6 text-sm leading-relaxed text-slate-500">
            {description}
          </Primitive.Description>
          {children}
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  )
}

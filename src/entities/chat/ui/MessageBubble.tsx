import type { Message } from '../model/types'

import { cn } from '@/shared/lib/cn'
import { formatMessageTime } from '@/shared/lib/format-time'

export const MessageBubble = ({ message }: { message: Message }) => {
  const outgoing = message.direction === 'outgoing'
  return (
    <div className={cn('flex', outgoing && 'justify-end')}>
      <div
        className={cn(
          'flex max-w-[min(76%,540px)] flex-col gap-1 rounded-2xl bg-white px-3.5 py-2.5 text-sm leading-relaxed break-words whitespace-pre-wrap text-slate-800 shadow-sm max-sm:max-w-[86%]',
          outgoing && 'bg-[#d9fdd3]',
        )}
      >
        <span>{message.text}</span>
        <time
          dateTime={new Date(message.timestamp).toISOString()}
          className="self-end text-[10px] text-slate-400"
        >
          {formatMessageTime(message.timestamp)}
        </time>
      </div>
    </div>
  )
}

import type { Chat } from '../model/types'

import { ChatAvatar } from './ChatAvatar'

import { cn } from '@/shared/lib/cn'
import { formatMessageTime } from '@/shared/lib/format-time'

interface ChatRowProps {
  chat: Chat
  selected: boolean
  onSelect: () => void
}

export const ChatRow = ({ chat, selected, onSelect }: ChatRowProps) => {
  const last = chat.messages.at(-1)
  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-emerald-50',
        selected && 'bg-emerald-50',
      )}
      onClick={onSelect}
      aria-current={selected ? 'true' : undefined}
    >
      <ChatAvatar name={chat.name} />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <strong className="truncate text-sm text-slate-800">{chat.name}</strong>
        <span className="truncate text-xs text-slate-400">
          {last?.text ?? 'Начните общение'}
        </span>
      </span>
      {last && (
        <time
          dateTime={new Date(last.timestamp).toISOString()}
          className="self-start text-[10px] text-slate-400"
        >
          {formatMessageTime(last.timestamp)}
        </time>
      )}
    </button>
  )
}

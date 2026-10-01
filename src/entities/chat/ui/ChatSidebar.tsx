import { MessageCircle, Plus } from 'lucide-react'

import type { Chat } from '../model/types'

import { ChatRow } from './ChatRow'

import { Button } from '@/shared/ui/Button'

interface ChatSidebarProps {
  chats: Chat[]
  activeChatId: string | null
  idInstance: string
  pollError: string
  onSelect: (chatId: string) => void
  onCreate: () => void
}

export const ChatSidebar = ({
  chats,
  activeChatId,
  idInstance,
  pollError,
  onSelect,
  onCreate,
}: ChatSidebarProps) => {
  return (
    <aside className="flex min-h-0 flex-col border-r border-slate-200 bg-white">
      <header className="flex items-end justify-between px-6 pt-8 pb-5">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-slate-400">
            ВАШИ СООБЩЕНИЯ
          </span>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Чаты
          </h1>
        </div>
        <Button
          type="button"
          aria-label="Новый чат"
          title="Новый чат"
          className="size-10 p-0"
          onClick={onCreate}
        >
          <Plus aria-hidden="true" size={19} />
        </Button>
      </header>
      <p className="mx-4 mb-4 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-400">
        Выберите чат или создайте новый
      </p>
      <div className="min-h-0 flex-1 overflow-y-auto px-2">
        {chats.length === 0 ? (
          <div className="mx-5 mt-16 flex flex-col items-center text-center text-xs text-slate-500">
            <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
              <MessageCircle aria-hidden="true" />
            </div>
            <strong className="mb-1 text-sm text-slate-600">
              Пока нет чатов
            </strong>
            <span>Начните переписку по номеру телефона</span>
            <Button
              type="button"
              variant="ghost"
              className="mt-4 text-xs"
              onClick={onCreate}
            >
              Новый чат <span aria-hidden="true">→</span>
            </Button>
          </div>
        ) : (
          chats.map((chat) => (
            <ChatRow
              key={chat.id}
              chat={chat}
              selected={chat.id === activeChatId}
              onSelect={() => {
                onSelect(chat.id)
              }}
            />
          ))
        )}
      </div>
      <div className="flex min-h-14 items-center gap-2 border-t border-slate-200 px-4 text-[10px] text-slate-400">
        <span
          aria-hidden="true"
          className={
            pollError
              ? 'size-2 rounded-full bg-red-500'
              : 'size-2 rounded-full bg-emerald-400'
          }
        />
        {pollError ? 'Проблема с получением' : 'Ожидание сообщений'}
        <span className="ml-auto">ID {idInstance}</span>
      </div>
    </aside>
  )
}

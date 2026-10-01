import { ArrowLeft, MessageCircle, Plus } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

import type { Chat } from '../model/types'

import { ChatAvatar } from './ChatAvatar'
import { MessageBubble } from './MessageBubble'

import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'

interface ConversationProps {
  chat: Chat | undefined
  pollError: string
  composer: ReactNode
  onBack: () => void
  onCreate: () => void
}

export const Conversation = ({
  chat,
  pollError,
  composer,
  onBack,
  onCreate,
}: ConversationProps) => {
  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat?.id, chat?.messages.length])

  return (
    <section
      className={cn(
        'flex min-h-0 min-w-0 flex-col bg-[#efeae2] max-sm:hidden',
        chat && 'max-sm:fixed max-sm:inset-0 max-sm:z-30 max-sm:flex',
      )}
      aria-label="Переписка"
    >
      {chat ? (
        <>
          <header className="flex h-20 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-7 max-sm:h-16 max-sm:px-3">
            <Button
              variant="ghost"
              type="button"
              className="hidden size-10 p-0 max-sm:flex"
              onClick={onBack}
              aria-label="К списку чатов"
            >
              <ArrowLeft aria-hidden="true" size={20} />
            </Button>
            <ChatAvatar name={chat.name} small />
            <div className="flex flex-col gap-1">
              <strong className="text-sm text-slate-900">{chat.name}</strong>
              <span className="text-xs text-slate-400">
                Личный чат · WhatsApp
              </span>
            </div>
          </header>
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[radial-gradient(#c4bdb035_1px,transparent_1px)] bg-size-[22px_22px]">
            <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col justify-end gap-3 px-9 py-6 max-sm:px-4">
              {chat.messages.length === 0 ? (
                <div className="m-auto text-center text-sm text-slate-400">
                  <MessageCircle
                    className="mx-auto mb-4 text-emerald-600"
                    aria-hidden="true"
                    size={35}
                  />
                  <h2 className="text-lg font-semibold text-slate-800">
                    Начните переписку
                  </h2>
                  <p className="mt-1">
                    Напишите первое сообщение для {chat.name}
                  </p>
                </div>
              ) : (
                <>
                  <span className="mx-auto mb-2 rounded-full bg-white px-3 py-1 text-[11px] text-slate-400">
                    Сообщения
                  </span>
                  {chat.messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                </>
              )}
              <div ref={bottomRef} />
            </div>
          </div>
          {pollError && (
            <div
              className="border-t border-red-100 bg-red-50 px-8 py-2 text-xs text-red-700"
              role="alert"
            >
              Получение сообщений: {pollError}
            </div>
          )}
          {composer}
        </>
      ) : (
        <div className="m-auto flex flex-col items-center p-8 text-center">
          <div className="mb-5 grid size-20 place-items-center rounded-3xl bg-emerald-50 text-4xl font-bold text-emerald-700">
            W
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Добро пожаловать в WhatsApp
          </h2>
          <p className="mt-2 mb-6 max-w-xs text-sm leading-relaxed text-slate-500">
            Выберите чат слева или начните новую переписку по номеру телефона.
          </p>
          <Button type="button" onClick={onCreate}>
            <Plus aria-hidden="true" size={18} /> Новый чат
          </Button>
          {pollError && (
            <p className="mt-5 text-xs text-red-600" role="alert">
              Получение сообщений: {pollError}
            </p>
          )}
        </div>
      )}
    </section>
  )
}

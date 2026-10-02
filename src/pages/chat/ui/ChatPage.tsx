import { useState } from 'react'

import { ChatSidebar, Conversation, useChatStore } from '@/entities/chat'
import { LoginPanel } from '@/features/connect-instance'
import { CreateChatDialog } from '@/features/create-chat'
import { useIncomingMessagesQuery } from '@/features/receive-messages'
import { MessageComposer } from '@/features/send-message'
import { NavigationRail } from '@/shared/ui/NavigationRail'

export const ChatPage = () => {
  const [newChatOpen, setNewChatOpen] = useState(false)
  const credentials = useChatStore((state) => state.credentials)
  const chats = useChatStore((state) => state.chats)
  const activeChatId = useChatStore((state) => state.activeChatId)
  const setActiveChatId = useChatStore((state) => state.setActiveChatId)
  const disconnect = useChatStore((state) => state.disconnect)
  const activeChat = chats.find((chat) => chat.id === activeChatId)
  const incoming = useIncomingMessagesQuery()

  if (!credentials) return <LoginPanel />

  return (
    <main className="grid h-dvh min-h-0 grid-cols-[76px_332px_minmax(0,1fr)] overflow-hidden bg-white max-lg:grid-cols-[64px_280px_minmax(0,1fr)] max-sm:grid-cols-[58px_minmax(0,1fr)]">
      <NavigationRail onDisconnect={disconnect} />
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        idInstance={credentials.idInstance}
        pollError={incoming.error?.message ?? ''}
        onSelect={setActiveChatId}
        onCreate={() => {
          setNewChatOpen(true)
        }}
      />
      <Conversation
        chat={activeChat}
        pollError={incoming.error?.message ?? ''}
        onBack={() => {
          setActiveChatId(null)
        }}
        onCreate={() => {
          setNewChatOpen(true)
        }}
        composer={
          activeChat ? (
            <MessageComposer key={activeChat.id} chatId={activeChat.id} />
          ) : null
        }
      />
      <CreateChatDialog open={newChatOpen} onOpenChange={setNewChatOpen} />
    </main>
  )
}

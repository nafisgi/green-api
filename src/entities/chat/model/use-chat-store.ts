import { create } from 'zustand'
import type { StoreApi } from 'zustand'

import { addChat, appendMessage, upsertIncoming } from './chat-collection'
import type { Chat, Message } from './types'

import type { Credentials } from '@/shared/api/types'

interface SessionSlice {
  credentials: Credentials | null
  sessionId: number
  connect: (credentials: Credentials) => void
  disconnect: () => void
}

interface ChatsSlice {
  chats: Chat[]
  activeChatId: string | null
  setActiveChatId: (chatId: string | null) => void
  createChat: (chat: Chat) => void
  addOutgoing: (chatId: string, message: Message) => void
  addIncoming: (incoming: {
    chat: Omit<Chat, 'messages'>
    message: Message
  }) => void
}

type ChatStore = SessionSlice & ChatsSlice
type SetStore = StoreApi<ChatStore>['setState']

const createSessionSlice = (set: SetStore): SessionSlice => {
  return {
    credentials: null,
    sessionId: 0,
    connect: (credentials) => {
      set((state) => ({
        credentials,
        sessionId: state.sessionId + 1,
        chats: [],
        activeChatId: null,
      }))
    },
    disconnect: () => {
      set((state) => ({
        credentials: null,
        sessionId: state.sessionId + 1,
        chats: [],
        activeChatId: null,
      }))
    },
  }
}

const createChatsSlice = (set: SetStore): ChatsSlice => {
  return {
    chats: [],
    activeChatId: null,
    setActiveChatId: (activeChatId) => {
      set({ activeChatId })
    },
    createChat: (chat) => {
      set((state) => ({
        chats: addChat(state.chats, chat),
        activeChatId: chat.id,
      }))
    },
    addOutgoing: (chatId, message) => {
      set((state) => ({ chats: appendMessage(state.chats, chatId, message) }))
    },
    addIncoming: (incoming) => {
      set((state) => ({ chats: upsertIncoming(state.chats, incoming) }))
    },
  }
}

export const useChatStore = create<ChatStore>()((set) => ({
  ...createSessionSlice(set),
  ...createChatsSlice(set),
}))

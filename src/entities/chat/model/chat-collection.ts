import { uniqBy } from 'es-toolkit'

import type { Chat, Message } from './types'

export const addChat = (chats: Chat[], chat: Chat): Chat[] => {
  return chats.some((item) => item.id === chat.id) ? chats : [chat, ...chats]
}

export const appendMessage = (
  chats: Chat[],
  chatId: string,
  message: Message,
): Chat[] => {
  return chats.map((chat) =>
    chat.id === chatId
      ? {
          ...chat,
          messages: uniqBy([...chat.messages, message], (item) => item.id),
        }
      : chat,
  )
}

export const upsertIncoming = (
  chats: Chat[],
  incoming: { chat: Omit<Chat, 'messages'>; message: Message },
): Chat[] => {
  const existing = chats.find(
    (chat) =>
      chat.id === incoming.chat.id ||
      (incoming.chat.phone !== '' && chat.phone === incoming.chat.phone),
  )
  if (!existing)
    return [{ ...incoming.chat, messages: [incoming.message] }, ...chats]
  if (existing.messages.some((message) => message.id === incoming.message.id))
    return chats
  return appendMessage(chats, existing.id, incoming.message)
}

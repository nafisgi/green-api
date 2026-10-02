import { describe, expect, it } from 'vitest'

import { addChat, appendMessage, upsertIncoming } from './chat-collection'
import type { Chat, Message } from './types'

const chat: Chat = {
  id: '123456789012345@lid',
  phone: '79991234567',
  name: '+79991234567',
  messages: [],
}
const message: Message = {
  id: 'm1',
  text: 'Привет',
  direction: 'outgoing',
  timestamp: 1,
}

describe('chat collection', () => {
  it('does not duplicate chats or messages', () => {
    const chats = addChat(addChat([], chat), chat)
    const withMessage = appendMessage(
      appendMessage(chats, chat.id, message),
      chat.id,
      message,
    )
    expect(chats).toHaveLength(1)
    expect(withMessage[0]?.messages).toEqual([message])
  })

  it('creates a chat for a new sender and deduplicates repeated notifications', () => {
    const incoming = {
      chat: {
        id: '79990000000@c.us',
        phone: '79990000000',
        name: 'Ответ',
      },
      message: { ...message, direction: 'incoming' as const },
    }
    const chats = upsertIncoming([], incoming)
    expect(upsertIncoming(chats, incoming)).toEqual(chats)
    expect(chats[0]?.messages[0]?.text).toBe('Привет')
  })

  it('matches a reply by phone when CheckWhatsapp returned a lid', () => {
    const incoming = {
      chat: {
        id: '79991234567@c.us',
        phone: '79991234567',
        name: 'Ответ',
      },
      message: { ...message, direction: 'incoming' as const },
    }
    const chats = upsertIncoming([chat], incoming)
    expect(chats).toHaveLength(1)
    expect(chats[0]?.id).toBe(chat.id)
    expect(chats[0]?.messages).toEqual([incoming.message])
  })
})

import { z } from 'zod'

import type { Chat, Message } from '../model/types'

import { requestApi } from '@/shared/api/client'
import type { Credentials } from '@/shared/api/types'

const accountSchema = z.object({
  status: z.boolean().optional(),
  reason: z.string().optional(),
  existsWhatsapp: z.boolean(),
  chatId: z.string().optional(),
})
const sentSchema = z.object({ idMessage: z.string().min(1) })
const notificationSchema = z.object({
  receiptId: z.number().int().positive(),
  body: z.object({
    typeWebhook: z.string().optional(),
    idMessage: z.string().optional(),
    timestamp: z.number().optional(),
    senderData: z
      .object({
        chatId: z.string().optional(),
        chatName: z.string().optional(),
        sender: z.string().optional(),
      })
      .optional(),
    messageData: z
      .object({
        typeMessage: z.string().optional(),
        textMessageData: z
          .object({ textMessage: z.string().optional() })
          .optional(),
      })
      .optional(),
  }),
})

export interface IncomingMessage {
  chat: Omit<Chat, 'messages'>
  message: Message
}

export const findChatByPhone = async (
  credentials: Credentials,
  phone: string,
  signal?: AbortSignal,
): Promise<Chat> => {
  const account = await requestApi(
    'check-account',
    credentials,
    accountSchema,
    { phoneNumber: phone },
    signal,
  )
  if (account.status === false)
    throw new Error(account.reason ?? 'Инстанс недоступен.')
  if (!account.existsWhatsapp || !account.chatId)
    throw new Error('Аккаунт WhatsApp с таким номером не найден.')
  if (!/^\d+@(c\.us|lid)$/.test(account.chatId))
    throw new Error('GREEN-API вернул некорректный идентификатор чата.')
  return { id: account.chatId, phone, name: `+${phone}`, messages: [] }
}

export const sendTextMessage = async (
  credentials: Credentials,
  chatId: string,
  text: string,
  signal?: AbortSignal,
): Promise<Message> => {
  const sent = await requestApi(
    'send',
    credentials,
    sentSchema,
    { chatId, message: text },
    signal,
  )
  return {
    id: sent.idMessage,
    text,
    direction: 'outgoing',
    timestamp: Date.now(),
  }
}

export const receiveTextMessage = async (
  credentials: Credentials,
  signal: AbortSignal,
): Promise<IncomingMessage | null> => {
  const notification = await requestApi(
    'receive',
    credentials,
    notificationSchema.nullable(),
    {},
    signal,
  )
  if (!notification) return null
  const { body } = notification
  const sender = body.senderData
  const text = body.messageData?.textMessageData?.textMessage
  const isText =
    body.typeWebhook === 'incomingMessageReceived' &&
    body.messageData?.typeMessage === 'textMessage'
  const senderPhone = [sender?.chatId, sender?.sender]
    .find((id) => id?.endsWith('@c.us'))
    ?.replace(/@c\.us$/, '')
  const incoming =
    isText &&
    sender?.chatId &&
    /^\d+@(c\.us|lid)$/.test(sender.chatId) &&
    body.idMessage &&
    text !== undefined
      ? {
          chat: {
            id: sender.chatId,
            phone: senderPhone ?? '',
            name:
              sender.chatName ??
              (senderPhone ? `+${senderPhone}` : sender.chatId),
          },
          message: {
            id: body.idMessage,
            text,
            direction: 'incoming' as const,
            timestamp: body.timestamp ? body.timestamp * 1000 : Date.now(),
          },
        }
      : null
  await requestApi(
    'delete',
    credentials,
    z.unknown(),
    { receiptId: notification.receiptId },
    signal,
  )
  return incoming
}

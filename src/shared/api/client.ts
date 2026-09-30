import ky, { isHTTPError, isNetworkError, isTimeoutError } from 'ky'
import { z } from 'zod'

import type { Credentials } from './types'

import { isGreenApiUrl } from '@/shared/lib/is-green-api-url'

const errorResponseSchema = z.object({
  error: z.string().optional(),
  reason: z.string().optional(),
  message: z.string().optional(),
  description: z.string().optional(),
})
const credentialsSchema = z.object({
  apiUrl: z.string().refine(isGreenApiUrl),
  idInstance: z.string().regex(/^\d+$/),
  apiTokenInstance: z.string().regex(/^[a-zA-Z0-9]+$/),
})
const phoneSchema = z.string().regex(/^\d{11,16}$/)
const chatIdSchema = z.string().regex(/^\d+@(c\.us|lid)$/)
const messageSchema = z.string().trim().min(1).max(4000)
const receiptIdSchema = z.number().int().positive()

const client = ky.create({
  timeout: 75_000,
  retry: { limit: 0 },
  hooks: {
    beforeError: [
      async ({ error }) => {
        if (isHTTPError(error)) {
          const body: unknown = await error.response
            .clone()
            .json()
            .catch(() => null)
          const parsed = errorResponseSchema.safeParse(body)
          const reason = parsed.success
            ? (parsed.data.reason ??
              parsed.data.message ??
              parsed.data.error ??
              parsed.data.description)
            : undefined
          error.message =
            reason ??
            `GREEN-API вернул ошибку ${String(error.response.status)}.`
        } else if (isNetworkError(error)) {
          error.message =
            'Не удалось связаться с GREEN-API. Проверьте подключение и доступ к API из браузера.'
        } else if (isTimeoutError(error)) {
          error.message = 'GREEN-API не ответил вовремя.'
        }
        return error
      },
    ],
  },
})

export type ApiAction =
  'settings' | 'check-account' | 'send' | 'receive' | 'delete'

interface RequestDetails {
  method: 'GET' | 'POST' | 'DELETE'
  name: string
  suffix?: string
  body?: Record<string, unknown>
}

const requestDetails = (
  action: ApiAction,
  payload: Record<string, unknown>,
): RequestDetails => {
  switch (action) {
    case 'settings':
      return { method: 'GET', name: 'getSettings' }
    case 'check-account':
      return {
        method: 'POST',
        name: 'checkWhatsapp',
        body: { chatId: phoneSchema.parse(payload.phoneNumber) },
      }
    case 'send':
      return {
        method: 'POST',
        name: 'sendMessage',
        body: {
          chatId: chatIdSchema.parse(payload.chatId),
          message: messageSchema.parse(payload.message),
        },
      }
    case 'receive':
      return {
        method: 'GET',
        name: 'receiveNotification',
        suffix: '?receiveTimeout=5',
      }
    case 'delete':
      return {
        method: 'DELETE',
        name: 'deleteNotification',
        suffix: `/${String(receiptIdSchema.parse(payload.receiptId))}`,
      }
  }
}

export const requestApi = async <Schema extends z.ZodType>(
  action: ApiAction,
  credentials: Credentials,
  schema: Schema,
  payload: Record<string, unknown> = {},
  signal?: AbortSignal,
): Promise<z.output<Schema>> => {
  const { apiUrl, idInstance, apiTokenInstance } =
    credentialsSchema.parse(credentials)
  const details = requestDetails(action, payload)
  const url = `${apiUrl.replace(/\/$/, '')}/waInstance${idInstance}/${details.name}/${apiTokenInstance}${details.suffix ?? ''}`
  const response: unknown = await client(url, {
    method: details.method,
    ...(details.body ? { json: details.body } : {}),
    ...(signal ? { signal } : {}),
  }).json()
  return schema.parse(response)
}

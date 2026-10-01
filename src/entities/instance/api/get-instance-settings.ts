import { z } from 'zod'

import { requestApi } from '@/shared/api/client'
import type { Credentials } from '@/shared/api/types'

const settingsSchema = z.object({
  status: z.boolean().optional(),
  reason: z.string().optional(),
  typeInstance: z.string().optional(),
  incomingWebhook: z.string().optional(),
  webhookUrl: z.string().nullish(),
})

export const verifyInstance = async (
  credentials: Credentials,
  signal?: AbortSignal,
): Promise<void> => {
  const settings = await requestApi(
    'settings',
    credentials,
    settingsSchema,
    {},
    signal,
  )
  if (settings.status === false)
    throw new Error(settings.reason ?? 'Инстанс недоступен.')
  if (settings.typeInstance && settings.typeInstance !== 'whatsapp')
    throw new Error('Этот инстанс не относится к WhatsApp.')
  if (settings.incomingWebhook !== 'yes' || settings.webhookUrl) {
    throw new Error(
      'В настройках инстанса включите входящие уведомления и оставьте Webhook URL пустым.',
    )
  }
}

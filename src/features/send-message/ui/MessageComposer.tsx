import { zodResolver } from '@hookform/resolvers/zod'
import { Send } from 'lucide-react'
import type { KeyboardEvent } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { useSendMessageMutation } from '../model/useSendMessageMutation'

import { Button } from '@/shared/ui/Button'
import { Textarea } from '@/shared/ui/Textarea'

const messageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, 'Введите текст сообщения.')
    .max(4000, 'Сообщение слишком длинное.'),
})

type MessageInput = z.infer<typeof messageSchema>

interface MessageComposerProps {
  chatId: string
}

export const MessageComposer = ({ chatId }: MessageComposerProps) => {
  const mutation = useSendMessageMutation()
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MessageInput>({
    resolver: zodResolver(messageSchema),
    defaultValues: { message: '' },
  })
  const draft = useWatch({ control, name: 'message' })

  const submit = ({ message }: MessageInput) => {
    mutation.mutate(
      { chatId, text: message.trim() },
      {
        onSuccess: () => {
          reset()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      },
    )
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <form
      className="border-t border-slate-200 bg-white px-3 pt-3 pb-4 sm:px-10"
      onSubmit={(event) => {
        void handleSubmit(submit)(event)
      }}
      noValidate
    >
      {(errors.message ?? mutation.error) && (
        <p className="mx-auto mb-2 max-w-3xl text-xs text-red-600" role="alert">
          {errors.message?.message ?? mutation.error?.message}
        </p>
      )}
      <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-slate-200 px-4 py-2 shadow-sm focus-within:border-emerald-500">
        <Textarea
          aria-label="Текст сообщения"
          placeholder="Напишите сообщение…"
          maxLength={4000}
          rows={1}
          disabled={mutation.isPending}
          onKeyDown={handleKeyDown}
          {...register('message')}
        />
        <Button
          type="submit"
          aria-label="Отправить сообщение"
          title="Отправить"
          className="size-10 shrink-0 p-0"
          disabled={!draft.trim() || mutation.isPending}
        >
          <Send aria-hidden="true" size={18} />
        </Button>
      </div>
      <p className="mx-auto mt-2 max-w-3xl text-right text-[10px] text-slate-400 max-sm:hidden">
        Enter — отправить · Shift + Enter — новая строка
      </p>
    </form>
  )
}

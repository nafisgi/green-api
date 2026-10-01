import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { useCreateChatMutation } from '../model/useCreateChatMutation'

import { Button } from '@/shared/ui/Button'
import { Dialog } from '@/shared/ui/Dialog'
import { Input } from '@/shared/ui/Input'

const phoneSchema = z.object({
  phone: z
    .string()
    .refine(
      (value) => /^\d{11,16}$/.test(value.replace(/\D/g, '')),
      'Введите номер от 11 до 16 цифр в международном формате.',
    ),
})

type PhoneInput = z.infer<typeof phoneSchema>

interface CreateChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const CreateChatDialog = ({
  open,
  onOpenChange,
}: CreateChatDialogProps) => {
  const mutation = useCreateChatMutation()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PhoneInput>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '' },
  })

  const submit = (values: PhoneInput) => {
    mutation.mutate(values.phone.replace(/\D/g, ''), {
      onSuccess: () => {
        reset()
        onOpenChange(false)
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Новый чат"
      description="Введите номер человека, которому хотите написать в WhatsApp."
    >
      <form
        onSubmit={(event) => {
          void handleSubmit(submit)(event)
        }}
        noValidate
      >
        <label
          htmlFor="phone"
          className="mb-2 block text-sm font-semibold text-slate-600"
        >
          Номер телефона
        </label>
        <Input
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+7 999 123-45-67"
          aria-invalid={Boolean(errors.phone)}
          {...register('phone')}
        />
        {errors.phone && (
          <p className="mt-2 text-xs text-red-600" role="alert">
            {errors.phone.message}
          </p>
        )}
        {mutation.error && (
          <p className="mt-2 text-xs text-red-600" role="alert">
            {mutation.error.message}
          </p>
        )}
        <Button
          type="submit"
          className="mt-6 min-h-12 w-full justify-between"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Проверяем номер…' : 'Создать чат'}{' '}
          <span aria-hidden="true">→</span>
        </Button>
      </form>
      <p className="mt-4 text-center text-xs text-slate-400">
        Укажите номер с кодом страны: от 11 до 16 цифр
      </p>
    </Dialog>
  )
}

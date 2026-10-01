import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useConnectInstanceMutation } from '../model/useConnectInstanceMutation'

import { isGreenApiUrl } from '@/shared/lib/is-green-api-url'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

const credentialsSchema = z.object({
  apiUrl: z
    .url('Укажите корректный API URL.')
    .refine(isGreenApiUrl, 'API URL должен вести на HTTPS-хост GREEN-API.'),
  idInstance: z.string().regex(/^\d+$/, 'Введите цифровой idInstance.'),
  apiTokenInstance: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/, 'Введите apiTokenInstance.'),
})

type CredentialsInput = z.infer<typeof credentialsSchema>

export const ConnectInstanceForm = () => {
  const mutation = useConnectInstanceMutation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CredentialsInput>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      idInstance: '',
      apiTokenInstance: '',
    },
  })

  const submit = (values: CredentialsInput) => {
    mutation.mutate({
      apiUrl: values.apiUrl.trim().replace(/\/$/, ''),
      idInstance: values.idInstance.trim(),
      apiTokenInstance: values.apiTokenInstance.trim(),
    })
  }

  return (
    <form
      className="mt-7 flex flex-col"
      onSubmit={(event) => {
        void handleSubmit(submit)(event)
      }}
      noValidate
    >
      <label
        htmlFor="api-url"
        className="mb-2 text-sm font-semibold text-slate-600"
      >
        API URL
      </label>
      <Input
        id="api-url"
        type="url"
        autoComplete="url"
        aria-invalid={Boolean(errors.apiUrl)}
        {...register('apiUrl')}
      />
      {errors.apiUrl && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {errors.apiUrl.message}
        </p>
      )}
      <label
        htmlFor="instance-id"
        className="mt-5 mb-2 text-sm font-semibold text-slate-600"
      >
        idInstance
      </label>
      <Input
        id="instance-id"
        inputMode="numeric"
        placeholder="Например, 3100000000"
        autoComplete="off"
        aria-invalid={Boolean(errors.idInstance)}
        {...register('idInstance')}
      />
      {errors.idInstance && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {errors.idInstance.message}
        </p>
      )}
      <label
        htmlFor="instance-token"
        className="mt-5 mb-2 text-sm font-semibold text-slate-600"
      >
        apiTokenInstance
      </label>
      <Input
        id="instance-token"
        type="password"
        placeholder="Токен вашего инстанса"
        autoComplete="off"
        aria-invalid={Boolean(errors.apiTokenInstance)}
        {...register('apiTokenInstance')}
      />
      {errors.apiTokenInstance && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {errors.apiTokenInstance.message}
        </p>
      )}
      {mutation.error && (
        <p
          className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
          role="alert"
        >
          {mutation.error.message}
        </p>
      )}
      <Button
        type="submit"
        className="mt-7 min-h-13 justify-between"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? 'Подключаем…' : 'Открыть чат'}{' '}
        <span aria-hidden="true">→</span>
      </Button>
    </form>
  )
}

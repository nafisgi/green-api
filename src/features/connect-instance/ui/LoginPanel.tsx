import { MessageCircle } from 'lucide-react'

import { ConnectInstanceForm } from './ConnectInstanceForm'

export const LoginPanel = () => {
  return (
    <main className="grid min-h-dvh place-items-center bg-[#e9f1ed] p-4 sm:p-8">
      <div className="grid w-full max-w-[1060px] overflow-hidden rounded-[27px] bg-white shadow-[0_22px_70px_#35407414] md:min-h-[620px] md:grid-cols-2">
        <section className="flex min-h-45 flex-col justify-between overflow-hidden bg-[linear-gradient(145deg,#0d8b68,#075e50)] p-6 text-white sm:p-10 md:p-14">
          <div className="flex items-center gap-3 text-2xl font-extrabold tracking-tight">
            <span className="grid size-11 place-items-center rounded-2xl bg-white text-[#0d8b68]">
              W
            </span>{' '}
            WhatsApp
          </div>
          <div className="mt-5 sm:mt-7">
            <span className="text-[11px] font-bold tracking-[.16em] opacity-80">
              ПРОСТОЙ ЧАТ ДЛЯ WHATSAPP
            </span>
            <h1 className="mt-3 mb-4 text-[31px] leading-tight font-bold tracking-tight sm:mt-5 sm:text-5xl">
              Сообщения
              <br />
              рядом с вами.
            </h1>
            <p className="max-w-sm leading-relaxed text-emerald-100 max-sm:hidden">
              Общайтесь в WhatsApp через ваш инстанс GREEN-API. Только текст,
              ничего лишнего.
            </p>
          </div>
          <p className="text-xs text-emerald-100 max-sm:hidden">
            Работает через GREEN-API WhatsApp
          </p>
        </section>
        <section
          className="flex flex-col justify-center p-6 sm:p-12 md:p-16"
          aria-labelledby="login-title"
        >
          <div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-[#0d8b68]">
            <MessageCircle aria-hidden="true" size={20} />
          </div>
          <h2
            id="login-title"
            className="mt-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            Подключить аккаунт
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Введите данные инстанса из личного кабинета GREEN-API.
          </p>
          <ConnectInstanceForm />
          <p className="mt-5 text-xs leading-relaxed text-slate-400">
            Данные используются для запросов и не сохраняются после закрытия
            страницы.
          </p>
        </section>
      </div>
    </main>
  )
}

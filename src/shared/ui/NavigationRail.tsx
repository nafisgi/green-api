import { LogOut, MessageCircle } from 'lucide-react'

import { Button } from './Button'

export const NavigationRail = ({
  onDisconnect,
}: {
  onDisconnect: () => void
}) => {
  return (
    <nav
      aria-label="Основная навигация"
      className="flex flex-col items-center gap-7 border-r border-slate-200 bg-[#fbfcff] px-2 py-5"
    >
      <div
        aria-label="WhatsApp"
        className="grid size-10 place-items-center rounded-2xl bg-emerald-700 text-2xl font-bold text-white"
      >
        W
      </div>
      <span
        aria-current="page"
        className="flex w-14 flex-col items-center gap-1 rounded-2xl bg-emerald-50 py-2 text-[10px] font-semibold text-emerald-700"
      >
        <MessageCircle aria-hidden="true" size={20} />
        Чаты
      </span>
      <Button
        type="button"
        variant="ghost"
        className="mt-auto size-10 p-0"
        aria-label="Отключить инстанс"
        title="Отключить"
        onClick={onDisconnect}
      >
        <LogOut aria-hidden="true" size={20} />
      </Button>
    </nav>
  )
}

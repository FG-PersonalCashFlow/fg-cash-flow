import type { Stream } from '../types/cashflow'
import { toMonthly } from '../types/cashflow'

interface Props {
  stream: Stream
  onEdit: (stream: Stream) => void
  onDelete: (id: string) => void
}

const FREQ_LABEL: Record<string, string> = {
  weekly: 'wk',
  biweekly: 'bi-wk',
  monthly: 'mo',
  quarterly: 'qtr',
  annually: 'yr',
}

function fmt(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

export default function StreamCard({ stream, onEdit, onDelete }: Props) {
  const monthly = toMonthly(stream.amount, stream.frequency)
  const isIncome = stream.type === 'income'

  return (
    <div
      className={`group flex items-center justify-between gap-4 rounded-xl px-4 py-3 border transition-opacity ${
        stream.active ? 'opacity-100' : 'opacity-40'
      } bg-gray-900 border-gray-800 hover:border-gray-700`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white truncate">{stream.name}</p>
        {stream.notes && (
          <p className="text-xs text-gray-500 truncate">{stream.notes}</p>
        )}
      </div>

      <div className="text-right shrink-0">
        <p className={`text-sm font-semibold ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isIncome ? '+' : '-'}{fmt(stream.amount)}
          <span className="text-xs font-normal text-gray-500 ml-1">/{FREQ_LABEL[stream.frequency]}</span>
        </p>
        <p className="text-xs text-gray-500">{fmt(monthly)}/mo</p>
      </div>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(stream)}
          className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors cursor-pointer"
          title="Edit"
        >
          <PencilIcon />
        </button>
        <button
          onClick={() => onDelete(stream.id)}
          className="p-1.5 rounded-lg hover:bg-rose-900/50 text-gray-400 hover:text-rose-400 transition-colors cursor-pointer"
          title="Delete"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  )
}

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

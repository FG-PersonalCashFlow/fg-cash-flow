import { useState, useEffect } from 'react'
import type { Stream, StreamType, Frequency } from '../types/cashflow'

interface Props {
  stream?: Stream
  defaultType?: StreamType
  onSave: (data: Omit<Stream, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void
  onClose: () => void
}

const FREQUENCIES: { value: Frequency; label: string }[] = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually', label: 'Annually' },
]

export default function StreamModal({ stream, defaultType = 'income', onSave, onClose }: Props) {
  const [name, setName] = useState(stream?.name ?? '')
  const [type, setType] = useState<StreamType>(stream?.type ?? defaultType)
  const [amount, setAmount] = useState(String(stream?.amount ?? ''))
  const [frequency, setFrequency] = useState<Frequency>(stream?.frequency ?? 'monthly')
  const [notes, setNotes] = useState(stream?.notes ?? '')
  const [active, setActive] = useState(stream?.active ?? true)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave({
      id: stream?.id,
      name: name.trim(),
      type,
      amount: parseFloat(amount) || 0,
      frequency,
      notes: notes.trim() || undefined,
      active,
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-lg font-semibold text-white mb-5">
          {stream ? 'Edit Stream' : 'Add Stream'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Freelance Design"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as StreamType)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as Frequency)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                {FREQUENCIES.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Amount ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Notes (optional)</label>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              placeholder="Any context..."
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-300">Active</span>
          </label>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

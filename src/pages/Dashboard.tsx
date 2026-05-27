import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { useStreams } from '../hooks/useStreams'
import StreamCard from '../components/StreamCard'
import StreamModal from '../components/StreamModal'
import SummaryBar from '../components/SummaryBar'
import type { Stream, StreamType } from '../types/cashflow'

export default function Dashboard() {
  const { user } = useAuth()
  const { income, expenses, summary, loading, writeError, upsertStream, removeStream } = useStreams(user?.uid)
  const [editing, setEditing] = useState<Stream | null>(null)
  const [adding, setAdding] = useState<StreamType | null>(null)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">💰</span>
          <span className="font-semibold text-white">Cash Flow</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400 hidden sm:block">{user?.email}</span>
          <button
            onClick={() => signOut(auth)}
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {writeError && (
          <div className="mb-4 bg-rose-900/40 border border-rose-700 text-rose-300 text-sm rounded-xl px-4 py-3">
            {writeError} — check your <a href="https://console.firebase.google.com" target="_blank" className="underline">Firestore security rules</a>.
          </div>
        )}
        <SummaryBar {...summary} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StreamSection
            title="Income"
            streams={income}
            accent="emerald"
            onAdd={() => setAdding('income')}
            onEdit={setEditing}
            onDelete={removeStream}
          />
          <StreamSection
            title="Expenses"
            streams={expenses}
            accent="rose"
            onAdd={() => setAdding('expense')}
            onEdit={setEditing}
            onDelete={removeStream}
          />
        </div>
      </main>

      {editing && (
        <StreamModal
          stream={editing}
          onSave={upsertStream}
          onClose={() => setEditing(null)}
        />
      )}
      {adding && (
        <StreamModal
          defaultType={adding}
          onSave={upsertStream}
          onClose={() => setAdding(null)}
        />
      )}
    </div>
  )
}

function StreamSection({
  title,
  streams,
  accent,
  onAdd,
  onEdit,
  onDelete,
}: {
  title: string
  streams: Stream[]
  accent: 'emerald' | 'rose'
  onAdd: () => void
  onEdit: (s: Stream) => void
  onDelete: (id: string) => void
}) {
  const accentBtn =
    accent === 'emerald'
      ? 'bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-400 border-emerald-800'
      : 'bg-rose-900/30 hover:bg-rose-900/50 text-rose-400 border-rose-800'

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">{title}</h2>
        <button
          onClick={onAdd}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${accentBtn}`}
        >
          + Add
        </button>
      </div>

      <div className="space-y-2">
        {streams.length === 0 && (
          <p className="text-sm text-gray-600 py-4 text-center">No {title.toLowerCase()} streams yet.</p>
        )}
        {streams.map((s) => (
          <StreamCard key={s.id} stream={s} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  )
}

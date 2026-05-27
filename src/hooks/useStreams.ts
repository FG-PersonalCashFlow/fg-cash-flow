import { useEffect, useState } from 'react'
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Stream, StreamType } from '../types/cashflow'
import { DEFAULT_INCOME_STREAMS, DEFAULT_EXPENSE_STREAMS, toMonthly } from '../types/cashflow'

function streamsRef(uid: string) {
  return collection(db, 'users', uid, 'streams')
}

export function useStreams(uid: string | undefined) {
  const [streams, setStreams] = useState<Stream[]>([])
  const [loading, setLoading] = useState(true)
  const [writeError, setWriteError] = useState<string | null>(null)

  useEffect(() => {
    if (!uid) return
    return onSnapshot(
      streamsRef(uid),
      (snap) => {
        if (snap.empty) {
          seedDefaults(uid)
        } else {
          setStreams(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Stream)))
        }
        setLoading(false)
      },
      (err) => {
        console.error('Firestore read error:', err)
        setWriteError(`Read failed: ${err.message}`)
        setLoading(false)
      },
    )
  }, [uid])

  async function seedDefaults(uid: string) {
    const batch = writeBatch(db)
    const now = Date.now()
    const all = [...DEFAULT_INCOME_STREAMS, ...DEFAULT_EXPENSE_STREAMS]
    all.forEach((s, i) => {
      const ref = doc(streamsRef(uid))
      batch.set(ref, { ...s, createdAt: now + i, updatedAt: now + i })
    })
    await batch.commit()
  }

  async function upsertStream(uid: string, stream: Omit<Stream, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) {
    setWriteError(null)
    const now = Date.now()
    try {
      if (stream.id) {
        const { id, notes, ...rest } = stream
        await updateDoc(doc(streamsRef(uid), id), {
          ...rest,
          notes: notes ?? deleteField(),
          updatedAt: now,
        })
      } else {
        const { id: _id, notes, ...rest } = stream
        const ref = doc(streamsRef(uid))
        await setDoc(ref, {
          ...rest,
          ...(notes ? { notes } : {}),
          createdAt: now,
          updatedAt: now,
        })
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error('Firestore write error:', err)
      setWriteError(`Save failed: ${msg}`)
    }
  }

  async function removeStream(uid: string, id: string) {
    setWriteError(null)
    try {
      await deleteDoc(doc(streamsRef(uid), id))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error('Firestore delete error:', err)
      setWriteError(`Delete failed: ${msg}`)
    }
  }

  const income = streams.filter((s) => s.type === 'income' && s.active)
  const expenses = streams.filter((s) => s.type === 'expense' && s.active)

  const totalMonthlyIncome = income.reduce((sum, s) => sum + toMonthly(s.amount, s.frequency), 0)
  const totalMonthlyExpenses = expenses.reduce((sum, s) => sum + toMonthly(s.amount, s.frequency), 0)
  const netMonthlyCashFlow = totalMonthlyIncome - totalMonthlyExpenses
  const annualProjection = netMonthlyCashFlow * 12

  return {
    streams,
    income,
    expenses,
    loading,
    writeError,
    summary: { totalMonthlyIncome, totalMonthlyExpenses, netMonthlyCashFlow, annualProjection },
    upsertStream: (s: Parameters<typeof upsertStream>[1]) => upsertStream(uid!, s),
    removeStream: (id: string) => removeStream(uid!, id),
  }
}

export type { StreamType }

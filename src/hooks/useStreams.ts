import { useEffect, useState } from 'react'
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
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

  useEffect(() => {
    if (!uid) return
    return onSnapshot(streamsRef(uid), (snap) => {
      if (snap.empty) {
        seedDefaults(uid)
      } else {
        setStreams(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Stream)))
      }
      setLoading(false)
    })
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
    const now = Date.now()
    if (stream.id) {
      const { id, ...data } = stream
      await updateDoc(doc(streamsRef(uid), id), { ...data, updatedAt: now })
    } else {
      const ref = doc(streamsRef(uid))
      await setDoc(ref, { ...stream, createdAt: now, updatedAt: now })
    }
  }

  async function removeStream(uid: string, id: string) {
    await deleteDoc(doc(streamsRef(uid), id))
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
    summary: { totalMonthlyIncome, totalMonthlyExpenses, netMonthlyCashFlow, annualProjection },
    upsertStream: (s: Parameters<typeof upsertStream>[1]) => upsertStream(uid!, s),
    removeStream: (id: string) => removeStream(uid!, id),
  }
}

export type { StreamType }

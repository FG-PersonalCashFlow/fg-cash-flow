interface Props {
  totalMonthlyIncome: number
  totalMonthlyExpenses: number
  netMonthlyCashFlow: number
  annualProjection: number
}

function fmt(n: number) {
  return Math.abs(n).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

export default function SummaryBar({ totalMonthlyIncome, totalMonthlyExpenses, netMonthlyCashFlow, annualProjection }: Props) {
  const isPositive = netMonthlyCashFlow >= 0
  const savingsRate = totalMonthlyIncome > 0 ? (netMonthlyCashFlow / totalMonthlyIncome) * 100 : 0

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
      <StatCard label="Monthly Income" value={fmt(totalMonthlyIncome)} color="text-emerald-400" prefix="+" />
      <StatCard label="Monthly Expenses" value={fmt(totalMonthlyExpenses)} color="text-rose-400" prefix="-" />
      <StatCard
        label="Net Cash Flow"
        value={fmt(netMonthlyCashFlow)}
        color={isPositive ? 'text-indigo-400' : 'text-amber-400'}
        prefix={isPositive ? '+' : '-'}
        sub={`${savingsRate.toFixed(1)}% savings rate`}
      />
      <StatCard
        label="Annual Projection"
        value={fmt(annualProjection)}
        color={isPositive ? 'text-indigo-400' : 'text-amber-400'}
        prefix={isPositive ? '+' : '-'}
        sub="at current rate"
      />
    </div>
  )
}

function StatCard({
  label,
  value,
  color,
  prefix,
  sub,
}: {
  label: string
  value: string
  color: string
  prefix: string
  sub?: string
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-xl font-bold ${color}`}>
        <span className="text-sm mr-0.5">{prefix}</span>
        {value}
      </p>
      {sub && <p className="text-xs text-gray-600 mt-0.5">{sub}</p>}
    </div>
  )
}

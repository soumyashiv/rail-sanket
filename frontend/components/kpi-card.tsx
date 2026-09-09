import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import type { Kpi } from '@/lib/types'
import { toneDot } from '@/lib/status'

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const improving =
    kpi.trend === 'flat'
      ? null
      : (kpi.trend === 'up') === (kpi.goodDirection === 'up')

  const TrendIcon = kpi.trend === 'up' ? ArrowUpRight : kpi.trend === 'down' ? ArrowDownRight : Minus

  return (
    <Card className="relative gap-0 overflow-hidden p-3.5 sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground leading-snug">
          {kpi.label}
        </p>
        <span className={cn('size-2 shrink-0 rounded-full', toneDot[kpi.tone])} />
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="font-mono text-xl font-bold tabular-nums text-foreground">
          {kpi.value}
        </span>
        {kpi.unit && <span className="text-xs font-medium text-muted-foreground">{kpi.unit}</span>}
      </div>
      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
        <span
          className={cn(
            'inline-flex items-center gap-0.5 font-medium',
            improving === null
              ? 'text-muted-foreground'
              : improving
                ? 'text-success'
                : 'text-danger',
          )}
        >
          <TrendIcon className="size-3" />
          {kpi.delta > 0 ? '+' : ''}
          {kpi.delta}
          {kpi.unit === '%' ? 'pp' : ''}
        </span>
        <span className="text-muted-foreground/80">vs last week</span>
      </div>
    </Card>
  )
}


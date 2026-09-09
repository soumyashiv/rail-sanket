import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/status-badge'
import {
  monthlyCorridorCapacity,
  monthlyBacklogTrend,
  departmentWorkload,
  weeklyPlan,
} from '@/lib/data/dashboard'
import { recommendedBlocks } from '@/lib/data/recommendations'
import { corridors } from '@/lib/data/corridors'
import { MonthlyCapacityChart } from '@/components/charts/monthly-capacity-chart'
import { MonthlyBacklogChart } from '@/components/charts/monthly-backlog-chart'

// September 2026 calendar data — which dates have blocks
const calendarWeeks = [
  { days: [
    { d: 1, hasBlock: false }, { d: 2, hasBlock: true }, { d: 3, hasBlock: false }, { d: 4, hasBlock: false }, { d: 5, hasBlock: true }, { d: 6, hasBlock: false }, { d: 7, hasBlock: false },
  ]},
  { days: [
    { d: 8, hasBlock: false }, { d: 9, hasBlock: true }, { d: 10, hasBlock: false }, { d: 11, hasBlock: true }, { d: 12, hasBlock: false }, { d: 13, hasBlock: false }, { d: 14, hasBlock: true, isPlanned: true },
  ]},
  { days: [
    { d: 15, hasBlock: true, isPlanned: true }, { d: 16, hasBlock: true, isPlanned: true }, { d: 17, hasBlock: false }, { d: 18, hasBlock: false }, { d: 19, hasBlock: true }, { d: 20, hasBlock: false }, { d: 21, hasBlock: false },
  ]},
  { days: [
    { d: 22, hasBlock: false }, { d: 23, hasBlock: true }, { d: 24, hasBlock: false }, { d: 25, hasBlock: true }, { d: 26, hasBlock: false }, { d: 27, hasBlock: false }, { d: 28, hasBlock: true },
  ]},
  { days: [
    { d: 29, hasBlock: false }, { d: 30, hasBlock: false }, { d: null }, { d: null }, { d: null }, { d: null }, { d: null },
  ]},
]

export default function MonthlyPage() {
  const totalDemand = monthlyCorridorCapacity.reduce((s, c) => s + c.demandHours, 0)
  const totalCapacity = monthlyCorridorCapacity.reduce((s, c) => s + c.capacityHours, 0)
  const totalCritical = monthlyCorridorCapacity.reduce((s, c) => s + c.criticalOpen, 0)
  const utilPct = Math.round((totalDemand / totalCapacity) * 100)

  return (
    <div>
      <PageHeader
        badge="DIVISION CAPACITY & STRATEGIC PLANNING · PRD SECTION 14"
        title="Monthly Capacity & Maintenance Demand"
        description="September 2026 — Kharagpur Division macro planning. Corridor-level maintenance demand vs. available train path windows and backlog drawdown rate."
      />

      {/* Top KPIs */}
      <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Demand hours', value: `${totalDemand}h`, note: 'This month' },
          { label: 'Available capacity', value: `${totalCapacity}h`, note: 'Block windows' },
          { label: 'Capacity utilization', value: `${utilPct}%`, note: 'Division-wide' },
          { label: 'Critical open', value: totalCritical, note: 'Needs priority' },
        ].map((s) => (
          <Card key={s.label} className="gap-0 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
            <p className="font-mono text-2xl font-semibold tabular-nums mt-2">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.note}</p>
          </Card>
        ))}
      </section>

      {/* Charts */}
      <section className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Corridor capacity vs. demand</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Hours planned vs. available block windows</p>
          </CardHeader>
          <CardContent>
            <MonthlyCapacityChart data={monthlyCorridorCapacity} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Backlog reduction trend</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Total open tasks and critical subset by week</p>
          </CardHeader>
          <CardContent>
            <MonthlyBacklogChart data={monthlyBacklogTrend} />
          </CardContent>
        </Card>
      </section>

      {/* Calendar and corridor table side by side */}
      <section className="grid gap-4 lg:grid-cols-5">
        {/* Mini calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>September 2026</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Maintenance block calendar</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <div key={i} className="text-xs font-medium text-muted-foreground py-1">{d}</div>
              ))}
            </div>
            {calendarWeeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-1 mb-1">
                {week.days.map((day, di) => (
                  <div
                    key={di}
                    className={`flex h-8 items-center justify-center rounded text-xs font-medium transition-colors ${
                      !day.d
                        ? ''
                        : day.isPlanned
                          ? 'bg-primary text-primary-foreground font-semibold'
                          : day.hasBlock
                            ? 'bg-info-muted text-info-foreground border border-info/20'
                            : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {day.d ?? ''}
                  </div>
                ))}
              </div>
            ))}
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded bg-primary" /> This week (planned)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded bg-info-muted border border-info/20" /> Block scheduled
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Corridor detail table */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Corridor-level breakdown</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Demand vs. capacity and critical open tasks</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Corridor</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Demand</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Capacity</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Util %</th>
                    <th className="text-right py-2 pl-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Critical open</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {monthlyCorridorCapacity.map((row) => {
                    const util = Math.round((row.demandHours / row.capacityHours) * 100)
                    const corridor = corridors.find((c) => c.id === row.corridor)
                    return (
                      <tr key={row.corridor} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 pr-3">
                          <span className="font-mono text-xs font-semibold text-primary">{row.corridor}</span>
                          <span className="ml-2 text-xs text-muted-foreground hidden sm:inline">{corridor?.name}</span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums">{row.demandHours}h</td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums text-muted-foreground">{row.capacityHours}h</td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  util >= 90 ? 'bg-danger' : util >= 75 ? 'bg-warning' : 'bg-success'
                                }`}
                                style={{ width: `${Math.min(100, util)}%` }}
                              />
                            </div>
                            <span className="font-mono text-xs font-semibold tabular-nums">{util}%</span>
                          </div>
                        </td>
                        <td className="py-3 pl-3 text-right">
                          {row.criticalOpen > 0 ? (
                            <StatusBadge tone="danger" dot={false}>{row.criticalOpen}</StatusBadge>
                          ) : (
                            <StatusBadge tone="success" dot={false}>0</StatusBadge>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Department workload */}
      <section className="mt-4 grid gap-4 sm:grid-cols-3">
        {departmentWorkload.map((d) => (
          <Card key={d.department}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{d.department}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { label: 'Open', value: d.open, color: 'bg-warning' },
                  { label: 'Scheduled', value: d.scheduled, color: 'bg-info' },
                  { label: 'Bundled', value: d.bundled, color: 'bg-success' },
                ].map((item) => {
                  const total = d.open + d.scheduled + d.bundled
                  return (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-mono font-medium tabular-nums">{item.value}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.color}`}
                          style={{ width: `${(item.value / total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Total: {d.open + d.scheduled + d.bundled} tasks this month
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}

import Link from 'next/link'
import {
  ArrowRight,
  CalendarClock,
  TriangleAlert,
  Sparkles,
  TrainFront,
} from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { KpiCard } from '@/components/kpi-card'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AvailabilityChart } from '@/components/charts/availability-chart'
import { WorkloadChart } from '@/components/charts/workload-chart'
import { CriticalityDonut } from '@/components/charts/criticality-donut'
import { kpis, criticalityBreakdown } from '@/lib/data/dashboard'
import { recommendedBlocks } from '@/lib/data/recommendations'
import { conflicts, exceptions } from '@/lib/data/conflicts'
import { corridorName } from '@/lib/data/corridors'
import {
  confidenceTone,
  severityTone,
  impactTone,
} from '@/lib/status'

const critColors: Record<string, string> = {
  critical: 'bg-chart-4',
  high: 'bg-chart-3',
  medium: 'bg-chart-1',
  low: 'bg-chart-5',
}

export default function DashboardPage() {
  const todayBlocks = recommendedBlocks.filter((b) => b.date === '2026-09-14')
  const openConflicts = conflicts.filter((c) => !c.resolved)

  return (
    <div className="space-y-6">
      <PageHeader
        badge="SOUTH EASTERN RAILWAY · KHARAGPUR DIVISION"
        title="Operations & Block Planning Dashboard"
        description="Coordinated multi-department maintenance planning across Engineering, S&T and Traction — Kharagpur Division, week of 14 Sep 2026."
      >
        <Button variant="outline" asChild className="shadow-xs">
          <Link href="/queue">
            Work queue ({openConflicts.length} pending)
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button asChild className="shadow-sm">
          <Link href="/planner">
            <CalendarClock className="size-4" />
            Open Auto Planner
          </Link>
        </Button>
      </PageHeader>

      {/* AI Planning Intelligence Banner */}
      <div className="relative overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground text-sm sm:text-base">
                  Week 38 Coordinated Block Plan Generated
                </span>
                <span className="rounded-full bg-success/20 px-2 py-0.5 font-mono text-[10px] font-bold text-success">
                  96.1% Availability
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                5 candidate blocks scheduled across 5 corridors · 375 minutes maintenance downtime saved · 14 tasks bundled without timetable clash.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="default" asChild>
              <Link href="/recommendations">
                Review Recommendations
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-7">
        {kpis.map((k) => (
          <KpiCard key={k.id} kpi={k} />
        ))}
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Availability & block utilization</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                7-day rolling trend across the division
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-chart-1" /> Availability
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-chart-2" /> Utilization
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <AvailabilityChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending by criticality</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Open maintenance tasks</p>
          </CardHeader>
          <CardContent>
            <CriticalityDonut />
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {criticalityBreakdown.map((c) => (
                <li key={c.key} className="flex items-center gap-2">
                  <span className={`size-2.5 rounded-[3px] ${critColors[c.key]}`} />
                  <span className="text-muted-foreground">{c.name}</span>
                  <span className="ml-auto font-mono font-medium tabular-nums">{c.value}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Workload by department</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Open · Scheduled · Bundled</p>
          </CardHeader>
          <CardContent>
            <WorkloadChart />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <CardTitle>Today&apos;s recommended blocks</CardTitle>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/recommendations">
                All recommendations
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayBlocks.map((b) => (
              <div
                key={b.id}
                className="flex flex-col gap-3 rounded-xl border border-border/80 bg-secondary/30 p-3.5 transition-all hover:bg-secondary/50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3.5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                    <TrainFront className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-foreground">{b.id}</span>
                      <p className="font-semibold text-foreground text-sm">
                        {corridorName(b.corridorId)} <span className="text-muted-foreground font-normal">· {b.section}</span>
                      </p>
                    </div>
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                      {b.start}–{b.end} · {b.durationMin} min · {b.blockType}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="rounded bg-background/80 px-2 py-0.5 font-medium border border-border/60 text-muted-foreground">
                        {b.taskIds.length} tasks bundled: {b.taskIds.join(', ')}
                      </span>
                      <span className="font-semibold text-success">
                        +{b.downtimeSavedMin}m downtime saved
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end sm:gap-1.5 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <StatusBadge tone={confidenceTone(b.confidence)} dot={false}>
                      {b.confidence}
                    </StatusBadge>
                    <StatusBadge tone={impactTone(b.operationalImpact)} dot={false}>
                      {b.operationalImpact} impact
                    </StatusBadge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold tabular-nums text-foreground">
                      {b.utilization}% util
                    </span>
                    <Button size="xs" variant="outline" asChild className="h-7 text-xs">
                      <Link href="/planner">Inspect</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/80">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <div className="flex items-center gap-2">
              <TriangleAlert className="size-4 text-warning" />
              <CardTitle className="text-base">Active Conflicts ({openConflicts.length})</CardTitle>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/conflicts">
                Resolve all
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {openConflicts.slice(0, 4).map((c) => (
              <div key={c.id} className="flex items-start gap-3 rounded-lg border border-border/70 bg-secondary/20 p-3 hover:bg-secondary/40 transition-colors">
                <StatusBadge tone={severityTone(c.severity)} dot={false} className="mt-0.5 shrink-0">
                  {c.severity}
                </StatusBadge>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold leading-snug text-foreground">{c.title}</p>
                    <span className="font-mono text-[11px] text-muted-foreground">{c.id}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {corridorName(c.corridorId)} · {c.time} · <span className="font-medium text-foreground">{c.type} Conflict</span>
                  </p>
                  <p className="mt-1 text-[11px] text-primary font-medium flex items-center gap-1">
                    → Suggested: {c.suggestedAction}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-danger" />
              <CardTitle className="text-base">Unscheduled Critical Tasks ({exceptions.length})</CardTitle>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/conflicts">
                Review exceptions
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {exceptions.map((e) => (
              <div key={e.id} className="flex items-start gap-3 rounded-lg border border-border/70 bg-secondary/20 p-3 hover:bg-secondary/40 transition-colors">
                <span className="mt-0.5 rounded bg-danger/15 px-2 py-0.5 font-mono text-xs font-bold text-danger shrink-0">
                  {e.priority}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-foreground">{e.taskId}</p>
                    <span className="text-[11px] text-muted-foreground">{e.department}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{e.reason}</p>
                  <p className="mt-1 text-[11px] text-amber-500 font-medium">
                    ⚡ {e.suggestedAction}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

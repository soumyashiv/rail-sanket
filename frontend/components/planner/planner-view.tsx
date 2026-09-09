'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Wand2,
  Clock,
  Gauge,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ArrowRightLeft,
  ListTree,
  CalendarClock,
  MapPin,
  Layers,
  Sparkles,
} from 'lucide-react'
import { corridors, corridorName } from '@/lib/data/corridors'
import { timelineByCorridor } from '@/lib/data/operations'
import { recommendedBlocks } from '@/lib/data/recommendations'
import { getTask } from '@/lib/data/tasks'
import type { RecommendedBlock } from '@/lib/types'
import { CorridorTimeline } from '@/components/planner/timeline'
import { CorridorNetworkMap } from '@/components/planner/corridor-network-map'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/status-badge'
import { cn } from '@/lib/utils'
import { confidenceTone, impactTone, criticalityTone } from '@/lib/status'

const legend = [
  { label: 'Train movement', className: 'bg-muted border-border' },
  { label: 'Available window', className: 'bg-success-muted/60 border-success/30 border-dashed' },
  { label: 'Recommended block', className: 'bg-primary border-primary' },
  { label: 'Operational blackout', className: 'bg-danger-muted border-danger/30' },
]

export function PlannerView() {
  const [selected, setSelected] = useState<RecommendedBlock>(recommendedBlocks[0])
  const [planned, setPlanned] = useState(false)
  const [viewMode, setViewMode] = useState<'timeline' | 'map'>('timeline')

  function runAutoPlan() {
    toast.success('Auto block plan generated', {
      description: '5 candidate blocks across 5 corridors · 0 hard conflicts · 89.2% average utilization',
    })
    setPlanned(true)
  }

  function pickBlockByMeta(corridorId: string, meta?: string) {
    const match = recommendedBlocks.find(
      (r) =>
        r.corridorId === corridorId &&
        (meta?.includes(r.taskIds[0]) ||
          meta?.includes(r.taskIds[1] || '') ||
          meta?.includes(r.blockType.split(' ')[0]) ||
          r.id === meta),
    )
    if (match) setSelected(match)
  }

  return (
    <div className="grid gap-5 xl:grid-cols-3">
      <div className="space-y-4 xl:col-span-2">
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-border/50">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-bold">
                  {viewMode === 'timeline' ? 'Corridor Timelines' : 'Track Schematic Map'}
                </CardTitle>
                <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary">
                  12h Horizon
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {viewMode === 'timeline'
                  ? '06:00–18:00 operational horizon across Kharagpur Division corridors.'
                  : 'Physical track configurations, station chainage, and active section blocks.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* View Switcher Tabs */}
              <div className="flex rounded-md border border-border bg-secondary/40 p-0.5">
                <button
                  onClick={() => setViewMode('timeline')}
                  className={cn(
                    'flex items-center gap-2 rounded px-2.5 py-1 text-xs font-medium transition-all',
                    viewMode === 'timeline'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <CalendarClock className="size-3.5" />
                  Timeline
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={cn(
                    'flex items-center gap-2 rounded px-2.5 py-1 text-xs font-medium transition-all',
                    viewMode === 'map'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <MapPin className="size-3.5" />
                  Track Map
                </button>
              </div>

              <Button size="sm" onClick={runAutoPlan} className="h-8 gap-2 shadow-xs text-xs font-medium">
                <Sparkles className="size-3.5" />
                {planned ? 'Re-run Auto-Plan' : 'Run Auto-Plan'}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            {viewMode === 'timeline' ? (
              <>
                {corridors.map((c) => (
                  <div key={c.id}>
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-primary/10 px-1.5 py-0.2 font-mono text-xs font-bold text-primary">
                          {c.id}
                        </span>
                        <span className="text-xs font-semibold text-foreground">{c.name}</span>
                        <span className="text-[11px] text-muted-foreground">· {c.trafficDensity}</span>
                      </div>
                      {selected.corridorId === c.id && (
                        <span className="text-[11px] font-medium text-primary">
                          Selected: {selected.id}
                        </span>
                      )}
                    </div>
                    <CorridorTimeline
                      slots={timelineByCorridor[c.id]}
                      activeBlock={selected.corridorId === c.id ? selected.taskIds[0] : undefined}
                      onSelectBlock={(meta) => pickBlockByMeta(c.id, meta)}
                    />
                  </div>
                ))}

                <div className="flex flex-wrap gap-4 border-t border-border/60 pt-3">
                  {legend.map((l) => (
                    <div key={l.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className={cn('size-2.5 rounded border', l.className)} />
                      {l.label}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <CorridorNetworkMap
                selectedBlock={selected}
                onSelectBlock={(block) => setSelected(block)}
              />
            )}
          </CardContent>
        </Card>

        {/* Candidate Blocks List */}
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex-row items-center justify-between py-3 border-b border-border/40">
            <CardTitle className="text-sm font-semibold">Recommended Block Windows</CardTitle>
            <span className="rounded-md bg-secondary px-2 py-0.5 font-mono text-xs font-medium text-muted-foreground">
              {recommendedBlocks.length} Windows Available
            </span>
          </CardHeader>
          <CardContent className="grid gap-2.5 pt-3 sm:grid-cols-2">
            {recommendedBlocks.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelected(b)}
                className={cn(
                  'rounded-lg border p-3 text-left transition-all duration-150',
                  selected.id === b.id
                    ? 'border-primary bg-primary/10 ring-1 ring-primary shadow-xs'
                    : 'border-border/70 hover:border-border hover:bg-secondary/30',
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-foreground">{b.id}</span>
                  <StatusBadge tone={confidenceTone(b.confidence)} dot={false}>
                    {b.confidence}
                  </StatusBadge>
                </div>
                <p className="mt-1 text-xs font-semibold text-foreground truncate">{b.section}</p>
                <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                  {b.start}–{b.end} · {b.durationMin}m · {b.blockType}
                </p>
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40 pt-1.5">
                  <span>{b.taskIds.length} tasks</span>
                  <span className="font-mono font-medium text-foreground">{b.utilization}% util</span>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      <BlockDetail block={selected} />
    </div>
  )
}


function BlockDetail({ block }: { block: RecommendedBlock }) {
  const [decision, setDecision] = useState<'approved' | 'rejected' | null>(null)

  const metrics = [
    { icon: Clock, label: 'Duration', value: `${block.durationMin} min` },
    { icon: Gauge, label: 'Utilization', value: `${block.utilization}%` },
    { icon: ShieldAlert, label: 'Op. impact', value: block.operationalImpact },
    { icon: ListTree, label: 'Downtime saved', value: `${block.downtimeSavedMin} min` },
  ]

  return (
    <Card className="h-fit xl:sticky xl:top-20 border-border/80 shadow-xs">
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex items-center justify-between">
          <CardTitle className="font-mono text-base">{block.id}</CardTitle>
          <StatusBadge tone={impactTone(block.operationalImpact)}>
            {block.operationalImpact} impact
          </StatusBadge>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {corridorName(block.corridorId)} · {block.section}
        </p>
        <p className="font-mono text-xs font-semibold text-foreground">
          {block.start}–{block.end} · {block.blockType}
        </p>
      </CardHeader>
      <CardContent className="space-y-4 pt-3">
        <div className="grid grid-cols-2 gap-2">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-md border border-border/60 bg-secondary/20 p-2">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <m.icon className="size-3" />
                {m.label}
              </div>
              <p className="mt-0.5 text-xs font-bold text-foreground">{m.value}</p>
            </div>
          ))}
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold text-foreground">
            Bundled Tasks ({block.taskIds.length})
          </p>
          <ul className="space-y-1">
            {block.taskIds.map((id) => {
              const t = getTask(id)
              if (!t) return null
              return (
                <li key={id} className="flex items-center gap-2 rounded border border-border/60 p-1.5 bg-secondary/10">
                  <span className="font-mono text-[10px] text-muted-foreground">{t.id}</span>
                  <span className="min-w-0 flex-1 truncate text-xs font-medium">{t.taskType}</span>
                  <StatusBadge tone={criticalityTone(t.criticality)} dot={false}>
                    {t.criticality}
                  </StatusBadge>
                </li>
              )
            })}
          </ul>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold text-foreground">Optimization Rationale</p>
          <ul className="space-y-1.5">
            {block.reasons.map((r) => (
              <li key={r} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/70" />
                <span className="leading-snug">{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {block.alternative && (
          <div className="rounded-md border border-dashed border-border/80 bg-secondary/30 p-2.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
              <ArrowRightLeft className="size-3" />
              Alternative Window
            </div>
            <p className="mt-0.5 font-mono text-xs font-medium">
              {block.alternative.start}–{block.alternative.end}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {block.alternative.note}
            </p>
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            className="flex-1 h-8 text-xs font-medium"
            variant={decision === 'approved' ? 'default' : 'outline'}
            onClick={() => {
              setDecision('approved')
              toast.success(`${block.id} approved`, { description: 'Added to the weekly plan.' })
            }}
          >
            <CheckCircle2 className="size-3.5" />
            Approve
          </Button>
          <Button
            size="sm"
            className="flex-1 h-8 text-xs font-medium"
            variant={decision === 'rejected' ? 'destructive' : 'outline'}
            onClick={() => {
              setDecision('rejected')
              toast(`${block.id} rejected`, { description: 'Returned to the queue for replanning.' })
            }}
          >
            <XCircle className="size-3.5" />
            Reject
          </Button>
        </div>
        {decision && (
          <p className="text-center text-[11px] text-muted-foreground">
            Status: <span className="font-semibold capitalize text-foreground">{decision}</span>
          </p>
        )}
      </CardContent>
    </Card>
  )
}

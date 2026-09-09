'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Gauge,
  ShieldAlert,
  ArrowRightLeft,
  ChevronDown,
  ChevronUp,
  TrainFront,
  Filter,
} from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { recommendedBlocks } from '@/lib/data/recommendations'
import { getTask } from '@/lib/data/tasks'
import { corridorName } from '@/lib/data/corridors'
import {
  confidenceTone,
  impactTone,
  criticalityTone,
  planStatusTone,
} from '@/lib/status'
import type { RecommendedBlock, PlanTaskStatus } from '@/lib/types'

export default function RecommendationsPage() {
  const [decisions, setDecisions] = useState<Record<string, 'approved' | 'rejected'>>({})
  const [expanded, setExpanded] = useState<string | null>(recommendedBlocks[0]?.id)
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  function decide(id: string, action: 'approved' | 'rejected') {
    setDecisions((prev) => ({ ...prev, [id]: action }))
    const block = recommendedBlocks.find((b) => b.id === id)
    if (action === 'approved') {
      toast.success(`${id} approved`, { description: `Added to the weekly plan. ${block?.criticalTasks ?? 0} critical task(s) scheduled.` })
    } else {
      toast(`${id} rejected`, { description: 'Returned to queue for replanning.' })
    }
  }

  const filtered = recommendedBlocks.filter((b) => {
    if (filterStatus === 'all') return true
    if (filterStatus === 'pending') return !decisions[b.id]
    return decisions[b.id] === filterStatus
  })

  const pendingCount = recommendedBlocks.filter((b) => !decisions[b.id]).length
  const approvedCount = Object.values(decisions).filter((d) => d === 'approved').length

  return (
    <div>
      <PageHeader
        badge="Decision Support"
        title="Block Recommendations"
        description="Candidate maintenance windows evaluated against timetable paths and corridor backlogs."
      >
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs gap-1.5"
          onClick={() => {
            recommendedBlocks.forEach((b) => {
              if (!decisions[b.id]) setDecisions((prev) => ({ ...prev, [b.id]: 'approved' }))
            })
            toast.success('All pending recommendations approved', { description: 'Weekly plan finalized.' })
          }}
        >
          <CheckCircle2 className="size-3.5" />
          Approve All Pending
        </Button>
      </PageHeader>

      {/* Summary strip */}
      <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total blocks', value: recommendedBlocks.length, tone: '' },
          { label: 'Pending review', value: pendingCount, tone: 'text-warning-foreground' },
          { label: 'Approved', value: approvedCount, tone: 'text-success' },
          { label: 'Critical tasks covered', value: recommendedBlocks.reduce((s, b) => s + b.criticalTasks, 0), tone: 'text-danger' },
        ].map((s) => (
          <Card key={s.label} className="gap-1 p-3.5 sm:p-4">
            <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
            <p className={`font-mono text-2xl font-bold tabular-nums ${s.tone}`}>{s.value}</p>
          </Card>
        ))}
      </section>

      {/* Filter tabs */}
      <div className="mb-4 flex items-center gap-2">
        <Filter className="size-4 text-muted-foreground" />
        {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilterStatus(f)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors capitalize ${
              filterStatus === f
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((block) => {
          const decision = decisions[block.id]
          const isExpanded = expanded === block.id
          return (
            <Card
              key={block.id}
              className={`transition-all ${
                decision === 'approved'
                  ? 'border-success/40 bg-success-muted/20'
                  : decision === 'rejected'
                    ? 'border-danger/30 bg-danger-muted/10 opacity-60'
                    : ''
              }`}
            >
              {/* Header row — always visible */}
              <button
                className="w-full text-left"
                onClick={() => setExpanded(isExpanded ? null : block.id)}
              >
                <CardHeader className="flex-col gap-2 sm:flex-row sm:items-center pb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <TrainFront className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-semibold">{block.id}</span>
                        <StatusBadge tone={confidenceTone(block.confidence)} dot={false}>
                          {block.confidence} confidence
                        </StatusBadge>
                        <StatusBadge tone={impactTone(block.operationalImpact)} dot={false}>
                          {block.operationalImpact} impact
                        </StatusBadge>
                        {block.criticalTasks > 0 && (
                          <StatusBadge tone="danger" dot={false}>
                            {block.criticalTasks} critical
                          </StatusBadge>
                        )}
                        {decision && (
                          <StatusBadge tone={planStatusTone(decision === 'approved' ? 'Approved' : 'Rejected')} dot={false}>
                            {decision}
                          </StatusBadge>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {corridorName(block.corridorId)} · {block.section} ·{' '}
                        <span className="font-mono">{block.start}–{block.end}</span> ·{' '}
                        {block.blockType} · {block.utilization}% utilized
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    {!decision && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-success/40 text-success hover:bg-success-muted"
                          onClick={(e) => { e.stopPropagation(); decide(block.id, 'approved') }}
                        >
                          <CheckCircle2 className="size-3.5" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-danger/40 text-danger hover:bg-danger-muted"
                          onClick={(e) => { e.stopPropagation(); decide(block.id, 'rejected') }}
                        >
                          <XCircle className="size-3.5" />
                          Reject
                        </Button>
                      </>
                    )}
                    {isExpanded ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
                  </div>
                </CardHeader>
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <CardContent className="pt-0 space-y-5">
                  <div className="h-px bg-border" />

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {[
                      { icon: Clock, label: 'Duration', value: `${block.durationMin} min` },
                      { icon: Gauge, label: 'Utilization', value: `${block.utilization}%` },
                      { icon: ShieldAlert, label: 'Op. impact', value: block.operationalImpact },
                      { icon: CheckCircle2, label: 'Downtime saved', value: `${block.downtimeSavedMin} min` },
                    ].map((m) => (
                      <div key={m.label} className="rounded-lg border border-border p-3">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <m.icon className="size-3.5" />
                          {m.label}
                        </div>
                        <p className="mt-1 text-sm font-semibold">{m.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Bundled tasks */}
                    <div>
                      <p className="mb-2 text-sm font-medium">
                        Bundled tasks ({block.taskIds.length})
                      </p>
                      <ul className="space-y-1.5">
                        {block.taskIds.map((id) => {
                          const t = getTask(id)
                          if (!t) return <li key={id} className="font-mono text-xs text-muted-foreground">{id}</li>
                          return (
                            <li key={id} className="flex items-center gap-2 rounded-md border border-border p-2.5">
                              <span className="font-mono text-xs text-muted-foreground">{t.id}</span>
                              <span className="min-w-0 flex-1 truncate text-sm">{t.taskType}</span>
                              <StatusBadge tone={criticalityTone(t.criticality)} dot={false}>
                                {t.criticality}
                              </StatusBadge>
                            </li>
                          )
                        })}
                      </ul>
                    </div>

                    {/* Why this block */}
                    <div>
                      <p className="mb-2 text-sm font-medium">Why this block?</p>
                      <ul className="space-y-1.5">
                        {block.reasons.map((r) => (
                          <li key={r} className="flex gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                            <span className="text-pretty">{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Alternative window */}
                  {block.alternative && (
                    <div className="rounded-lg border border-dashed border-border bg-secondary/40 p-3">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1">
                        <ArrowRightLeft className="size-3.5" />
                        Alternative window (higher impact)
                      </div>
                      <p className="font-mono text-sm">
                        {block.alternative.start}–{block.alternative.end}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{block.alternative.note}</p>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

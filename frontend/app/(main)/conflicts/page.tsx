'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  TriangleAlert,
  AlertCircle,
  Info,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  X,
} from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { conflicts, exceptions } from '@/lib/data/conflicts'
import { corridorName } from '@/lib/data/corridors'
import { severityTone } from '@/lib/status'
import type { ConflictType, Severity } from '@/lib/types'

const typeLabel: Record<ConflictType, string> = {
  Operational: 'Operational',
  Resource: 'Resource',
  Corridor: 'Corridor',
  Capacity: 'Capacity',
  Dependency: 'Dependency',
}

const severityIcon = {
  Critical: AlertCircle,
  Warning: TriangleAlert,
  Info: Info,
}

const severityBorderClass: Record<Severity, string> = {
  Critical: 'border-l-4 border-l-danger',
  Warning: 'border-l-4 border-l-warning',
  Info: 'border-l-4 border-l-info',
}

export default function ConflictsPage() {
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(
    new Set(conflicts.filter((c) => c.resolved).map((c) => c.id))
  )
  const [expanded, setExpanded] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<ConflictType | 'All'>('All')

  function resolve(id: string) {
    setResolvedIds((prev) => new Set([...prev, id]))
    toast.success('Conflict marked as resolved', { description: 'Removed from active conflicts.' })
  }

  const openConflicts = conflicts.filter(
    (c) => !resolvedIds.has(c.id) && (typeFilter === 'All' || c.type === typeFilter)
  )
  const resolvedConflicts = conflicts.filter((c) => resolvedIds.has(c.id))
  const criticalCount = conflicts.filter((c) => !resolvedIds.has(c.id) && c.severity === 'Critical').length

  const types: (ConflictType | 'All')[] = ['All', 'Operational', 'Resource', 'Corridor', 'Capacity', 'Dependency']

  return (
    <div>
      <PageHeader
        badge="Validation"
        title="Conflicts & Exceptions"
        description="Active operational, resource, and corridor clashes with suggested resolutions."
      >
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs gap-1.5"
          onClick={() => {
            const openIds = conflicts.filter((c) => !c.resolved).map((c) => c.id)
            setResolvedIds(new Set([...resolvedIds, ...openIds]))
            toast.success('All conflicts marked resolved', {
              description: 'Weekly block plan is now conflict-free.',
            })
          }}
        >
          <CheckCircle2 className="size-3.5" />
          Apply Suggested Resolutions
        </Button>
      </PageHeader>

      {/* Summary strip */}
      <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Open conflicts', value: openConflicts.length, tone: openConflicts.length > 0 ? 'text-warning-foreground' : 'text-success' },
          { label: 'Critical', value: criticalCount, tone: criticalCount > 0 ? 'text-danger' : '' },
          { label: 'Resolved', value: resolvedConflicts.length, tone: 'text-success' },
          { label: 'Unscheduled tasks', value: exceptions.length, tone: 'text-warning-foreground' },
        ].map((s) => (
          <Card key={s.label} className="gap-1 p-3.5 sm:p-4">
            <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
            <p className={`font-mono text-2xl font-bold tabular-nums ${s.tone}`}>{s.value}</p>
          </Card>
        ))}
      </section>

      {/* Type filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              typeFilter === t
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Open conflicts */}
      <div className="space-y-3 mb-8">
        <h2 className="text-sm font-semibold text-foreground">
          Open conflicts ({openConflicts.length})
        </h2>

        {openConflicts.length === 0 && (
          <Card className="p-8 text-center">
            <CheckCircle2 className="mx-auto size-8 text-success mb-3" />
            <p className="font-medium">No open conflicts</p>
            <p className="text-sm text-muted-foreground mt-1">All conflicts have been resolved for the selected filter.</p>
          </Card>
        )}

        {openConflicts.map((c) => {
          const Icon = severityIcon[c.severity]
          const isExpanded = expanded === c.id
          return (
            <Card key={c.id} className={`overflow-hidden ${severityBorderClass[c.severity]}`}>
              <button className="w-full text-left" onClick={() => setExpanded(isExpanded ? null : c.id)}>
                <CardHeader className="flex-col gap-2 sm:flex-row sm:items-start pb-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <Icon
                      className={`mt-0.5 size-5 shrink-0 ${
                        c.severity === 'Critical'
                          ? 'text-danger'
                          : c.severity === 'Warning'
                            ? 'text-warning-foreground'
                            : 'text-info'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-muted-foreground">{c.id}</span>
                        <StatusBadge tone={severityTone(c.severity)} dot={false}>{c.severity}</StatusBadge>
                        <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                          {typeLabel[c.type]}
                        </span>
                      </div>
                      <p className="font-medium text-sm leading-snug">{c.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {corridorName(c.corridorId)} · {c.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={(e) => { e.stopPropagation(); resolve(c.id) }}
                    >
                      <CheckCircle2 className="size-3.5" />
                      Mark resolved
                    </Button>
                    {isExpanded ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
                  </div>
                </CardHeader>
              </button>

              {isExpanded && (
                <CardContent className="pt-0 space-y-4">
                  <div className="h-px bg-border" />
                  <div>
                    <p className="text-sm font-medium mb-1">Description</p>
                    <p className="text-sm text-muted-foreground text-pretty">{c.description}</p>
                  </div>
                  {(c.affectedTasks.length > 0 || c.affectedTrains.length > 0) && (
                    <div className="flex flex-wrap gap-4">
                      {c.affectedTasks.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1.5">Affected tasks</p>
                          <div className="flex flex-wrap gap-1.5">
                            {c.affectedTasks.map((t) => (
                              <span key={t} className="font-mono rounded bg-muted px-2 py-0.5 text-xs">{t}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {c.affectedTrains.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1.5">Affected trains</p>
                          <div className="flex flex-wrap gap-1.5">
                            {c.affectedTrains.map((t) => (
                              <span key={t} className="font-mono rounded bg-muted px-2 py-0.5 text-xs">{t}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="rounded-lg border border-dashed border-info/40 bg-info-muted/30 p-3">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-info mb-1">
                      <Lightbulb className="size-3.5" />
                      Suggested resolution
                    </div>
                    <p className="text-sm text-foreground text-pretty">{c.suggestedAction}</p>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {/* Exceptions — unscheduled critical tasks */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Exceptions — no feasible window ({exceptions.length})
        </h2>

        {exceptions.map((e) => (
          <Card key={e.id} className="border-l-4 border-l-danger/60">
            <CardHeader className="flex-row items-start gap-3 pb-3">
              <span className="mt-0.5 rounded bg-danger-muted px-2 py-0.5 font-mono text-xs font-bold text-danger shrink-0">
                {e.priority}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-sm font-semibold">{e.taskId}</p>
                <p className="mt-0.5 text-sm text-muted-foreground text-pretty">{e.reason}</p>
                <div className="mt-2 rounded-lg border border-dashed border-info/40 bg-info-muted/30 p-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-info mb-0.5">
                    <Lightbulb className="size-3.5" />
                    Suggested action
                  </div>
                  <p className="text-xs text-foreground">{e.suggestedAction}</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Resolved section */}
      {resolvedConflicts.length > 0 && (
        <div className="mt-8 space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <CheckCircle2 className="size-4 text-success" />
            Resolved ({resolvedConflicts.length})
          </h2>
          {resolvedConflicts.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3 opacity-60"
            >
              <span className="font-mono text-xs text-muted-foreground">{c.id}</span>
              <span className="text-sm">{c.title}</span>
              <CheckCircle2 className="ml-auto size-4 text-success" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

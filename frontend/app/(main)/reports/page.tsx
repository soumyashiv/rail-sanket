'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  FileText,
  Download,
  FileSpreadsheet,
  AlertTriangle,
  Calendar,
  BarChart3,
  CheckCircle,
  Clock,
} from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/status-badge'

const reports = [
  {
    id: 'weekly-plan',
    title: 'Weekly Block Plan',
    description: 'Full plan for 14–18 Sep 2026 with task details, timing, and approval status.',
    icon: Calendar,
    formats: ['PDF', 'CSV'],
    status: 'AI-RECOMMENDED',
    tone: 'info' as const,
    generated: '2026-09-09 15:00',
  },
  {
    id: 'monthly-summary',
    title: 'Monthly Maintenance Summary',
    description: 'Corridor-level capacity utilization, backlog, and department workload for September 2026.',
    icon: BarChart3,
    formats: ['PDF', 'CSV'],
    status: 'DRAFT',
    tone: 'neutral' as const,
    generated: '2026-09-09 14:30',
  },
  {
    id: 'unscheduled-critical',
    title: 'Unscheduled Critical Tasks',
    description: '4 critical tasks with no feasible block window. Requires operations review.',
    icon: AlertTriangle,
    formats: ['PDF', 'CSV'],
    status: 'ACTION REQUIRED',
    tone: 'danger' as const,
    generated: '2026-09-09 15:00',
  },
  {
    id: 'block-utilization',
    title: 'Block Utilization Report',
    description: 'Per-corridor block efficiency, idle time analysis, and bundling effectiveness.',
    icon: BarChart3,
    formats: ['PDF', 'CSV'],
    status: 'DRAFT',
    tone: 'neutral' as const,
    generated: '2026-09-09 14:30',
  },
  {
    id: 'asset-availability',
    title: 'Asset Availability Report',
    description: 'Asset downtime estimates, availability percentages, and trend over the week.',
    icon: CheckCircle,
    formats: ['PDF'],
    status: 'DRAFT',
    tone: 'neutral' as const,
    generated: '2026-09-09 14:30',
  },
  {
    id: 'conflict-report',
    title: 'Conflict Report',
    description: 'All detected conflicts, severity classification, resolution status, and audit trail.',
    icon: AlertTriangle,
    formats: ['PDF', 'CSV'],
    status: 'DRAFT',
    tone: 'warning' as const,
    generated: '2026-09-09 15:00',
  },
  {
    id: 'audit-log',
    title: 'Audit Log Export',
    description: 'Complete record of planner actions, approvals, rejections, and manual overrides.',
    icon: FileText,
    formats: ['CSV'],
    status: 'SYSTEM',
    tone: 'neutral' as const,
    generated: '2026-09-09 15:05',
  },
]

// Simulated recent audit log entries
const auditEntries = [
  { time: '15:02', user: 'R. Kaushik', action: 'Approved', entity: 'REC-101', note: 'HWH–SRC traffic block' },
  { time: '14:55', user: 'R. Kaushik', action: 'Rejected', entity: 'REC-103', note: 'Insufficient crew' },
  { time: '14:47', user: 'S. Mishra (S&T)', action: 'Resolved conflict', entity: 'CF-06', note: 'Shifted block start to 12:00' },
  { time: '14:30', user: 'System', action: 'Generated plan', entity: 'PLAN-2026-37', note: 'Auto block plan for week 37' },
  { time: '14:22', user: 'R. Kaushik', action: 'Override', entity: 'ENG-104', note: 'Manual priority increase to Critical' },
]

export default function ReportsPage() {
  const [downloading, setDownloading] = useState<string | null>(null)

  function handleDownload(reportId: string, format: string) {
    setDownloading(`${reportId}-${format}`)
    setTimeout(() => {
      setDownloading(null)
      toast.success(`Report downloaded`, {
        description: `${format} export generated — marked as DRAFT / AI-RECOMMENDED until approved.`,
      })
    }, 1000)
  }

  return (
    <div>
      <PageHeader
        badge="GOVERNANCE & AUDIT TRAIL EXPORT · PRD SECTION 25"
        title="Planning Reports & Audit Logs"
        description="Formal block plans, asset availability statements, and conflict logs for Divisional Railway Managers (DRM) and Principal Chief Operations Managers (PCOM). Marked AI-RECOMMENDED until certified."
      >
        <Button
          variant="outline"
          onClick={() => toast.success('All reports queued for export', { description: 'Check your downloads folder.' })}
        >
          <Download className="size-4" />
          Export all
        </Button>
      </PageHeader>

      {/* Report cards */}
      <section className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => {
          const Icon = r.icon
          return (
            <Card key={r.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </div>
                    <CardTitle className="text-sm leading-tight">{r.title}</CardTitle>
                  </div>
                  <StatusBadge tone={r.tone} dot={false} className="shrink-0 text-[10px]">
                    {r.status}
                  </StatusBadge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 pt-0">
                <p className="text-xs text-muted-foreground text-pretty flex-1">{r.description}</p>
                <div className="mt-3 flex items-center gap-2">
                  <Clock className="size-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{r.generated}</span>
                  <div className="ml-auto flex gap-1.5">
                    {r.formats.map((fmt) => (
                      <Button
                        key={fmt}
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-xs"
                        onClick={() => handleDownload(r.id, fmt)}
                        disabled={downloading === `${r.id}-${fmt}`}
                      >
                        {downloading === `${r.id}-${fmt}` ? (
                          <span className="animate-pulse">…</span>
                        ) : (
                          <>
                            {fmt === 'CSV' ? <FileSpreadsheet className="size-3 mr-1" /> : <FileText className="size-3 mr-1" />}
                            {fmt}
                          </>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </section>

      {/* Audit trail */}
      <Card>
        <CardHeader>
          <CardTitle>Recent audit log</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Last 5 planning actions — all changes are recorded for traceability.
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Time</th>
                  <th className="text-left py-2 pr-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">User</th>
                  <th className="text-left py-2 pr-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Action</th>
                  <th className="text-left py-2 pr-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Entity</th>
                  <th className="text-left py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {auditEntries.map((entry, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 pr-4 font-mono text-xs tabular-nums text-muted-foreground">{entry.time}</td>
                    <td className="py-2.5 pr-4 text-sm">{entry.user}</td>
                    <td className="py-2.5 pr-4">
                      <span
                        className={`font-medium text-xs ${
                          entry.action === 'Approved'
                            ? 'text-success'
                            : entry.action === 'Rejected'
                              ? 'text-danger'
                              : entry.action === 'Override'
                                ? 'text-warning-foreground'
                                : 'text-muted-foreground'
                        }`}
                      >
                        {entry.action}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 font-mono text-xs">{entry.entity}</td>
                    <td className="py-2.5 text-xs text-muted-foreground">{entry.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Export the full audit log from the Reports section above.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

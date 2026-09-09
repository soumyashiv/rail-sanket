'use client'

import { ArrowDownRight, ArrowUpRight, Link2 } from 'lucide-react'
import type { MaintenanceTask } from '@/lib/types'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { corridorName } from '@/lib/data/corridors'
import {
  criticalityTone,
  priorityTone,
  priorityLabel,
  taskStatusTone,
} from '@/lib/status'

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium">{value}</dd>
    </div>
  )
}

export function TaskDetail({
  task,
  open,
  onOpenChange,
}: {
  task: MaintenanceTask | null
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-md">
        {task && (
          <>
            <SheetHeader className="border-b border-border">
              <div className="flex items-center gap-2">
                <SheetTitle className="font-mono">{task.id}</SheetTitle>
                <StatusBadge tone={taskStatusTone(task.status)}>{task.status}</StatusBadge>
              </div>
              <SheetDescription className="text-pretty">
                {task.taskType} · {task.assetType} {task.assetId}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 p-4">
              <div className="rounded-lg border border-border bg-secondary/40 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Priority score</span>
                  <div className="flex items-center gap-2">
                    <StatusBadge tone={priorityTone(task.priority)} dot={false}>
                      {priorityLabel(task.priority)}
                    </StatusBadge>
                    <span className="font-mono text-2xl font-semibold tabular-nums">
                      {task.priority}
                    </span>
                  </div>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Weighted from criticality, overdue, defect severity, corridor and dependencies.
                </p>

                <ul className="mt-4 space-y-2.5">
                  {task.priorityFactors.map((f) => (
                    <li key={f.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5">
                          {f.positive ? (
                            <ArrowUpRight className="size-3.5 text-danger" />
                          ) : (
                            <ArrowDownRight className="size-3.5 text-success" />
                          )}
                          {f.label}
                        </span>
                        <span className="font-mono tabular-nums text-muted-foreground">
                          +{f.contribution}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn('h-full rounded-full', f.positive ? 'bg-danger' : 'bg-success')}
                          style={{ width: `${Math.min(100, f.contribution * 2.5)}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <dl className="grid grid-cols-2 gap-4">
                <Field label="Department" value={task.department} />
                <Field label="Source system" value={task.sourceSystem} />
                <Field
                  label="Criticality"
                  value={
                    <StatusBadge tone={criticalityTone(task.criticality)} dot={false}>
                      {task.criticality}
                    </StatusBadge>
                  }
                />
                <Field label="Defect severity" value={`${task.defectSeverity}/100`} />
                <Field label="Corridor" value={`${corridorName(task.corridorId)}`} />
                <Field label="Location" value={task.location} />
                <Field label="Required block" value={task.requiredBlockType} />
                <Field label="Est. duration" value={`${task.estimatedDuration} min`} />
                <Field label="Due date" value={new Date(task.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} />
                <Field
                  label="Overdue"
                  value={
                    task.overdueDays > 0 ? (
                      <span className="text-danger">{task.overdueDays} days</span>
                    ) : (
                      'On time'
                    )
                  }
                />
                <Field label="Assigned crew" value={task.crew} />
                <Field
                  label="Dependencies"
                  value={
                    task.dependencies.length ? (
                      <span className="flex items-center gap-1 font-mono text-xs">
                        <Link2 className="size-3.5" />
                        {task.dependencies.join(', ')}
                      </span>
                    ) : (
                      'None'
                    )
                  }
                />
              </dl>

              <div className="flex gap-2">
                <Button className="flex-1">Add to block</Button>
                <Button variant="outline" className="flex-1">
                  Defer
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

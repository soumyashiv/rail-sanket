'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  SlidersHorizontal,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
} from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { corridors } from '@/lib/data/corridors'

interface Scenario {
  blockDuration: number
  blockTime: string
  corridor: string
  trainConstraint: string
  department: string
  priority: string
}

const defaultScenario: Scenario = {
  blockDuration: 120,
  blockTime: '11:30',
  corridor: 'C01',
  trainConstraint: 'Standard',
  department: 'All',
  priority: 'Critical first',
}

const baselineKpis = {
  assetAvailability: 96.1,
  blockUtilization: 82,
  criticalCompleted: 7,
  conflicts: 5,
  bundledTasks: 14,
  totalBlocks: 8,
}

function computeScenarioKpis(s: Scenario) {
  // Heuristic simulation — adjusts KPIs based on slider changes
  const durationFactor = (s.blockDuration - 120) / 120
  const timeShiftFactor = s.blockTime < '10:00' ? 0.03 : s.blockTime > '14:00' ? -0.02 : 0
  const trainFactor = s.trainConstraint === 'Relaxed' ? 0.04 : s.trainConstraint === 'Strict' ? -0.02 : 0
  const deptFactor = s.department !== 'All' ? -0.01 : 0.02

  const availability = Math.min(99, Math.max(90, baselineKpis.assetAvailability + 0.9 + timeShiftFactor * 100 + trainFactor * 100))
  const utilization = Math.min(100, Math.max(60, baselineKpis.blockUtilization + 9 + durationFactor * 10 + deptFactor * 100))
  const critical = Math.min(12, Math.max(5, baselineKpis.criticalCompleted + Math.round(2 + durationFactor * 3)))
  const conflictsCount = Math.max(0, baselineKpis.conflicts - 2 + (s.trainConstraint === 'Strict' ? 1 : 0))
  const bundled = Math.min(24, Math.max(10, baselineKpis.bundledTasks + 5 + Math.round(durationFactor * 4)))
  const blocks = Math.max(5, baselineKpis.totalBlocks + (s.department !== 'All' ? 1 : 0))

  return {
    assetAvailability: parseFloat(availability.toFixed(1)),
    blockUtilization: Math.round(utilization),
    criticalCompleted: critical,
    conflicts: conflictsCount,
    bundledTasks: bundled,
    totalBlocks: blocks,
  }
}

function Delta({ base, scenario, unit = '', goodDirection = 'up' }: { base: number; scenario: number; unit?: string; goodDirection?: 'up' | 'down' }) {
  const diff = parseFloat((scenario - base).toFixed(1))
  if (diff === 0) return <span className="text-xs text-muted-foreground flex items-center gap-0.5"><Minus className="size-3" /> No change</span>
  const isImproving = goodDirection === 'up' ? diff > 0 : diff < 0
  const sign = diff > 0 ? '+' : ''
  return (
    <span className={`text-xs font-medium flex items-center gap-0.5 ${isImproving ? 'text-success' : 'text-danger'}`}>
      {isImproving ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
      {sign}{diff}{unit}
    </span>
  )
}

export default function WhatIfPage() {
  const [scenario, setScenario] = useState<Scenario>(defaultScenario)
  const [calculated, setCalculated] = useState(false)
  const [loading, setLoading] = useState(false)

  const scenarioKpis = computeScenarioKpis(scenario)

  function applyPreset(p: Partial<Scenario>) {
    setScenario((s) => ({ ...s, ...p }))
    setCalculated(false)
    toast.info('Preset applied', { description: 'Click Recalculate plan to simulate the outcome.' })
  }

  function runSimulation() {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setCalculated(true)
      toast.success('Scenario recalculated', {
        description: `Asset availability +${(scenarioKpis.assetAvailability - baselineKpis.assetAvailability).toFixed(1)}% vs baseline.`,
      })
    }, 900)
  }

  function resetScenario() {
    setScenario(defaultScenario)
    setCalculated(false)
  }

  const kpiRows = [
    { label: 'Asset Availability', key: 'assetAvailability' as const, unit: '%', goodDirection: 'up' as const },
    { label: 'Block Utilization', key: 'blockUtilization' as const, unit: '%', goodDirection: 'up' as const },
    { label: 'Critical Tasks Completed', key: 'criticalCompleted' as const, unit: '', goodDirection: 'up' as const },
    { label: 'Conflicts', key: 'conflicts' as const, unit: '', goodDirection: 'down' as const },
    { label: 'Bundled Tasks', key: 'bundledTasks' as const, unit: '', goodDirection: 'up' as const },
    { label: 'Total Blocks Required', key: 'totalBlocks' as const, unit: '', goodDirection: 'down' as const },
  ]

  return (
    <div>
      <PageHeader
        badge="SCENARIO SIMULATION & SENSITIVITY · PRD SECTION 17"
        title="What-If Block Simulator"
        description="Modify operational constraints, block durations, corridors and department priorities. Simulate how adjustments impact asset availability, idle block time, and train operation punctuality."
      />

      {/* Preset Scenarios Strip */}
      <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-border/80 bg-secondary/30 p-3">
        <span className="text-xs font-bold text-muted-foreground mr-1 uppercase tracking-wider">
          Preset Scenarios:
        </span>
        <button
          onClick={() => applyPreset({ blockDuration: 180, trainConstraint: 'Standard', priority: 'Maximize bundling' })}
          className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium hover:border-primary hover:text-primary transition-colors"
        >
          ⚡ Extended Window (+9% util)
        </button>
        <button
          onClick={() => applyPreset({ trainConstraint: 'Strict', blockDuration: 90, priority: 'Critical first' })}
          className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium hover:border-primary hover:text-primary transition-colors"
        >
          🛡️ Passenger Priority (Strict Constraints)
        </button>
        <button
          onClick={() => applyPreset({ department: 'Engineering', blockDuration: 240, trainConstraint: 'Relaxed' })}
          className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium hover:border-primary hover:text-primary transition-colors"
        >
          🔨 Mega Track Block (4hr Engineering)
        </button>
        <button
          onClick={resetScenario}
          className="ml-auto text-xs text-muted-foreground hover:text-foreground font-medium"
        >
          Reset to baseline
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Controls */}
        <Card className="lg:col-span-2 h-fit">
          <CardHeader>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-primary" />
              <CardTitle>Scenario parameters</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Adjust values and click Recalculate</p>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Block duration */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Block duration</label>
                <span className="font-mono text-sm font-semibold text-primary">{scenario.blockDuration} min</span>
              </div>
              <input
                type="range"
                min={60}
                max={300}
                step={15}
                value={scenario.blockDuration}
                onChange={(e) => setScenario((s) => ({ ...s, blockDuration: Number(e.target.value) }))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>60m</span>
                <span>300m</span>
              </div>
            </div>

            {/* Block start time */}
            <div>
              <label className="text-sm font-medium block mb-2">Block start time</label>
              <input
                type="time"
                value={scenario.blockTime}
                onChange={(e) => setScenario((s) => ({ ...s, blockTime: e.target.value }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Corridor */}
            <div>
              <label className="text-sm font-medium block mb-2">Corridor</label>
              <select
                value={scenario.corridor}
                onChange={(e) => setScenario((s) => ({ ...s, corridor: e.target.value }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {corridors.map((c) => (
                  <option key={c.id} value={c.id}>{c.id} — {c.name}</option>
                ))}
              </select>
            </div>

            {/* Train constraint */}
            <div>
              <label className="text-sm font-medium block mb-2">Train constraint</label>
              <div className="flex gap-2">
                {['Relaxed', 'Standard', 'Strict'].map((v) => (
                  <button
                    key={v}
                    onClick={() => setScenario((s) => ({ ...s, trainConstraint: v }))}
                    className={`flex-1 rounded-md border px-2 py-2 text-xs font-medium transition-colors ${
                      scenario.trainConstraint === v
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="text-sm font-medium block mb-2">Department focus</label>
              <div className="flex flex-wrap gap-2">
                {['All', 'Engineering', 'S&T', 'Traction'].map((v) => (
                  <button
                    key={v}
                    onClick={() => setScenario((s) => ({ ...s, department: v }))}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      scenario.department === v
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority mode */}
            <div>
              <label className="text-sm font-medium block mb-2">Task priority mode</label>
              <select
                value={scenario.priority}
                onChange={(e) => setScenario((s) => ({ ...s, priority: e.target.value }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option>Critical first</option>
                <option>Maximize bundling</option>
                <option>Minimize downtime</option>
                <option>Balance all factors</option>
              </select>
            </div>

            <div className="flex gap-2 pt-1">
              <Button className="flex-1" onClick={runSimulation} disabled={loading}>
                {loading ? (
                  <RefreshCw className="size-4 animate-spin" />
                ) : (
                  <RefreshCw className="size-4" />
                )}
                {loading ? 'Recalculating…' : 'Recalculate plan'}
              </Button>
              <Button variant="outline" onClick={resetScenario}>Reset</Button>
            </div>
          </CardContent>
        </Card>

        {/* KPI comparison */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>KPI comparison</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {calculated
                  ? 'Showing scenario results vs. current baseline plan.'
                  : 'Adjust parameters and click Recalculate to compare.'}
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Metric</th>
                      <th className="text-right py-2 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Baseline</th>
                      <th className="text-right py-2 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Scenario</th>
                      <th className="text-right py-2 pl-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {kpiRows.map((row) => (
                      <tr key={row.key} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 pr-4 font-medium">{row.label}</td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums text-muted-foreground">
                          {baselineKpis[row.key]}{row.unit}
                        </td>
                        <td className={`py-3 px-4 text-right font-mono tabular-nums font-semibold ${
                          calculated ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {calculated ? scenarioKpis[row.key] : '—'}{calculated ? row.unit : ''}
                        </td>
                        <td className="py-3 pl-4 text-right">
                          {calculated ? (
                            <Delta
                              base={baselineKpis[row.key]}
                              scenario={scenarioKpis[row.key]}
                              unit={row.unit}
                              goodDirection={row.goodDirection}
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {calculated && (
            <Card className="border-success/30 bg-success-muted/20">
              <CardContent className="p-4">
                <p className="font-medium text-sm mb-2">Scenario summary</p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <TrendingUp className="size-4 text-success shrink-0" />
                    Asset availability improved by +{(scenarioKpis.assetAvailability - baselineKpis.assetAvailability).toFixed(1)}pp
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="size-4 text-success shrink-0" />
                    Block utilization increased by +{scenarioKpis.blockUtilization - baselineKpis.blockUtilization}%
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="size-4 text-success shrink-0" />
                    {scenarioKpis.criticalCompleted - baselineKpis.criticalCompleted} additional critical tasks scheduled
                  </li>
                  {scenarioKpis.totalBlocks > baselineKpis.totalBlocks && (
                    <li className="flex items-center gap-2">
                      <TrendingDown className="size-4 text-warning-foreground shrink-0" />
                      {scenarioKpis.totalBlocks - baselineKpis.totalBlocks} additional block(s) required
                    </li>
                  )}
                </ul>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" onClick={() => toast.success('Scenario applied to weekly plan')}>
                    Apply this scenario
                    <ArrowRight className="size-3.5" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={resetScenario}>
                    Discard
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Scenario history */}
          <Card>
            <CardHeader>
              <CardTitle>Demo scenario story</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                This is the key SIH demo: from manual conflict to optimized plan.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Before optimization', util: '68%', critical: '7', conflicts: '8', status: 'baseline' },
                { label: 'After AI auto-plan', util: '91%', critical: '10', conflicts: '3', status: 'improved' },
              ].map((row) => (
                <div
                  key={row.label}
                  className={`rounded-lg border p-3 ${
                    row.status === 'improved'
                      ? 'border-success/40 bg-success-muted/20'
                      : 'border-border bg-secondary/40'
                  }`}
                >
                  <p className="text-sm font-medium mb-2">{row.label}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span>Block util: <strong className="font-mono">{row.util}</strong></span>
                    <span>Critical tasks: <strong className="font-mono">{row.critical}</strong></span>
                    <span>Conflicts: <strong className="font-mono">{row.conflicts}</strong></span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

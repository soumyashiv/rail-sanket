'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Settings,
  User,
  Shield,
  Bell,
  Sliders,
  Save,
  ChevronRight,
} from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface WeightConfig {
  criticality: number
  urgency: number
  safety: number
  assetImpact: number
  overdue: number
  operationalBenefit: number
}

const defaultWeights: WeightConfig = {
  criticality: 30,
  urgency: 20,
  safety: 20,
  assetImpact: 15,
  overdue: 10,
  operationalBenefit: 5,
}

const weightLabels: Record<keyof WeightConfig, string> = {
  criticality: 'Criticality score',
  urgency: 'Urgency score',
  safety: 'Safety / defect score',
  assetImpact: 'Asset impact score',
  overdue: 'Overdue score',
  operationalBenefit: 'Operational benefit score',
}

const settingsSections = [
  { icon: User, label: 'User & role', desc: 'Profile, role, and division assignment' },
  { icon: Shield, label: 'Safety constraints', desc: 'Hard constraint rules and blackout periods' },
  { icon: Bell, label: 'Notifications', desc: 'Alert thresholds and notification routing' },
]

export default function SettingsPage() {
  const [weights, setWeights] = useState<WeightConfig>(defaultWeights)
  const [bufferMin, setBufferMin] = useState(15)
  const [minUtil, setMinUtil] = useState(70)
  const [autoApprove, setAutoApprove] = useState(false)
  const [notifications, setNotifications] = useState(true)

  const totalWeight = Object.values(weights).reduce((s, v) => s + v, 0)

  function saveWeights() {
    if (Math.abs(totalWeight - 100) > 0.5) {
      toast.error('Weights must sum to 100%', { description: `Current total: ${totalWeight}%` })
      return
    }
    toast.success('Priority weights saved', { description: 'New weights will apply on next plan generation.' })
  }

  return (
    <div>
      <PageHeader
        badge="Configuration"
        title="Planning Settings"
        description="Scoring weights, safety headway buffers, and optimization thresholds."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Priority weight editor */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sliders className="size-4 text-primary" />
              <CardTitle>Priority score weights</CardTitle>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Adjust how the AI priority score is calculated. Weights must sum to 100%.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {(Object.keys(weights) as (keyof WeightConfig)[]).map((key) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium">{weightLabels[key]}</label>
                  <span className={`font-mono text-sm font-semibold ${totalWeight > 100 ? 'text-danger' : 'text-primary'}`}>
                    {weights[key]}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={5}
                  value={weights[key]}
                  onChange={(e) => setWeights((w) => ({ ...w, [key]: Number(e.target.value) }))}
                  className="w-full accent-primary"
                />
              </div>
            ))}

            <div className={`rounded-lg border p-3 text-sm ${
              Math.abs(totalWeight - 100) < 0.5
                ? 'border-success/40 bg-success-muted/20 text-success'
                : 'border-danger/40 bg-danger-muted/20 text-danger'
            }`}>
              Total weight: <span className="font-mono font-semibold">{totalWeight}%</span>
              {Math.abs(totalWeight - 100) > 0.5 && ' — must equal 100% to save'}
            </div>

            <div className="flex gap-2">
              <Button onClick={saveWeights} disabled={Math.abs(totalWeight - 100) > 0.5}>
                <Save className="size-4" />
                Save weights
              </Button>
              <Button
                variant="outline"
                onClick={() => { setWeights(defaultWeights); toast('Weights reset to defaults') }}
              >
                Reset to defaults
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="space-y-4">
          {/* Planning parameters */}
          <Card>
            <CardHeader>
              <CardTitle>Planning parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium">Safety buffer (min)</label>
                  <span className="font-mono text-sm font-semibold text-primary">{bufferMin} min</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={45}
                  step={5}
                  value={bufferMin}
                  onChange={(e) => setBufferMin(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <p className="mt-1 text-xs text-muted-foreground">Minimum buffer before/after train movements</p>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium">Min. block utilization</label>
                  <span className="font-mono text-sm font-semibold text-primary">{minUtil}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={95}
                  step={5}
                  value={minUtil}
                  onChange={(e) => setMinUtil(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <p className="mt-1 text-xs text-muted-foreground">Blocks below this threshold are flagged</p>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium">Auto-approve High-confidence blocks</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Bypasses manual review for high-confidence, low-impact blocks</p>
                </div>
                <button
                  onClick={() => { setAutoApprove(!autoApprove); toast(autoApprove ? 'Auto-approve disabled' : 'Auto-approve enabled — use carefully') }}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    autoApprove ? 'bg-primary' : 'bg-muted'
                  }`}
                  role="switch"
                  aria-checked={autoApprove}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      autoApprove ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium">Conflict notifications</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Alert when new conflicts are detected</p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    notifications ? 'bg-primary' : 'bg-muted'
                  }`}
                  role="switch"
                  aria-checked={notifications}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      notifications ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <Button
                className="w-full"
                onClick={() => toast.success('Planning parameters saved')}
              >
                <Save className="size-4" />
                Save parameters
              </Button>
            </CardContent>
          </Card>

          {/* Other settings links */}
          <Card>
            <CardHeader>
              <CardTitle>System settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 p-0 px-6 pb-4">
              {settingsSections.map((s) => {
                const Icon = s.icon
                return (
                  <button
                    key={s.label}
                    className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-muted/40"
                    onClick={() => toast(`${s.label} settings coming soon`)}
                  >
                    <Icon className="size-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{s.label}</p>
                      <p className="text-xs text-muted-foreground truncate">{s.desc}</p>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </button>
                )
              })}
            </CardContent>
          </Card>

          {/* Info */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">About this system</p>
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">RailSanket</strong> — AI-Powered Automatic Block Planning (SIH26027)<br />
                Ministry of Railways · South Eastern Railway · Kharagpur Division<br />
                <span className="mt-1 block">Version: MVP / SIH Prototype</span>
              </p>
              <p className="mt-2 text-xs text-warning-foreground bg-warning-muted/50 rounded p-2">
                AI recommendations require human approval. This system is a decision-support tool and does not issue operational blocks.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

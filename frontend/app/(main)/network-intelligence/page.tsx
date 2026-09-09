'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Network,
  CalendarClock,
  Radio,
  Filter,
  RefreshCw,
  Building2,
  Calendar,
  Layers,
  Search,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  Activity,
} from 'lucide-react'
import {
  networkTopKpis,
  networkCorridors,
  type NetworkLayer,
} from '@/lib/data/network-intelligence'
import { corridors } from '@/lib/data/corridors'
import { Button } from '@/components/ui/button'
import { NetworkMetrics } from '@/components/network-intelligence/network-metrics'
import { NetworkLayerSwitcher } from '@/components/network-intelligence/network-layer-switcher'
import { NetworkMap } from '@/components/network-intelligence/network-map'
import { CorridorDetailPanel } from '@/components/network-intelligence/corridor-detail-panel'
import { MaintenancePressure } from '@/components/network-intelligence/maintenance-pressure'
import { BlockCapacityChart } from '@/components/network-intelligence/block-capacity-chart'
import { TrainDensityChart } from '@/components/network-intelligence/train-density-chart'
import { AINetworkInsights } from '@/components/network-intelligence/ai-network-insights'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function NetworkIntelligencePage() {
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>('C01')
  const [activeLayer, setActiveLayer] = useState<NetworkLayer>('asset-health')
  const [selectedDept, setSelectedDept] = useState<'All' | 'Engineering' | 'S&T' | 'Traction'>('All')
  const [selectedHorizon, setSelectedHorizon] = useState<'7d' | '14d' | '30d'>('7d')
  const [simMinute, setSimMinute] = useState<number>(750) // 12:30 IST default
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentCorridor = networkCorridors[selectedCorridorId] || networkCorridors['C01']

  // Dynamically adjusted KPIs when filtering
  const displayKpis = {
    ...networkTopKpis,
    assetAvailability: selectedDept === 'Engineering' ? 95.8 : selectedDept === 'S&T' ? 96.2 : selectedDept === 'Traction' ? 98.1 : networkTopKpis.assetAvailability,
    criticalTasks: selectedDept === 'All' ? networkTopKpis.criticalTasks : selectedDept === 'Engineering' ? 6 : selectedDept === 'S&T' ? 4 : 2,
  }

  function handleCorridorFilterChange(cid: string) {
    if (cid === 'All') {
      setSelectedCorridorId('C01')
      toast.info('Showing all 5 division corridors')
    } else {
      setSelectedCorridorId(cid)
      toast.info(`Focused on ${cid}: ${networkCorridors[cid]?.name}`)
    }
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = searchQuery.trim().toUpperCase()
    if (!q) return

    if (q.includes('12841') || q.includes('COROMANDEL') || q.includes('12863') || q.includes('HWH') || q.includes('SRC') || q.includes('PKU')) {
      setSelectedCorridorId('C01')
      toast.success(`Focused C01: Howrah–Kharagpur Main Line for "${searchQuery}"`)
    } else if (q.includes('18001') || q.includes('KANDARI') || q.includes('DGHA') || q.includes('TMZ')) {
      setSelectedCorridorId('C04')
      toast.success(`Focused C04: Panskura–Haldia–Digha Coastal Line for "${searchQuery}"`)
    } else if (q.includes('TATA') || q.includes('COAL') || q.includes('BOXN') || q.includes('8821')) {
      setSelectedCorridorId('C03')
      toast.success(`Focused C03: Kharagpur–Tatanagar Mineral Line for "${searchQuery}"`)
    } else if (q.includes('12839') || q.includes('BLS') || q.includes('BALASORE')) {
      setSelectedCorridorId('C02')
      toast.success(`Focused C02: Kharagpur–Balasore Trunk Line for "${searchQuery}"`)
    } else if (q.includes('MDN') || q.includes('MIDNAPORE') || q.includes('BCN')) {
      setSelectedCorridorId('C05')
      toast.success(`Focused C05: Kharagpur–Midnapore Section for "${searchQuery}"`)
    } else {
      toast.info(`No specific match for "${searchQuery}". Showing ${selectedCorridorId}.`)
    }
  }

  return (
    <div className="space-y-5 relative">
      {/* Live OCC Division Alert Ticker Strip */}
      <div className="flex items-center justify-between gap-3 rounded-lg border border-border/80 bg-secondary/30 px-3.5 py-1.5 text-xs font-mono">
        <div className="flex items-center gap-2 truncate">
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-primary shrink-0">
            <Radio className="size-3 animate-pulse text-cyan-400" />
            OCC BROADCAST:
          </span>
          <span className="truncate text-muted-foreground text-[11px]">
            ⚠️ Caution Order #SER-281: 30 km/h PSR at KM 118/4 (KGP-HIJ) · ⚡ 11:30–13:30 AI Bundled Window Active · TMS feed latency: 42ms
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 shrink-0 text-[11px] text-muted-foreground">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-foreground font-semibold">SER KHARAGPUR (KGP)</span>
        </div>
      </div>

      {/* Page Header: High-Density Operational Command Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-border/80 bg-card/80 p-4 shadow-xs backdrop-blur-md md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Network className="size-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Network Intelligence
            </h1>
            <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
              OCC Situational Awareness
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Topological block capacity, train headway movement & asset risk intersection · Horizon:{' '}
            <span className="font-mono font-medium text-foreground">12–18 October 2026</span>
          </p>
        </div>

        {/* Right Status & Primary Action */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <span className="flex items-center gap-1.5 font-medium text-emerald-500">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              TMS Live Feed
            </span>
            <span>· Updated just now</span>
          </div>

          <Button asChild size="sm" className="gap-2 shadow-sm font-semibold">
            <Link href="/planner">
              <CalendarClock className="size-4" />
              Open Block Planner
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter Bar Strip with Global Train/Station Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/70 bg-secondary/30 px-3.5 py-2 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">
            <Filter className="size-3 text-primary" />
            Filters:
          </span>

          {/* Corridor Dropdown Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground text-[11px]">Corridor:</span>
            <select
              value={selectedCorridorId}
              onChange={(e) => handleCorridorFilterChange(e.target.value)}
              className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="All">All Corridors (C01–C05)</option>
              {corridors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} — {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Department Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground text-[11px]">Department:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value as any)}
              className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering (TMS)</option>
              <option value="S&T">Signalling (SMMS)</option>
              <option value="Traction">Traction OHE (TDMS)</option>
            </select>
          </div>

          {/* Date Range / Horizon */}
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground text-[11px]">Horizon:</span>
            <div className="flex rounded-md border border-border bg-background p-0.5 font-mono text-[11px]">
              {(['7d', '14d', '30d'] as const).map((h) => (
                <button
                  key={h}
                  onClick={() => setSelectedHorizon(h)}
                  className={cn(
                    'rounded px-2 py-0.5 font-bold transition-all',
                    selectedHorizon === h ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {h.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Global Train / Station Quick Search */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5">
          <div className="relative">
            <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search train (e.g. 12841) or station (KGP)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 rounded-md border border-border bg-background pl-8 pr-2.5 py-1 text-xs text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <Button type="submit" size="xs" variant="secondary" className="font-mono text-[11px]">
            Find
          </Button>
        </form>
      </div>

      {/* Top Integrated Metric Tiles with Real SVG Sparklines */}
      <NetworkMetrics kpis={displayKpis} filteredCorridor={selectedCorridorId} />

      {/* Visual Network Layers Switcher */}
      <NetworkLayerSwitcher
        activeLayer={activeLayer}
        onChangeLayer={(layer) => setActiveLayer(layer)}
      />

      {/* Central Visual Composition: Hero Railway Map & Selected Corridor Inspector */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Large Stylized Railway Grid with Live Moving Trains & 24h Scrubber */}
        <div className="lg:col-span-2">
          <NetworkMap
            selectedCorridorId={selectedCorridorId}
            onSelectCorridor={(id) => setSelectedCorridorId(id)}
            activeLayer={activeLayer}
            simMinute={simMinute}
            onSimMinuteChange={(m) => setSimMinute(m)}
          />
        </div>

        {/* Selected Corridor Detail Panel with THI Gauge & Radio Feed */}
        <div className="lg:col-span-1">
          <CorridorDetailPanel
            corridor={currentCorridor}
            onSelectCorridor={(id) => setSelectedCorridorId(id)}
          />
        </div>
      </div>

      {/* Maintenance Pressure & Block Capacity Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <MaintenancePressure
          selectedCorridorId={selectedCorridorId}
          onSelectCorridor={(id) => setSelectedCorridorId(id)}
        />
        <BlockCapacityChart
          selectedCorridorId={selectedCorridorId}
          onSelectCorridor={(id) => setSelectedCorridorId(id)}
        />
      </div>

      {/* Network Train Movement Density (Synchronized with Map Scrubber) */}
      <TrainDensityChart simMinute={simMinute} />

      {/* AI Network Insights & Advisory */}
      <AINetworkInsights onSelectCorridor={(id) => setSelectedCorridorId(id)} />
    </div>
  )
}

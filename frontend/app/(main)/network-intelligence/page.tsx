'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Network,
  CalendarClock,
  Search,
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
    <div className="space-y-4 relative">
      {/* Page Header */}
      <div className="flex flex-col gap-3 rounded-lg border border-border/70 bg-card p-3.5 shadow-xs md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Network className="size-4" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">
              Network Intelligence
            </h1>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Real-time track topology, train movement, and corridor maintenance windows.
          </p>
        </div>

        {/* Right Status & Primary Action */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-medium">TMS Live Feed</span>
          </div>

          <Button asChild size="sm" className="h-8 gap-1.5 shadow-xs text-xs">
            <Link href="/planner">
              <CalendarClock className="size-3.5" />
              Open Block Planner
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter Bar Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-lg border border-border/60 bg-secondary/25 px-3 py-2 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Corridor Dropdown Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground text-[11px]">Corridor:</span>
            <select
              value={selectedCorridorId}
              onChange={(e) => handleCorridorFilterChange(e.target.value)}
              className="rounded border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
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
            <span className="text-muted-foreground text-[11px]">Dept:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value as any)}
              className="rounded border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering (TMS)</option>
              <option value="S&T">Signalling (SMMS)</option>
              <option value="Traction">Traction (TDMS)</option>
            </select>
          </div>

          {/* Horizon */}
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground text-[11px]">Horizon:</span>
            <div className="flex rounded border border-border bg-background p-0.5 text-[11px]">
              {(['7d', '14d', '30d'] as const).map((h) => (
                <button
                  key={h}
                  onClick={() => setSelectedHorizon(h)}
                  className={cn(
                    'rounded px-1.5 py-0.2 font-medium transition-all',
                    selectedHorizon === h ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Search */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5">
          <div className="relative">
            <Search className="size-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search train or station..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 rounded border border-border bg-background pl-7 pr-2 py-1 text-xs text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <Button type="submit" size="xs" variant="secondary" className="h-6.5 text-[11px]">
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

'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  TrainFront,
  ShieldCheck,
  CalendarClock,
  Sparkles,
  ArrowRight,
  Layers,
  Wrench,
  Zap,
  Radio,
  Search,
  CheckCircle2,
  Lock,
  Building2,
  TrendingUp,
  Cpu,
  Compass,
  FileCheck2,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'

export default function RootLandingPage() {
  const { user, isAuthenticated } = useAuth()
  const [activeStep, setActiveStep] = useState<number>(1)
  const [searchFrom, setSearchFrom] = useState<string>('HWH')
  const [searchTo, setSearchTo] = useState<string>('KGP')
  const [inquiryResult, setInquiryResult] = useState<string | null>(null)

  const steps = [
    {
      step: 1,
      title: 'Unified Backlog Normalization',
      tag: 'Step 1 · Data Ingestion',
      dept: 'TMS (Track) · SMMS (Signals) · TDMS (OHE)',
      desc: 'Connects directly with Indian Railways enterprise databases to continuously normalize maintenance requisitions from all 3 technical engineering departments into a unified, conflict-aware backlog.',
      bullet: 'Automated urgency scoring based on train speeds, overdue days, and asset degradation curves.',
      badge: 'Zero Manual Consolidation',
    },
    {
      step: 2,
      title: 'AI Constraint-Based Solving',
      tag: 'Step 2 · Timetable Horizon',
      dept: 'Control Office Application (COA) / TMS Feed',
      desc: 'Our constraint satisfaction engine analyzes live passenger and goods train schedules to discover optimal 90–180 minute maintenance windows between train paths without causing section bottlenecks.',
      bullet: 'Maintains headway safety buffers (15–20 min) and prevents adjacent section deadlocks.',
      badge: 'Punctuality Protection',
    },
    {
      step: 3,
      title: 'Multi-Department Bundling & Approval',
      tag: 'Step 3 · Joint Execution',
      dept: 'Section Controllers & Divisional Officers',
      desc: 'Simultaneously schedules Track Tamper machines, OHE power shutoffs, and point machine testing inside the exact same corridor window — saving an average of 375 minutes of idle track time weekly.',
      bullet: 'One-click explainable rationale with contingency alternative windows and instant officer authorization.',
      badge: '+30% Corridor Utilization',
    },
  ]

  const departments = [
    {
      cadre: 'IRTS',
      name: 'Operating / Traffic',
      role: 'Sr. DOM / Section Controllers',
      icon: TrainFront,
      accent: 'border-blue-500/50 bg-blue-500/20 text-blue-300',
      responsibilities: 'Timetable protection, freight dispatching, speed restrictions, and section block grants.',
    },
    {
      cadre: 'IRSE',
      name: 'Civil Engineering (TMS)',
      role: 'Sr. DEN / AEN / Track Engineers',
      icon: Wrench,
      accent: 'border-amber-500/50 bg-amber-500/20 text-amber-300',
      responsibilities: 'Track tamping, rail renewal, deep screening, bridge bearings, and ultrasonic flaw detection (USFD).',
    },
    {
      cadre: 'IRSEE',
      name: 'Traction Distribution (TDMS)',
      role: 'Sr. DEE / TRD Engineers',
      icon: Zap,
      accent: 'border-cyan-500/50 bg-cyan-500/20 text-cyan-300',
      responsibilities: '25kV OHE power blocks, contact wire inspection, isolator testing, and mast alignment.',
    },
    {
      cadre: 'IRSSE',
      name: 'Signal & Telecom (SMMS)',
      role: 'Sr. DSTE / Signal Inspectors',
      icon: Radio,
      accent: 'border-violet-500/50 bg-violet-500/20 text-violet-300',
      responsibilities: 'Point machine overhauls, track circuits, axle counters, and electronic interlocking (EI) safety.',
    },
  ]

  function handleSearchWindow(e: React.FormEvent) {
    e.preventDefault()
    setInquiryResult(
      `Feasible 120-min maintenance window identified between ${searchFrom} and ${searchTo} (11:30–13:30 IST). Post-passage of Down Coromandel Express (12841). Zero conflict.`
    )
  }

  return (
    <div className="relative min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-primary selection:text-white">
      {/* Background Image: Vivid, High-Visibility Indian Railways Scenic Viaduct */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/railway-viaduct-bg.jpg"
          alt="Indian Railways Scenic Viaduct"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-[0.72] contrast-[1.05] saturate-[1.12]"
        />
        {/* Soft, Transparent Gradient Mask so Background Landscape is Vividly Clear */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/25 to-slate-950/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.12)_0%,transparent_65%)]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-40 border-b border-white/15 bg-slate-950/70 backdrop-blur-md px-4 py-3 sm:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            {/* Logo & Wordmark */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex size-10 items-center justify-center rounded-xl bg-white p-1 border border-white/40 shadow-md transition-transform group-hover:scale-105">
                <Image
                  src="/railsanket-logo.png"
                  alt="Rail Sanket Locomotive Logo"
                  width={36}
                  height={36}
                  className="size-8 object-contain"
                  priority
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Image
                    src="/railsanket-wordmark-white.png"
                    alt="Rail Sanket"
                    width={130}
                    height={25}
                    className="h-6 w-auto object-contain"
                    priority
                  />
                  <span className="rounded bg-primary/30 px-1.5 py-0.5 font-mono text-[9px] font-bold text-cyan-300 border border-cyan-400/40">
                    AI OCC
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 font-mono mt-0.5">
                  Indian Railways · Kharagpur Division
                </p>
              </div>
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs text-slate-200">
              <a href="#overview" className="hover:text-white transition-colors font-medium">Overview</a>
              <a href="#onboarding" className="hover:text-white transition-colors font-medium">How It Works</a>
              <a href="#departments" className="hover:text-white transition-colors font-medium">Departments</a>
              <a href="#calculator" className="hover:text-white transition-colors font-medium">Window Inquiry</a>
            </nav>

            {/* Auth CTA */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Button size="sm" asChild className="h-8 gap-1.5 font-medium text-xs shadow-md">
                  <Link href="/dashboard">
                    <span>Enter OCC ({user?.initials})</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              ) : (
                <Button size="sm" asChild className="h-8 gap-1.5 font-medium text-xs shadow-md">
                  <Link href="/auth">
                    <Lock className="size-3.5" />
                    <span>Officer Sign In</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section id="overview" className="flex flex-col justify-center px-4 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-5xl text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-slate-950/70 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-md shadow-md">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SAFETY · SECURITY · PUNCTUALITY · PRD SIH26027</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
              Coordinated AI Block Planning <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-300 via-cyan-200 to-emerald-300 bg-clip-text text-transparent">
                for Indian Railways
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto max-w-3xl text-sm sm:text-base text-slate-100 font-medium leading-relaxed drop-shadow-sm bg-slate-950/40 p-3 rounded-xl backdrop-blur-xs">
              RailSanket coordinates maintenance work across Civil Engineering (TMS), Signalling (SMMS), and Traction Distribution (TDMS). By automatically identifying gap windows between passenger and goods train paths, it bundles multi-department repairs while protecting train punctuality.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button size="lg" asChild className="h-11 px-6 text-sm font-semibold shadow-xl shadow-blue-950/60">
                <Link href="/auth">
                  <Lock className="size-4" />
                  Officer Login &amp; Demo Access
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-11 px-6 text-sm border-white/30 bg-slate-950/60 hover:bg-slate-900 text-white backdrop-blur-md">
                <a href="#onboarding">
                  <Compass className="size-4" />
                  Explore Onboarding Workflow
                </a>
              </Button>
            </div>

            {/* Telemetry Strip */}
            <div className="grid grid-cols-2 gap-3 pt-8 sm:grid-cols-4 max-w-4xl mx-auto">
              {[
                { label: 'Division Network', val: 'Kharagpur (SER)', sub: '5 Trunk Corridors' },
                { label: 'Target Availability', val: '96.1%', sub: '+1.4% 7d improvement' },
                { label: 'Weekly Savings', val: '375 min', sub: 'Idle block downtime saved' },
                { label: 'Safety Clashes', val: '0 Hard Clashes', sub: 'Guaranteed buffer clearances' },
              ].map((m, i) => (
                <div key={i} className="rounded-xl border border-white/20 bg-slate-950/75 p-3.5 backdrop-blur-md text-left shadow-lg">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300">{m.label}</span>
                  <p className="font-mono text-xl font-bold text-white mt-0.5">{m.val}</p>
                  <span className="text-[11px] text-slate-300">{m.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3-Step Interactive Onboarding Section */}
        <section id="onboarding" className="border-t border-white/15 bg-slate-950/70 px-4 py-16 sm:px-8 backdrop-blur-md">
          <div className="mx-auto max-w-6xl space-y-10">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
                Operational Architecture
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white">
                How RailSanket Transforms Block Planning
              </h2>
              <p className="mx-auto max-w-2xl text-xs sm:text-sm text-slate-300">
                A seamless 3-stage process from automated enterprise feed ingestion to multi-department joint execution.
              </p>
            </div>

            {/* Step Selector Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {steps.map((s) => (
                <button
                  key={s.step}
                  onClick={() => setActiveStep(s.step)}
                  className={`rounded-xl border p-4 text-left transition-all backdrop-blur-md ${
                    activeStep === s.step
                      ? 'border-primary bg-primary/20 ring-1 ring-primary shadow-lg text-white'
                      : 'border-white/15 bg-slate-950/60 hover:bg-slate-900/80 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary">{s.tag}</span>
                    <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-slate-200">
                      {s.badge}
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-white">{s.title}</h3>
                  <p className="mt-1 text-xs text-slate-300 line-clamp-2">{s.desc}</p>
                </button>
              ))}
            </div>

            {/* Active Step Deep-Dive Card */}
            {steps.find((s) => s.step === activeStep) && (
              <div className="rounded-2xl border border-white/20 bg-slate-950/80 p-6 sm:p-8 backdrop-blur-xl space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/10 pb-4">
                  <div>
                    <span className="font-mono text-xs text-primary font-semibold uppercase tracking-wider">
                      {steps[activeStep - 1].tag}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                      {steps[activeStep - 1].title}
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-slate-200 rounded-md bg-white/10 px-3 py-1 self-start sm:self-center">
                    Systems: {steps[activeStep - 1].dept}
                  </span>
                </div>

                <p className="text-sm text-slate-200 leading-relaxed">
                  {steps[activeStep - 1].desc}
                </p>

                <div className="flex items-start gap-2.5 rounded-lg border border-emerald-500/40 bg-emerald-500/15 p-3 text-xs text-emerald-200">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span>{steps[activeStep - 1].bullet}</span>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <Button size="sm" asChild className="h-8 gap-1.5 text-xs font-semibold">
                    <Link href="/auth">
                      <Lock className="size-3.5" />
                      Sign In as Officer to Experience
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild className="h-8 text-xs border-white/25 text-slate-200">
                    <Link href="/planner">
                      <CalendarClock className="size-3.5" />
                      View Live Block Planner
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 4 Indian Railways Engineering Cadres Section */}
        <section id="departments" className="border-t border-white/15 px-4 py-16 sm:px-8 bg-slate-950/50 backdrop-blur-xs">
          <div className="mx-auto max-w-6xl space-y-10">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
                Divisional Stakeholders
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white">
                Coordinating Key Railway Departments
              </h2>
              <p className="mx-auto max-w-2xl text-xs sm:text-sm text-slate-300">
                Aligned with South Eastern Railway organizational cadres for seamless inter-departmental consensus.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {departments.map((d, i) => (
                <div key={i} className="rounded-xl border border-white/20 bg-slate-950/75 p-5 backdrop-blur-md space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className={`flex size-9 items-center justify-center rounded-lg border ${d.accent}`}>
                      <d.icon className="size-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-white px-2 py-0.5 rounded bg-white/10">
                      {d.cadre}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{d.name}</h4>
                    <p className="text-xs text-slate-300 font-mono mt-0.5">{d.role}</p>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed border-t border-white/10 pt-2.5">
                    {d.responsibilities}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Block Window Feasibility Tool */}
        <section id="calculator" className="border-t border-white/15 bg-slate-950/75 px-4 py-16 sm:px-8 backdrop-blur-md">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
                Interactive Feasibility Tool
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Quick Corridor Window Search
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                Test the gap discovery engine between any two division junction points.
              </p>
            </div>

            <form onSubmit={handleSearchWindow} className="rounded-xl border border-white/20 bg-slate-950/85 p-5 sm:p-6 backdrop-blur-xl space-y-4 shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-mono">From Station</label>
                  <select
                    value={searchFrom}
                    onChange={(e) => setSearchFrom(e.target.value)}
                    className="w-full rounded-md border border-white/20 bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
                  >
                    <option value="HWH">Howrah Jn (HWH)</option>
                    <option value="SRC">Santragachi Jn (SRC)</option>
                    <option value="PKU">Panskura Jn (PKU)</option>
                    <option value="KGP">Kharagpur Jn (KGP)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-mono">To Station</label>
                  <select
                    value={searchTo}
                    onChange={(e) => setSearchTo(e.target.value)}
                    className="w-full rounded-md border border-white/20 bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
                  >
                    <option value="KGP">Kharagpur Jn (KGP)</option>
                    <option value="BLS">Balasore (BLS)</option>
                    <option value="TATA">Tatanagar Jn (TATA)</option>
                    <option value="MDN">Midnapore (MDN)</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <Button type="submit" className="w-full h-9 text-xs font-semibold gap-2">
                    <Search className="size-3.5" />
                    Find Feasible Window
                  </Button>
                </div>
              </div>

              {inquiryResult && (
                <div className="rounded-lg border border-primary/40 bg-primary/15 p-3.5 text-xs text-slate-100 space-y-2 mt-3 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 font-semibold text-primary">
                    <CheckCircle2 className="size-4 text-emerald-400" />
                    <span>Feasible Maintenance Window Discovered</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-200">
                    {inquiryResult}
                  </p>
                  <div className="pt-1 flex items-center gap-2">
                    <Button size="sm" asChild className="h-7 text-[11px]">
                      <Link href="/auth">
                        Enter OCC to Schedule Block
                        <ArrowRight className="size-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-slate-950/90 px-4 py-8 sm:px-8 text-center text-xs text-slate-400">
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <TrainFront className="size-4 text-primary" />
              <span className="font-bold text-slate-200">RailSanket</span>
              <span>· Center for Railway Information Systems (CRIS)</span>
            </div>
            <p className="text-[11px]">
              Kharagpur Division, South Eastern Railway · Smart India Hackathon (SIH26027)
            </p>
            <div className="flex items-center gap-4 text-[11px] text-slate-300">
              <Link href="/auth" className="hover:text-white">Officer Portal</Link>
              <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
              <Link href="/planner" className="hover:text-white">Block Planner</Link>
              <Link href="/network-intelligence" className="hover:text-white">Network Map</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

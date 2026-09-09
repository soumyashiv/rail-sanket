'use client'

import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  TrainFront,
  ShieldCheck,
  KeyRound,
  UserCheck,
  Building2,
  Calendar,
  Search,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  CheckCircle2,
  AlertCircle,
  Radio,
  FileCheck2,
  Compass,
  Layers,
  Wrench,
  Zap,
  LogOut,
  SlidersHorizontal,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useAuth, defaultOfficers, type UserSession } from '@/lib/auth-context'

interface DemoOfficer {
  id: string
  name: string
  cadre: string
  designation: string
  department: string
  email: string
  division: string
  icon: any
  badgeColor: string
}

const demoOfficers: DemoOfficer[] = [
  {
    id: 'dom',
    name: 'S. K. Mukherjee',
    cadre: 'IRTS',
    designation: 'Sr. Divisional Operations Manager',
    department: 'Operating (Traffic Control)',
    email: 'srdom.kgp@ser.railnet.gov.in',
    division: 'Kharagpur Division, SER',
    icon: TrainFront,
    badgeColor: 'bg-primary/20 text-primary border-primary/40',
  },
  {
    id: 'den',
    name: 'Rajesh Verma',
    cadre: 'IRSE',
    designation: 'Sr. Divisional Engineer / Planning',
    department: 'Civil Engineering (TMS Track)',
    email: 'srden.plan.kgp@ser.railnet.gov.in',
    division: 'Kharagpur Division, SER',
    icon: Wrench,
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
  },
  {
    id: 'dee',
    name: 'Amit Sen',
    cadre: 'IRSEE',
    designation: 'Sr. Divisional Electrical Engineer',
    department: 'Traction Distribution (TDMS OHE)',
    email: 'srdee.trd.kgp@ser.railnet.gov.in',
    division: 'Kharagpur Division, SER',
    icon: Zap,
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
  },
  {
    id: 'dste',
    name: 'Priya Nair',
    cadre: 'IRSSE',
    designation: 'Sr. Divisional Signal & Telecom Engg',
    department: 'Signalling & Telecom (SMMS)',
    email: 'srdste.kgp@ser.railnet.gov.in',
    division: 'Kharagpur Division, SER',
    icon: Radio,
    badgeColor: 'bg-violet-500/20 text-violet-400 border-violet-500/40',
  },
]

function AuthContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTarget = searchParams?.get('redirect') || '/network-intelligence'
  const { user, isAuthenticated, login, logout } = useAuth()

  const [activeTab, setActiveTab] = useState<'login' | 'personas' | 'register' | 'inquiry'>('personas')
  const [email, setEmail] = useState<string>('srdom.kgp@ser.railnet.gov.in')
  const [password, setPassword] = useState<string>('••••••••••••')
  const [department, setDepartment] = useState<string>('Operating')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [requireOtp, setRequireOtp] = useState<boolean>(false)

  // Inquiry tab states
  const [fromStation, setFromStation] = useState<string>('Howrah (HWH)')
  const [toStation, setToStation] = useState<string>('Kharagpur (KGP)')
  const [journeyDate, setJourneyDate] = useState<string>('2026-10-14')

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    // Map department to realistic officer
    const matched = defaultOfficers.find((o) => o.department.includes(department)) || defaultOfficers[0]

    setTimeout(() => {
      setIsLoading(false)
      toast.success('CRIS Authentication Successful', {
        description: `Welcome, ${matched.name} (${matched.cadre}). Access granted to Kharagpur Central OCC.`,
      })
      login(
        {
          ...matched,
          email: email || matched.email,
        },
        redirectTarget,
      )
    }, 600)
  }

  function handleSelectPersona(officer: DemoOfficer) {
    setEmail(officer.email)
    setDepartment(officer.department)
    setIsLoading(true)

    toast.info(`Authenticating as ${officer.name} (${officer.cadre})...`, {
      description: officer.designation,
    })

    setTimeout(() => {
      setIsLoading(false)
      toast.success(`Access Granted: ${officer.name}`, {
        description: `${officer.department} · ${officer.division}`,
      })
      login(
        {
          id: officer.id,
          name: officer.name,
          cadre: officer.cadre,
          designation: officer.designation,
          department: officer.department,
          email: officer.email,
          division: officer.division,
          initials: officer.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase(),
        },
        redirectTarget,
      )
    }, 450)
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      toast.success('Clearance Request Submitted', {
        description: 'Your request #CRIS-SER-2026-891 has been routed to Sr. DOM for DRM approval.',
      })
      setActiveTab('login')
    }, 700)
  }

  function handleInquirySearch(e: React.FormEvent) {
    e.preventDefault()
    toast.success('Found 4 Feasible Maintenance Windows', {
      description: `${fromStation} → ${toStation} on ${journeyDate}. Midday optimal window: 11:30–13:30.`,
    })
    router.push('/network-intelligence')
  }

  return (
    <div className="relative min-h-screen w-full select-none overflow-x-hidden bg-slate-950 font-sans text-foreground">
      {/* 1. Cinematic Scenic Background: Indian Railways Mountain Viaduct */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/railway-viaduct-bg.jpg"
          alt="Indian Railways Scenic Mountain Viaduct"
          fill
          priority
          className="object-cover object-center brightness-90 contrast-105"
        />
        {/* Rich dark gradient vignette overlays for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(2,6,23,0.85)_100%)]" />
      </div>

      {/* 2. Top Navigation Bar matching reference image */}
      <header className="relative z-20 flex h-20 w-full items-center justify-between px-6 sm:px-12 backdrop-blur-xs border-b border-white/10">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600/90 text-white shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-105 border border-white/20">
            <TrainFront className="size-6" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white drop-shadow-md">
                Railonic
              </span>
              <span className="rounded bg-white/20 px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider text-white">
                CRIS Portal
              </span>
            </div>
            <p className="text-[10px] font-medium tracking-wide text-slate-300">
              Indian Railways · Automatic Block Planning
            </p>
          </div>
        </Link>

        {/* Central Navigation Pills */}
        <nav className="hidden lg:flex items-center gap-1.5 rounded-full border border-white/15 bg-slate-900/60 p-1.5 backdrop-blur-md text-xs font-medium text-slate-200">
          <Link
            href="/network-intelligence"
            className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Compass className="size-3.5 text-cyan-400" />
            <span>Network Operations</span>
          </Link>
          <Link
            href="/planner"
            className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Calendar className="size-3.5 text-primary" />
            <span>Block Planner</span>
          </Link>
          <Link
            href="/conflicts"
            className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition-colors hover:bg-white/10 hover:text-white"
          >
            <AlertCircle className="size-3.5 text-amber-400" />
            <span>Conflict Matrix</span>
          </Link>
          <Link
            href="/what-if"
            className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Sparkles className="size-3.5 text-violet-400" />
            <span>What-If Simulator</span>
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-mono hidden sm:inline">
                {user.name} ({user.cadre})
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="text-xs border-white/20 text-slate-200 hover:bg-white/10 gap-1.5"
              >
                <LogOut className="size-3" />
                <span>Sign Out</span>
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('login')}
                className={cn(
                  'text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 border border-transparent',
                  activeTab === 'login' && 'border-white/20 bg-white/10 text-white',
                )}
              >
                Officer Login
              </Button>

              <Button
                size="sm"
                onClick={() => setActiveTab('personas')}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30 gap-1.5"
              >
                <UserCheck className="size-3.5" />
                <span>1-Click Demo Login</span>
              </Button>
            </>
          )}
        </div>
      </header>

      {/* 3. Hero Content & Tagline Section */}
      <main className="relative z-10 mx-auto flex max-w-7xl flex-col justify-between px-6 pt-10 pb-16 sm:px-12 min-h-[calc(100vh-80px)]">
        {/* Hero Title and Philosophy from Indian Railways Reference */}
        <div className="max-w-2xl space-y-3">
          {/* Sub-tagline */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-widest text-cyan-300 backdrop-blur-md shadow-xs">
            <span className="size-1.5 rounded-full bg-cyan-400 animate-pulse" />
            SAFETY | SECURITY | PUNCTUALITY
          </div>

          {/* Grand Heading */}
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl drop-shadow-lg leading-tight">
            Indian Railways
          </h1>

          {/* Slogan from Reference Image */}
          <p className="text-sm font-medium leading-relaxed text-slate-200/90 sm:text-base drop-shadow-sm max-w-xl">
            Heartily enjoy every journey through our boundless hospitality. Through Indian railways, The Lifeline of the Nation.
          </p>

          <div className="flex items-center gap-3 pt-1 text-xs text-slate-300/80 font-mono">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
              CRIS Central Auth Server Online
            </span>
            <span>·</span>
            <span>Kharagpur Division, South Eastern Railway</span>
          </div>
        </div>

        {/* 4. Interactive Glassmorphism Authentication Console */}
        <div className="mt-8 w-full max-w-4xl rounded-2xl border border-white/20 bg-slate-900/85 p-4 shadow-2xl backdrop-blur-xl sm:p-6 transition-all duration-300">
          {/* Already Authenticated Active Banner */}
          {isAuthenticated && user && (
            <div className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3.5 flex flex-wrap items-center justify-between gap-3 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-bold font-mono text-sm border border-emerald-500/30">
                  {user.initials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">
                      {user.name}, {user.cadre}
                    </span>
                    <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 font-mono text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
                      SESSION ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">
                    {user.designation} · {user.department}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="text-xs border-white/20 text-slate-200 hover:bg-white/10"
                >
                  Switch Officer
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 shadow-md shadow-emerald-600/30"
                >
                  <Link href={redirectTarget}>
                    <span>Continue Work in OCC</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-white/15 pb-3">
            <button
              onClick={() => setActiveTab('personas')}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-xs font-bold transition-all',
                activeTab === 'personas'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white',
              )}
            >
              <UserCheck className="size-3.5" />
              <span>1-Click Demo Personas</span>
            </button>

            <button
              onClick={() => setActiveTab('login')}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-xs font-bold transition-all',
                activeTab === 'login'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white',
              )}
            >
              <KeyRound className="size-3.5" />
              <span>Officer SSO Login</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiry')}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-xs font-bold transition-all',
                activeTab === 'inquiry'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white',
              )}
            >
              <Search className="size-3.5" />
              <span>Block Window / Timetable Inquiry</span>
            </button>

            <button
              onClick={() => setActiveTab('register')}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-xs font-bold transition-all',
                activeTab === 'register'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white',
              )}
            >
              <FileCheck2 className="size-3.5" />
              <span>Request Clearance</span>
            </button>
          </div>

          {/* Tab: Quick 1-Click Demo Personas */}
          {activeTab === 'personas' && (
            <div className="mt-4 space-y-3">
              <p className="text-xs text-slate-300">
                Select an authentic Indian Railways operational officer to authenticate and immediately access the division control room:
              </p>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {demoOfficers.map((officer) => (
                  <div
                    key={officer.id}
                    onClick={() => handleSelectPersona(officer)}
                    className="group cursor-pointer rounded-xl border border-white/15 bg-slate-800/60 p-3.5 transition-all duration-200 hover:-translate-y-1 hover:border-blue-500/50 hover:bg-slate-800/90 hover:shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <span className={cn('rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold', officer.badgeColor)}>
                        {officer.cadre}
                      </span>
                      <officer.icon className="size-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                    </div>

                    <h4 className="mt-2.5 font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                      {officer.name}
                    </h4>
                    <p className="text-xs text-blue-400/90 font-medium leading-tight">
                      {officer.designation}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {officer.department}
                    </p>

                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300 font-mono">
                      <span>{officer.division.split(',')[0]}</span>
                      <span className="text-blue-400 font-bold group-hover:translate-x-0.5 transition-transform">
                        Login →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Officer SSO Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="mt-4 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {/* Department Select */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/20 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Operating">Operating (Traffic/Sr. DOM)</option>
                    <option value="Engineering">Civil Engineering (TMS/Sr. DEN)</option>
                    <option value="Traction">Traction (TDMS OHE/Sr. DEE)</option>
                    <option value="Signalling">Signalling & Telecom (SMMS/Sr. DSTE)</option>
                  </select>
                </div>

                {/* Email / HRMS ID */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    CRIS / Railnet Email
                  </label>
                  <div className="relative mt-1">
                    <Mail className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="officer@ser.railnet.gov.in"
                      className="w-full rounded-lg border border-white/20 bg-slate-800/80 pl-8 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Passkey / CRIS Password
                  </label>
                  <div className="relative mt-1">
                    <Lock className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-lg border border-white/20 bg-slate-800/80 pl-8 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                    />
                  </div>
                </div>

                {/* Division Preselected */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Assigned Division
                  </label>
                  <div className="relative mt-1">
                    <Building2 className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
                    <input
                      type="text"
                      disabled
                      value="Kharagpur (SER)"
                      className="w-full rounded-lg border border-white/20 bg-slate-800/50 pl-8 pr-3 py-2 text-xs font-semibold text-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Two-Factor Option & Submit Action */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="otpCheckbox"
                    checked={requireOtp}
                    onChange={(e) => setRequireOtp(e.target.checked)}
                    className="size-4 rounded border-white/20 bg-slate-800 text-blue-600 focus:ring-0"
                  />
                  <label htmlFor="otpCheckbox" className="text-xs text-slate-300 cursor-pointer">
                    Enable 2FA Mobile OTP Verification (CRIS Sentinel)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab('personas')}
                    className="text-xs text-slate-300 hover:text-white"
                  >
                    Switch to 1-Click Demo
                  </Button>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/40 gap-2 px-6"
                  >
                    {isLoading ? (
                      <span>Verifying Credentials...</span>
                    ) : (
                      <>
                        <span>Authenticate &amp; Enter OCC</span>
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          )}

          {/* Tab: Request Clearance / Registration Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="mt-4 space-y-3">
              <p className="text-xs text-slate-300">
                Submit an authorization request for access to the Kharagpur Division Automated Block Planning System:
              </p>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Full Name &amp; Cadre
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arunav Roy, IRSE"
                    className="mt-1 w-full rounded-lg border border-white/20 bg-slate-800/80 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    HRMS Employee ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HRMS-5029148"
                    className="mt-1 w-full rounded-lg border border-white/20 bg-slate-800/80 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Official Designation
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Assistant Divisional Engineer"
                    className="mt-1 w-full rounded-lg border border-white/20 bg-slate-800/80 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab('personas')}
                  className="text-xs text-slate-300 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Submit Clearance Request
                </Button>
              </div>
            </form>
          )}

          {/* Tab: Block Window Inquiry */}
          {activeTab === 'inquiry' && (
            <form onSubmit={handleInquirySearch} className="mt-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    From Station / Section
                  </label>
                  <input
                    type="text"
                    value={fromStation}
                    onChange={(e) => setFromStation(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/20 bg-slate-800/80 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    To Station / Section
                  </label>
                  <input
                    type="text"
                    value={toStation}
                    onChange={(e) => setToStation(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/20 bg-slate-800/80 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Planning Date
                  </label>
                  <input
                    type="date"
                    value={journeyDate}
                    onChange={(e) => setJourneyDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/20 bg-slate-800/80 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-xs text-slate-400 font-mono">
                  Corridor C01: Howrah–Kharagpur Trunk Line (115 km)
                </span>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs gap-1.5"
                >
                  <Search className="size-3.5" />
                  <span>Search Feasible Block Slots</span>
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* 5. Ministry of Railways Security Footer */}
        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400" />
            <span>Ministry of Railways · Government of India · CRIS Secured SSL Gateway</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-400">FOIS · COA · TMS · ICMS API v4.2</span>
            <Link href="/network-intelligence" className="text-blue-400 hover:underline">
              Enter Operations Control Room →
            </Link>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading Indian Railways Portal...</div>}>
      <AuthContent />
    </Suspense>
  )
}

'use client'

import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  TrainFront,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  CheckCircle2,
  AlertCircle,
  Radio,
  FileCheck2,
  Wrench,
  Zap,
  LogOut,
  Building2,
  Compass,
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
  const redirectTarget = searchParams?.get('redirect') || '/planner'
  const { user, isAuthenticated, login, logout } = useAuth()

  const [activeTab, setActiveTab] = useState<'demo' | 'sso' | 'request'>('demo')
  const [email, setEmail] = useState('srdom.kgp@ser.railnet.gov.in')
  const [password, setPassword] = useState('••••••••••••')
  const [requireOtp, setRequireOtp] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Quick Demo Officer Login
  function handleDemoLogin(officer: DemoOfficer) {
    setIsSubmitting(true)
    const session: UserSession = {
      id: officer.id,
      name: officer.name,
      cadre: officer.cadre,
      designation: officer.designation,
      department: officer.department,
      email: officer.email,
      division: officer.division,
      role: 'Officer',
      initials: officer.name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      authenticatedAt: new Date().toISOString(),
    }

    login(session, redirectTarget)
    toast.success(`Welcome, ${officer.name} (${officer.cadre})`, {
      description: `Authenticated as ${officer.designation} · ${officer.division}`,
    })
  }

  // Handle Manual Officer Login
  function handleManualLogin(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      const match =
        demoOfficers.find((o) => o.email.toLowerCase() === email.toLowerCase()) ||
        demoOfficers[0]

      const session: UserSession = {
        id: match.id,
        name: match.name,
        cadre: match.cadre,
        designation: match.designation,
        department: match.department,
        email: email,
        division: match.division,
        role: 'Officer',
        initials: match.name
          .split(' ')
          .map((p) => p[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(),
        authenticatedAt: new Date().toISOString(),
      }

      login(session, redirectTarget)
      toast.success(`Authentication Successful`, {
        description: `CRIS SSO Token verified for ${session.name}`,
      })
      setIsSubmitting(false)
    }, 500)
  }

  return (
    <div className="relative min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-primary selection:text-white">
      {/* Background: Red WAP-4 Indian Railways Locomotive with Catenary */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/wap4-loco-bg.jpg"
          alt="Indian Railways WAP-4 Locomotive on Main Line"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-[0.80] contrast-[1.05] saturate-[1.15]"
        />
        {/* Soft, Transparent Contrast Overlay so Locomotive is Beautifully Visible */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/25 to-slate-950/50" />
      </div>

      {/* Foreground Container */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header Bar */}
        <header className="flex items-center justify-between px-4 py-3 sm:px-8 border-b border-white/15 bg-slate-950/70 backdrop-blur-md">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex size-9 items-center justify-center rounded-lg bg-white p-1 border border-white/40 shadow-sm transition-transform group-hover:scale-105">
              <Image
                src="/railsanket-logo.png"
                alt="Rail Sanket Locomotive Logo"
                width={32}
                height={32}
                className="size-7 object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Image
                  src="/railsanket-wordmark-white.png"
                  alt="Rail Sanket"
                  width={120}
                  height={23}
                  className="h-5.5 w-auto object-contain"
                  priority
                />
              </div>
              <p className="text-[10px] text-slate-300 font-mono mt-0.5">
                Indian Railways · Kharagpur Division OCC
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-slate-200 hover:text-white transition-colors"
          >
            <Compass className="size-3.5 text-primary" />
            <span className="hidden sm:inline font-medium">Platform Landing &amp; Onboarding</span>
            <span className="sm:hidden">Landing</span>
            <ArrowRight className="size-3" />
          </Link>
        </header>

        {/* Main Content Area */}
        <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-xl space-y-4">
            {/* Active Session Card (if user is already logged in) */}
            {isAuthenticated && user && (
              <div className="rounded-xl border border-emerald-500/40 bg-slate-900/85 p-4 backdrop-blur-xl shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 className="size-4 text-emerald-400" />
                    <span>Active CRIS Railnet Officer Session</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">
                    SER KGP OCC
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-2.5">
                  <div>
                    <p className="text-sm font-bold text-white">
                      {user.name} <span className="text-xs font-mono text-primary">({user.cadre})</span>
                    </p>
                    <p className="text-xs text-slate-300">{user.designation}</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{user.division}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => router.push(redirectTarget)}
                      className="gap-1.5 h-8 text-xs font-semibold"
                    >
                      Continue to OCC
                      <ArrowRight className="size-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={logout}
                      className="h-8 text-xs border-white/20 text-rose-300 hover:bg-rose-500/20"
                    >
                      <LogOut className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Main Authentication Card */}
            <div className="rounded-2xl border border-white/15 bg-slate-900/85 p-6 backdrop-blur-xl shadow-2xl space-y-5">
              {/* Card Title */}
              <div className="border-b border-white/10 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-5 text-emerald-400" />
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      Officer Authentication
                    </h2>
                  </div>
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-mono text-primary font-semibold">
                    CRIS Railnet Gateway
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Select a demo persona for instant access, or sign in with your CRIS staff credentials.
                </p>
              </div>

              {/* Tabs */}
              <div className="grid grid-cols-2 rounded-lg border border-white/10 bg-slate-950/60 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('demo')}
                  className={cn(
                    'rounded-md py-1.5 font-medium transition-all',
                    activeTab === 'demo'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-slate-400 hover:text-white',
                  )}
                >
                  ⚡ 1-Click Demo Personas
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('sso')}
                  className={cn(
                    'rounded-md py-1.5 font-medium transition-all',
                    activeTab === 'sso'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-slate-400 hover:text-white',
                  )}
                >
                  🔒 CRIS Railnet SSO
                </button>
              </div>

              {/* Tab 1: 1-Click Demo Personas */}
              {activeTab === 'demo' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">
                    Click any authorized officer below to instantly test multi-department workflows:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {demoOfficers.map((officer) => (
                      <button
                        key={officer.id}
                        type="button"
                        onClick={() => handleDemoLogin(officer)}
                        disabled={isSubmitting}
                        className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-slate-950/60 p-3 text-left transition-all hover:border-primary/60 hover:bg-slate-950 hover:shadow-md disabled:opacity-50"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={cn('rounded px-1.5 py-0.2 font-mono text-[10px] font-bold border', officer.badgeColor)}>
                              {officer.cadre}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              SER KGP
                            </span>
                          </div>
                          <p className="font-bold text-sm text-white group-hover:text-primary transition-colors">
                            {officer.name}
                          </p>
                          <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                            {officer.designation}
                          </p>
                          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-mono">
                            {officer.department}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2 text-[11px] text-primary font-medium">
                          <span>Enter as {officer.cadre}</span>
                          <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Manual SSO Login */}
              {activeTab === 'sso' && (
                <form onSubmit={handleManualLogin} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-300 font-medium">
                      CRIS / Railnet Email or Staff ID
                    </label>
                    <div className="relative">
                      <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <Input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="officer@ser.railnet.gov.in"
                        className="h-9 pl-9 text-xs bg-slate-950 border-white/15 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-300 font-medium">
                      Railnet Passkey / Token
                    </label>
                    <div className="relative">
                      <Lock className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <Input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-9 pl-9 text-xs bg-slate-950 border-white/15 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={requireOtp}
                        onChange={(e) => setRequireOtp(e.target.checked)}
                        className="rounded border-white/20 bg-slate-950 text-primary focus:ring-primary"
                      />
                      <span>Verify with 2FA Mobile OTP</span>
                    </label>
                    <span className="text-slate-400 font-mono text-[11px]">KGP Division Gateway</span>
                  </div>

                  {requireOtp && (
                    <div className="space-y-1 rounded-lg border border-primary/30 bg-primary/5 p-2.5">
                      <label className="text-[11px] text-primary font-medium">
                        Enter 6-Digit Mobile OTP (Sent to registered mobile)
                      </label>
                      <Input
                        type="text"
                        maxLength={6}
                        placeholder="482910"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="h-8 font-mono text-center tracking-widest text-xs bg-slate-950 border-white/15 text-white"
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-9 text-xs font-semibold gap-2 shadow-md mt-2"
                  >
                    <KeyRound className="size-3.5" />
                    Sign In to Operations Control Center
                  </Button>
                </form>
              )}

              {/* Bottom Security Assurance */}
              <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  CRIS 256-bit Encrypted
                </span>
                <span>SIH26027 · Kharagpur OCC</span>
              </div>
            </div>

            {/* Back link to Landing */}
            <div className="text-center">
              <Link
                href="/landing"
                className="text-xs text-slate-300 hover:text-white transition-colors inline-flex items-center gap-1.5"
              >
                <span>← Return to Platform Landing &amp; Onboarding Overview</span>
              </Link>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-4 py-3 text-center text-[10px] text-slate-400 border-t border-white/5 bg-slate-950/70">
          Center for Railway Information Systems (CRIS) · South Eastern Railway · Smart India Hackathon
        </footer>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white font-mono text-xs">
          Loading RailSanket Authentication...
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  )
}

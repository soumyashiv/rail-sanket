'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { TrainFront, ShieldCheck, Lock, Radio } from 'lucide-react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !hasRedirected) {
      setHasRedirected(true)
      const redirectUrl = `/auth?redirect=${encodeURIComponent(pathname)}`
      router.replace(redirectUrl)
    }
  }, [isLoading, isAuthenticated, hasRedirected, router, pathname])

  // While checking authentication state or performing redirect
  if (isLoading || !isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 font-sans text-white p-4 select-none">
        {/* Ambient subtle glow background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,58,138,0.25)_0%,rgba(2,6,23,0.95)_70%)]" />

        <div className="relative z-10 flex flex-col items-center max-w-sm text-center space-y-4">
          {/* Animated Indian Railways Locomotive Crest */}
          <div className="relative flex size-16 items-center justify-center rounded-2xl bg-blue-600/90 text-white shadow-xl shadow-blue-500/40 border border-white/20 animate-pulse">
            <TrainFront className="size-8" />
            <span className="absolute -top-1 -right-1 flex size-3.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex size-3.5 rounded-full bg-cyan-400" />
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-white">
              Railonic Division OCC
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              South Eastern Railway · Kharagpur
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-xs space-y-1.5 w-full backdrop-blur-md">
            <div className="flex items-center justify-center gap-2 font-mono text-cyan-400 text-[11px] font-semibold">
              <Lock className="size-3.5 animate-spin" />
              <span>Checking CRIS Railnet Authorization...</span>
            </div>
            <p className="text-[10px] text-slate-500">
              Authentication required to access live block windows and timetable movements.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
            <ShieldCheck className="size-3 text-emerald-500" />
            <span>CRIS Sentinel Gateway v4.2 Secured</span>
          </div>
        </div>
      </div>
    )
  }

  // Authenticated: Render the protected children
  return <>{children}</>
}

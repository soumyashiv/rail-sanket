'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  TrainFront,
  ChevronsLeft,
  Activity,
  CheckCircle2,
  Cpu,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { navItems, navSections } from '@/lib/nav'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  onNavigate?: () => void
}

export function Sidebar({ collapsed, onToggle, onNavigate }: SidebarProps) {
  const pathname = usePathname()

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border select-none">
        {/* Branding Header */}
        <div
          className={cn(
            'flex h-16 items-center gap-3 border-b border-sidebar-border/80 px-4 transition-all',
            collapsed && 'justify-center px-0',
          )}
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sidebar-primary to-primary text-sidebar-primary-foreground shadow-md ring-1 ring-white/10">
            <TrainFront className="size-5.5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col truncate leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-foreground text-base">
                  RAILONIC
                </span>
                <span className="rounded bg-primary/20 px-1 py-0.5 font-mono text-[9px] font-bold text-primary">
                  AI
                </span>
              </div>
              <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase truncate">
                IR · Kharagpur Division
              </span>
            </div>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navSections.map((section) => {
            const items = navItems.filter((i) => i.section === section)
            return (
              <div key={section}>
                {!collapsed && (
                  <p className="mb-2 px-2.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                    {section}
                  </p>
                )}
                <ul className="space-y-1">
                  {items.map((item) => {
                    const active =
                      item.href === '/'
                        ? pathname === '/'
                        : pathname.startsWith(item.href)
                    const link = (
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        className={cn(
                          'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                          collapsed && 'justify-center px-0 size-10 mx-auto',
                          active
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-sm ring-1 ring-sidebar-border'
                            : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
                        )}
                      >
                        {/* Active Accent Bar */}
                        {active && !collapsed && (
                          <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-primary" />
                        )}
                        <item.icon
                          className={cn(
                            'size-4.5 shrink-0 transition-transform duration-150 group-hover:scale-110',
                            active ? 'text-primary' : 'text-muted-foreground',
                          )}
                        />
                        {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                        {!collapsed && item.badge && (
                          <span
                            className={cn(
                              'rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums',
                              active
                                ? 'bg-primary text-primary-foreground shadow-xs'
                                : 'bg-sidebar-accent text-sidebar-foreground border border-sidebar-border',
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )
                    return (
                      <li key={item.href}>
                        {collapsed ? (
                          <Tooltip>
                            <TooltipTrigger asChild>{link}</TooltipTrigger>
                            <TooltipContent side="right" className="flex items-center gap-2 font-medium">
                              {item.label}
                              {item.badge && (
                                <span className="rounded-full bg-primary px-1.5 py-0.2 text-[10px] text-primary-foreground">
                                  {item.badge}
                                </span>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          link
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </nav>

        {/* Live Systems Integration Status (Footer) */}
        {!collapsed && (
          <div className="mx-3 mb-2 rounded-lg border border-sidebar-border/70 bg-sidebar-accent/30 p-2.5">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <Cpu className="size-3 text-primary" />
                Data Adapters
              </span>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-success">
                <span className="size-1.5 rounded-full bg-success animate-pulse" />
                Online
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-center font-mono text-[10px]">
              <div className="rounded bg-sidebar-accent/70 px-1 py-0.5 text-muted-foreground">
                <span className="font-semibold text-foreground">TMS</span>
              </div>
              <div className="rounded bg-sidebar-accent/70 px-1 py-0.5 text-muted-foreground">
                <span className="font-semibold text-foreground">SMMS</span>
              </div>
              <div className="rounded bg-sidebar-accent/70 px-1 py-0.5 text-muted-foreground">
                <span className="font-semibold text-foreground">TDMS</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom collapse control */}
        <div className="border-t border-sidebar-border p-2.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className={cn(
              'hidden w-full text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:flex',
              collapsed ? 'justify-center p-0 size-9' : 'justify-start gap-2.5 px-3',
            )}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronsLeft
              className={cn(
                'size-4 transition-transform duration-300',
                collapsed && 'rotate-180',
              )}
            />
            {!collapsed && <span className="text-xs font-medium">Collapse navigation</span>}
          </Button>
        </div>
      </div>
    </TooltipProvider>
  )
}


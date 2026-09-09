'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  TrainFront,
  ChevronsLeft,
  Activity,
  CheckCircle2,
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
            'flex h-14 items-center border-b border-sidebar-border transition-all',
            collapsed ? 'justify-center px-2' : 'px-4',
          )}
        >
          <Link
            href="/dashboard"
            onClick={onNavigate}
            className={cn(
              'flex items-center rounded-md transition-colors hover:opacity-80',
              collapsed ? 'justify-center p-1.5' : 'gap-2 py-1'
            )}
            title="Rail Sanket — Operations Overview"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border/60 bg-white shadow-xs">
              <Image
                src="/railsanket-logo.png"
                alt="Rail Sanket"
                width={28}
                height={28}
                className="size-6 object-contain"
                priority
              />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <Image
                  src="/railsanket-wordmark.png"
                  alt="Rail Sanket"
                  width={100}
                  height={20}
                  className="h-[18px] w-auto object-contain"
                  priority
                />
                <span className="text-[10px] text-muted-foreground/80 truncate leading-none mt-0.5">
                  Kharagpur Division, SER
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navSections.map((section) => {
            const items = navItems.filter((i) => i.section === section)
            return (
              <div key={section}>
                {!collapsed && (
                  <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
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
                          'group relative flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors duration-100',
                          collapsed && 'justify-center px-0 size-9 mx-auto',
                          active
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                            : 'text-muted-foreground hover:bg-sidebar-accent/40 hover:text-foreground',
                        )}
                      >
                        {/* Active indicator */}
                        {active && !collapsed && (
                          <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full bg-primary" />
                        )}
                        <item.icon
                          className={cn(
                            'size-4 shrink-0',
                            active ? 'text-primary' : 'text-muted-foreground/70 group-hover:text-foreground',
                          )}
                        />
                        {!collapsed && <span className="flex-1 truncate font-normal">{item.label}</span>}
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

        {/* Bottom collapse control */}
        <div className="border-t border-sidebar-border p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className={cn(
              'hidden w-full text-muted-foreground/60 hover:bg-sidebar-accent hover:text-muted-foreground lg:flex',
              collapsed ? 'justify-center p-0 size-9' : 'justify-start gap-2 px-2.5',
            )}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronsLeft
              className={cn(
                'size-3.5 transition-transform duration-300',
                collapsed && 'rotate-180',
              )}
            />
            {!collapsed && <span className="text-xs">Collapse</span>}
          </Button>
        </div>
      </div>
    </TooltipProvider>
  )
}


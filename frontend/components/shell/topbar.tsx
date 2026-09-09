'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  Building2,
  CheckCircle2,
} from 'lucide-react'
import { activeNav } from '@/lib/nav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { toast } from 'sonner'

const divisions = [
  { id: 'KGP', name: 'Kharagpur Division', zone: 'South Eastern Railway', active: true },
  { id: 'HWH', name: 'Howrah Division', zone: 'Eastern Railway', active: false },
  { id: 'CKP', name: 'Chakradharpur Division', zone: 'South Eastern Railway', active: false },
  { id: 'ADRA', name: 'Adra Division', zone: 'South Eastern Railway', active: false },
]

const notificationsList = [
  { id: '1', title: 'ENG-221 flagged as exception', meta: 'No feasible window in corridor C01 · 2m ago', unread: true },
  { id: '2', title: 'Conflict CF-01 needs resolution', meta: 'Overlaps with Coromandel Exp · 14m ago', unread: true },
  { id: '3', title: 'AI Recommendation REC-102 generated', meta: 'Bridge bearing block on C03 · 1h ago', unread: false },
  { id: '4', title: 'COA Timetable Feed Synced', meta: 'All 5 corridors updated with latest paths · 2h ago', unread: false },
]

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname()
  const current = activeNav(pathname)
  const { user, logout } = useAuth()
  const [selectedDiv, setSelectedDiv] = useState(divisions[0])
  const [notifications, setNotifications] = useState(notificationsList)

  const unreadCount = notifications.filter((n) => n.unread).length

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
    toast.success('All notifications marked as read')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/80 bg-background/90 px-4 backdrop-blur-md md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenu}
        aria-label="Open navigation"
      >
        <Menu className="size-5" />
      </Button>

      {/* Page Title */}
      <div className="min-w-0 flex items-center gap-2">
        <h1 className="truncate text-sm font-semibold text-foreground sm:text-[15px]">
          {current?.label ?? 'Dashboard'}
        </h1>
      </div>

      {/* Right Controls */}
      <div className="ml-auto flex items-center gap-2 sm:gap-2.5">
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks, corridors…"
            className="h-8 w-48 pl-8 text-xs lg:w-60 bg-secondary/40 focus-visible:bg-background"
          />
        </div>

        {/* Division Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="hidden h-8 items-center gap-2 border-border bg-secondary/30 text-xs font-medium lg:flex cursor-pointer"
              >
                <Building2 className="size-3.5 text-muted-foreground" />
                <span>{selectedDiv.name.replace(' Division', '')}</span>
                <ChevronDown className="size-3 text-muted-foreground" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel className="text-xs">Railway Division</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {divisions.map((div) => (
              <DropdownMenuItem
                key={div.id}
                onClick={() => {
                  setSelectedDiv(div)
                  toast.info(`Switched to ${div.name}`)
                }}
                className="flex items-center justify-between py-1.5 text-xs"
              >
                <div>
                  <div className="font-semibold text-foreground">{div.name}</div>
                  <div className="text-[10px] text-muted-foreground">{div.zone}</div>
                </div>
                {selectedDiv.id === div.id && (
                  <CheckCircle2 className="size-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Live Feed Status Pill */}
        <div className="hidden items-center gap-2 px-2 py-1 text-xs text-muted-foreground sm:flex">
          <span className="size-2 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-medium">COA Live</span>
        </div>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="relative size-9 text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="size-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-danger opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-danger ring-2 ring-background" />
                  </span>
                )}
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-3 py-2.5">
              <span className="text-xs font-medium text-foreground">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-1.5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    {unreadCount}
                  </span>
                )}
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[11px] font-medium text-primary hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-72 overflow-y-auto">
              {notifications.map((n) => (
                <DropdownMenuItem
                  key={n.id}
                  className="flex flex-col items-start gap-1 py-2.5 px-3 cursor-pointer"
                  onClick={() => {
                    setNotifications((prev) =>
                      prev.map((item) => (item.id === n.id ? { ...item, unread: false } : item))
                    )
                  }}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">{n.title}</span>
                    {n.unread && (
                      <span className="size-1.5 rounded-full bg-danger" />
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground leading-snug">{n.meta}</span>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="gap-2 px-1 sm:px-2 h-9 rounded-full sm:rounded-lg cursor-pointer">
                <Avatar className="size-7.5 ring-1 ring-border">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                    {user?.initials || 'IR'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left leading-tight sm:block">
                  <div className="text-xs font-bold">{user?.name || 'Officer On-Duty'}</div>
                  <div className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                    {user?.cadre ? `${user.cadre} · ${user.department.split(' ')[0]}` : 'Divisional Planner'}
                  </div>
                </div>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="pb-2">
              <div className="font-semibold text-sm text-foreground">
                {user?.name || 'R. Kaushik'}
              </div>
              <div className="text-xs font-normal text-muted-foreground mt-0.5">
                {user?.cadre || 'IRSE'} · {user?.designation || 'Sr. Divisional Engineer'}
              </div>
              <div className="text-[10px] text-muted-foreground/70 font-mono mt-1">
                {user?.division || 'Kharagpur Division, SER'}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="text-xs cursor-pointer">
              <Link href="/auth">Officer Portal &amp; Roles</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="text-xs cursor-pointer">
              <Link href="/auth">Switch Officer Account</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs">Division Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-xs text-danger cursor-pointer font-semibold"
            >
              Sign out (CRIS Railnet)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}


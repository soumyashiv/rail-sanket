'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useAuth } from '@/lib/auth-context'
import {
  Menu,
  Search,
  Bell,
  Radio,
  Sun,
  Moon,
  ChevronDown,
  Building2,
  Calendar,
  Layers,
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
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [selectedDiv, setSelectedDiv] = useState(divisions[0])
  const [notifications, setNotifications] = useState(notificationsList)

  useEffect(() => {
    setMounted(true)
  }, [])

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

      {/* Page Title & Breadcrumb Context */}
      <div className="min-w-0 flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="truncate text-base font-bold tracking-tight text-foreground">
              {current?.label ?? 'Dashboard'}
            </h1>
            <span className="hidden rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary sm:inline-flex items-center gap-1">
              <Calendar className="size-2.5" />
              Week 38 (14–20 Sep)
            </span>
          </div>
          <p className="hidden truncate text-xs text-muted-foreground sm:block">
            {selectedDiv.zone} · {selectedDiv.name}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="ml-auto flex items-center gap-2 sm:gap-2.5">
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks, assets, corridors… (Ctrl+K)"
            className="h-9 w-56 pl-8 text-xs lg:w-72 bg-secondary/40 focus-visible:bg-background"
          />
        </div>

        {/* Division Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="hidden h-9 items-center gap-1.5 border-border bg-secondary/30 text-xs font-medium lg:flex"
            >
              <Building2 className="size-3.5 text-primary" />
              <span>{selectedDiv.name}</span>
              <ChevronDown className="size-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="text-xs">Select Railway Division</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {divisions.map((div) => (
              <DropdownMenuItem
                key={div.id}
                onClick={() => {
                  setSelectedDiv(div)
                  toast.info(`Switched to ${div.name}`)
                }}
                className="flex items-center justify-between py-2 text-xs"
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
        <div className="hidden items-center gap-1.5 rounded-full border border-success/30 bg-success-muted/50 px-2.5 py-1 text-[11px] font-semibold text-success sm:flex">
          <Radio className="size-3 animate-pulse text-success" />
          <span>COA Live</span>
        </div>

        {/* Theme Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className="size-9 text-muted-foreground hover:text-foreground"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={mounted ? `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode` : 'Toggle theme'}
        >
          {mounted ? (
            theme === 'dark' ? (
              <Sun className="size-4.5 text-warning" />
            ) : (
              <Moon className="size-4.5 text-primary" />
            )
          ) : (
            <Sun className="size-4.5 opacity-0" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative size-9 text-muted-foreground hover:text-foreground"
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
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Notifications ({unreadCount} new)
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
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-1 sm:px-2 h-9 rounded-full sm:rounded-lg">
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
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              <div className="font-semibold text-foreground">
                {user?.name || 'R. Kaushik'}, {user?.cadre || 'IRSE'}
              </div>
              <div className="text-xs font-normal text-muted-foreground leading-snug mt-0.5">
                {user?.designation || 'Sr. Divisional Engineer / Planning'}
              </div>
              <div className="text-[10px] text-primary font-mono mt-1">
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


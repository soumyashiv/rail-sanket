import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Network,
  ListChecks,
  CalendarClock,
  Sparkles,
  TriangleAlert,
  SlidersHorizontal,
  CalendarRange,
  FileText,
  Settings,
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  section: 'Planning' | 'Intelligence' | 'System'
  badge?: string
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard, section: 'Planning' },
  { label: 'Network Intelligence', href: '/network-intelligence', icon: Network, section: 'Planning' },
  { label: 'Maintenance Queue', href: '/queue', icon: ListChecks, section: 'Planning' },
  { label: 'Auto Block Planner', href: '/planner', icon: CalendarClock, section: 'Planning' },
  { label: 'Monthly Overview', href: '/monthly', icon: CalendarRange, section: 'Planning' },
  { label: 'AI Recommendations', href: '/recommendations', icon: Sparkles, section: 'Intelligence', badge: '5' },
  { label: 'Conflicts & Exceptions', href: '/conflicts', icon: TriangleAlert, section: 'Intelligence', badge: '6' },
  { label: 'What-If Simulator', href: '/what-if', icon: SlidersHorizontal, section: 'Intelligence' },
  { label: 'Reports', href: '/reports', icon: FileText, section: 'System' },
  { label: 'Settings', href: '/settings', icon: Settings, section: 'System' },
]

export const navSections: NavItem['section'][] = ['Planning', 'Intelligence', 'System']

export function activeNav(pathname: string): NavItem | undefined {
  return (
    navItems.find((i) => i.href !== '/' && pathname.startsWith(i.href)) ??
    navItems.find((i) => i.href === pathname)
  )
}

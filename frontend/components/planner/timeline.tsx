'use client'

import { cn } from '@/lib/utils'
import type { TimelineSlot } from '@/lib/data/operations'

const DAY_START = 6 * 60 // 06:00
const DAY_END = 18 * 60 // 18:00
const SPAN = DAY_END - DAY_START

function toMin(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

function pct(min: number) {
  return ((min - DAY_START) / SPAN) * 100
}

// Major hour marks every 2 hours for ruler labels
const rulerHours = Array.from({ length: 7 }, (_, i) => 6 + i * 2) // 6,8,...,18
// All hours for minor gridlines
const allHours = Array.from({ length: 13 }, (_, i) => 6 + i) // 6..18

const kindStyle: Record<TimelineSlot['kind'], string> = {
  train: 'bg-muted border-border text-muted-foreground',
  available: 'bg-success-muted/40 border-success/20 border-dashed text-success',
  block: 'bg-primary/90 text-primary-foreground border-primary/70 shadow-sm',
  blackout:
    'bg-danger-muted/70 text-danger border-danger/30 [background-image:repeating-linear-gradient(45deg,transparent,transparent_5px,color-mix(in_oklch,var(--danger)_15%,transparent)_5px,color-mix(in_oklch,var(--danger)_15%,transparent)_10px)]',
}

export function CorridorTimeline({
  slots,
  onSelectBlock,
  activeBlock,
}: {
  slots: TimelineSlot[]
  onSelectBlock?: (meta?: string) => void
  activeBlock?: string
}) {
  return (
    <div className="w-full">
      {/* Hour ruler */}
      <div className="relative mb-1 h-4">
        {rulerHours.map((h) => (
          <div
            key={h}
            className="absolute -translate-x-1/2 font-mono text-[10px] text-muted-foreground/70"
            style={{ left: `${pct(h * 60)}%` }}
          >
            {String(h).padStart(2, '0')}:00
          </div>
        ))}
      </div>

      {/* Timeline bar */}
      <div className="relative h-14 rounded-md border border-border bg-secondary/15 overflow-hidden">
        {/* Major gridlines every 2h */}
        {rulerHours.map((h) => (
          <div
            key={h}
            className="absolute inset-y-0 w-px bg-border/50"
            style={{ left: `${pct(h * 60)}%` }}
            aria-hidden
          />
        ))}
        {/* Minor gridlines every 1h (odd hours only) */}
        {allHours
          .filter((h) => h % 2 !== 0)
          .map((h) => (
            <div
              key={`minor-${h}`}
              className="absolute inset-y-0 w-px bg-border/15"
              style={{ left: `${pct(h * 60)}%` }}
              aria-hidden
            />
          ))}

        {slots.map((s, i) => {
          const left = pct(toMin(s.start))
          const width = pct(toMin(s.end)) - left
          const isBlock = s.kind === 'block'
          const active = isBlock && Boolean(activeBlock && (s.meta?.includes(activeBlock) || activeBlock === s.meta || activeBlock === s.label))
          const isTrain = s.kind === 'train'
          return (
            <button
              key={i}
              type="button"
              disabled={!isBlock}
              onClick={() => isBlock && onSelectBlock?.(s.meta)}
              style={{ left: `${left}%`, width: `${Math.max(width, 0.4)}%` }}
              className={cn(
                'absolute flex flex-col justify-center overflow-hidden rounded px-1.5 text-left transition-all',
                kindStyle[s.kind],
                isBlock
                  ? 'inset-y-0.5 cursor-pointer hover:brightness-110 hover:shadow-sm text-[10px]'
                  : 'inset-y-1 cursor-default text-[10px]',
                isTrain && 'inset-y-1.5 opacity-90',
                active &&
                  'ring-2 ring-primary ring-offset-1 ring-offset-background shadow-md z-10 brightness-110 font-semibold',
              )}
              title={`${s.label} (${s.start}–${s.end})`}
            >
              {width > 5 && (
                <span className="truncate font-medium leading-none">{s.label}</span>
              )}
              {width > 12 && s.meta && (
                <span className="truncate text-[9px] leading-tight opacity-80 mt-0.5">{s.meta}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

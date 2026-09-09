import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  badge?: string
  children?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  badge,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'mb-5 flex flex-col gap-3 border-b border-border/60 pb-4 md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className="min-w-0 space-y-0.5">
        {badge && (
          <div className="inline-flex items-center gap-1.5 rounded-md bg-secondary/80 px-2 py-0.5 text-[11px] font-medium text-muted-foreground mb-1">
            <span className="size-1.5 rounded-full bg-primary" />
            {badge}
          </div>
        )}
        <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="max-w-2xl text-xs leading-normal text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {children}
        </div>
      )}
    </div>
  )
}

import type { LucideIcon } from 'lucide-react'

import { Card, CardContent } from './ui/card'

type MetricCardProps = {
  title: string
  value: number
  description: string
  icon: LucideIcon
}

export function MetricCard({ title, value, description, icon: Icon }: MetricCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{title}</p>
          <div className="mt-2 flex items-end gap-2">
            <p className="text-3xl font-display leading-none">{value}</p>
            <p className="pb-0.5 text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  )
}
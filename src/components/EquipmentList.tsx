import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { equipmentTypeLabels, formatDate } from '../lib/utils'
import type { EquipmentSummary } from '../types'
import { EquipmentStatusBadge } from './EquipmentStatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

type EquipmentListProps = {
  items: EquipmentSummary[]
  showLinks?: boolean
  showLastCompleted?: boolean
  maxItems?: number
  compact?: boolean
  title?: string
}

export function EquipmentList({
  items,
  showLinks = true,
  showLastCompleted = false,
  maxItems,
  compact = false,
  title = 'Equipamentos',
}: EquipmentListProps) {
  const visibleItems = maxItems ? items.slice(0, maxItems) : items

  return (
    <Card className="h-full">
      <CardHeader className={compact ? 'p-5' : undefined}>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className={compact ? 'space-y-2.5 p-5 pt-0' : 'space-y-3'}>
        {visibleItems.map((item) => (
          <div key={item.id} className={compact ? 'rounded-2xl border border-border/60 bg-white/70 p-3' : 'rounded-2xl border border-border/60 bg-white/70 p-4'}>
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-foreground">{item.name}</p>
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{equipmentTypeLabels[item.type]}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {showLastCompleted
                    ? `Última concluída: ${formatDate(item.lastCompletedInspection?.executedAt ?? null)}`
                    : `Próxima inspeção: ${formatDate(item.nextInspection?.scheduledDate ?? null)}`}
                </p>
              </div>
              <div className="flex items-center gap-2.5 self-start sm:self-center">
                <EquipmentStatusBadge status={item.currentStatus} />
                {showLinks ? (
                  <Link to={`/equipment/${item.id}`} className="flex items-center gap-1 text-sm font-semibold text-primary">
                    Ver
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        ))}
        {maxItems && items.length > maxItems ? (
          <Link to="/equipment" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            Ver todos os equipamentos
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : null}
      </CardContent>
    </Card>
  )
}
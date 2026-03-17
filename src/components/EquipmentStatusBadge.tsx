import type { EquipmentHealthStatus } from '../types'
import { cn, equipmentStatusClasses, equipmentStatusLabels } from '../lib/utils'
import { Badge } from './ui/badge'

type EquipmentStatusBadgeProps = {
  status: EquipmentHealthStatus
  className?: string
}

export function EquipmentStatusBadge({ status, className }: EquipmentStatusBadgeProps) {
  return <Badge className={cn(equipmentStatusClasses[status], className)} variant="outline">{equipmentStatusLabels[status]}</Badge>
}
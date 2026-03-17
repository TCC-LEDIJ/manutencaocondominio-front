import { Link } from 'react-router-dom'

import { equipmentTypeLabels, formatDate } from '../lib/utils'
import type { EquipmentSummary } from '../types'
import { EquipmentStatusBadge } from './EquipmentStatusBadge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'

type EquipmentTableProps = {
  equipment: EquipmentSummary[]
}

export function EquipmentTable({ equipment }: EquipmentTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Próxima inspeção</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {equipment.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <Link to={`/equipment/${item.id}`} className="font-semibold text-primary hover:underline">
                {item.name}
              </Link>
            </TableCell>
            <TableCell>{equipmentTypeLabels[item.type]}</TableCell>
            <TableCell>{formatDate(item.nextInspection?.scheduledDate ?? null)}</TableCell>
            <TableCell>
              <EquipmentStatusBadge status={item.currentStatus} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
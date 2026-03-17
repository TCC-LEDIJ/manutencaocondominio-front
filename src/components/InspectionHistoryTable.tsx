import { formatDate } from '../lib/utils'
import type { InspectionWithMeta } from '../types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'

type InspectionHistoryTableProps = {
  inspections: InspectionWithMeta[]
}

export function InspectionHistoryTable({ inspections }: InspectionHistoryTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Agendada</TableHead>
          <TableHead>Executada</TableHead>
          <TableHead>Executada por</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Documentos</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {inspections.map((inspection) => (
          <TableRow key={inspection.id}>
            <TableCell>{formatDate(inspection.scheduledDate)}</TableCell>
            <TableCell>{formatDate(inspection.executedAt)}</TableCell>
            <TableCell>{inspection.executedByName ?? '—'}</TableCell>
            <TableCell>{inspection.status}</TableCell>
            <TableCell>
              <div className="space-y-1">
                {inspection.documents.length === 0 ? (
                  <span className="text-muted-foreground">Sem anexos</span>
                ) : (
                  inspection.documents.map((document) => (
                    <a key={document.id} href={document.url} target="_blank" rel="noreferrer" className="block text-primary hover:underline">
                      {document.fileName}
                    </a>
                  ))
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
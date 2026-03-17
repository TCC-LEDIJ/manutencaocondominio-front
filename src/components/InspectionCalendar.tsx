import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import type { DashboardChartDatum } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

type InspectionCalendarProps = {
  data: DashboardChartDatum[]
  compact?: boolean
}

export function InspectionCalendar({ data, compact = false }: InspectionCalendarProps) {
  return (
    <Card>
      <CardHeader className={compact ? 'p-5' : undefined}>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle>Inspeções nos próximos 30 dias</CardTitle>
          <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-status-success" />Concluídas</span>
            <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-status-warning" />Agendadas</span>
            <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-status-danger" />Vencidas</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className={compact ? 'p-5 pt-0' : undefined}>
        <div className={compact ? 'h-[220px] w-full' : 'h-[320px] w-full'}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: 0, right: 12, top: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd6cb" />
              <XAxis dataKey="dateLabel" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} width={24} />
              <Tooltip
                cursor={{ fill: 'rgba(15, 23, 42, 0.04)' }}
                contentStyle={{
                  borderRadius: '16px',
                  border: '1px solid rgba(229, 231, 235, 1)',
                  boxShadow: '0 20px 45px -28px rgba(15, 23, 42, 0.35)',
                }}
              />
              <Bar dataKey="concluidas" stackId="inspections" fill="#639922" radius={[6, 6, 0, 0]} />
              <Bar dataKey="agendadas" stackId="inspections" fill="#EF9F27" radius={[6, 6, 0, 0]} />
              <Bar dataKey="vencidas" stackId="inspections" fill="#E24B4A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
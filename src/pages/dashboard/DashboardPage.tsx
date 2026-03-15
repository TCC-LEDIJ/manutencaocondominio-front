import { AlertCircle, CalendarClock, CircleCheckBig, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'

import { AlertFeed } from '../../components/AlertFeed'
import { EquipmentList } from '../../components/EquipmentList'
import { HealthScoreCard } from '../../components/HealthScoreCard'
import { InspectionCalendar } from '../../components/InspectionCalendar'
import { MetricCard } from '../../components/MetricCard'
import { Card, CardContent } from '../../components/ui/card'
import { useAuth } from '../../context/AuthContext'
import { useRecentAlerts } from '../../hooks/useAlerts'
import { useDashboardOverview } from '../../hooks/useEquipment'
import { useUpcomingInspectionChart } from '../../hooks/useInspections'

const statusOrder = {
  OVERDUE: 0,
  EXPIRING_SOON: 1,
  UP_TO_DATE: 2,
} as const

export function DashboardPage() {
  const { condominiumId } = useAuth()
  const overviewQuery = useDashboardOverview(condominiumId ?? '')
  const alertsQuery = useRecentAlerts(condominiumId ?? '')
  const chartQuery = useUpcomingInspectionChart(condominiumId ?? '')

  if (overviewQuery.isLoading || alertsQuery.isLoading || chartQuery.isLoading) {
    return <Card><CardContent className="p-8 text-sm text-muted-foreground">Carregando dashboard...</CardContent></Card>
  }

  if (overviewQuery.isError || alertsQuery.isError || chartQuery.isError || !overviewQuery.data) {
    return <Card><CardContent className="p-8 text-sm text-status-danger">Não foi possível carregar o dashboard.</CardContent></Card>
  }

  const { metrics } = overviewQuery.data
  const prioritizedEquipment = [...overviewQuery.data.equipment].sort(
    (leftItem, rightItem) => statusOrder[leftItem.currentStatus] - statusOrder[rightItem.currentStatus],
  )

  return (
    <div className="space-y-4">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.95fr)]">
        <Card className="overflow-hidden bg-gradient-to-br from-primary via-primary to-slate-900 text-primary-foreground">
          <CardContent className="flex h-full flex-col justify-between gap-6 p-5 md:p-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-foreground/70">Painel do síndico</p>
              <h1 className="text-3xl text-primary-foreground md:text-4xl xl:max-w-none">Operação do condomínio em tempo real</h1>
              <p className="text-sm text-primary-foreground/75 md:text-base xl:max-w-none">
                Visão consolidada dos itens críticos, do score de saúde e dos alertas mais recentes sem precisar navegar por múltiplas telas.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link to="/equipment" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:bg-white/90">
                Ver base completa
              </Link>
              <span className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-primary-foreground/85">
                {metrics.overdue} itens exigem ação imediata
              </span>
            </div>
          </CardContent>
        </Card>

        <HealthScoreCard score={metrics.healthScore} compact />
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Equipamentos" value={metrics.totalEquipment} description="Base cadastrada no condomínio" icon={Wrench} />
        <MetricCard title="Em dia" value={metrics.upToDate} description="Sem risco iminente" icon={CircleCheckBig} />
        <MetricCard title="Vencendo" value={metrics.expiringSoon} description="Janela crítica de 7 dias" icon={CalendarClock} />
        <MetricCard title="Vencidos" value={metrics.overdue} description="Demandam ação imediata" icon={AlertCircle} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <EquipmentList items={prioritizedEquipment} maxItems={4} compact title="Fila prioritária" />
        <AlertFeed alerts={alertsQuery.data ?? []} maxItems={4} compact />
      </section>

      <InspectionCalendar data={chartQuery.data ?? []} compact />
    </div>
  )
}
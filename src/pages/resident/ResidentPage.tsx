import { EquipmentList } from '../../components/EquipmentList'
import { HealthScoreCard } from '../../components/HealthScoreCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { useAuth } from '../../context/AuthContext'
import { useDashboardOverview } from '../../hooks/useEquipment'

export function ResidentPage() {
  const { condominiumId } = useAuth()
  const overviewQuery = useDashboardOverview(condominiumId ?? '')

  if (overviewQuery.isLoading) {
    return <Card><CardContent className="p-8 text-sm text-muted-foreground">Carregando painel do morador...</CardContent></Card>
  }

  if (overviewQuery.isError || !overviewQuery.data) {
    return <Card><CardContent className="p-8 text-sm text-status-danger">Não foi possível carregar a visão do morador.</CardContent></Card>
  }

  const { equipment, metrics } = overviewQuery.data

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">Painel do morador</p>
        <h1 className="text-3xl md:text-4xl">Transparência do edifício</h1>
        <p className="max-w-3xl text-muted-foreground">Acompanhamento simplificado do status dos equipamentos e da última manutenção concluída.</p>
      </section>

      <HealthScoreCard score={metrics.healthScore} showNumber={false} />

      <Card>
        <CardHeader>
          <CardTitle>Equipamentos do condomínio</CardTitle>
          <CardDescription>Apenas informações públicas: nome, tipo, status e última vistoria concluída.</CardDescription>
        </CardHeader>
        <CardContent>
          <EquipmentList items={equipment} showLinks={false} showLastCompleted />
        </CardContent>
      </Card>
    </div>
  )
}
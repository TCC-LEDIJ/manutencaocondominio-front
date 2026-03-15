import { AlertTriangle, ShieldAlert, ShieldCheck, ShieldEllipsis } from 'lucide-react'

import { getHealthLabel } from '../lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'

type HealthScoreCardProps = {
  score: number
  showNumber?: boolean
  compact?: boolean
}

function getIcon(label: string) {
  if (label === 'Excelente') {
    return <ShieldCheck className="h-5 w-5" />
  }

  if (label === 'Bom') {
    return <ShieldEllipsis className="h-5 w-5" />
  }

  if (label === 'Regular') {
    return <AlertTriangle className="h-5 w-5" />
  }

  return <ShieldAlert className="h-5 w-5" />
}

export function HealthScoreCard({ score, showNumber = true, compact = false }: HealthScoreCardProps) {
  const label = getHealthLabel(score)

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-white via-white to-secondary/40">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-5">
        <div>
          <CardTitle>Saúde do edifício</CardTitle>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Indicador consolidado com base nas próximas manutenções críticas.
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {getIcon(label)}
        </div>
      </CardHeader>
      <CardContent className={compact ? 'space-y-4 p-5 pt-0' : 'space-y-5 p-6 pt-0'}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Status</p>
            <p className={compact ? 'mt-1 text-2xl font-display' : 'mt-1 text-3xl font-display'}>{label}</p>
          </div>
          {showNumber ? <p className={compact ? 'text-3xl font-display' : 'text-4xl font-display'}>{score}</p> : null}
        </div>
        <Progress
          value={score}
          className={compact ? 'h-3 bg-slate-200/80' : 'h-4 bg-slate-200/80'}
          indicatorClassName="bg-gradient-to-r from-status-danger via-status-warning to-status-success"
        />
      </CardContent>
    </Card>
  )
}
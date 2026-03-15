import { AlertCircle, CheckCircle2, Clock3 } from 'lucide-react'

import { alertTriggerLabels, formatDate } from '../lib/utils'
import type { RecentAlert } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

type AlertFeedProps = {
  alerts: RecentAlert[]
  maxItems?: number
  compact?: boolean
}

function getAlertIcon(status: RecentAlert['status']) {
  if (status === 'FAILED') {
    return AlertCircle
  }

  if (status === 'SENT') {
    return CheckCircle2
  }

  return Clock3
}

function getAlertColor(status: RecentAlert['status']) {
  if (status === 'FAILED') {
    return 'text-status-danger'
  }

  if (status === 'SENT') {
    return 'text-status-success'
  }

  return 'text-status-warning'
}

export function AlertFeed({ alerts, maxItems, compact = false }: AlertFeedProps) {
  const visibleAlerts = maxItems ? alerts.slice(0, maxItems) : alerts

  return (
    <Card className="h-full">
      <CardHeader className={compact ? 'p-5' : undefined}>
        <CardTitle>Alertas recentes</CardTitle>
      </CardHeader>
      <CardContent className={compact ? 'space-y-2.5 p-5 pt-0' : 'space-y-3'}>
        {visibleAlerts.map((alert) => {
          const Icon = getAlertIcon(alert.status)

          return (
            <div key={alert.id} className={compact ? 'flex gap-3 rounded-2xl border border-border/60 bg-white/70 p-3' : 'flex gap-3 rounded-2xl border border-border/60 bg-white/70 p-4'}>
              <div className={`mt-0.5 ${getAlertColor(alert.status)}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{alert.equipmentName}</p>
                <p className="text-sm text-muted-foreground">
                  {alertTriggerLabels[alert.trigger]} • inspeção em {formatDate(alert.inspectionDate)}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">Enviado em {formatDate(alert.sentAt)}</p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
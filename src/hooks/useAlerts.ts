import { useQuery } from '@tanstack/react-query'

import { alertService } from '../services/alert.service'

export function useRecentAlerts(condominiumId: string) {
  return useQuery({
    queryKey: ['recent-alerts', condominiumId],
    queryFn: () => alertService.findRecent(condominiumId),
    enabled: Boolean(condominiumId),
  })
}
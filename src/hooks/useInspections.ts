import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { inspectionService } from '../services/inspection.service'

export function useUpcomingInspectionChart(condominiumId: string) {
  return useQuery({
    queryKey: ['upcoming-chart', condominiumId],
    queryFn: () => inspectionService.getUpcomingChart(condominiumId),
    enabled: Boolean(condominiumId),
  })
}

export function useMarkInspectionDone(condominiumId: string, equipmentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: inspectionService.markDone,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['equipment-detail', equipmentId] })
      void queryClient.invalidateQueries({ queryKey: ['equipment', condominiumId] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard-overview', condominiumId] })
      void queryClient.invalidateQueries({ queryKey: ['upcoming-chart', condominiumId] })
      void queryClient.invalidateQueries({ queryKey: ['recent-alerts', condominiumId] })
    },
  })
}